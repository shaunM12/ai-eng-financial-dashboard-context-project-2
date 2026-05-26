import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";
import {
  type AlertsResponse,
  type DateRangeFilter,
  type FacetsResponse,
  type MetricsResponse,
  type TopCategoriesResponse,
} from "@/lib/api-contracts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type ViewMode = "home" | "comparison";

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.json();
}

function formatDateReference(dateFilter: DateRangeFilter, facets: FacetsResponse | null): string {
  if (dateFilter.start_date && dateFilter.end_date) {
    return `${dateFilter.start_date} to ${dateFilter.end_date}`;
  }
  if (dateFilter.start_date) {
    return `${dateFilter.start_date} to latest`;
  }
  if (dateFilter.end_date) {
    return `earliest to ${dateFilter.end_date}`;
  }
  if (!facets) {
    return "Full available range";
  }
  return `${facets.min_date} to ${facets.max_date}`;
}

function calculatePeriodPercent(value: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return (value / total) * 100;
}

function App() {
  const [view, setView] = useState<ViewMode>("home");
  const [homeDateFilter, setHomeDateFilter] = useState<DateRangeFilter>({});
  const [comparisonDateFilter, setComparisonDateFilter] = useState<DateRangeFilter>({});
  const [threshold, setThreshold] = useState(0.3);

  const [facets, setFacets] = useState<FacetsResponse | null>(null);
  const [facetsError, setFacetsError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<AlertsResponse>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const [b2bCategories, setB2bCategories] = useState<TopCategoriesResponse>([]);
  const [b2cCategories, setB2cCategories] = useState<TopCategoriesResponse>([]);
  const [comparisonLoading, setComparisonLoading] = useState(true);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  const homeDateInvalid = Boolean(
    homeDateFilter.start_date &&
      homeDateFilter.end_date &&
      homeDateFilter.start_date > homeDateFilter.end_date,
  );

  const comparisonDateInvalid = Boolean(
    comparisonDateFilter.start_date &&
      comparisonDateFilter.end_date &&
      comparisonDateFilter.start_date > comparisonDateFilter.end_date,
  );

  const b2bTotalIncome = useMemo(
    () => b2bCategories.reduce((sum, item) => sum + item.total_amount, 0),
    [b2bCategories],
  );
  const b2cTotalIncome = useMemo(
    () => b2cCategories.reduce((sum, item) => sum + item.total_amount, 0),
    [b2cCategories],
  );

  const comparisonChartData = useMemo(
    () => [
      { group: "B2B", income: b2bTotalIncome },
      { group: "B2C", income: b2cTotalIncome },
    ],
    [b2bTotalIncome, b2cTotalIncome],
  );

  useEffect(() => {
    fetchJson<FacetsResponse>("/api/metrics/facets")
      .then((response) => {
        setFacets(response);
        setFacetsError(null);
      })
      .catch(() => {
        setFacetsError("No se pudieron cargar los limites de fechas disponibles.");
      });
  }, []);

  useEffect(() => {
    if (homeDateInvalid) {
      return;
    }

    setHomeLoading(true);
    const query = buildQuery({
      start_date: homeDateFilter.start_date,
      end_date: homeDateFilter.end_date,
    });

    fetchJson<MetricsResponse>(`/api/metrics${query}`)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
        setHomeError(null);
      })
      .catch(() => {
        setHomeError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setHomeLoading(false);
      });

    return undefined;
  }, [homeDateFilter.end_date, homeDateFilter.start_date, homeDateInvalid]);

  useEffect(() => {
    if (homeDateInvalid) {
      return;
    }

    setAlertsLoading(true);
    const query = buildQuery({
      threshold,
      start_date: homeDateFilter.start_date,
      end_date: homeDateFilter.end_date,
    });

    fetchJson<AlertsResponse>(`/api/metrics/alerts${query}`)
      .then((response) => {
        setAlerts(response);
        setAlertsError(null);
      })
      .catch(() => {
        setAlertsError("No se pudieron cargar las alertas de anomalias.");
      })
      .finally(() => {
        setAlertsLoading(false);
      });

    return undefined;
  }, [homeDateFilter.end_date, homeDateFilter.start_date, homeDateInvalid, threshold]);

  useEffect(() => {
    if (comparisonDateInvalid) {
      return;
    }

    setComparisonLoading(true);
    const sharedQuery = {
      operation_type: "income",
      limit: 5,
      start_date: comparisonDateFilter.start_date,
      end_date: comparisonDateFilter.end_date,
    };

    Promise.all([
      fetchJson<TopCategoriesResponse>(
        `/api/metrics/categories/top${buildQuery({
          ...sharedQuery,
          business_type: "B2B",
        })}`,
      ),
      fetchJson<TopCategoriesResponse>(
        `/api/metrics/categories/top${buildQuery({
          ...sharedQuery,
          business_type: "B2C",
        })}`,
      ),
    ])
      .then(([b2bResponse, b2cResponse]) => {
        setB2bCategories(b2bResponse);
        setB2cCategories(b2cResponse);
        setComparisonError(null);
      })
      .catch(() => {
        setComparisonError("No se pudo cargar la comparacion B2B/B2C.");
      })
      .finally(() => {
        setComparisonLoading(false);
      });

    return undefined;
  }, [comparisonDateFilter.end_date, comparisonDateFilter.start_date, comparisonDateInvalid]);

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period={formatDateReference(homeDateFilter, facets)} />

          <section className="flex flex-wrap items-center gap-2" aria-label="Dashboard views">
            <button
              type="button"
              className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                view === "home"
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              onClick={() => setView("home")}
            >
              Home Dashboard
            </button>
            <button
              type="button"
              className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                view === "comparison"
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              onClick={() => setView("comparison")}
            >
              B2B vs B2C Comparison
            </button>
          </section>

          {view === "home" ? (
            <>
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Date Range Filter</CardTitle>
                  <CardDescription>
                    Filter all home dashboard data using optional start and end dates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Start date</span>
                    <input
                      type="date"
                      value={homeDateFilter.start_date ?? ""}
                      onChange={(event) =>
                        setHomeDateFilter((prev) => ({
                          ...prev,
                          start_date: event.target.value || undefined,
                        }))
                      }
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">End date</span>
                    <input
                      type="date"
                      value={homeDateFilter.end_date ?? ""}
                      onChange={(event) =>
                        setHomeDateFilter((prev) => ({
                          ...prev,
                          end_date: event.target.value || undefined,
                        }))
                      }
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
                    <p className="font-medium">Available range</p>
                    <p className="text-muted-foreground">
                      {facets ? `${facets.min_date} to ${facets.max_date}` : "Range unavailable"}
                    </p>
                    {facetsError ? (
                      <p className="mt-1 text-xs text-destructive">{facetsError}</p>
                    ) : null}
                  </div>
                </CardContent>
                {homeDateInvalid ? (
                  <CardContent className="pt-0">
                    <p className="text-sm text-destructive">
                      Start date must be earlier than or equal to end date.
                    </p>
                  </CardContent>
                ) : null}
              </Card>

              {homeError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
                  {homeError}
                </div>
              ) : null}

              <section aria-label="Key performance indicators">
                <KPIRow metrics={metrics} loading={homeLoading} />
              </section>

              <section
                aria-label="Financial charts"
                className="grid grid-cols-1 gap-4 xl:grid-cols-2"
              >
                <IncomeOutcomeChart data={monthlyData} loading={homeLoading} />
                <ProfitPercentChart data={monthlyData} loading={homeLoading} />
              </section>

              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Anomaly Alerts</CardTitle>
                  <CardDescription>
                    Periods where outcome spikes above your configured threshold.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-end gap-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Threshold ratio (0.01 - 1.0)</span>
                    <input
                      type="number"
                      min={0.01}
                      max={1}
                      step={0.01}
                      value={threshold}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        if (Number.isNaN(next)) {
                          return;
                        }
                        const clamped = Math.max(0.01, Math.min(1, next));
                        setThreshold(clamped);
                      }}
                      className="w-44 rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                </CardContent>
                <CardContent className="pt-0">
                  {alertsError ? (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground">
                      {alertsError}
                    </div>
                  ) : alertsLoading ? (
                    <div className="text-sm text-muted-foreground">Loading alerts...</div>
                  ) : alerts.length === 0 ? (
                    <div className="rounded-md border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                      No anomalies detected for the selected threshold and date range.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="px-3 py-2 font-medium">Period</th>
                            <th className="px-3 py-2 font-medium">Recorded outcome</th>
                            <th className="px-3 py-2 font-medium">Rolling avg (prev 3)</th>
                            <th className="px-3 py-2 font-medium">Increase %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alerts.map((alert) => (
                            <tr key={`${alert.period}-${alert.outcome_total}`} className="border-b border-border/60">
                              <td className="px-3 py-2">{alert.period}</td>
                              <td className="px-3 py-2">${alert.outcome_total.toFixed(2)}</td>
                              <td className="px-3 py-2">${alert.baseline_average.toFixed(2)}</td>
                              <td className="px-3 py-2">{(alert.increase_ratio * 100).toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">B2B vs B2C Comparison Filter</CardTitle>
                  <CardDescription>
                    Compare top 5 income categories for each business line with an optional date range.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Start date</span>
                    <input
                      type="date"
                      value={comparisonDateFilter.start_date ?? ""}
                      onChange={(event) =>
                        setComparisonDateFilter((prev) => ({
                          ...prev,
                          start_date: event.target.value || undefined,
                        }))
                      }
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">End date</span>
                    <input
                      type="date"
                      value={comparisonDateFilter.end_date ?? ""}
                      onChange={(event) =>
                        setComparisonDateFilter((prev) => ({
                          ...prev,
                          end_date: event.target.value || undefined,
                        }))
                      }
                      className="rounded-md border border-input bg-background px-3 py-2"
                    />
                  </label>
                  <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
                    <p className="font-medium">Available range</p>
                    <p className="text-muted-foreground">
                      {facets ? `${facets.min_date} to ${facets.max_date}` : "Range unavailable"}
                    </p>
                    <p className="mt-2 font-medium">Available categories</p>
                    <p className="text-muted-foreground">
                      {facets ? facets.categories.join(", ") : "Unavailable"}
                    </p>
                  </div>
                </CardContent>
                {comparisonDateInvalid ? (
                  <CardContent className="pt-0">
                    <p className="text-sm text-destructive">
                      Start date must be earlier than or equal to end date.
                    </p>
                  </CardContent>
                ) : null}
              </Card>

              {comparisonError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
                  {comparisonError}
                </div>
              ) : null}

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-2" aria-label="B2B and B2C top categories">
                <Card className="border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">B2B Top Income Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {comparisonLoading ? (
                      <p className="text-sm text-muted-foreground">Loading B2B data...</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground">
                              <th className="px-3 py-2 font-medium">Category</th>
                              <th className="px-3 py-2 font-medium">Total income</th>
                              <th className="px-3 py-2 font-medium">% of group</th>
                            </tr>
                          </thead>
                          <tbody>
                            {b2bCategories.map((item) => (
                              <tr key={`b2b-${item.category}`} className="border-b border-border/60">
                                <td className="px-3 py-2 capitalize">{item.category}</td>
                                <td className="px-3 py-2">${item.total_amount.toFixed(2)}</td>
                                <td className="px-3 py-2">
                                  {calculatePeriodPercent(item.total_amount, b2bTotalIncome).toFixed(2)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">B2C Top Income Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {comparisonLoading ? (
                      <p className="text-sm text-muted-foreground">Loading B2C data...</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground">
                              <th className="px-3 py-2 font-medium">Category</th>
                              <th className="px-3 py-2 font-medium">Total income</th>
                              <th className="px-3 py-2 font-medium">% of group</th>
                            </tr>
                          </thead>
                          <tbody>
                            {b2cCategories.map((item) => (
                              <tr key={`b2c-${item.category}`} className="border-b border-border/60">
                                <td className="px-3 py-2 capitalize">{item.category}</td>
                                <td className="px-3 py-2">${item.total_amount.toFixed(2)}</td>
                                <td className="px-3 py-2">
                                  {calculatePeriodPercent(item.total_amount, b2cTotalIncome).toFixed(2)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              <Card className="border-border/60">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">B2B vs B2C Total Income</CardTitle>
                  <CardDescription>
                    Visual comparison of top-category income totals by business line.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {comparisonLoading ? (
                    <div className="text-sm text-muted-foreground">Loading comparison chart...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                        <XAxis dataKey="group" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip
                          formatter={(value: number) => `$${value.toFixed(2)}`}
                          contentStyle={{
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-card)",
                          }}
                        />
                        <Bar dataKey="income" fill="var(--chart-income)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;

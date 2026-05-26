# Component Breakdown

Specification source: OpenAPI contract and provided Swagger screenshots.
Scope note: this document defines frontend structure only. No implementation code is included.

## Feature 1: Home Date Range Filter

### Goal
Add optional start and end date inputs at the top of the home dashboard that filter all displayed dashboard data.

### Component Map
- Reused: DashboardHeaderShell
  - Role: top-level header container that currently displays title and period badge.
  - Existing reference: frontend/src/components/dashboard/dashboard-header.tsx.
- New: DateRangeFilterBar
  - Role: render start_date and end_date inputs.
  - Inputs:
    - value: DateRangeFilter
    - availableMinDate: DateStringISO
    - availableMaxDate: DateStringISO
    - onChange(next: DateRangeFilter)
  - UI rules:
    - Both fields are optional.
    - Send values in YYYY-MM-DD format.
- New: AvailableRangeHint
  - Role: display valid backend range from facets as a user reference.
  - Inputs:
    - minDate: DateStringISO
    - maxDate: DateStringISO

### Data Dependencies
- GET /api/metrics/facets
  - Provides min_date and max_date for reference display.
- GET /api/metrics
  - Receives optional start_date and end_date and powers KPI and chart data already shown on home.

### State Contracts
- Shared filter state at page level:
  - dateFilter: DateRangeFilter
  - facets: FacetsResponse | null

## Feature 2: Anomaly Alerts Table

### Goal
Show a table below current charts with periods where outcome increased above threshold.

### Component Map
- New: AlertsControls
  - Role: render threshold numeric input.
  - Inputs:
    - value: number
    - min: 0.01
    - max: 1.0
    - step: 0.01
    - onChange(nextThreshold: number)
- New: AlertsTable
  - Role: render anomaly rows from alerts endpoint.
  - Inputs:
    - rows: AlertsResponse
    - loading: boolean
    - error: string | null
  - Columns:
    - period
    - recorded outcome (outcome_total)
    - rolling average of previous periods (baseline_average)
    - percentage increase (increase_ratio * 100)
- New: AlertsEmptyState
  - Role: explicit message when no anomalies exist for current threshold/filter.

### Data Dependencies
- GET /api/metrics/alerts
  - Uses AlertParams:
    - threshold (frontend valid range 0.01-1.0, default 0.3)
    - start_date and end_date from Feature 1 date filter
    - optional group_by and business_type if exposed in UI

### State Contracts
- alertsParams: AlertParams
- alertsData: AlertsResponse
- empty state condition: alertsData.length === 0 and no request error

## Feature 3: B2B vs B2C Comparison View

### Goal
Create a separate comparison page with:
- Two side-by-side tables (top 5 income categories for B2B and B2C).
- One chart below comparing B2B and B2C income totals.
- Optional date range filter in YYYY-MM-DD format.

### Component Map
- New: ComparisonPageHeader
  - Role: title, description, and date filter controls.
- New: ComparisonDateRangeFilter
  - Role: capture optional start_date and end_date.
  - Inputs:
    - value: DateRangeFilter
    - available range from facets
- New: TopCategoriesTable
  - Role: reusable table component instantiated for B2B and B2C.
  - Inputs:
    - title: string
    - rows: TopCategoriesResponse
    - groupTotalIncome: number
  - Columns:
    - category name
    - total income
    - percent of group total
- New: IncomeComparisonChart
  - Role: compare B2B vs B2C totals as visual bars/series.
  - Inputs:
    - b2bIncomeTotal: number
    - b2cIncomeTotal: number

### Data Dependencies
- GET /api/metrics/facets
  - Source of available categories and date bounds.
- GET /api/metrics/categories/top (called twice)
  - B2B call params: operation_type=income, limit=5, business_type=B2B, optional date range
  - B2C call params: operation_type=income, limit=5, business_type=B2C, optional date range

### Derived Values
- groupTotalIncome = sum(total_amount) for rows in each business group.
- categoryPercent = (row.total_amount / groupTotalIncome) * 100.
- chart totals use each groupTotalIncome value from the same top-category dataset.

### Layout Contract
- Desktop: two tables side by side, chart below both.
- Mobile: tables stacked, chart below.

import type { BusinessType, Category, FinancialMovement, OperationType } from "@/lib/financial-types";

export type DateStringISO = string;

export interface DateRangeFilter {
  start_date?: DateStringISO;
  end_date?: DateStringISO;
}

export type GroupBy = "day" | "week" | "month";

export interface FacetsResponse {
  operation_types: OperationType[];
  business_types: BusinessType[];
  categories: Category[];
  min_date: DateStringISO;
  max_date: DateStringISO;
}

export interface AlertEntry {
  period: string;
  outcome_total: number;
  baseline_average: number;
  increase_ratio: number;
}

export type AlertsResponse = AlertEntry[];

export interface CategoryEntry {
  category: Category;
  operation_type: OperationType;
  total_amount: number;
}

export type TopCategoriesResponse = CategoryEntry[];

export interface AlertParams extends DateRangeFilter {
  threshold?: number;
  group_by?: GroupBy;
  business_type?: BusinessType;
}

export interface TopCategoriesParams extends DateRangeFilter {
  operation_type: OperationType;
  limit: number;
  business_type?: BusinessType;
}

export type MetricsResponse = FinancialMovement[];

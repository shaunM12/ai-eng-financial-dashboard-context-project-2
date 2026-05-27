/**
 * API response contract types for dashboard feature specifications.
 * Source of truth: OpenAPI (/openapi.json, /docs) and provided Swagger screenshots.
 */

/** ISO-like date string in YYYY-MM-DD format. */
export type DateStringISO = string

/** Allowed financial operation values. */
export type OperationType = 'income' | 'outcome'

/** Allowed movement category values. */
export type Category =
  | 'suppliers'
  | 'sales'
  | 'operational'
  | 'administrative'
  | 'others'

/** Allowed business line values. */
export type BusinessType = 'B2B' | 'B2C'

/**
 * Response shape for GET /api/metrics/facets.
 * Used for date-range references and allowed filter values.
 */
export interface FacetsResponse {
  /** Available operation types currently present in the dataset. */
  operation_types: OperationType[]

  /** Available business lines currently present in the dataset. */
  business_types: BusinessType[]

  /** Available categories currently present in the dataset. */
  categories: Category[]

  /** Earliest available movement date in dataset, YYYY-MM-DD. */
  min_date: DateStringISO

  /** Latest available movement date in dataset, YYYY-MM-DD. */
  max_date: DateStringISO
}

/**
 * Single anomaly row from GET /api/metrics/alerts.
 */
export interface AlertEntry {
  /** Period identifier. Format depends on group_by (day, week, month). */
  period: string

  /** Sum of outcome values for the reported period. */
  outcome_total: number

  /** Rolling baseline average of prior periods used by backend alert logic. */
  baseline_average: number

  /** Relative increase ratio: (outcome_total - baseline_average) / baseline_average. */
  increase_ratio: number
}

/** Response shape for GET /api/metrics/alerts. */
export type AlertsResponse = AlertEntry[]

/**
 * Single category aggregate row from GET /api/metrics/categories/top.
 */
export interface CategoryEntry {
  /** Category label. */
  category: Category

  /** Operation type used in the request. */
  operation_type: OperationType

  /** Total aggregated amount for the category in the selected filters. */
  total_amount: number
}

/** Response shape for GET /api/metrics/categories/top. */
export type TopCategoriesResponse = CategoryEntry[]

import type {
  BusinessType,
  DateStringISO,
  OperationType,
} from './api-types'

/** Valid grouping values exposed by GET /api/metrics/alerts. */
export type GroupBy = 'day' | 'week' | 'month'

/**
 * Shared date-range query parameters used by dashboard filters.
 */
export interface DateRangeFilter {
  /**
   * Inclusive lower date bound.
   * Valid format: YYYY-MM-DD.
   * Optional: omit to include data from the earliest available date.
   */
  start_date?: DateStringISO

  /**
   * Inclusive upper date bound.
   * Valid format: YYYY-MM-DD.
   * Optional: omit to include data through the latest available date.
   */
  end_date?: DateStringISO
}

/**
 * Query parameters for GET /api/metrics/alerts.
 */
export interface AlertParams extends DateRangeFilter {
  /**
   * Spike sensitivity ratio used by anomaly detection.
   * Frontend contract constraint: 0.01 to 1.0.
   * Backend allows >= 0, but this UI spec intentionally narrows valid input.
   * Default UI value: 0.3.
   */
  threshold?: number

  /**
   * Period granularity for alert grouping.
   * Valid values: day, week, month.
   * Default backend value: month.
   */
  group_by?: GroupBy

  /**
   * Optional business-line filter.
   * Valid values: B2B, B2C.
   */
  business_type?: BusinessType
}

/**
 * Query parameters for GET /api/metrics/categories/top.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Financial operation to aggregate.
   * Valid values: income, outcome.
   * Feature 3 uses income.
   */
  operation_type: OperationType

  /**
   * Maximum number of categories returned.
   * Backend constraint: integer between 1 and 20.
   * Feature 3 requirement: 5.
   */
  limit: number

  /**
   * Optional business-line filter for split comparison.
   * Valid values: B2B, B2C.
   */
  business_type?: BusinessType
}

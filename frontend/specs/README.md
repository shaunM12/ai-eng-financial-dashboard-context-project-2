# Frontend Feature Specifications

This specification set defines contracts and UI behavior for three dashboard features.
Implementation is intentionally out of scope.

## Contract Sources
- Primary: OpenAPI document and provided Swagger screenshots.
- Verification reference: backend implementation and tests.
- Docs entrypoint: /docs.

## Clarifications Applied
- The documentation path is /docs (not /doc).
- For Feature 2, the UI column label is defined as rolling average of previous 3 periods, while the API field consumed is baseline_average from /api/metrics/alerts.
- This package specifies contracts and behavior only; it does not add React pages/components or API integration code.

## Non-Goals
- No React component implementation.
- No API service implementation.
- No backend endpoint changes.

## Shared Type Artifacts
- Response types: frontend/specs/api-types.ts
- Query parameter types: frontend/specs/param-types.ts

## Feature 1: Home Date Range Filter

### Endpoint Usage
- GET /api/metrics/facets
  - Purpose: fetch min_date and max_date for range reference.
- GET /api/metrics
  - Purpose: fetch dashboard movement data filtered by date.

### Request Types
- DateRangeFilter (frontend/specs/param-types.ts)
  - start_date?: YYYY-MM-DD
  - end_date?: YYYY-MM-DD

### Response Types
- FacetsResponse (frontend/specs/api-types.ts)
- Financial metrics movement list (existing app contract from /api/metrics)

### Parameter Constraints
- start_date:
  - Optional.
  - Format: YYYY-MM-DD.
  - Inclusive lower bound when present.
- end_date:
  - Optional.
  - Format: YYYY-MM-DD.
  - Inclusive upper bound when present.

### UI Requirements
- Render two optional date inputs near the top of home dashboard.
- Always show available range reference from facets: min_date to max_date.
- If both dates are empty, load all available data.

### Edge Cases
- Edge case: user clears both dates.
  - UI must show full dataset and keep available-range hint visible.
- Edge case: selected start_date is later than end_date.
  - UI must block request submission and show inline validation message.
- Edge case: facets request fails.
  - UI must still render date inputs and display fallback hint: range unavailable.

## Feature 2: Anomaly Alerts Table

### Endpoint Usage
- GET /api/metrics/alerts
  - Query: threshold, optional start_date, optional end_date, optional group_by, optional business_type.

### Request Types
- AlertParams (frontend/specs/param-types.ts)
  - threshold?: number (frontend accepted range 0.01 to 1.0, default 0.3)
  - group_by?: day | week | month
  - business_type?: B2B | B2C
  - start_date?: YYYY-MM-DD
  - end_date?: YYYY-MM-DD

### Response Types
- AlertsResponse (frontend/specs/api-types.ts)
  - Array of AlertEntry with period, outcome_total, baseline_average, increase_ratio.

### Parameter Constraints
- threshold:
  - Frontend constraint: 0.01 to 1.0.
  - Default UI value: 0.3.
  - Backend allows >= 0, but UI intentionally narrows input.
- start_date/end_date:
  - Optional.
  - Same DateRangeFilter rules from Feature 1.
- group_by:
  - Optional.
  - Valid values: day, week, month.
- business_type:
  - Optional.
  - Valid values: B2B, B2C.

### UI Requirements
- Place alerts table below existing home charts.
- Render exactly four columns:
  - period
  - recorded outcome
  - rolling average of previous 3 periods
  - percentage increase
- Show numeric threshold control for user configuration.
- Apply active date range filter from Feature 1.
- If no rows are returned, show explicit empty-state message.

### Edge Cases
- Edge case: threshold set outside valid UI range.
  - UI must prevent invalid value entry and show helper text for allowed range.
- Edge case: alerts endpoint returns empty list.
  - UI must show explicit empty-state message; table container remains visible.
- Edge case: alerts endpoint request fails.
  - UI must show non-blocking error state and keep threshold control accessible.

## Feature 3: B2B vs B2C Comparison View

### Endpoint Usage
- GET /api/metrics/facets
  - Purpose: available categories and valid date range for filters.
- GET /api/metrics/categories/top
  - Called twice with TopCategoriesParams:
    - B2B request: operation_type=income, limit=5, business_type=B2B, optional date range.
    - B2C request: operation_type=income, limit=5, business_type=B2C, optional date range.

### Request Types
- TopCategoriesParams (frontend/specs/param-types.ts)
  - operation_type: income | outcome
  - limit: number (backend: integer 1 to 20; feature requirement uses 5)
  - business_type?: B2B | B2C
  - start_date?: YYYY-MM-DD
  - end_date?: YYYY-MM-DD
- DateRangeFilter for shared comparison filter controls.

### Response Types
- FacetsResponse (frontend/specs/api-types.ts)
- TopCategoriesResponse (frontend/specs/api-types.ts)

### Parameter Constraints
- operation_type:
  - Required in spec type.
  - Feature value: income.
- limit:
  - Required in spec type.
  - Backend constraints: min 1, max 20.
  - Feature value: 5.
- business_type:
  - Required by feature behavior (B2B and B2C split requests).
- start_date/end_date:
  - Optional.
  - Format: YYYY-MM-DD.

### UI Requirements
- Build a dedicated comparison page.
- Show two side-by-side sections for B2B and B2C.
- Each section table columns:
  - category name
  - total income
  - percent of group total
- Add a single chart below both tables that compares B2B and B2C totals.
- Use the same date filter format and behavior as Feature 1.

### Edge Cases
- Edge case: one business segment returns fewer than 5 categories.
  - UI must render available rows only and keep table headers and section title.
- Edge case: one segment total is 0.
  - UI must show 0 values and percentage display should avoid divide-by-zero (show 0%).
- Edge case: one segment request fails while the other succeeds.
  - UI must isolate the error to the affected section and keep the other section/chart visible with partial-data indicator.

## Contract Validation Checklist
- All endpoint paths and parameter names match OpenAPI (/openapi.json) and /docs screenshots.
- All query parameters use snake_case names.
- All date parameters are documented as YYYY-MM-DD.
- Alert threshold UI constraint is documented as 0.01 to 1.0.
- Types in api-types.ts and param-types.ts are strict and avoid any/object.

## Requirement Traceability Matrix

| Requirement ID | Original Requirement | Where Defined In Specs |
| --- | --- | --- |
| F1-1 | Add start and end date inputs on home dashboard that filter all displayed data | Feature 1 UI Requirements and Feature 1 Endpoint Usage |
| F1-2 | Send dates as YYYY-MM-DD | Feature 1 Parameter Constraints and DateRangeFilter in param-types.ts |
| F1-3 | Both inputs optional; empty means all data | Feature 1 UI Requirements and Feature 1 Edge Cases |
| F1-4 | Show available min/max date reference near inputs | Feature 1 UI Requirements and Feature 1 Endpoint Usage (/api/metrics/facets) |
| F2-1 | Add anomaly alerts table below existing charts | Feature 2 UI Requirements |
| F2-2 | Table columns: period, outcome, rolling average, percentage increase | Feature 2 UI Requirements |
| F2-3 | User-configurable threshold input, ratio 0.01-1.0, default 0.3 | Feature 2 Request Types and Feature 2 Parameter Constraints; AlertParams in param-types.ts |
| F2-4 | Explicit empty state when no anomalies | Feature 2 UI Requirements and Feature 2 Edge Cases |
| F2-5 | Alerts table respects Feature 1 date range | Feature 2 UI Requirements and Feature 2 Request Types |
| F2-6 | Use GET /api/metrics/alerts?threshold=<ratio> | Feature 2 Endpoint Usage |
| F3-1 | New comparison page for B2B vs B2C revenue performance | Feature 3 UI Requirements |
| F3-2 | Two side-by-side sections with top 5 income categories | Feature 3 UI Requirements and Feature 3 Endpoint Usage |
| F3-3 | Table columns: category, total income, % of group total | Feature 3 UI Requirements |
| F3-4 | Single chart below both sections comparing B2B vs B2C income | Feature 3 UI Requirements |
| F3-5 | Comparison page supports optional date range filter in YYYY-MM-DD | Feature 3 Request Types and Feature 3 Parameter Constraints |
| F3-6 | Available categories must come from facets endpoint | Feature 3 Endpoint Usage (/api/metrics/facets) |
| F3-7 | Use GET /api/metrics/categories/top?operation_type=income&limit=5 | Feature 3 Endpoint Usage |
| D1 | Create api-types.ts with FacetsResponse, AlertEntry/AlertsResponse, CategoryEntry/TopCategoriesResponse | Shared Type Artifacts and frontend/specs/api-types.ts |
| D2 | Create param-types.ts with DateRangeFilter, AlertParams, TopCategoriesParams and strict typing | Shared Type Artifacts and frontend/specs/param-types.ts |
| D3 | Document every parameter property with JSDoc meaning/values/format | frontend/specs/param-types.ts (all properties documented) |
| D4 | Create components.md component breakdown per feature | frontend/specs/components.md |
| D5 | Create README with endpoints, types, constraints, and >=2 edge cases per feature | Feature 1/2/3 sections in this file |
| Scope-1 | Important: specs only, do not implement React/components/API calls | Non-Goals and Clarifications Applied |

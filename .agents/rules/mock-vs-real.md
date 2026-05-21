# Rule: Mock vs. Real Data Structure

## Scope
Backend data modules and organization.

## Standard
- Place all mock data and generators in a clearly named module or folder (e.g., `mock_data/`).

## Rationale
Clear separation of mock and real data prevents confusion and accidental exposure of test data in production.
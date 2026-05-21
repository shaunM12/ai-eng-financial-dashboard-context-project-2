# Rule: Mock Data Usage

## Scope
Backend data generation, API endpoints, and test fixtures.

## Standard
- Mock data must only be used in development or test environments.
- Production must use a real database or API.
- Clearly separate mock and real data logic.

## Rationale
Mock data is useful for demos and tests but is not suitable for real users or analytics. Separation prevents accidental exposure of fake data.
# Rule: Service Readiness

## Scope
Docker Compose configuration for all services.

## Standard
- Add healthchecks to all Docker Compose services.
- Use `depends_on` with `condition: service_healthy` for startup order.

## Rationale
Ensures services only start when dependencies are actually ready, reducing startup errors and race conditions.
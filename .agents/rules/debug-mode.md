# Rule: Debug/Reload Modes

## Scope
Backend Dockerfile, Uvicorn/debugpy startup configuration.

## Standard
- Never run `debugpy` or `--reload` in production Docker images.
- Use build args or environment variables to toggle debug features.

## Rationale
Debug and reload modes are for development only. They reduce performance and expose internals if left enabled in production.
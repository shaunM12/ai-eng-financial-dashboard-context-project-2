# Rule: Proxy Target Configuration

## Scope
Frontend Vite proxy settings.

## Standard
- Make Vite proxy target configurable via `.env` file.
- Default to `backend` for Docker and `localhost` for local dev.

## Rationale
Hardcoded proxy targets break local development and deployment flexibility. Environment-based config is more robust.
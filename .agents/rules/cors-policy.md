# Rule: CORS Policy

## Scope
All FastAPI backend CORS configuration.

## Standard
- In production, restrict `allow_origins` to trusted domains and set `allow_credentials=False` unless strictly required.
- In development, document why `*` and credentials are enabled.

## Rationale
Permissive CORS with credentials is a critical security risk. Restricting origins and credentials prevents cross-site attacks and data leaks.
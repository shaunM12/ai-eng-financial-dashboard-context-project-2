# Rule: Dependency Pinning

## Scope
All backend and frontend dependency files.

## Standard
- Pin all backend dependencies with exact versions in `requirements.txt`.
- Use exact or tilde (`~`) versions for frontend dependencies.

## Rationale
Pinning ensures reproducible builds and prevents breakage from upstream changes.
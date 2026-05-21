# Rule: Environment Separation

## Scope
Environment variable and configuration management.

## Standard
- Use `.env`, `.env.development`, `.env.production` to separate config for different environments.

## Rationale
Environment-specific configs prevent accidental use of dev settings in production and vice versa.
---
title: Proxy Target Configuration
scope: project
globs:
	- 'frontend/vite.config.ts'
	- 'frontend/.env*'
content:
	- Make proxy target configurable through environment variables.
	- Use sensible defaults for containerized and local development.
	- Avoid hardcoded backend origins in frontend config.
	- Preserve deployment flexibility across environments.
---
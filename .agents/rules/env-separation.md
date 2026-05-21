---
title: Environment Separation
scope: project
globs:
	- 'frontend/.env*'
	- 'backend/.env*'
	- 'docker-compose.yml'
content:
	- Separate settings by environment using env files.
	- Keep development and production values isolated.
	- Avoid deploying development configuration to production.
	- Prefer environment-aware configuration over hardcoded values.
---
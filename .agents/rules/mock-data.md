---
title: Mock Data Usage
scope: project
globs:
	- 'backend/app/**/*.py'
	- 'backend/tests/**/*.py'
content:
	- Use mock data only in development and test environments.
	- Production paths must use real data sources.
	- Keep mock and real data logic clearly separated.
	- Prevent accidental exposure of fake data to users.
---
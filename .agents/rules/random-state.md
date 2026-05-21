---
title: Random State Management
scope: project
globs:
	- 'backend/app/**/*.py'
content:
	- Avoid global random seeding in request-handling code.
	- Use local random generator instances for deterministic behavior.
	- Keep random state isolated per operation when needed.
	- Prevent unpredictable behavior in concurrent workloads.
---
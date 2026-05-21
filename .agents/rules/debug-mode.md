---
title: Debug and Reload Modes
scope: project
globs:
	- 'backend/Dockerfile'
	- 'backend/app/**/*.py'
content:
	- Do not run debugpy in production images or startup commands.
	- Do not use the reload flag in production.
	- Toggle debug features with environment variables or build arguments.
	- Keep debug tooling limited to development to avoid performance and security risk.
---
---
title: CORS Policy
scope: project
globs:
	- 'backend/app/**/*.py'
content:
	- Restrict allow_origins to trusted domains in production.
	- Set allow_credentials to false in production unless strictly required.
	- If permissive CORS is used in development, document the reason.
	- Prevent cross-site attacks and data leaks caused by permissive CORS.
---
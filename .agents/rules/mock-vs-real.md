---
title: Mock Versus Real Data Structure
scope: project
globs:
	- 'backend/app/**/*.py'
content:
	- Keep mock data and generators in clearly named modules or folders.
	- Keep production data access paths separate from mock implementations.
	- Make environment switching explicit and easy to audit.
	- Reduce confusion and accidental use of test data in production.
---
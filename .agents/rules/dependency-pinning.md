---
title: Dependency Pinning
scope: project
globs:
	- 'backend/requirements.txt'
	- 'frontend/package.json'
content:
	- Pin backend dependencies to exact versions in requirements.txt.
	- Use exact or tilde ranges for frontend dependencies.
	- Keep installs reproducible across environments and time.
	- Reduce breakage from upstream dependency changes.
---
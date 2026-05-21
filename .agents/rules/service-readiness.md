---
title: Service Readiness
scope: project
globs:
	- 'docker-compose.yml'
content:
	- Define healthchecks for each service in compose.
	- Use service_healthy dependency conditions for startup ordering.
	- Ensure dependent services wait for readiness, not only process start.
	- Reduce race conditions and startup failures.
---
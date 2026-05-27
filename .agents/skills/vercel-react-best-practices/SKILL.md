---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React/Next.js components for performance, bundle size, data-fetching, and rendering improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
  source: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
---

# Vercel React Best Practices

Apply this skill when working on React or Next.js UI and data flows.

## When to use

- Reviewing React component quality and performance.
- Refactoring slow or re-render-heavy components.
- Improving bundle loading and dynamic imports.
- Fixing server/client data-fetching waterfalls.
- Optimizing rendering and hydration behavior.

## Priority areas

1. Eliminating waterfalls (critical)
2. Bundle size optimization (critical)
3. Server-side performance (high)
4. Client-side data fetching (medium-high)
5. Re-render optimization (medium)
6. Rendering performance (medium)
7. JavaScript hot-path optimizations (low-medium)
8. Advanced patterns (low)

## Review output format

- Issue
- Impact
- Evidence (file path and line)
- Recommended fix
- Priority

## References

- Skill page: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
- Upstream repo: https://github.com/vercel-labs/agent-skills
- React docs: https://react.dev
- Next.js docs: https://nextjs.org
- Detailed notes: references/UPSTREAM.md

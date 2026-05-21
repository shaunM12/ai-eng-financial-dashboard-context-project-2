# Rule Refinement Notes

## What Was Done

- Each rule in `.agents/rules` was reviewed for clarity, specificity, and direct connection to the actual workflows and files in this repository.
- Ambiguous or generic language was replaced with concrete instructions, file references, and actionable requirements.
- Rules were updated to:
  - Reference real files and code locations (e.g., `backend/app/main.py`, `docker-compose.yml`, etc.).
  - Specify how to implement or enforce the rule in this project.
  - Distinguish between development and production practices where relevant.
  - Require documentation or code comments for exceptions (e.g., permissive CORS in dev).
  - Encourage separation of mock and real data, and use of environment variables for configuration.

## Why This Was Done

- To ensure every rule is actionable and not just theoretical.
- To make it easy for contributors and reviewers to apply the rules during code reviews and development.
- To reduce ambiguity and prevent misinterpretation or accidental misconfiguration.
- To align the rule set with the real structure and operational needs of this codebase.
- To support automation and future agent-driven enforcement or suggestions.

## How to Use These Rules

- When making changes, consult the relevant rule file for guidance.
- During code review, reference the rule files to justify requested changes or approvals.
- Update rules as the project evolves to keep them relevant and effective.

---

_This file documents the rationale and process for refining the rule set in this repository._
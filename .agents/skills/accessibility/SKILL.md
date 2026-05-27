---
name: accessibility
description: Audit and improve frontend accessibility using WCAG 2.2 guidance. Use when asked for a11y review, keyboard navigation fixes, ARIA checks, or accessibility improvements.
license: MIT
metadata:
  author: local-project-skill
  source: https://skills.sh/addyosmani/web-quality-skills/accessibility
  version: "1.0"
---

# Accessibility (Project Adaptation)

Use this skill to review and improve accessibility for the financial dashboard frontend.

## Scope

- Frontend React app in `frontend/src`
- Shared UI components in `frontend/src/components/ui`
- Dashboard components in `frontend/src/components/dashboard`

## How it works

1. Identify UI states: loading, success, empty, and error.
2. Validate semantic structure before ARIA changes.
3. Review keyboard access and visible focus for all interactive controls.
4. Verify labels, names, roles, and announcements for dynamic updates.
5. Check color contrast and reduced-motion support.
6. Produce prioritized findings: Critical, High, Medium, Low.

## Checklist

### Perceivable

- All informative images/icons have meaningful alternatives.
- Color is not the only signal for value changes (profit/loss, gains/drops).
- Text contrast meets WCAG AA (4.5:1 normal, 3:1 large).
- Chart content has text alternatives or equivalent summaries.

### Operable

- Every interactive element is keyboard reachable and actionable.
- Focus order follows visual/logical order.
- Focus indicators are clearly visible.
- No keyboard traps in dialogs, dropdowns, or chart controls.
- Touch/click targets are at least 24 by 24 CSS pixels where practical.

### Understandable

- Inputs have associated labels and clear instructions.
- Validation errors are clear and connected to fields.
- Repeated navigation/help UI stays in consistent order.
- Status changes are understandable without relying on color alone.

### Robust

- Prefer native controls over div/span with ARIA roles.
- If ARIA is required, roles/states/properties match behavior.
- Dynamic updates use polite/assertive live regions only when needed.
- Headings and landmarks provide clear page structure.

## Project-specific targets

- KPI cards expose readable labels and value context.
- Income/outcome and profit charts include text summaries for screen readers.
- Loading skeletons and async states announce meaningful status updates.
- Error states from API calls are announced and recoverable by keyboard.

## Output format

When reporting issues, use:

- Severity
- File path
- Problem
- User impact
- Fix recommendation

## References

- Upstream skill: https://skills.sh/addyosmani/web-quality-skills/accessibility
- Local checklist: references/A11Y-CHECKLIST.md
- WCAG quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- ARIA APG: https://www.w3.org/WAI/ARIA/apg/

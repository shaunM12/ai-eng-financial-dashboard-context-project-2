# Accessibility Checklist For This Repo

Use this quick pass before merging frontend UI changes.

## Global

- Page has one clear main heading.
- Landmarks exist (`header`, `main`, `nav`, `footer` where relevant).
- Keyboard can reach all controls with visible focus.
- No interaction depends only on hover.

## Dashboard Components

- KPI cards have meaningful labels and not just raw numbers.
- Chart components provide textual equivalents for trends.
- Positive/negative states include text or icon cues in addition to color.

## Forms and Actions

- Inputs have explicit labels.
- Error messages are tied to fields and announced.
- Buttons have clear action names.

## Async States

- Loading state is announced or clearly represented semantically.
- Empty state explains what happened and what user can do next.
- Error state includes retry action and screen-reader-friendly messaging.

## Motion and Preferences

- Animations respect reduced-motion user preference.
- Auto-updating regions avoid disruptive announcements.

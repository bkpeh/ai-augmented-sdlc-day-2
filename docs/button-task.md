# PRD-001 Button Styling Task

## Step-by-step plan
1. Review existing button styles in `src/index.css` and identify primary, destructive, and filter button selectors.
2. Define a consistent primary style for "Add" and "Save" buttons, ensuring hover and focus-visible states are included.
3. Keep destructive styling for "Delete" buttons and add a clear hover state that does not reduce contrast.
4. Add a distinct selected state for filter buttons (`aria-pressed="true"`) that is visible without relying on color alone (e.g., underline + border).
5. Add hover styles for all button variants while preserving current spacing and layout.
6. Verify button visuals against PRD acceptance criteria and ensure no regressions in layout.

## Playwright-based testing plan
- Start the dev server and run Playwright against the running app.
- Validate primary button styling is applied to "Add" and "Save" via class names and computed style checks.
- Validate destructive styling is applied to "Delete" and hover state changes the background or border color.
- Validate filter buttons show selected state when clicked and `aria-pressed` updates.
- Validate hover styles for filter buttons using Playwright hover and computed styles.
- Perform a smoke test for add/edit/delete flows to ensure buttons remain functional.

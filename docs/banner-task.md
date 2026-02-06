# PRD-002 Banner Task

## Step-by-step plan
1. Add a new `Banner` component that renders a title, subtitle, and a compact info item.
2. Update `App.jsx` to render the banner above the form and pass props (title, subtitle, task count info).
3. Ensure the info item uses total task count to stay stable across filters.
4. Add banner styles in `src/index.css` that are responsive and visually distinct without overpowering the main app.
5. Validate banner layout on mobile and desktop widths and confirm it appears on all screens.
6. Confirm the banner does not change existing focus management or accessibility behavior.

## Playwright-based testing plan
- Start the dev server and run Playwright against the running app.
- Assert the banner region is visible on load and contains the expected title and subtitle text.
- Assert the info item renders a task count and updates when tasks are added or deleted.
- Verify banner remains present when changing filters.
- Run a viewport test at mobile and desktop sizes to confirm layout stability.

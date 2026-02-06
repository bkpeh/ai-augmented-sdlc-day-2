# PRD-003 Due Date Task

## Step-by-step plan
1. Extend the task model in `App.jsx` to include an optional `dueDate` field (ISO date string or null).
2. Update `addTask` to accept and store a `dueDate` and wire it from the form.
3. Update `Form.jsx` to include a labeled date input ("Due date (optional)") and pass its value to `addTask`.
4. Update `Todo.jsx` to display a due date line only when a task has a due date.
5. Update the edit template in `Todo.jsx` to include a date input, initialize it with the current due date, and pass it to `editTask`.
6. Update `editTask` in `App.jsx` to persist the new due date.
7. Confirm the UI shows no due date placeholder when the field is empty.
8. Manually verify add/edit/delete/filter flows with and without due dates.

## Playwright-based testing plan
- Start the dev server and run Playwright against the running app.
- Add a task with a due date and assert the due date text renders in the task item.
- Add a task without a due date and assert no due date text is present.
- Edit a task to change the due date and verify it updates in view mode.
- Clear a due date in edit mode and verify the due date display is removed.
- Verify due dates persist correctly through filter changes and task completion toggles.

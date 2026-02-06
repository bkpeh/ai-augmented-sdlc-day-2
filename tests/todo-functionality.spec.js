import { test, expect } from "@playwright/test";

// Shared selector for task count heading
const TASK_COUNT_HEADING = /\d+ tasks? remaining/;

test.describe("TodoMatic - Core Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the correct page title and heading", async ({ page }) => {
    await expect(page).toHaveTitle("TodoMatic");
    await expect(page.getByRole("heading", { name: "TodoMatic" })).toBeVisible();
  });

  test("shows initial task count", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /tasks remaining/ });
    await expect(heading).toBeVisible();
  });

  test("can add a new todo", async ({ page }) => {
    const taskName = "Test new todo";
    
    await page.getByLabel("What needs to be done?").fill(taskName);
    await page.getByRole("button", { name: "Add" }).click();

    const todoItem = page.getByRole("listitem").filter({ hasText: taskName });
    await expect(todoItem).toBeVisible();
  });

  test("can add multiple todos", async ({ page }) => {
    const tasks = ["First task", "Second task", "Third task"];
    
    for (const taskName of tasks) {
      await page.getByLabel("What needs to be done?").fill(taskName);
      await page.getByRole("button", { name: "Add" }).click();
    }

    for (const taskName of tasks) {
      await expect(page.getByRole("listitem").filter({ hasText: taskName })).toBeVisible();
    }
  });

  test("clears input field after adding a todo", async ({ page }) => {
    const taskName = "Test clear input";
    const input = page.getByLabel("What needs to be done?");
    
    await input.fill(taskName);
    await page.getByRole("button", { name: "Add" }).click();

    await expect(input).toHaveValue("");
  });

  test("updates task count when adding todos", async ({ page }) => {
    const initialHeading = page.getByRole("heading", { name: /tasks remaining/ });
    const initialText = await initialHeading.textContent();
    
    await page.getByLabel("What needs to be done?").fill("New task");
    await page.getByRole("button", { name: "Add" }).click();

    const updatedText = await initialHeading.textContent();
    expect(updatedText).not.toBe(initialText);
  });
});

test.describe("TodoMatic - Task Completion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Add a test task
    await page.getByLabel("What needs to be done?").fill("Test task");
    await page.getByRole("button", { name: "Add" }).click();
  });

  test("can mark a task as complete", async ({ page }) => {
    const todoItem = page.getByRole("listitem").filter({ hasText: "Test task" });
    const checkbox = todoItem.getByRole("checkbox");
    
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test("can unmark a completed task", async ({ page }) => {
    const todoItem = page.getByRole("listitem").filter({ hasText: "Test task" });
    const checkbox = todoItem.getByRole("checkbox");
    
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });
});

test.describe("TodoMatic - Task Editing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("What needs to be done?").fill("Original task");
    await page.getByRole("button", { name: "Add" }).click();
  });

  test("can edit a task", async ({ page }) => {
    const todoItem = page.getByRole("listitem").filter({ hasText: "Original task" });
    
    await todoItem.getByRole("button", { name: /Edit/ }).click();
    
    const editInput = todoItem.getByRole("textbox");
    await expect(editInput).toBeVisible();
    
    await editInput.fill("Updated task");
    await todoItem.getByRole("button", { name: /Save/ }).click();
    
    await expect(page.getByRole("listitem").filter({ hasText: "Updated task" })).toBeVisible();
    await expect(page.getByRole("listitem").filter({ hasText: "Original task" })).toHaveCount(0);
  });

  test("can cancel editing a task", async ({ page }) => {
    const todoItem = page.getByRole("listitem").filter({ hasText: "Original task" });
    
    await todoItem.getByRole("button", { name: /Edit/ }).click();
    
    const editInput = todoItem.getByRole("textbox");
    await editInput.fill("Should not save");
    
    await todoItem.getByRole("button", { name: /Cancel/ }).click();
    
    await expect(page.getByRole("listitem").filter({ hasText: "Original task" })).toBeVisible();
    await expect(page.getByRole("listitem").filter({ hasText: "Should not save" })).toHaveCount(0);
  });

  test("shows edit form with proper labels", async ({ page }) => {
    const todoItem = page.getByRole("listitem").filter({ hasText: "Original task" });
    
    await todoItem.getByRole("button", { name: /Edit/ }).click();
    
    await expect(todoItem.getByText(/New name for Original task/)).toBeVisible();
  });
});

test.describe("TodoMatic - Task Deletion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("What needs to be done?").fill("Task to delete");
    await page.getByRole("button", { name: "Add" }).click();
  });

  test("can delete a task", async ({ page }) => {
    const todoItem = page.getByRole("listitem").filter({ hasText: "Task to delete" });
    
    await expect(todoItem).toBeVisible();
    
    await todoItem.getByRole("button", { name: /Delete/ }).click();
    
    await expect(todoItem).toHaveCount(0);
  });

  test("updates task count after deletion", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /tasks remaining/ });
    const textBefore = await heading.textContent();
    
    const todoItem = page.getByRole("listitem").filter({ hasText: "Task to delete" });
    await todoItem.getByRole("button", { name: /Delete/ }).click();
    
    const textAfter = await heading.textContent();
    expect(textAfter).not.toBe(textBefore);
  });

  test("can delete multiple tasks", async ({ page }) => {
    // Add more tasks
    await page.getByLabel("What needs to be done?").fill("Task 2");
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByLabel("What needs to be done?").fill("Task 3");
    await page.getByRole("button", { name: "Add" }).click();

    // Delete all tasks
    let deleteButtons = page.getByRole("button", { name: /Delete/ });
    let count = await deleteButtons.count();
    
    for (let i = 0; i < count; i++) {
      await page.getByRole("button", { name: /Delete/ }).first().click();
    }

    await expect(page.getByRole("listitem")).toHaveCount(0);
  });
});

test.describe("TodoMatic - Filtering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // The app starts with 3 tasks: Eat (completed), Sleep, Repeat
  });

  test("shows all initial tasks by default", async ({ page }) => {
    // Verify the app loads with its default tasks
    const listItems = page.getByRole("listitem");
    // The app starts with 3 default tasks: Eat (completed), Sleep, Repeat
    await expect(listItems).toHaveCount(3);
    
    // Use exact match to avoid partial matches
    await expect(page.getByRole("checkbox", { name: "Eat", exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Sleep" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Repeat" })).toBeVisible();
  });

  test("can filter to show only active tasks", async ({ page }) => {
    // Click the Active filter button using the full accessible name
    await page.getByRole("button", { name: "Show Active tasks" }).click();
    
    await expect(page.getByRole("button", { name: "Show Active tasks" })).toHaveAttribute("aria-pressed", "true");
    // Sleep and Repeat are active
    await expect(page.getByRole("checkbox", { name: "Sleep" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Repeat" })).toBeVisible();
    // Eat is completed, so it should not be visible
    await expect(page.getByRole("checkbox", { name: "Eat", exact: true })).not.toBeVisible();
  });

  test("can filter to show only completed tasks", async ({ page }) => {
    // Click the Completed filter button using the full accessible name
    await page.getByRole("button", { name: "Show Completed tasks" }).click();
    
    await expect(page.getByRole("button", { name: "Show Completed tasks" })).toHaveAttribute("aria-pressed", "true");
    // Only Eat is completed
    await expect(page.getByRole("checkbox", { name: "Eat", exact: true })).toBeVisible();
    // Sleep and Repeat should not be visible
    await expect(page.getByRole("checkbox", { name: "Sleep" })).not.toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Repeat" })).not.toBeVisible();
  });

  test("can switch between filters", async ({ page }) => {
    // Filter to Active (Sleep, Repeat)
    await page.getByRole("button", { name: "Show Active tasks" }).click();
    await expect(page.getByRole("checkbox", { name: "Sleep" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Repeat" })).toBeVisible();
    
    // Filter to Completed (Eat)
    await page.getByRole("button", { name: "Show Completed tasks" }).click();
    await expect(page.getByRole("checkbox", { name: "Eat", exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Sleep" })).not.toBeVisible();
    
    // Back to All
    await page.getByRole("button", { name: "Show All tasks" }).click();
    await expect(page.getByRole("checkbox", { name: "Eat", exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Sleep" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Repeat" })).toBeVisible();
  });

  test("task counter shows active tasks count across filters", async ({ page }) => {
    const heading = page.getByRole("heading", { name: TASK_COUNT_HEADING });
    
    // Get the initial active task count
    await heading.waitFor();
    const initialText = await heading.textContent();
    
    // All filter - should show count of active tasks
    await expect(heading).toContainText(TASK_COUNT_HEADING);
    
    // Active filter - should still show count of active tasks
    await page.getByRole("button", { name: "Show Active tasks" }).click();
    await expect(heading).toContainText(TASK_COUNT_HEADING);
    
    // Completed filter - should still show count of active tasks (not changed by filter)
    await page.getByRole("button", { name: "Show Completed tasks" }).click();
    await expect(heading).toContainText(TASK_COUNT_HEADING);
    
    // Back to All - should still show the same count
    await page.getByRole("button", { name: "Show All tasks" }).click();
    await expect(heading).toContainText(initialText);
  });
});

test.describe("TodoMatic - Task Counter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays task count with correct grammar", async ({ page }) => {
    // Check that the count is displayed (default has some active tasks)
    const heading = page.getByRole("heading", { name: TASK_COUNT_HEADING });
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text).toMatch(TASK_COUNT_HEADING);
  });

  test("handles singular and plural task counts correctly", async ({ page }) => {
    // This test verifies that the app properly handles task/tasks grammar
    // The app uses "task" (singular) when count is 1, and "tasks" (plural) otherwise
    const heading = page.getByRole("heading", { name: TASK_COUNT_HEADING });
    await expect(heading).toBeVisible();
    
    // Verify the heading follows the pattern: number + "task" or "tasks" + "remaining"
    const text = await heading.textContent();
    expect(text).toMatch(/\d+ tasks? remaining/);
    
    // The specific text depends on the current state, but the grammar should be correct
    const count = parseInt(text.match(/\d+/)[0]);
    if (count === 1) {
      expect(text).toContain("1 task remaining");
    } else {
      expect(text).toContain(`${count} tasks remaining`);
    }
  });
});

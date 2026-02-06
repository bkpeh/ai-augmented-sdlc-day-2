import { test, expect } from "@playwright/test";

test.describe("button styling", () => {
  test("primary and destructive buttons use correct styles", async ({ page }) => {
    await page.goto("/");

    const addButton = page.getByRole("button", { name: "Add" });
    await expect(addButton).toHaveClass(/btn__primary/);
    await addButton.hover();
    await expect(addButton).toHaveCSS("background-color", "rgb(26, 26, 26)");

    const taskName = "Button style check";
    await page.getByLabel("What needs to be done?").fill(taskName);
    await addButton.click();

    const item = page.getByRole("listitem").filter({ hasText: taskName });
    const deleteButton = item.getByRole("button", { name: /Delete/ });
    await expect(deleteButton).toHaveClass(/btn__danger/);
    await deleteButton.hover();
    await expect(deleteButton).toHaveCSS(
      "background-color",
      "rgb(184, 50, 50)"
    );

    const editButton = item.getByRole("button", { name: /Edit/ });
    await editButton.click();

    const saveButton = item.getByRole("button", { name: /Save/ });
    await expect(saveButton).toHaveClass(/btn__primary/);
    await saveButton.hover();
    await expect(saveButton).toHaveCSS("background-color", "rgb(26, 26, 26)");
  });

  test("filter buttons show selected and hover state", async ({ page }) => {
    await page.goto("/");

    const activeButton = page.getByRole("button", { name: "Active" });
    await activeButton.click();

    await expect(activeButton).toHaveAttribute("aria-pressed", "true");
    await expect(activeButton).toHaveCSS("text-decoration-line", "underline");
    await expect(activeButton).toHaveCSS("border-color", "rgb(77, 77, 77)");

    const completedButton = page.getByRole("button", { name: "Completed" });
    await completedButton.hover();
    await expect(completedButton).toHaveCSS(
      "background-color",
      "rgb(250, 250, 250)"
    );
    await expect(completedButton).toHaveCSS(
      "border-color",
      "rgb(140, 140, 140)"
    );
  });

  test("add, edit, and delete flow remains functional", async ({ page }) => {
    await page.goto("/");

    const addButton = page.getByRole("button", { name: "Add" });
    const taskName = "Flow check";
    await page.getByLabel("What needs to be done?").fill(taskName);
    await addButton.click();

    const item = page.getByRole("listitem").filter({ hasText: taskName });
    await expect(item).toBeVisible();

    const editButton = item.getByRole("button", { name: /Edit/ });
    await editButton.click();

    const editInput = item.getByRole("textbox");
    const updatedName = "Flow check updated";
    await editInput.fill(updatedName);

    const saveButton = item.getByRole("button", { name: /Save/ });
    await saveButton.click();

    const updatedItem = page
      .getByRole("listitem")
      .filter({ hasText: updatedName });
    await expect(updatedItem).toBeVisible();

    const deleteButton = updatedItem.getByRole("button", { name: /Delete/ });
    await deleteButton.click();

    await expect(updatedItem).toHaveCount(0);
  });
});

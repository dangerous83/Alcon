import { test, expect } from "./fixtures";

test.describe("white label full preview", () => {
  test("clicking a sample opens a full preview dialog", async ({ page }) => {
    await page.goto("/white-label");

    await page
      .getByRole("button", { name: /full preview/i })
      .first()
      .click();

    const dialog = page.getByRole("dialog", { name: /Vanta Media preview/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Vanta Media" })).toBeVisible();
    await expect(dialog.getByText("1 / 20")).toBeVisible();
  });

  test("arrow keys and buttons step through samples", async ({ page }) => {
    await page.goto("/white-label");
    await page.getByRole("button", { name: /full preview/i }).first().click();

    await page.getByRole("button", { name: "Next sample" }).click();
    await expect(
      page.getByRole("dialog", { name: /Nexchain preview/i })
    ).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(
      page.getByRole("dialog", { name: /Vanta Media preview/i })
    ).toBeVisible();
  });

  test("Escape and the close button both dismiss the preview", async ({
    page,
  }) => {
    await page.goto("/white-label");
    await page.getByRole("button", { name: /full preview/i }).first().click();

    const dialog = page.getByRole("dialog", { name: /Vanta Media preview/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: /full preview/i }).first().click();
    await expect(
      page.getByRole("dialog", { name: /Vanta Media preview/i })
    ).toBeVisible();
    await page.getByRole("button", { name: "Close preview" }).click();
    await expect(
      page.getByRole("dialog", { name: /Vanta Media preview/i })
    ).toBeHidden();
  });
});

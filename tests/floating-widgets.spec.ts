import { test, expect } from "@playwright/test";

test("whatsapp widget links to the real number", async ({ page }) => {
  await page.goto("/");
  const whatsapp = page.getByRole("link", { name: /chat on whatsapp/i });
  await expect(whatsapp).toHaveAttribute(
    "href",
    "https://wa.me/971561643886"
  );
  await expect(whatsapp).toHaveAttribute("target", "_blank");
});

test("AI assistant widget opens, explains it isn't connected, and closes on Escape", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /open alcon ai assistant/i });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Alcon AI Assistant" });
  await expect(dialog).toBeVisible();
  // Honest about not having a live backend in this build, rather than
  // pretending to answer from real Alcon knowledge it doesn't have.
  await expect(dialog.getByText(/wired to a live backend/i)).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("AI assistant gives a fallback reply instead of a fake answer", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /open alcon ai assistant/i }).click();

  const input = page.getByLabel(/message the alcon ai assistant/i);
  await input.fill("What services does Alcon offer?");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(
    page.getByText(/isn't connected yet/i)
  ).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("quote form shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/get-quote");
  await page.getByRole("button", { name: "Send request" }).click();

  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
});

test("quote form submits successfully with valid data", async ({ page }) => {
  await page.goto("/get-quote");

  await page.getByLabel("Full name").fill("Jamie Rivera");
  await page.getByLabel("Email address").fill("jamie@example.com");
  await page.locator("select[name='service']").selectOption("branding");
  await page
    .getByLabel("Project details")
    .fill("We need a full identity refresh for our Dubai retail brand within the next quarter.");

  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("your request is in");
});

test("quote form rejects invalid email format", async ({ page }) => {
  await page.goto("/get-quote");
  await page.getByLabel("Full name").fill("Jamie Rivera");
  await page.getByLabel("Email address").fill("not-an-email");
  await page.locator("select[name='service']").selectOption("branding");
  await page.getByLabel("Project details").fill("A message that is definitely long enough.");
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
});

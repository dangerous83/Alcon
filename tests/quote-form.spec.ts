import { test, expect } from "./fixtures";

test("quote form shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/get-quote");
  await page.getByRole("button", { name: "Send request" }).click();

  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
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

test("valid submit offers an email fallback when no form endpoint is configured", async ({
  page,
}) => {
  // The site is a static export with no backend, so without
  // NEXT_PUBLIC_FORM_ENDPOINT set the form must NOT claim the message was
  // sent — it hands over a pre-filled mailto instead.
  await page.goto("/get-quote");

  await page.getByLabel("Full name").fill("Jamie Rivera");
  await page.getByLabel("Email address").fill("jamie@example.com");
  await page.locator("select[name='service']").selectOption("branding");
  await page
    .getByLabel("Project details")
    .fill("We need a full identity refresh for our Dubai retail brand within the next quarter.");

  await page.getByRole("button", { name: "Send request" }).click();

  const fallback = page.getByRole("link", { name: "open a pre-filled email" });
  await expect(fallback).toBeVisible();

  const href = await fallback.getAttribute("href");
  expect(href).toContain("mailto:");
  expect(decodeURIComponent(href ?? "")).toContain("Jamie Rivera");

  // And it must not have shown a success state.
  await expect(page.getByText("your request is in")).toHaveCount(0);
});

// NOTE: the configured-endpoint success path is not covered here.
// NEXT_PUBLIC_FORM_ENDPOINT is inlined at build time, so exercising it
// requires a second build with the variable set — do that in CI against a
// staging build rather than faking it with a route mock that would never
// hit the real code path.

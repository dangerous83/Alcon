import { test, expect } from "@playwright/test";

test("desktop primary navigation links work", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width < 768), "desktop-only test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  await nav.getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/client-projects\/?$/);

  await nav.getByRole("link", { name: "Journal" }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
});

test("services dropdown opens and links to each service", async ({
  page,
  viewport,
}) => {
  test.skip(!!(viewport && viewport.width < 768), "desktop-only test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const trigger = nav.getByRole("link", { name: /^Services/ });

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  // Every service should be reachable from the panel.
  for (const name of [
    "Branding & Identity",
    "Motion Graphics",
    "Video Editing",
    "Social Media",
    "Weekend Tutorials",
  ]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }

  await nav.getByRole("link", { name: "Branding & Identity" }).click();
  await expect(page).toHaveURL(/\/services\/branding\/?$/);
});

test("services dropdown closes on Escape", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width < 768), "desktop-only test");
  await page.goto("/");
  const trigger = page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: /^Services/ });

  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("services index is reachable via the dropdown's All services link", async ({
  page,
  viewport,
}) => {
  test.skip(!!(viewport && viewport.width < 768), "desktop-only test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await nav.getByRole("link", { name: /^Services/ }).hover();
  await nav.getByRole("link", { name: "All services" }).click();
  await expect(page).toHaveURL(/\/services\/?$/);
});

test("mobile menu opens and navigates", async ({ page, isMobile, viewport }) => {
  test.skip(!!(viewport && viewport.width > 767), "mobile-only test");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /open menu/i });
  await toggle.click();
  const mobileMenu = page.locator("#mobile-menu");
  await expect(mobileMenu).toBeVisible();
  await mobileMenu.getByRole("link", { name: "Get a Quote" }).click();
  await expect(page).toHaveURL(/\/get-quote\/?$/);
});

test("mobile menu exposes services submenu", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width > 767), "mobile-only test");
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();

  const menu = page.locator("#mobile-menu");
  await menu.getByRole("button", { name: /expand services list/i }).click();
  await menu.getByRole("link", { name: "Motion Graphics" }).click();
  await expect(page).toHaveURL(/\/services\/motion\/?$/);
});

test("hero primary CTA goes to /get-quote and secondary to /client-projects", async ({
  page,
}) => {
  await page.goto("/");
  const primary = page.getByRole("link", { name: "Start a Project" }).first();
  await expect(primary).toHaveAttribute("href", /\/get-quote\/?$/);

  const secondary = page.getByRole("link", { name: "Explore Our Work" }).first();
  await expect(secondary).toHaveAttribute("href", /\/client-projects\/?$/);
});

test("footer links are not broken", async ({ page, request }) => {
  await page.goto("/");
  const links = await page.locator("footer a[href^='/']").evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute("href"))
  );
  for (const href of new Set(links)) {
    if (!href) continue;
    const res = await request.get(href);
    expect(res.status(), href).toBeLessThan(400);
  }
});

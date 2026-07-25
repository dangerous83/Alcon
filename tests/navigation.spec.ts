import { test, expect } from "@playwright/test";

test("desktop primary navigation links work", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width < 1024), "desktop-only test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  await nav.getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/services\/?$/);

  await page.goto("/");
  await nav.getByRole("link", { name: "Solutions" }).click();
  await expect(page).toHaveURL(/\/solutions\/?$/);

  await page.goto("/");
  await nav.getByRole("link", { name: "White Label" }).click();
  await expect(page).toHaveURL(/\/white-label\/?$/);
});

test("clients dropdown opens and links to platform and website", async ({
  page,
  viewport,
}) => {
  test.skip(!!(viewport && viewport.width < 1024), "desktop-only test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const trigger = nav.getByRole("link", { name: /^Clients/ });

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Platform" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Website" })).toBeVisible();

  await nav.getByRole("link", { name: "Platform" }).click();
  await expect(page).toHaveURL(/\/client-projects\/platform\/?$/);

  await page.goto("/");
  await nav.getByRole("link", { name: /^Clients/ }).hover();
  await nav.getByRole("link", { name: "Website" }).click();
  await expect(page).toHaveURL(/\/client-projects\/website\/?$/);
});

test("clients dropdown closes on Escape", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width < 1024), "desktop-only test");
  await page.goto("/");
  const trigger = page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: /^Clients/ });

  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("clients link itself goes to the work index", async ({
  page,
  viewport,
}) => {
  test.skip(!!(viewport && viewport.width < 1024), "desktop-only test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await nav.getByRole("link", { name: /^Clients/ }).click();
  await expect(page).toHaveURL(/\/client-projects\/?$/);
});

test("top announcement banner links to /get-quote", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByRole("link", { name: /start a project/i }).first();
  await expect(banner).toHaveAttribute("href", /\/get-quote\/?$/);
});

test("mobile menu opens and navigates", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width >= 1024), "mobile-only test");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /open menu/i });
  await toggle.click();
  const mobileMenu = page.locator("#mobile-menu");
  await expect(mobileMenu).toBeVisible();
  await mobileMenu.getByRole("link", { name: "Get a Quote" }).click();
  await expect(page).toHaveURL(/\/get-quote\/?$/);
});

test("mobile menu exposes clients submenu", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width >= 1024), "mobile-only test");
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();

  const menu = page.locator("#mobile-menu");
  await menu.getByRole("button", { name: /expand clients list/i }).click();
  await menu.getByRole("link", { name: "Website" }).click();
  await expect(page).toHaveURL(/\/client-projects\/website\/?$/);
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

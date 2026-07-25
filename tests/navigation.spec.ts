import { test, expect } from "@playwright/test";

test("desktop primary navigation links work", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width < 768), "desktop-only test");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/services\/?$/);

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/client-projects\/?$/);

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Journal" }).click();
  await expect(page).toHaveURL(/\/blog\/?$/);
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

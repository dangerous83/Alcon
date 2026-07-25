import { test, expect } from "./fixtures";

test("desktop primary navigation links work", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width < 1024), "desktop-only test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });

  await nav.getByRole("link", { name: /^Services/ }).click();
  await expect(page).toHaveURL(/\/services\/?$/);

  await page.goto("/");
  await nav.getByRole("link", { name: /^Portfolio/ }).click();
  await expect(page).toHaveURL(/\/portfolio\/?$/);

  await page.goto("/");
  await nav.getByRole("link", { name: "White Label", exact: true }).click();
  await expect(page).toHaveURL(/\/white-label\/?$/);
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

test("top announcement banner has tagline, search, and the expert phone number", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Strategy-led creative, built for how AI moves now.")
  ).toBeVisible();

  // "Connect With Us" and the Customer Service number were dropped from the
  // banner in favour of search — assert their absence stays that way.
  await expect(
    page.getByRole("link", { name: "Connect With Us" })
  ).toHaveCount(0);
  await expect(page.locator('header a[href="tel:+97156461565"]')).toHaveCount(0);

  await expect(
    page.getByRole("combobox", { name: /search/i })
  ).toBeVisible();

  // The "Expert:" text label is hidden below the md breakpoint
  // (space-constrained banner), so match by href rather than accessible
  // name — that stays stable across all tested viewports.
  await expect(page.locator('header a[href="tel:+971561643886"]')).toBeVisible();
});

test("header search finds a real page and navigates to it", async ({
  page,
}) => {
  await page.goto("/");
  const search = page.getByRole("combobox", { name: /search/i });
  await search.fill("Brand Identity");

  const result = page.getByRole("option", { name: /Brand Identity/i }).first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/services\/branding\/?$/);
});

test("mobile menu opens and navigates", async ({ page, viewport }) => {
  test.skip(!!(viewport && viewport.width >= 1024), "mobile-only test");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /open menu/i });
  await toggle.click();
  const mobileMenu = page.locator("#mobile-menu");
  await expect(mobileMenu).toBeVisible();

  for (const label of ["Services", "Portfolio", "White Label", "Clients"]) {
    await expect(mobileMenu.getByText(label, { exact: true })).toBeVisible();
  }
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

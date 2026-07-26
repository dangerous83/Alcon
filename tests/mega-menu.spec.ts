import { test, expect } from "./fixtures";

test.describe("desktop mega menus", () => {
  test.beforeEach(({ viewport }) => {
    test.skip(!!(viewport && viewport.width < 1024), "desktop-only");
  });

  test("services mega menu lists its items across 3 columns", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: /^Services/ }).hover();

    const panel = page.getByTestId("services-mega-menu");

    for (const heading of ["Design", "Video & Animation", "Media & Production"]) {
      await expect(panel.getByText(heading, { exact: true })).toBeVisible();
    }

    // White Label has its own top-level nav link, so it is intentionally
    // not duplicated in the Services mega menu.
    for (const label of [
      "Brand Identity",
      "Web UI/UX Design",
      "Graphic Design",
      "Motion Design",
      "2D Animation",
      "3D Animation",
      "AI Video",
      "Social Media",
      "Videography",
      "Photography",
      "Video Editing",
      "Tutorials",
    ]) {
      await expect(panel.getByRole("link", { name: label })).toBeVisible();
    }

    // "NEW" badge on Tutorials
    await expect(panel.getByText("NEW", { exact: true })).toBeVisible();

    // Stats + CTA footer
    await expect(panel.getByText("13", { exact: true })).toBeVisible();
    await expect(panel.getByRole("link", { name: /all services/i })).toHaveAttribute(
      "href",
      /\/services\/?$/
    );

    await panel.getByRole("link", { name: "Brand Identity" }).click();
    await expect(page).toHaveURL(/\/services\/branding\/?$/);
  });

  test("portfolio mega menu lists all 8 items and its own stats", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: /^Portfolio/ }).hover();
    const panel = page.getByTestId("portfolio-mega-menu");

    for (const label of [
      "Branding",
      "UI/UX Design",
      "3D Animation",
      "2D Animation",
      "Motion Design",
      "Videography",
      "Social Media",
      "Photography",
    ]) {
      // Not exact: each link's accessible name is "Title Description"
      // (both live inside the same <Link>), so match by substring.
      await expect(panel.getByRole("link", { name: label })).toBeVisible();
    }

    await expect(panel.getByText("150+", { exact: true })).toBeVisible();
    await expect(
      panel.getByRole("link", { name: /view all work/i })
    ).toHaveAttribute("href", /\/client-projects\/?$/);
  });

  test("clients mega menu lists real external project links", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: /^Clients/ }).hover();

    const uiForge = page.getByRole("link", { name: "Ui Forge" });
    await expect(uiForge).toHaveAttribute("href", "https://www.uiforge.site/");
    await expect(uiForge).toHaveAttribute("target", "_blank");
    await expect(uiForge).toHaveAttribute("rel", /noopener/);

    const itsec = page.getByRole("link", { name: "ITSEC" });
    await expect(itsec).toHaveAttribute("href", "https://itsecnow.com/");

    // 9 platform + 10 website links, all pointing off-site.
    await expect(page.getByText("Global Harvest")).toBeVisible();
    await expect(page.getByText("VerifiX")).toBeVisible();
  });
});

test("services mega menu collapses to an internal list in the mobile menu", async ({
  page,
  viewport,
}) => {
  test.skip(!!(viewport && viewport.width >= 1024), "mobile-only");
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();
  const menu = page.locator("#mobile-menu");
  await menu.getByRole("button", { name: /expand services list/i }).click();
  await menu.getByRole("link", { name: "Brand Identity" }).click();
  await expect(page).toHaveURL(/\/services\/branding\/?$/);
});

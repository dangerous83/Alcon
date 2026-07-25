import { test, expect } from "@playwright/test";

test.describe("hero reveal panel", () => {
  test("renders three feature cards and switches the detail panel on click", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const panel = page.getByTestId("hero-reveal");
    await panel.scrollIntoViewIfNeeded();

    for (const label of ["Services", "Portfolio", "White Label"]) {
      await expect(panel.getByRole("tab", { name: new RegExp(label) })).toBeVisible();
    }

    await expect(
      panel.getByRole("heading", { name: /Design, motion, and production/i })
    ).toBeVisible();

    await panel.getByRole("tab", { name: /^White Label/ }).click();
    await expect(
      panel.getByRole("heading", { name: /Production capacity other agencies resell/i })
    ).toBeVisible();

    await panel.getByRole("tab", { name: /^Portfolio/ }).click();
    await expect(
      panel.getByRole("heading", { name: /Work built for platforms and brands/i })
    ).toBeVisible();
  });

  test("continue journey button is present and navigable via keyboard", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const panel = page.getByTestId("hero-reveal");
    await panel.scrollIntoViewIfNeeded();

    const cta = page.getByTestId("continue-journey");
    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();
  });
});

test.describe("hero reveal scroll gate", () => {
  test.skip(({ viewport }) => !!(viewport && viewport.width < 1024), "desktop-only");

  test("forward scroll is blocked past the reveal panel until Continue Journey is clicked", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for the real pinned hero (not the pre-hydration placeholder <div>)
    // to mount before measuring its height, otherwise "main > section" can
    // resolve to the reveal panel itself and the jump below is a no-op.
    await page.waitForFunction(() => !!document.querySelector("video"));

    // Jump straight to the end of the hero's pinned scroll range so the
    // reveal panel is the section in view, without waiting out the full
    // ~21s scrub in real time.
    await page.evaluate(() => {
      const section = document.querySelector("main > section") as HTMLElement | null;
      if (!section) return;
      const target = section.offsetTop + section.offsetHeight + 20;
      window.scrollTo({ top: target, behavior: "instant" });
    });

    const panel = page.getByTestId("hero-reveal");
    await expect(panel).toBeInViewport();

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(300);
    const afterBlocked = await page.evaluate(() => window.scrollY);
    expect(afterBlocked).toBe(before);

    await page.getByTestId("continue-journey").click();
    await page.waitForTimeout(600);
    const afterConfirmed = await page.evaluate(() => window.scrollY);
    expect(afterConfirmed).toBeGreaterThan(before);
  });
});

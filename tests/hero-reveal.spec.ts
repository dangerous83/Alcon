import { test, expect, type Page } from "@playwright/test";

// Scrolls to a fraction of the hero's own pin range. 1.0 is the last frame of
// the scrub (the Dubai reveal); the HUD eases in from ~0.71, where the scrub
// settles on the front-view brain. Nothing clamps or blocks the page — the
// scrub runs straight through all three clips.
async function scrollHeroTo(page: Page, fraction: number) {
  // Wait for the real pinned hero (not the pre-hydration placeholder) so
  // "main > section" resolves to the hero and its height is measurable.
  await page.waitForFunction(() => !!document.querySelector("video"));
  await page.evaluate((f) => {
    const section = document.querySelector("main > section") as HTMLElement | null;
    if (!section) return;
    // End of the *pin* range, not the end of the section: the sticky frame
    // releases one viewport before the section's bottom edge.
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: section.offsetTop + range * f,
      behavior: "instant",
    });
  }, fraction);
  await page.waitForTimeout(1600); // rAF smoothing + the HUD's ease-in
}

function pinEndOf(page: Page) {
  return page.evaluate(() => {
    const section = document.querySelector("main > section") as HTMLElement;
    return section.offsetTop + section.offsetHeight - window.innerHeight;
  });
}

test.describe("hero reveal HUD (reduced motion: plain section)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
  });

  test("renders three node cards and swaps the readout on click", async ({
    page,
  }) => {
    const panel = page.getByTestId("hero-reveal");
    await panel.scrollIntoViewIfNeeded();

    for (const label of ["Services", "Portfolio", "White Label"]) {
      await expect(panel.getByRole("tab", { name: new RegExp(label) })).toBeVisible();
    }

    await expect(
      panel.getByRole("heading", { name: /Design, motion, and production/i })
    ).toBeVisible();

    await panel.getByRole("tab", { name: /White Label/ }).click();
    await expect(
      panel.getByRole("heading", { name: /Production capacity other agencies resell/i })
    ).toBeVisible();
    await expect(panel.getByText("NODE-03 // ONLINE")).toBeVisible();

    await panel.getByRole("tab", { name: /Portfolio/ }).click();
    await expect(
      panel.getByRole("heading", { name: /Work built for platforms and brands/i })
    ).toBeVisible();
    await expect(panel.getByText("700+", { exact: true })).toBeVisible();
  });

  test("reduced motion leaves the page unlocked — no scroll gate", async ({
    page,
  }) => {
    await page.getByTestId("hero-reveal").scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThan(before);
  });
});

test.describe("hero reveal HUD over the scrub", () => {
  test.skip(({ viewport }) => !!(viewport && viewport.width < 1024), "desktop-only");

  test("HUD eases in once the scrub reaches the brain", async ({ page }) => {
    await page.goto("/");
    await scrollHeroTo(page, 0.78);

    const panel = page.getByTestId("hero-reveal");
    await expect(panel).toBeInViewport();
    await expect
      .poll(() => panel.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");

    // The video is still behind the HUD — this is an overlay, not a
    // separate section that replaced the hero.
    await expect(page.locator("video").first()).toBeVisible();
  });

  test("HUD stays up through the Dubai reveal on the last frame", async ({
    page,
  }) => {
    // It used to hide itself once Continue Journey was clicked. With the gate
    // gone the readout has to remain on screen for the whole back half of the
    // scrub, otherwise the final frame has nothing beside it.
    await page.goto("/");
    await scrollHeroTo(page, 1.0);

    const video = page.locator("video").first();
    expect(
      await video.evaluate((el: HTMLVideoElement) => el.currentTime)
    ).toBeGreaterThan(26);

    await expect
      .poll(() =>
        page.getByTestId("hero-reveal").evaluate((el) => getComputedStyle(el).opacity)
      )
      .toBe("1");
  });

  test("clip 3 scrubs from scrolling alone — no click required", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollHeroTo(page, 0.78);
    const video = page.locator("video").first();
    const early = await video.evaluate((el: HTMLVideoElement) => el.currentTime);

    await scrollHeroTo(page, 1.0);
    const late = await video.evaluate((el: HTMLVideoElement) => el.currentTime);

    // Past the clip2/clip3 boundary at ~21.08s, reached by scrolling only.
    expect(early).toBeLessThan(24);
    expect(late).toBeGreaterThan(26);
    expect(late).toBeGreaterThan(early);
  });

  test("scrolling is never blocked and there is no Continue Journey gate", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollHeroTo(page, 0.78);

    // The gate button is gone entirely.
    await expect(page.getByTestId("continue-journey")).toHaveCount(0);

    // Forward wheel input moves the page rather than being cancelled.
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);

    // And the page can leave the hero completely — nothing clamps it back.
    const pinEnd = await pinEndOf(page);
    await page.evaluate(() =>
      window.scrollTo({ top: 999_999, behavior: "instant" })
    );
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(pinEnd);
  });
});

test.describe("hero reveal branding", () => {
  test("the readout leads with the brand gradient, not cyan", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const panel = page.getByTestId("hero-reveal");
    await panel.scrollIntoViewIfNeeded();

    // Panel CTA carries the brand gradient (blue -> violet -> magenta).
    const ctaBackground = await panel
      .getByRole("link", { name: /Explore Services/i })
      .evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(ctaBackground).toContain("rgb(40, 112, 255)");
    expect(ctaBackground).toContain("rgb(113, 56, 255)");
    expect(ctaBackground).toContain("rgb(209, 45, 255)");

    // Metric figures are gradient-clipped, so their own colour is transparent.
    const metric = panel.locator("dd").first();
    await expect
      .poll(() => metric.evaluate((el) => getComputedStyle(el).color))
      .toBe("rgba(0, 0, 0, 0)");

    // The status label moved off cyan onto brand magenta. The pulsing dot
    // beside it is deliberately still cyan — one indicator, not a theme.
    const statusColor = await panel
      .getByText(/NODE-01 \/\/ ONLINE/)
      .evaluate((el) => getComputedStyle(el).color);
    expect(statusColor).toBe("rgb(209, 45, 255)");
  });
});

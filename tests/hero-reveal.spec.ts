import { test, expect, type Page } from "@playwright/test";

// Drives the hero toward the end of its pinned scroll range. The gate clamps
// the page back to the CLIP2_END frame (~0.77 of the range) on the way, which
// is where the scrub settles on the front-view brain and the HUD takes over —
// the remaining span is clip 3, reserved for after Continue Journey.
async function scrollToRevealPoint(page: Page) {
  // Wait for the real pinned hero (not the pre-hydration placeholder) so
  // "main > section" resolves to the hero and its height is measurable.
  await page.waitForFunction(() => !!document.querySelector("video"));
  await page.evaluate(() => {
    const section = document.querySelector("main > section") as HTMLElement | null;
    if (!section) return;
    // End of the *pin* range, not the end of the section: the sticky frame
    // releases one viewport before the section's bottom edge.
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight - window.innerHeight,
      behavior: "instant",
    });
  });
  await page.waitForTimeout(1400); // rAF smoothing + the HUD's ease-in
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

test.describe("hero reveal scroll gate", () => {
  test.skip(({ viewport }) => !!(viewport && viewport.width < 1024), "desktop-only");

  test("HUD overlays the hero once the scrub reaches the brain", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollToRevealPoint(page);

    const panel = page.getByTestId("hero-reveal");
    await expect(panel).toBeInViewport();
    await expect
      .poll(() => panel.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");

    // The video is still behind the HUD — this is an overlay, not a
    // separate section that replaced the hero.
    await expect(page.locator("video").first()).toBeVisible();
  });

  test("forward scroll is blocked until Continue Journey is clicked", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollToRevealPoint(page);
    await expect(page.getByTestId("hero-reveal")).toBeInViewport();

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);

    await page.getByTestId("continue-journey").click();
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test("scrolling back up stays free while the gate is closed", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollToRevealPoint(page);
    await expect(page.getByTestId("hero-reveal")).toBeInViewport();

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, -600);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(before);
  });

  test("a jump past the hero is clamped back to the gate", async ({ page }) => {
    // Stands in for every way the page can move without a cancellable
    // input event: dragging the scrollbar, Tab pulling an off-screen
    // element into view, iOS momentum, or a flick that clears the whole
    // pin inside one frame. Blocking wheel/touch/keys alone misses all of
    // these, so the clamp is what actually holds the gate.
    await page.goto("/");
    await scrollToRevealPoint(page);
    const pinEnd = await pinEndOf(page);

    await page.evaluate(() =>
      window.scrollTo({ top: 999_999, behavior: "instant" })
    );
    await page.waitForTimeout(400);

    // Held strictly short of the pin end — the gate sits at the CLIP2_END
    // frame, so the clip-3 span beyond it stays unreachable.
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(pinEnd);
    await expect(page.getByTestId("hero-reveal")).toBeInViewport();
  });

  test("the jump clamp releases after Continue Journey", async ({ page }) => {
    await page.goto("/");
    await scrollToRevealPoint(page);
    const pinEnd = await pinEndOf(page);

    await page.getByTestId("continue-journey").click();
    await page.waitForTimeout(1200);
    await page.evaluate(() =>
      window.scrollTo({ top: 999_999, behavior: "instant" })
    );
    await page.waitForTimeout(400);

    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(pinEnd);
  });

  test("clip 3 only scrubs after Continue Journey, and the HUD clears for it", async ({
    page,
  }) => {
    // The whole point of appending clip 3: it is the payoff behind the
    // button, not something you can scroll into while the gate holds.
    await page.goto("/");
    await scrollToRevealPoint(page);

    const video = page.locator("video").first();
    const atGate = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
    const duration = await video.evaluate((el: HTMLVideoElement) => el.duration);

    // Parked on the clip2/clip3 boundary (~21.08s of ~27.38s), well short of
    // the end, even though we asked the page to scroll past the pin.
    expect(duration).toBeGreaterThan(26);
    expect(atGate).toBeGreaterThan(19);
    expect(atGate).toBeLessThan(23);

    await page.getByTestId("continue-journey").click();
    await page.waitForTimeout(2000);

    // Clip 3 has now scrubbed through to the Dubai reveal on the last frame.
    const afterContinue = await video.evaluate(
      (el: HTMLVideoElement) => el.currentTime
    );
    expect(afterContinue).toBeGreaterThan(atGate + 3);

    // ...and the readout got out of the way so that frame is unobstructed.
    await expect
      .poll(() =>
        page.getByTestId("hero-reveal").evaluate((el) => getComputedStyle(el).opacity)
      )
      .toBe("0");
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

import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";

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
    // Inside the HUD's window: it eases in from ~0.62 (4s of video before the
    // clip2/clip3 seam) and hands over to the statement at the seam, ~0.77.
    await scrollHeroTo(page, 0.70);

    const panel = page.getByTestId("hero-reveal");
    await expect(panel).toBeInViewport();
    await expect
      .poll(() => panel.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");

    // The video is still behind the HUD — this is an overlay, not a
    // separate section that replaced the hero.
    await expect(page.locator("video").first()).toBeVisible();
  });

  test("HUD hands over to the positioning statement on clip 3", async ({
    page,
  }) => {
    // Clip 3 pulls the brain to the left of frame and resolves the Dubai
    // skyline inside it, so the readout steps aside and the positioning
    // statement takes the open right half instead.
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
      .toBe("0");

    const positioning = page.getByTestId("hero-positioning");
    await expect
      .poll(() => positioning.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");
    await expect(
      positioning.getByRole("heading", { name: /Dubai-based creative/i })
    ).toBeVisible();
  });

  test("the statement sits in the space beside the brain, left-aligned", async ({
    page,
    viewport,
  }) => {
    test.skip(!!(viewport && viewport.width < 1024), "layout is lg-and-up");
    await page.goto("/");
    await scrollHeroTo(page, 1.0);

    const heading = page
      .getByTestId("hero-positioning")
      .getByRole("heading", { name: /Dubai-based creative/i });
    const box = await heading.boundingBox();
    const width = viewport!.width;
    expect(box).not.toBeNull();

    // Past the midpoint: the video is full-bleed and the brain fills roughly
    // the left three-quarters, so the copy belongs in the remainder.
    expect(box!.x).toBeGreaterThan(width * 0.45);

    // Left-aligned, not centred — reads as a column beside the artwork.
    expect(
      await heading.evaluate((el) => getComputedStyle(el).textAlign)
    ).toBe("left");

    // Hard width cap, so it stays a contained block however wide the window
    // gets rather than stretching with it.
    expect(box!.width).toBeLessThanOrEqual(480);
  });

  test("clip 3 puts the video in a left panel, clear of the copy", async ({
    page,
    viewport,
  }) => {
    test.skip(!!(viewport && viewport.width < 1024), "layout is lg-and-up");
    // Two failed attempts sit behind this. Scaling the full-width element
    // letterboxed it across the whole viewport (black bars). Leaving it
    // full-bleed made the brain fill ~75% of the width and run under the
    // copy. Clip 3 now narrows the element and switches it to object-contain
    // so the frame shrinks and anchors left, with the copy beside it.
    await page.goto("/");
    await scrollHeroTo(page, 1.0);

    const geom = await page.evaluate(() => {
      const v = document.querySelector("video")!.getBoundingClientRect();
      const h = document
        .querySelector('[data-testid="hero-positioning"] h2')!
        .getBoundingClientRect();
      return { vLeft: Math.round(v.left), vRight: Math.round(v.right), hLeft: Math.round(h.left) };
    });
    const width = viewport!.width;

    // Anchored to the left edge, and not spanning the full width.
    expect(geom.vLeft).toBe(0);
    expect(geom.vRight).toBeLessThan(width);

    // The copy starts around the middle: far enough right to clear the
    // artwork, but not shoved against the edge. Note this is deliberately a
    // band and not "past the video element" — object-contain letterboxes the
    // frame inside that element, so its right portion is the clip's own
    // black background and the copy may sit over it without covering
    // anything. Pinning the copy past the element's edge is what left a dead
    // gap between the artwork and the text.
    expect(geom.hLeft).toBeGreaterThan(width * 0.45);
    expect(geom.hLeft).toBeLessThan(width * 0.62);
  });

  test("the copy's heading and paragraph share a right edge", async ({
    page,
    viewport,
  }) => {
    test.skip(!!(viewport && viewport.width < 1024), "layout is lg-and-up");
    // text-balance shortened the heading's lines while the paragraph filled
    // the column, so their right edges disagreed and the block read as
    // misaligned. Both should wrap to the same column width.
    await page.goto("/");
    await scrollHeroTo(page, 1.0);

    const edges = await page.evaluate(() => {
      const root = document.querySelector('[data-testid="hero-positioning"]')!;
      const h = root.querySelector("h2")!.getBoundingClientRect();
      const p = root.querySelector("p")!.getBoundingClientRect();
      return {
        leftDelta: Math.abs(Math.round(h.left - p.left)),
        rightDelta: Math.abs(Math.round(h.right - p.right)),
      };
    });
    expect(edges.leftDelta).toBeLessThanOrEqual(1);
    expect(edges.rightDelta).toBeLessThanOrEqual(1);
  });

  test("the accent word is calligraphy and the CTA reaches the contact page", async ({
    page,
  }) => {
    await page.goto("/");
    await scrollHeroTo(page, 1.0);
    const panel = page.getByTestId("hero-positioning");

    // Same Allura script the hero headlines use for their accent word.
    const accent = panel.locator(".heading-accent").first();
    await expect(accent).toBeVisible();
    const styles = await accent.evaluate(async (el) => {
      await document.fonts.ready;
      const own = getComputedStyle(el);
      return { family: own.fontFamily, color: own.color };
    });
    expect(styles.family).toContain("Allura");
    // Gradient text clips the background to the glyphs, so the colour itself
    // has to be fully transparent.
    expect(styles.color).toBe("rgba(0, 0, 0, 0)");

    await expect(
      panel.getByRole("link", { name: /Get in Touch/i })
    ).toHaveAttribute("href", /\/get-quote\/?$/);
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

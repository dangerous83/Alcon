import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";

// Scrolls to a fraction of the hero wrapper's own pin range, not the whole
// page — the page is much taller than the hero, so a fraction of
// document.scrollHeight would overshoot the hero almost immediately.
async function scrollToFraction(page: Page, fraction: number) {
  await page.evaluate((f) => {
    // The intro gate wraps the page's sections in a div, so the hero is
    // `main > div > section`, not a direct child. Match it as a descendant.
    const section = document.querySelector("main section") as HTMLElement | null;
    if (!section) return;
    const top = section.offsetTop;
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + Math.max(0, range * f), behavior: "instant" });
  }, fraction);
}

async function waitForVideoReady(page: Page) {
  await page.waitForFunction(() => {
    const v = document.querySelector("video");
    return v && v.readyState >= 1;
  });
}

test.describe("scroll-scrubbed hero", () => {
  test("video element loads with expected source and attributes", async ({
    page,
  }) => {
    await page.goto("/");
    const video = page.locator("video").first();
    await expect(video).toBeAttached();
    // React sets `muted` as a DOM property (not a reflected HTML attribute)
    // to avoid an SSR/autoplay hydration quirk, so check the property.
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.muted))
      .toBe(true);
    await expect(video).toHaveAttribute("playsinline", "");
    await expect(video).toHaveAttribute("poster", /hero-poster/);
  });

  test("scrolling forward increases video currentTime", async ({ page }) => {
    await page.goto("/");
    const video = page.locator("video").first();
    await waitForVideoReady(page);

    const before = await video.evaluate((el: HTMLVideoElement) => el.currentTime);

    await scrollToFraction(page, 0.5);
    await page.waitForTimeout(700); // allow rAF smoothing to catch up

    const after = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
    expect(after).toBeGreaterThan(before);
  });

  test("scrolling backward decreases video currentTime", async ({ page }) => {
    await page.goto("/");
    await waitForVideoReady(page);
    const video = page.locator("video").first();

    await scrollToFraction(page, 0.8);
    await page.waitForTimeout(700);
    const mid = await video.evaluate((el: HTMLVideoElement) => el.currentTime);

    await scrollToFraction(page, 0.3);
    await page.waitForTimeout(700);
    const after = await video.evaluate((el: HTMLVideoElement) => el.currentTime);

    expect(after).toBeLessThan(mid);
  });

  test("heading is bold with a calligraphy gradient accent word", async ({
    page,
  }) => {
    await page.goto("/");
    const accent = page.locator(".heading-accent").first();
    await expect(accent).toBeVisible();

    const styles = await accent.evaluate(async (el) => {
      await document.fonts.ready;
      const own = getComputedStyle(el);
      const heading = el.closest("p, h1") as HTMLElement;
      return {
        accentFamily: own.fontFamily,
        // Gradient text works by clipping the background to the glyphs, so
        // the colour itself must be fully transparent.
        accentColor: own.color,
        headingWeight: getComputedStyle(heading).fontWeight,
      };
    });

    // A plain-upright-sans accent, then an italic serif accent, were both
    // tried in earlier passes and replaced at the client's request — the
    // accent word is now a calligraphy script (Allura), not either of
    // those.
    expect(styles.accentFamily).toContain("Allura");
    expect(styles.accentColor).toBe("rgba(0, 0, 0, 0)");
    expect(Number(styles.headingWeight)).toBeGreaterThanOrEqual(700);
  });

  test("hero copy sits vertically centred, not pinned to the bottom", async ({
    page,
  }) => {
    await page.goto("/");
    // The hero renders an empty placeholder until hydration resolves the
    // reduced-motion query, so wait for real content before measuring.
    await expect(page.locator(".heading-accent").first()).toBeVisible();

    const metrics = await page.evaluate(async () => {
      // Fallback font metrics differ from the webfonts', which shifts the
      // heading box — measuring before fonts settle gives a stale position.
      await document.fonts.ready;
      const heading = document
        .querySelector(".heading-accent")
        ?.closest("p, h1");
      const rect = heading!.getBoundingClientRect();
      return {
        centre: rect.top + rect.height / 2,
        viewport: window.innerHeight,
      };
    });
    // Comfortably inside the middle band of the frame rather than hugging
    // the lower edge, which is what "justify-end" produced before.
    expect(metrics.centre).toBeGreaterThan(metrics.viewport * 0.25);
    expect(metrics.centre).toBeLessThan(metrics.viewport * 0.7);
  });

  test("chapter indicator reflects scroll position (01 -> 02 -> 03)", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForVideoReady(page);

    await expect(page.getByText("01 / 03")).toBeVisible();

    // The scrub is non-linear: page-scroll 0..0.6 covers clips 1-3 (the
    // ~27.38s brain build-up), the rest covers clip 4. Chapters span the first
    // ~15.04s, so these fractions land inside the 0..0.6 band.
    await scrollToFraction(page, 0.15); // ~6.8s -> chapter 2
    await page.waitForTimeout(700);
    await expect(page.getByText("02 / 03")).toBeVisible();

    await scrollToFraction(page, 0.28); // ~12.8s -> chapter 3, still phase A
    await page.waitForTimeout(700);
    await expect(page.getByText("03 / 03")).toBeVisible();
  });

  test("chapter copy fades out during the silent phase-B zoom into the brain", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForVideoReady(page);

    const column = page.getByTestId("hero-chapter-copy");

    await expect(page.locator(".heading-accent").first()).toBeVisible();
    await expect
      .poll(() => column.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");

    // Past the clip1/clip2 seam (~15.04s; on the non-linear map that clip1-3
    // band is 0..0.6, so ~0.45 lands well past the seam).
    await scrollToFraction(page, 0.45);
    await page.waitForTimeout(700);

    await expect
      .poll(() => column.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("0");
  });
});

test.describe("reduced motion", () => {
  test("static hero renders instead of the pinned scroll section", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Ideas that refuse to sit still/ })
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("link", { name: "Start a Project" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore Our Work" }).first()).toBeVisible();

    const { wrapperHeight, viewportHeight } = await page.evaluate(() => {
      const section = document.querySelector("main section");
      return {
        wrapperHeight: section?.getBoundingClientRect().height ?? 0,
        viewportHeight: window.innerHeight,
      };
    });
    // static hero should be roughly one viewport tall, not several
    expect(wrapperHeight).toBeLessThan(viewportHeight * 1.5);
  });
});

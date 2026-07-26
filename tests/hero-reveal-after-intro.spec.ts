// The scroll-scrubbed hero regression that shipped: the hero's ScrollTrigger
// was created while the section sat inside the intro's `display:none`
// wrapper, so it measured a zero-height element and its scroll range
// collapsed to nothing. Once the intro was dismissed the section became
// visible but the trigger was never re-measured — scrubbing was dead and the
// broken range threw the scroll to the footer.
//
// Deliberately NOT importing from ./fixtures: that fixture pre-dismisses the
// intro (returning-visitor path), which is exactly the path that hid this bug.
// These tests take the real first-visit route through the intro.
import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function beginJourney(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Begin Your Journey/i }).click();
  // Overlay plays through (~5s clip) then fades out.
  await expect(
    page.getByRole("dialog", { name: /Alcon intro/i })
  ).toBeHidden({ timeout: 20_000 });
}

async function scrollToFraction(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const section = document.querySelector("main section") as HTMLElement | null;
    if (!section) return;
    const top = section.offsetTop;
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + Math.max(0, range * f), behavior: "instant" });
  }, fraction);
}

test.describe("hero scrub after the intro is dismissed", () => {
  test("the page rests at the top of the hero, not the footer", async ({
    page,
  }) => {
    await beginJourney(page);

    // The reveal must land on the hero's opening frame, not jump the viewport
    // to the bottom of the document.
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
    await expect(page.locator("main section video").first()).toBeInViewport();
  });

  test("scrolling scrubs the hero video after the intro reveal", async ({
    page,
  }) => {
    await beginJourney(page);

    await page.waitForFunction(() => {
      const v = document.querySelector("video");
      return v && v.readyState >= 1;
    });
    const video = page.locator("main section video").first();

    const before = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
    await scrollToFraction(page, 0.5);
    await page.waitForTimeout(700); // let the rAF smoothing catch up
    const after = await video.evaluate((el: HTMLVideoElement) => el.currentTime);

    expect(after).toBeGreaterThan(before);
  });
});

import { test as base, expect } from "@playwright/test";

// The homepage shows a full-screen video intro once per session, which sits
// over the page and swallows every click. That's correct behaviour for a
// first-time visitor, but it would otherwise make every homepage test start
// by dismissing it.
//
// This fixture seeds the same sessionStorage flag the intro sets when it's
// dismissed, so specs run as a *returning* visitor — a real state the app
// supports, not a test-only bypass. Specs that actually exercise the intro
// import straight from @playwright/test instead (see intro.spec.ts).
export const INTRO_SEEN_KEY = "alcon-intro-seen";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript((key) => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        // sessionStorage can throw in odd contexts; the intro just shows.
      }
    }, INTRO_SEEN_KEY);
    await use(page);
  },
});

export { expect };

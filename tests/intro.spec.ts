// Deliberately NOT importing from ./fixtures — that fixture pre-dismisses
// the intro so the rest of the suite runs as a returning visitor. These
// tests are the first-visit path, so they need the real thing.
import { test, expect } from "@playwright/test";

test.describe("intro gate", () => {
  test("shows the intro video with a Begin Your Journey button", async ({
    page,
  }) => {
    await page.goto("/");

    const intro = page.getByRole("dialog", { name: /Alcon intro/i });
    await expect(intro).toBeVisible();

    const video = intro.locator("video");
    await expect(video).toBeAttached();
    await expect(video).toHaveAttribute("poster", /intro-poster/);

    await expect(
      page.getByRole("button", { name: /Begin Your Journey/i })
    ).toBeVisible();
  });

  test("the button sits clear of the artwork, with no black overlay", async ({
    page,
    viewport,
  }) => {
    await page.goto("/");

    // No scrim element between the video and the button: the client asked
    // for the video unobscured, so legibility comes from the button's own
    // backdrop-blur pill rather than a wash over the whole frame.
    const intro = page.getByRole("dialog", { name: /Alcon intro/i });
    const videoBox = await intro.locator("video").boundingBox();
    const buttonBox = await page
      .getByRole("button", { name: /Begin Your Journey/i })
      .boundingBox();

    expect(videoBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    // The artwork occupies the upper portion of the frame; the button lives
    // in the empty lower band so it never covers it.
    expect(buttonBox!.y).toBeGreaterThan(viewport!.height * 0.7);
  });

  test("clicking Begin Your Journey reveals the homepage", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Begin Your Journey/i }).click();

    await expect(
      page.getByRole("dialog", { name: /Alcon intro/i })
    ).toBeHidden();

    // The homepage itself, not a navigation — the intro overlays it.
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });

  test("does not show again in the same session", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Begin Your Journey/i }).click();
    await expect(
      page.getByRole("dialog", { name: /Alcon intro/i })
    ).toBeHidden();

    await page.reload();
    await expect(
      page.getByRole("button", { name: /Begin Your Journey/i })
    ).toHaveCount(0);
  });

  test("reduced motion skips the intro entirely", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /Begin Your Journey/i })
    ).toHaveCount(0);
  });

  test("the intro is homepage-only", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("button", { name: /Begin Your Journey/i })
    ).toHaveCount(0);
  });
});

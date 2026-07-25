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

  test("the button is centred in the frame, with no black overlay", async ({
    page,
    viewport,
  }) => {
    await page.goto("/");

    // No scrim element between the video and the button: the client asked
    // for the video unobscured, so the button simply fades out once playback
    // starts rather than a wash sitting over the whole frame.
    const intro = page.getByRole("dialog", { name: /Alcon intro/i });
    const videoBox = await intro.locator("video").boundingBox();
    const buttonBox = await page
      .getByRole("button", { name: /Begin Your Journey/i })
      .boundingBox();

    expect(videoBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    const buttonCentre = buttonBox!.y + buttonBox!.height / 2;
    expect(buttonCentre).toBeGreaterThan(viewport!.height * 0.4);
    expect(buttonCentre).toBeLessThan(viewport!.height * 0.6);
  });

  test("the video holds on its first frame until the button is pressed", async ({
    page,
  }) => {
    await page.goto("/");

    const video = page
      .getByRole("dialog", { name: /Alcon intro/i })
      .locator("video");

    // Neither autoplay nor loop: it waits, plays once, and rests on its last
    // frame — which is the homepage hero's opening frame.
    await expect(video).not.toHaveAttribute("autoplay", /.*/);
    await expect(video).not.toHaveAttribute("loop", /.*/);
    await expect(video).toHaveJSProperty("paused", true);

    await page.getByRole("button", { name: /Begin Your Journey/i }).click();
    await expect(video).toHaveJSProperty("paused", false);
  });

  test("clicking Begin Your Journey plays through, then reveals the homepage", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Begin Your Journey/i }).click();

    // The overlay stays up for the length of the clip (~5s) plus the fade.
    await expect(
      page.getByRole("dialog", { name: /Alcon intro/i })
    ).toBeHidden({ timeout: 20_000 });

    // The homepage itself, not a navigation — the intro overlays it.
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });

  test("does not show again in the same session", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Begin Your Journey/i }).click();
    await expect(
      page.getByRole("dialog", { name: /Alcon intro/i })
    ).toBeHidden({ timeout: 20_000 });

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

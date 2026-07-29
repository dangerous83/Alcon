# Site Audit — alcon-online.site

## Status: blocked at the network layer

This build environment's outbound network access is restricted to an
allowlist enforced by a policy-controlled egress proxy. Both required
external hosts were denied:

| Host | Result |
|---|---|
| `www.alcon-online.site` | `403 host_not_allowed` on every attempted connection (curl `CONNECT` and `WebFetch`) |
| `res.cloudinary.com` (hero video CDN) | `403 host_not_allowed` |

Evidence (proxy status endpoint, `/root/.ccr/README.md` diagnostics):

```
recentRelayFailures: [
  { kind: "connect_rejected", detail: "gateway answered 403 to CONNECT",
    host: "www.alcon-online.site:443" }
]
```

Because of this, **Phase 1 of the brief (full Playwright/browser crawl of
every route at 1440/1024/390px, screenshot capture, structured content
extraction) could not be performed** in this session. No content, copy, or
metadata from alcon-online.site was fetched, scraped, or guessed at any
point in this build — per the brief's explicit instruction not to fabricate
scraped content.

### What was resolved instead

- The user attached the hero video directly to the GitHub repository
  (`scroll scrubbed.mp4` on `main`), which unblocked the hero build. See
  "Video optimization" below.
- The client logo was already present in the repo (`Logo.jpg`) and was used
  as-is (`public/images/logo.jpg`), satisfying the "use the attached logo"
  requirement without needing network access.
- All other page content (service descriptions, project entries, blog
  posts, testimonials, contact details) is **placeholder content**,
  written to match the site's known structure (the route list and service
  names given directly in the brief), not scraped or invented as fact. See
  `docs/content-changes.md` for the full accounting and
  `docs/content-map.md` for a per-route status table.

### To complete Phase 1

Once `alcon-online.site` is reachable from a build environment (either by
widening this environment's network egress policy — see
https://code.claude.com/docs/en/claude-code-on-the-web — or running the
crawl from an unrestricted machine), run:

```bash
npx playwright test tests/site-crawl.template.ts  # not included — see below
```

A full crawl should capture, per route: title, meta description, headings,
paragraph copy, CTAs + destinations, images/videos with alt text, project
names, testimonials, contact info, social links, form fields, footer
content, structured data, and internal/external links, at 1440/1024/390px,
with screenshots saved to `docs/reference-screenshots/`. That crawl script
was not written speculatively against a site this environment cannot load
and verify against — building it blind risked shipping a broken tool. It
should be built against the live DOM once access exists, using the
Playwright scaffolding already in this repo (`playwright.config.ts`,
`tests/`) as a starting point.

## Video source audit (completed)

The supplied video (`scroll scrubbed.mp4`, delivered via the repo rather
than the originally-referenced Cloudinary URL, since Cloudinary was also
blocked) was inspected with `ffprobe`:

| Property | Original | Optimized (`public/video/hero-scroll.mp4`) |
|---|---|---|
| Resolution | 1920×1080 | 1920×1080 |
| Codec | H.264, yuv420p | H.264, yuv420p, no B-frames |
| Duration | 15.08s | 15.08s (unchanged) |
| Frame rate | 24fps | 24fps |
| Bitrate | ~10.9 Mbps | ~6.3 Mbps |
| Keyframe interval | every 30 frames (1.25s) | every 8 frames (~0.33s) |
| Audio | AAC (present) | removed (video is always muted) |
| Fast-start (`moov` atom) | not verified | enabled (`+faststart`) |
| File size | 20.6 MB | ~11.8 MB (desktop), ~2.8 MB (mobile 810px variant) |

The keyframe interval was the main scrubbing risk: 1.25s between keyframes
means the browser must decode up to 30 frames forward from the nearest
keyframe for an arbitrary seek, which stutters during fast scroll-scrub.
Re-encoding to a keyframe every 8 frames (~3x more keyframes) makes
arbitrary seeks near-instant. See `docs/performance-report.md` for the full
optimization writeup.

### Second clip merged in (`scroll scrubbed 2.mp4`)

A follow-up clip, `scroll scrubbed 2.mp4` (1920×1080, H.264, 24fps, 6.04s,
delivered the same way — repo upload), was added later to extend the hero
scrub into an interactive reveal. It picks up exactly where the first clip
ends (the AI-core brain canister shot) and ends on a front-view close-up of
the brain. It was re-encoded to the same all-intra H.264 parameters as the
first clip (`-g 1 -keyint_min 1 -sc_threshold 0 -crf 24 -preset slow
-pix_fmt yuv420p`), then joined to `hero-scroll.mp4` with an ffmpeg
`concat` filter (matching codec params end to end, so every frame across
the ~21.08s merged timeline is independently seekable, not just each half).
### Third and fourth clips merged in (`scroll scrubbed merge.mp4`)

The third clip (brain wiring up, Dubai skyline resolving inside it) and
fourth clip (the brain dispersing into the growth-chart of towers) were
originally two separate repo uploads (`scroll scrubbed 3.mp4` and
`scroll scrubbed 4.mp4`) with an authored seam between them. Both were
superseded by a single re-rendered upload, `scroll scrubbed merge.mp4`
(1920×1080, H.264, 24fps, 11.33s total — 6.29s + 5.04s), which fixes that
seam by rendering the handover as one continuous sequence instead of two
clips cut together. The two old source files were deleted from the repo.

`scroll scrubbed merge.mp4` (both halves, unbroken) is appended to clips 1-2
to make ONE hero video of all four clips — `hero-scroll.{mp4,webm}` (+ mobile),
778 frames / ~32.42s, every frame a keyframe. There is **no separate services
video**: the whole journey — chapters → brain → skyline → growth-chart of
towers — plays as a single scroll-scrub in a single pinned section, so nothing
ever cuts to a second `<video>` or a second section. (An earlier revision split
clip 4 into a `services-scroll.*` file behind its own pinned "One creative
system" section; that put a visible seam at the section boundary — the hero's
brain and the services' brain were two differently-scaled elements with a gap
between them as the sticky sections handed over — so it was folded back into the
one section. `services-scroll.*` was removed.)

The scrub is **non-linear**: page-scroll 0..0.6 covers clips 1-3 at roughly the
old per-pixel rate, and 0.6..1.0 is given to clip 4 so the towers-growth finale
and the cards reveal get room instead of flashing past in the ~15% of the travel
a linear map would allot a 5s clip in a 32.4s timeline. The section is
`h-[460vh] lg:h-[560vh]`.

The overlays hand over as the one scrub advances — chapter copy (clips 1-2) →
HUD readout (easing in ~4s before the clip2/clip3 seam) → positioning statement
(clip 3, right of frame) → the "One creative system, four disciplines" copy +
four cards (clip 4, left of frame, over the towers). The HUD's node plates carry
their own near-opaque backing (`bg-black/70`–`/85` plus a backdrop blur) with
the active state on border and glow rather than fill — a translucent panel
washed the labels out completely.

### Clip 3 composition

Clip 3 drifts the brain to the left of frame and resolves the Dubai skyline
inside it, leaving the right side open — that is where the positioning
statement sits, matching the client's reference composition.

Two details are load-bearing:

- **Clip 3 turns the video into a panel on the left**
  (`lg:w-[64%] lg:object-contain lg:[object-position:left_center]`), rather
  than a full-bleed background. Two earlier attempts failed: scaling the
  full-width element letterboxed it across the entire viewport, which read
  as broken black bars; leaving it full-bleed meant the brain filled ~75% of
  the width and ran under the copy. Narrowing the element and switching to
  `object-contain` shrinks the frame and anchors it left, leaving the right
  side genuinely free — no scrim needed behind the copy, because it no
  longer sits over artwork.
- **Heading and paragraph share a column width.** `text-balance` is applied
  only in the centred variant: left-aligned it shortened the heading's lines
  while the paragraph filled the column, so their right edges disagreed and
  the block read as misaligned.
- **The accent word is the same calligraphy as the hero headlines**
  (`.heading-accent` — Allura, gradient-clipped), and the copy carries a
  `Get in Touch` CTA to `/get-quote`, the site's contact route.
- **The statement lives in two places, from one source.**
  `PositioningCopy` holds the words; the motion build overlays it on clip 3,
  and `PositioningStatement` wraps it as a standalone centred section
  rendered *only* on the reduced-motion path (see `StaticHero`). It is
  deliberately absent from `page.tsx` — leaving it there would show the same
  sentence twice in a row, and dropping it entirely would hide the statement
  from reduced-motion visitors.

`public/video/hero-scroll*.{mp4,webm}` now contain the full ~32.42s
four-clip timeline — see `docs/asset-inventory.json` for exact file sizes.

### Services composition ("One creative system, four disciplines")

This is the FINAL phase of the hero's one scroll-scrub (clip 4), **not** a
separate section — that is what keeps it connected to the brain with no cut.
As clip 4 begins (`phaseD`, video-time ≥ 27.38s) the video panel opens from the
clip-3 left panel to full-bleed (`object-contain` throughout, so it scales
rather than popping) and the brain disperses into a growth-chart of towers.
Composition, matching the client's reference:

- **The chart is on the RIGHT, the copy on the LEFT.** The towers settle on the
  right of the frame; the black left of frame is where the "One creative system,
  four disciplines" heading and the four discipline cards live.
- **No dark overlay.** Nothing washes the artwork. The copy stays legible
  because it waits for the brain to clear the left of frame — it fades in only
  past `SERVICES_REVEAL_AT` (~30.5s, frame-checked), by which point the left of
  frame is black — and each card carries its own translucent, blurred plate.
- **`MainServices`** no longer renders a scrubbed section for motion visitors
  (it would duplicate this content behind a section boundary). It exports
  `ServicesCopy` / `ServicesCards` for the hero to render, and itself renders
  only the **reduced-motion / no-JS / SSR** fallback: a static frame of the
  towers finale (`services-poster.jpg`) with the same left-copy / right-chart
  composition, no dark overlay.


## GitHub Pages deployment (why the repo's Pages URL showed only text)

`https://dangerous83.github.io/Alcon/` originally rendered as a wall of
text rather than the website. Root cause, confirmed against the repo tree:

Pages was configured as **"Deploy from a branch" → main → / (root)**. That
mode serves the branch's files *verbatim* — it runs no build step. The
repo root contains Next.js **source** (`src/`, `package.json`, …) and no
`index.html`, so Pages fell through to rendering `README.md`. Nothing was
ever built or deployed; there was no bug in the site itself.

Fix applied:

1. `next.config.ts` switched to `output: "export"` — the app now builds to
   a fully static `out/` directory that any static host can serve.
2. `.github/workflows/deploy-pages.yml` builds that export on every push to
   `main` and publishes it via the official Pages actions.
3. `NEXT_PUBLIC_BASE_PATH` handling added, because Pages serves the site
   from `/Alcon` rather than the domain root. `next/link` and `next/image`
   apply a `basePath` automatically, but raw `<video src>`, `poster`, and
   CSS `url()` do not — those go through `src/lib/asset-path.ts`.
   `next/image` with `unoptimized: true` also skips the prefix, which is
   why the logo is routed through the same helper.
4. `public/.nojekyll` added, or Pages' Jekyll layer would strip the
   `_next/` directory containing all CSS and JS.
5. `/api/quote` removed — static hosting has no server. See README "Form
   configuration" for what replaced it.

**Required one-time setting:** Settings → Pages → Source → **GitHub
Actions**. Leaving it on "Deploy from a branch" reproduces the original
problem regardless of what the workflow does.

Verified locally by serving the built `out/` from a `/Alcon` subpath: all
routes returned 200, the hero video loaded (`readyState` 4), and there
were zero failed requests or console errors.

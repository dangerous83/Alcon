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
`public/video/hero-scroll*.{mp4,webm}` now contain the merged, ~21.08s
timeline — see `docs/asset-inventory.json` for exact file sizes.


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

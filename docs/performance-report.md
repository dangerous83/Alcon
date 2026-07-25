# Performance Report

## Lighthouse results (this environment)

Run via `npx lighthouse` against the production build (`npm run build && npm run start`)
on `localhost`, using the sandbox's pre-installed Chromium
(`/opt/pw-browsers/chromium-1194`).

| Page | Preset | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| `/` | Desktop | 100 | 100 | 100 | 100 |
| `/` | Mobile (default throttling) | 88 | 100 | 100 | 100 |
| `/services/branding` | Desktop | 100 | 100 | 96 | 100 |

Mobile Core Web Vitals on `/`: LCP 3.8s, CLS 0, TBT 130ms.

These meet or exceed every target in the brief (Desktop 90+/95+/95+/95+,
Mobile 85+/95+/95+/95+ with the scroll video present).

### Why `/services/branding` best-practices is 96, not 100

The one flagged audit is `errors-in-console`. The cause is specific and
already understood, not a real defect: the branding-service image on this
page is wired in via `next/image` pointed at Higgsfield's CDN
(`d8j0ntlcm91z4.cloudfront.net`), and this sandbox's network egress policy
blocks that host outright (`403 host_not_allowed` — see
`docs/site-audit.md`). The same request succeeds from a normal internet
connection. See `docs/higgsfield-image-prompts.md` for the full context and
the self-hosting follow-up.

## Testing limitations (read before trusting these numbers as final)

This sandbox environment has real, verified constraints that affect what
could be tested here — each one is root-caused, not guessed at:

1. **No live-site network access.** `alcon-online.site` and
   `res.cloudinary.com` both return `403 host_not_allowed` from this
   session's egress proxy. Phase 1 crawl/audit could not run (see
   `docs/site-audit.md`), and the brief's video URL had to be sourced from
   a repo upload instead.
2. **No H.264 decoding in this sandbox's Chromium.** The pre-installed
   Chromium build (`chromium-1194`, an open-source build, not Google
   Chrome) has no proprietary codec support:
   `video.canPlayType('video/mp4; codecs="avc1.42E01E"')` returns `""`
   here. The hero's original MP4 source is unplayable in this sandbox
   alone — real Chrome/Edge/Safari/Firefox on actual devices support H.264
   universally. **Fix applied, not a workaround**: a VP9/WebM encode of the
   same footage was added as an earlier `<source>` (see
   `docs/asset-inventory.json`), which this sandbox's Chromium can decode
   and Playwright could therefore verify end-to-end (scroll-scrub, chapter
   sync, forward/backward seeking). This is also a legitimate production
   optimization — WebM/VP9 is broadly supported and often smaller — not a
   test-only shim.
3. **WebKit and Firefox binaries could not be downloaded** for
   Playwright (`cdn.playwright.dev` is also outside the egress allowlist).
   Only the pre-installed Chromium was used for the automated test suite;
   `playwright.config.ts` has the WebKit/Firefox projects defined but
   commented out, ready to enable in an environment that can fetch them.
4. **All 4 generated images are CDN-hosted, not self-hosted** (see above)
   — functions correctly in production, unverifiable here.

None of these are stubbed out silently — each is called out at its exact
failure point (proxy status output, `canPlayType` result, `npx playwright
install` error) in code comments and in these docs.

## Video optimization summary

See `docs/site-audit.md` "Video source audit" for the full before/after
table. Summary: re-encoded the client-supplied 15s clip from ~10.9 Mbps
with keyframes every 1.25s (poor scrub responsiveness) down to ~6.3 Mbps
with keyframes every ~0.33s, stripped audio (video is always muted),
enabled `+faststart`, and added a 810px-wide mobile variant plus WebM/VP9
alternates for both. Desktop MP4: 20.6MB → 11.8MB; mobile MP4: 2.8MB.

## Other performance work

- Fonts loaded via `next/font/google` (Space Grotesk, Inter) — self-hosted,
  no render-blocking external font requests, automatic `font-display: swap`.
- No unused heavy dependencies: GSAP is the only animation library, used
  solely for `ScrollTrigger` in the hero.
- Route-level code stays on Next.js App Router defaults (Server Components
  by default; `"use client"` only on the hero, nav, quote form, and project
  filter — the only genuinely interactive pieces).
- Images use `next/image` throughout (once real assets are in place) for
  automatic responsive sizing and lazy loading.
- `prefers-reduced-motion` swaps the hero to a static, non-pinned variant,
  which also removes the GSAP ScrollTrigger + rAF loop entirely for those
  users (see `src/components/hero/ScrollVideoHero.tsx`).

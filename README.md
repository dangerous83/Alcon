# Alcon — Creative Intelligence

Production rebuild of the Alcon (Dubai creative agency) website. Next.js
App Router, TypeScript, Tailwind CSS v4, GSAP ScrollTrigger for the
scroll-scrubbed hero.

**Read `docs/site-audit.md` and `docs/content-changes.md` first.** This
build could not reach `alcon-online.site` from its build environment
(network policy), so most page copy is clearly-labeled placeholder content,
not migrated real content. See those two docs for exactly what's real vs.
placeholder and how to finish the swap.

## Installation

```bash
npm install
```

Node 20+ recommended (built and tested on Node 22).

## Development

```bash
npm run dev
```

Opens at `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NOTIFY_WEBHOOK_URL` | No | If set, `/api/quote` POSTs validated form submissions here (e.g. a Zapier/Make webhook, or your own notification endpoint). If unset, submissions are validated and logged server-side (`console.info("[quote-submission]", ...)`) instead of silently discarded — see "Form configuration" below. |

No secrets are used in client-side code. Copy `.env.example`-style values
into `.env.local` if you add credentials for a real email/CRM provider.

## Image generation status

4 images were generated via Higgsfield (`cinematic_studio_2_5`) and are
wired into the site, served from Higgsfield's CDN (not self-hosted — see
`docs/higgsfield-image-prompts.md` for why and how to finish self-hosting).
7+ more placements still use the `MediaFrame` placeholder component with
recommended prompts documented in the same file.

## Video source and optimization

The hero's scroll-scrubbed video was supplied via direct repo upload
(`scroll scrubbed.mp4` on `main`), since the brief's original Cloudinary
URL was unreachable from this build environment. It was re-encoded for web
delivery — see `docs/site-audit.md` "Video source audit" and
`docs/performance-report.md` for the full before/after. Final assets:

- `public/video/hero-scroll.mp4` / `.webm` — desktop/tablet
- `public/video/hero-scroll-mobile.mp4` / `.webm` — mobile (<768px)
- `public/images/hero-poster.jpg` / `.webp` (+ mobile variants) — poster /
  reduced-motion fallback frame

## Form configuration

`/get-quote` posts to `/api/quote` (`src/app/api/quote/route.ts`), which
validates server-side (mirroring `src/lib/validation/quote.ts`, also used
client-side) and includes a honeypot field for spam protection. Without
`NOTIFY_WEBHOOK_URL` configured, submissions are accepted and logged, not
silently lost — but nobody gets an email. Wire a real provider (Resend,
a CRM webhook, etc.) via that env var, or swap the route's delivery logic
for a provider SDK, before relying on this in production.

## Testing

```bash
npx playwright test
```

Runs against `npm run build && npm run start` on port 3100
(`playwright.config.ts` manages this via `webServer`). Covers routes,
navigation, the quote form, and the scroll-scrubbed hero (forward/backward
scrub, chapter sync, reduced-motion fallback) at 1440×900, 1024×768,
390×844, and 360×800.

**Only Chromium runs in this repo's dev sandbox** — WebKit/Firefox
binaries couldn't be downloaded here (network policy). The config has
those projects defined but commented out
(`playwright.config.ts`); run `npx playwright install webkit firefox`
in an environment with normal internet access (e.g. CI) and uncomment them
for the full cross-browser matrix the brief asks for.

## Build

```bash
npm run build
npm run start
```

## Deployment

Any Next.js-compatible host (Vercel, etc.) works out of the box. Before
deploying to production:

1. Finish the content swap (`docs/content-map.md`).
2. Decide on self-hosting the Higgsfield images vs. keeping the CDN
   dependency (`docs/higgsfield-image-prompts.md`).
3. Configure `NOTIFY_WEBHOOK_URL` (or swap in a real email/CRM provider).
4. Update `siteConfig.url` in `src/lib/content/site.ts` if the production
   domain differs from `alcon-online.site`.

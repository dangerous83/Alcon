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

All are build-time variables (baked into the static export), so changing
one requires a rebuild.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_FORM_ENDPOINT` | No | URL that accepts a JSON POST from the quote form — Formspree, Web3Forms, Getform, Basin, or your own endpoint. If unset, the form does **not** fake a send: it offers a pre-filled email instead. See "Form configuration". |
| `NEXT_PUBLIC_BASE_PATH` | No | Subpath the site is served from, e.g. `/Alcon` for GitHub Pages. Leave unset for a domain root. Set automatically by the Pages workflow. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical/OG/sitemap base URL. Defaults to `https://www.alcon-online.site`. |
| `NEXT_PUBLIC_AI_AGENT_ENDPOINT` | No | POST endpoint (`{ message } -> { reply }`) for the floating "Alcon AI Assistant" widget. Unset by default — see "AI assistant widget" below. |

These are all `NEXT_PUBLIC_*` (visible in the client bundle) by design —
none is a secret. Don't put API keys here; a static site has no server to
keep them on.

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

The hero is **one continuous scroll-scrubbed video** of all four clips
(chapters → brain → Dubai skyline → growth-chart of towers) playing in a
single pinned section — there is no separate services video, so the scrub
never cuts to a second clip or section. The last two clips come from a
single re-rendered upload, `scroll scrubbed merge.mp4`, which replaced the
old separately-cut `scroll scrubbed 3.mp4` / `scroll scrubbed 4.mp4`. The
"One creative system, four disciplines" cards resolve over the towers as the
final phase of that same scrub. See `docs/site-audit.md` "Third and fourth
clips merged in" and "Services composition" for details.

## AI assistant widget

The bottom-right "brain" icon (`src/components/layout/FloatingWidgets.tsx`)
opens a chat panel. **It is a UI shell, not a working assistant** — a
static export has no server to run an Alcon-aware AI on, and no such
backend was configured. Without `NEXT_PUBLIC_AI_AGENT_ENDPOINT` set, it
says so plainly and points visitors to WhatsApp/email instead of
fabricating an answer.

To make it real: stand up an endpoint that accepts
`POST { message: string }` and returns `{ reply: string }` — a hosted LLM
call, a RAG service over Alcon's own content, whatever you choose — and
set `NEXT_PUBLIC_AI_AGENT_ENDPOINT` to it.

The WhatsApp button next to it is fully live: it opens
`https://wa.me/971561643886`.

## Form configuration

`/get-quote` validates client-side
(`src/lib/validation/quote.ts`) and includes a honeypot field for basic
spam filtering, then POSTs JSON to `NEXT_PUBLIC_FORM_ENDPOINT`.

**Without that variable set, the form does not pretend to send anything** —
it surfaces a pre-filled `mailto:` link and the studio's email address, so
an enquiry is never silently lost.

Because this is a static site there is no server-side validation anymore
(the old `/api/quote` route was removed when switching to static export).
Whatever form service you point it at should do its own validation and
spam protection.

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

The site is a **static export** (`output: "export"` in `next.config.ts`),
so it deploys to any static host — including GitHub Pages.

### GitHub Pages (configured)

`.github/workflows/deploy-pages.yml` builds the export and publishes it on
every push to `main`.

**One-time setup (required):** repo **Settings → Pages → Build and
deployment → Source → GitHub Actions**.

Do **not** leave it on "Deploy from a branch". That mode makes GitHub's
built-in Jekyll builder render `README.md` as the site and race this
workflow for the `github-pages` environment — so the published page
flickers to this very README instead of the Alcon website. That is exactly
the "I can't see my interface, it shows the README" symptom. Flip the
source to **GitHub Actions** once and it's fixed. As a safeguard the deploy
workflow now also passes `enablement: true` to `actions/configure-pages`,
which reasserts "GitHub Actions" as the source on every run.

The workflow sets `NEXT_PUBLIC_BASE_PATH` to `/<repo-name>` automatically,
since Pages serves the site from a subpath. To wire the quote form up, add
a repo variable `NEXT_PUBLIC_FORM_ENDPOINT` (Settings → Secrets and
variables → Actions → Variables).

### Docker / any VPS

The included `Dockerfile` builds the export and serves it with nginx
(`nginx.conf`):

```bash
docker build -t alcon-web .
docker run -p 8080:80 alcon-web
```

Pass build args to configure it:
`--build-arg FORM_ENDPOINT=... --build-arg SITE_URL=https://your-domain`.

> Not build-tested in the environment that produced it — that sandbox's
> network policy blocked pulling base images from Docker Hub. Run
> `docker build` yourself before relying on it.

### Custom domain

Leave `NEXT_PUBLIC_BASE_PATH` unset (the site then lives at the domain
root) and set `NEXT_PUBLIC_SITE_URL` to the real domain so canonical tags,
the sitemap, and OG URLs match.

### Before going live

1. Finish the content swap (`docs/content-map.md`).
2. Decide on self-hosting the Higgsfield images vs. keeping the CDN
   dependency (`docs/higgsfield-image-prompts.md`).
3. Configure `NOTIFY_WEBHOOK_URL` (or swap in a real email/CRM provider).
4. Update `siteConfig.url` in `src/lib/content/site.ts` if the production
   domain differs from `alcon-online.site`.

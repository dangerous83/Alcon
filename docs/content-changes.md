# Content Changes

## Why this document looks different than expected

The brief's content-migration rules assume this build started from a
crawl of `alcon-online.site`. That crawl could not happen — the session's
network egress policy blocked the host (`403 host_not_allowed`; full
evidence in `docs/site-audit.md`). Nothing here is a "correction" of real
site copy, because no real site copy was ever fetched.

## What is verbatim from the brief (not placeholder)

- Hero eyebrows, headlines, and paragraphs for all three chapters
  (`src/lib/content/hero.ts`)
- Primary/secondary CTA labels and destinations (`Start a Project` →
  `/get-quote`, `Explore Our Work` → `/client-projects`)
- Route slugs: `/services/branding`, `/services/motion`,
  `/services/editing`, `/services/social`, `/services/tutorials`,
  `/client-projects`, `/blog`, `/get-quote`
- Brand palette and gradient values

## What is placeholder, and why it's not lorem ipsum

Every other piece of copy (service descriptions, deliverables, process
steps, FAQs, project entries, blog posts, "why Alcon" principles, footer
contact details) is original, production-quality copy written specifically
for a Dubai creative agency offering these five services — not generic
filler text. It was written this way so the layouts, hierarchy, and tone
are reviewable now, rather than shipping visibly-broken lorem ipsum.

It is explicitly **not** presented as scraped fact:

- No client names, project metrics, or results are invented anywhere.
  `/client-projects` and the homepage's featured-work section use generic
  "Selected Work — Placeholder" entries rather than fabricated case
  studies.
- No testimonials are attributed to real or invented people. The
  homepage's credibility section states working principles instead.
- No publication dates or bylines are attributed to real individuals; blog
  posts are dated with a placeholder ISO date and credited to "Alcon Team".
- Contact details (email, phone, WhatsApp, social handles) are clearly
  marked `TODO(content-swap)` in `src/lib/content/site.ts` rather than
  guessed.

## Where to look

Every placeholder file carries the same header comment pointing back to
this document: `src/lib/content/site.ts`, `services.ts`, `projects.ts`,
`blog.ts`.

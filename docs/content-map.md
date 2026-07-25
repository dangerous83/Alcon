# Content Map

Per-route status. "Placeholder" means production-quality copy written to
match the brief's known structure, not scraped or invented factual claims.
"Brief-supplied" means the copy came verbatim from the project brief.

| Route | Status | Notes |
|---|---|---|
| `/` (hero chapters) | Brief-supplied | Verbatim hero eyebrow/heading/paragraph copy and CTAs from the brief |
| `/` (positioning, process, capabilities, collaboration, final CTA) | Placeholder | Written to the brief's required section list |
| `/` (featured projects, credibility) | Placeholder, honesty-constrained | No invented client names, metrics, or quotes — see `content-changes.md` |
| `/services` | Placeholder | Index of the 5 services named in the brief's route list |
| `/services/branding` | Placeholder | Slug preserved per brief |
| `/services/motion` | Placeholder | Slug preserved per brief |
| `/services/editing` | Placeholder | Slug preserved per brief |
| `/services/social` | Placeholder | Slug preserved per brief |
| `/services/tutorials` | Placeholder | Slug preserved per brief |
| `/client-projects` | Placeholder, honesty-constrained | Generic "selected work" entries, no fabricated clients/results |
| `/blog` + posts | Placeholder | 2 sample articles; author attributed to "Alcon Team", not a real named person |
| `/get-quote` | Functional, content placeholder | Form validates client-side and posts to a configurable form service (`NEXT_PUBLIC_FORM_ENDPOINT`); with none set it offers a pre-filled email rather than faking a send. Contact details are TODO placeholders |
| Footer (contact, social) | Placeholder | Email/phone/social handles marked `TODO(content-swap)` in `src/lib/content/site.ts` |

## Swapping in real content

All placeholder copy lives in `src/lib/content/*.ts`. Once
`alcon-online.site` is reachable:

1. Crawl the live site (see `docs/site-audit.md`).
2. Replace the arrays/objects in `src/lib/content/site.ts`,
   `services.ts`, `projects.ts`, and `blog.ts` with real data — the shape
   (fields, slugs) is already the shape the page templates expect, so no
   template changes should be needed for a like-for-like swap.
3. Update `docs/content-changes.md` with what changed.
4. Regenerate `docs/route-inventory.json` and `docs/asset-inventory.json`
   from the crawl.

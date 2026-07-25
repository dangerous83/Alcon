# SEO Audit

## Baseline: no live-site SEO audit was possible

`alcon-online.site` was unreachable from this build environment (see
`docs/site-audit.md`), so this is not a before/after diff of the live
site's SEO — it's the technical SEO implemented in this rebuild, built to
the brief's spec from scratch.

## Implemented

| Requirement | Status | Where |
|---|---|---|
| Unique page titles | Done | `metadata.title` per route via Next.js Metadata API, templated as `%s — Alcon` |
| Unique meta descriptions | Done | Per-route `metadata.description` |
| Canonical URLs | Done | `alternates.canonical` on services, service detail, client-projects, blog, blog post, get-quote |
| Open Graph metadata | Done | Root layout sets site-wide OG; blog posts add `article` type + `publishedTime` |
| Twitter/X metadata | Done | Root layout `twitter.card = summary_large_image` |
| XML sitemap | Done | `src/app/sitemap.ts`, includes all static + dynamic (service/blog) routes |
| robots.txt | Done | `src/app/robots.ts`, points at the sitemap |
| Organization/ProfessionalService structured data | Done | `organizationJsonLd` in `src/lib/seo/jsonld.ts`, injected once in root layout |
| Service structured data | Done | `serviceJsonLd` on each `/services/[slug]` page |
| BlogPosting structured data | Done | `blogPostingJsonLd` on each blog post |
| Breadcrumb structured data | Done | `breadcrumbJsonLd` on service and blog post pages |
| Local Dubai context | Done | `siteConfig.location`, footer, JSON-LD `address`/`areaServed` |
| Correct heading structure | Done | One `<h1>` per page (hero's is `.sr-only` with a stable summary — see `docs/design-system.md`); `<h2>`/`<h3>` used hierarchically in sections |
| Descriptive internal links | Done | Nav/footer/CTA link text describes the destination (no "click here") |
| Social preview images | Done | `hero-poster.jpg` used as the default OG/Twitter image |
| 404 page | Done | `src/app/not-found.tsx` |
| Redirect map | N/A this pass | No route renames occurred — the brief's named slugs were preserved exactly (`/services/branding`, etc.). Build one once real content migration reveals any slug the live site currently uses that isn't in this list. |

## Explicitly not done

- No keyword stuffing, no unverifiable superlative claims ("#1 agency in
  Dubai") — the brief prohibits both, and this copy avoids them throughout.
- No Lighthouse SEO score was captured in this environment — see
  `docs/performance-report.md` "Testing limitations."

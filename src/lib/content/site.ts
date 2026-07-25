/**
 * PLACEHOLDER CONTENT NOTICE
 * -----------------------------------------------------------------------
 * This build was produced without live access to alcon-online.site (the
 * session's network egress policy denied the host — see docs/site-audit.md
 * and docs/content-changes.md). Every field below is production-quality
 * placeholder copy written to match the real site's known structure
 * (routes, service names, and the hero copy the client supplied directly),
 * NOT scraped or invented factual content. Contact details, social links,
 * and legal text are intentionally left as clearly-marked TODOs rather
 * than fabricated. Swap this file for real content once the source site
 * is reachable.
 */

export const siteConfig = {
  name: "Alcon",
  legalName: "Alcon Creative Agency",
  tagline: "Creative Intelligence",
  description:
    "Alcon is a Dubai-based creative and advertising agency combining strategy, design, and emerging technology to build brand experiences that move people.",
  // Canonical/OG base URL. Defaults to the intended production domain;
  // the Pages deploy overrides it via NEXT_PUBLIC_SITE_URL so canonical
  // tags match where the site is actually served from.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.alcon-online.site",
  locale: "en-AE",
  location: {
    city: "Dubai",
    country: "United Arab Emirates",
  },
  contact: {
    // TODO(content-swap): replace with the real values from alcon-online.site
    email: "hello@alcon-online.site",
    phone: "+971-000-0000",
    whatsapp: "https://wa.me/971000000000",
  },
  social: {
    // TODO(content-swap): confirm handles against the live site footer
    instagram: "https://instagram.com/alcon",
    linkedin: "https://linkedin.com/company/alcon",
    behance: "https://behance.net/alcon",
  },
} as const;

/**
 * Primary navigation. `children` renders as a dropdown.
 *
 * Journal (/blog) is intentionally not in the primary bar — the requested
 * nav is these four items — but it stays linked from the footer and in the
 * sitemap so it is neither orphaned nor dropped from search.
 */
export const navigation = [
  { label: "Services", href: "/services", cta: false },
  { label: "Solutions", href: "/solutions", cta: false },
  { label: "White Label", href: "/white-label", cta: false },
  {
    label: "Clients",
    href: "/client-projects",
    cta: false,
    children: [
      { label: "Platform", href: "/client-projects/platform" },
      { label: "Website", href: "/client-projects/website" },
    ],
  },
  { label: "Get a Quote", href: "/get-quote", cta: true },
] as const;

/** Slim announcement bar above the header. */
export const topBanner = {
  // TODO(content-swap): replace with a real announcement.
  text: "Alcon is taking on new projects for Q4 2026.",
  linkLabel: "Start a project",
  href: "/get-quote",
} as const;

export const footerLinks = {
  services: [
    { label: "Branding & Identity", href: "/services/branding" },
    { label: "Motion Graphics", href: "/services/motion" },
    { label: "Video Editing", href: "/services/editing" },
    { label: "Social Media", href: "/services/social" },
    { label: "Weekend Tutorials", href: "/services/tutorials" },
  ],
  company: [
    { label: "Solutions", href: "/solutions" },
    { label: "White Label", href: "/white-label" },
    { label: "Clients", href: "/client-projects" },
    { label: "Journal", href: "/blog" },
    { label: "Get a Quote", href: "/get-quote" },
  ],
} as const;

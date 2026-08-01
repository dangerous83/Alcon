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
    // TODO(content-swap): email still pending — replace once confirmed.
    email: "hello@alcon-online.site",
    // Client-supplied real numbers.
    phone: "+971561643886",
    whatsapp: "https://wa.me/971561643886",
  },
  social: {
    // TODO(content-swap): confirm handles against the live site footer
    instagram: "https://instagram.com/alcon",
    facebook: "https://facebook.com/alcon",
    tiktok: "https://tiktok.com/@alcon",
    twitter: "https://x.com/alcon",
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
  { label: "Services", href: "/services", cta: false, mega: "services", icon: "layers" },
  { label: "Portfolio", href: "/portfolio", cta: false, mega: "portfolio", icon: "briefcase" },
  { label: "White Label", href: "/white-label", cta: false, icon: "tag" },
  {
    label: "Clients",
    href: "/client-projects",
    cta: false,
    mega: "clients",
    icon: "users",
    children: [
      { label: "Platform", href: "/client-projects/platform" },
      { label: "Website", href: "/client-projects/website" },
    ],
  },
  { label: "Get a Quote", href: "/get-quote", cta: true, icon: "arrow-right" },
] as const;

/**
 * Top announcement bar: tagline (left), site search (centre), and a phone
 * number (right). The bar previously also carried a "Customer Service"
 * number and a "Connect With Us" CTA; both were dropped at the client's
 * request in favour of the search bar, leaving just the one contact number
 * that's already the primary "Expert" line used elsewhere on the site.
 */
export const topBanner = {
  // A few tagline options were suggested; this is the recommended one —
  // swap freely, it's a one-line content edit.
  tagline: "Strategy-led creative, built for how AI moves now.",
  phone: { label: "Expert", number: "+971561643886" },
} as const;

export const footerLinks = {
  services: [
    { label: "Branding & Identity", href: "/services/branding" },
    { label: "Web UI/UX Design", href: "/services/web-ui-ux" },
    { label: "Graphic Design", href: "/services/graphic-design" },
    { label: "Motion Graphics", href: "/services/motion" },
    { label: "2D Animation", href: "/services/2d-animation" },
    { label: "3D Animation", href: "/services/3d-animation" },
    { label: "AI Video", href: "/services/ai-video" },
    { label: "Video Editing", href: "/services/editing" },
    { label: "Videography", href: "/services/videography" },
    { label: "Photography", href: "/services/photography" },
    { label: "Social Media", href: "/services/social" },
    { label: "Weekend Tutorials", href: "/services/tutorials" },
  ],
  // Deliberately NOT hand-duplicated: the footer's nav column is built from
  // `navigation` directly in SiteFooter, so it can't drift out of sync with
  // the header again. Journal isn't in the primary nav (see the comment on
  // `navigation` above) but stays linked here so it isn't orphaned.
  companyExtra: [{ label: "Journal", href: "/blog" }],
} as const;

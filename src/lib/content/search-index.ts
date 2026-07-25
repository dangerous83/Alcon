// A hand-built index for the header search bar rather than a hosted search
// service — this is a static export with no backend, so anything else would
// mean either fabricating result relevance or shipping a fake search box
// that doesn't actually search. Every entry is a route that exists in the
// app; keywords are extra terms worth matching beyond the label itself.

import { services } from "@/lib/content/services";
import { blogPosts } from "@/lib/content/blog";
import { servicesMegaMenu, portfolioMegaMenu } from "@/lib/content/mega-menu";

export type SearchEntry = {
  label: string;
  href: string;
  group: string;
  keywords?: string;
};

const staticEntries: SearchEntry[] = [
  { label: "Services", href: "/services", group: "Pages" },
  { label: "Portfolio", href: "/portfolio", group: "Pages" },
  { label: "White Label", href: "/white-label", group: "Pages" },
  { label: "Clients", href: "/client-projects", group: "Pages" },
  {
    label: "Platform Clients",
    href: "/client-projects/platform",
    group: "Pages",
  },
  {
    label: "Website Clients",
    href: "/client-projects/website",
    group: "Pages",
  },
  { label: "Journal", href: "/blog", group: "Pages", keywords: "blog articles" },
  {
    label: "Get a Quote",
    href: "/get-quote",
    group: "Pages",
    keywords: "contact quote enquiry pricing",
  },
];

const serviceEntries: SearchEntry[] = services.map((service) => ({
  label: service.name,
  href: `/services/${service.slug}`,
  group: "Services",
  keywords: service.summary,
}));

// The mega menus list finer-grained service names (e.g. "AI Video",
// "Photography") than the five built-out service pages, each mapped onto
// its closest existing page — see mega-menu.ts. Indexing those labels too
// means searching "photography" finds something, even though there's no
// dedicated /services/photography route yet.
const megaMenuEntries: SearchEntry[] = [
  ...servicesMegaMenu.flatMap((column) => column.items),
  ...portfolioMegaMenu.flatMap((column) => column.items),
].map((item) => ({
  label: item.label,
  href: item.href,
  group: "Services",
  keywords: item.description,
}));

const blogEntries: SearchEntry[] = blogPosts.map((post) => ({
  label: post.title,
  href: `/blog/${post.slug}`,
  group: "Journal",
  keywords: post.excerpt,
}));

// De-duplicated by label — the mega menus and the five real service pages
// overlap heavily (e.g. "Brand Identity" and "Branding & Identity" both
// point at /services/branding), and showing the same destination twice
// under near-identical names reads as broken, not thorough.
const seen = new Set<string>();
export const searchIndex: SearchEntry[] = [
  ...staticEntries,
  ...serviceEntries,
  ...megaMenuEntries,
  ...blogEntries,
].filter((entry) => {
  const key = `${entry.label.toLowerCase()}|${entry.href}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

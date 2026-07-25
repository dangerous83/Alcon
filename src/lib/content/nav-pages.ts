// PLACEHOLDER CONTENT — see src/lib/content/site.ts header. These four
// routes exist to satisfy the requested nav structure (Solutions, White
// Label, Clients > Platform/Website); no real page briefs were available,
// so each is an honest placeholder rather than invented detail.

export type NavPageContent = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  body: string[];
};

export const navPages: Record<string, NavPageContent> = {
  solutions: {
    slug: "solutions",
    title: "Solutions",
    eyebrow: "Solutions",
    summary:
      "Packaged engagements that combine Alcon's core services around a specific business outcome, rather than a single deliverable.",
    body: [
      "This page is a placeholder pending a real content brief. It exists so the navigation structure you asked for (Services · Solutions · White Label · Clients) is fully wired and every link resolves to a real page rather than a 404.",
      "Once solution offerings are defined, this becomes an index of packaged engagements — e.g. a full brand launch, a campaign sprint, or an ongoing content retainer — each linking through to the relevant services.",
    ],
  },
  "white-label": {
    slug: "white-label",
    title: "White Label",
    eyebrow: "White Label",
    summary:
      "Production capacity other agencies and studios can resell under their own brand.",
    body: [
      "This page is a placeholder pending a real content brief. It exists so the navigation structure you asked for is fully wired.",
      "Once defined, this page should explain the white-label engagement model: what's delivered under the partner's brand, how briefs and revisions flow, and how pricing works for resale.",
    ],
  },
};

export const clientSubPages: Record<
  "platform" | "website",
  NavPageContent
> = {
  platform: {
    slug: "platform",
    title: "Platform Work",
    eyebrow: "Clients / Platform",
    summary: "Product and platform work — dashboards, tools, and internal systems.",
    body: [
      "This page is a placeholder pending real project data. See /client-projects for the general work index, which carries the same honesty note: no fabricated client names or results.",
    ],
  },
  website: {
    slug: "website",
    title: "Website Work",
    eyebrow: "Clients / Website",
    summary: "Marketing sites, landing pages, and web experiences.",
    body: [
      "This page is a placeholder pending real project data. See /client-projects for the general work index, which carries the same honesty note: no fabricated client names or results.",
    ],
  },
};

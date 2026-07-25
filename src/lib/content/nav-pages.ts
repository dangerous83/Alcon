// PLACEHOLDER CONTENT — see src/lib/content/site.ts header. This route
// exists to satisfy the requested nav structure (Services / Portfolio /
// White Label / Clients); no real page brief was available, so it's an
// honest placeholder rather than invented detail.

export type NavPageContent = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  body: string[];
};

export const navPages: Record<string, NavPageContent> = {
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

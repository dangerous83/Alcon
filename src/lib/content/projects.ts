// PLACEHOLDER CONTENT — see src/lib/content/site.ts header.
// No client names, metrics, or testimonials are invented here — entries are
// generic "selected work" placeholders until real project data is migrated
// from alcon-online.site/client-projects.

export type Project = {
  slug: string;
  title: string;
  category: (typeof projectCategories)[number]["slug"];
  summary: string;
  externalUrl?: string;
};

export const projectCategories = [
  { slug: "branding", label: "Branding" },
  { slug: "motion", label: "Motion" },
  { slug: "editing", label: "Editing" },
  { slug: "social", label: "Social" },
] as const;

export const projects: Project[] = [
  {
    slug: "selected-work-01",
    title: "Selected Work — Identity System",
    category: "branding",
    summary:
      "Placeholder entry pending migration of real project data, links, and media from the live client-projects page.",
  },
  {
    slug: "selected-work-02",
    title: "Selected Work — Campaign Motion",
    category: "motion",
    summary:
      "Placeholder entry pending migration of real project data, links, and media from the live client-projects page.",
  },
  {
    slug: "selected-work-03",
    title: "Selected Work — Brand Film Edit",
    category: "editing",
    summary:
      "Placeholder entry pending migration of real project data, links, and media from the live client-projects page.",
  },
  {
    slug: "selected-work-04",
    title: "Selected Work — Social Content System",
    category: "social",
    summary:
      "Placeholder entry pending migration of real project data, links, and media from the live client-projects page.",
  },
];

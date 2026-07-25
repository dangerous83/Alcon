// Featured project slots.
//
// These are deliberately-empty placeholder cards, designed to be filled
// in with real project work as it is added. Copy is honest about that:
// each slot names the discipline it will host and reads as "slot pending
// upload", not as a fabricated case study. Swap the summary and hook up a
// real image asset in FeaturedProjects.tsx / the /client-projects page
// when the project is ready to publish.

export type Project = {
  slug: string;
  title: string;
  category: (typeof projectCategories)[number]["slug"];
  summary: string;
  externalUrl?: string;
  /**
   * Marks the slot as an unfilled placeholder so the UI can render it as
   * an "add project here" tile rather than pretending to be finished work.
   * Set to false (or omit) once real content is in.
   */
  placeholder?: boolean;
};

export const projectCategories = [
  { slug: "branding", label: "Branding" },
  { slug: "motion", label: "Motion" },
  { slug: "editing", label: "Editing" },
  { slug: "social", label: "Social" },
] as const;

export const projects: Project[] = [
  {
    slug: "featured-slot-01",
    title: "Featured Project Slot",
    category: "branding",
    summary:
      "Reserved for a branding & identity case study — replace this entry with the client name, hero image, and outcome once the project is cleared to publish.",
    placeholder: true,
  },
  {
    slug: "featured-slot-02",
    title: "Featured Project Slot",
    category: "motion",
    summary:
      "Reserved for a motion or video advertising case study — replace this entry with the client name, hero image, and outcome once the project is cleared to publish.",
    placeholder: true,
  },
  {
    slug: "featured-slot-03",
    title: "Featured Project Slot",
    category: "editing",
    summary:
      "Reserved for a post-production or brand film case study — replace this entry with the client name, hero image, and outcome once the project is cleared to publish.",
    placeholder: true,
  },
  {
    slug: "featured-slot-04",
    title: "Featured Project Slot",
    category: "social",
    summary:
      "Reserved for a social marketing or paid campaign case study — replace this entry with the client name, hero image, and outcome once the project is cleared to publish.",
    placeholder: true,
  },
];

// Hero chapter copy. The original brief supplied plainer headings; these
// were rewritten at the client's request for a more distinctive voice.
// Each heading is split into segments so one word can carry the italic
// serif + brand-gradient treatment.

export type HeadingSegment = { text: string; emphasis?: boolean };

export type HeroChapter = {
  index: 1 | 2 | 3;
  start: number;
  end: number;
  eyebrow: string;
  heading: HeadingSegment[];
  paragraph: string;
};

/** Flattens a segmented heading back to a plain string (alt text, tests). */
export function headingToText(heading: HeadingSegment[]) {
  return heading.map((segment) => segment.text).join("");
}

export const heroChapters: HeroChapter[] = [
  {
    index: 1,
    start: 0,
    end: 5,
    eyebrow: "ALCON / CREATIVE INTELLIGENCE",
    heading: [
      { text: "Ideas that refuse to sit " },
      { text: "still", emphasis: true },
      { text: "." },
    ],
    paragraph:
      "Alcon combines strategy, design, and emerging technology to turn complex challenges into clear, memorable brand experiences.",
  },
  {
    index: 2,
    start: 5,
    end: 10,
    eyebrow: "STRATEGY × DESIGN × AI",
    heading: [
      { text: "Human instinct at machine " },
      { text: "velocity", emphasis: true },
      { text: "." },
    ],
    paragraph:
      "From brand identity and digital experiences to motion and campaigns, every touchpoint is designed as part of one connected creative system.",
  },
  {
    index: 3,
    start: 10,
    end: 15,
    eyebrow: "FROM CONCEPT TO IMPACT",
    heading: [
      { text: "Build what people can't " },
      { text: "forget", emphasis: true },
      { text: "." },
    ],
    paragraph:
      "Work directly with a Dubai-based creative team that transforms ambitious ideas into focused, high-performing experiences.",
  },
];

export const heroSummary =
  "Alcon — Creative Intelligence. A Dubai-based creative agency combining strategy, design, and AI to build brand experiences that move people, from identity and digital experiences to motion and campaigns.";

export const heroCtas = {
  primary: { label: "Start a Project", href: "/get-quote" },
  secondary: { label: "Explore Our Work", href: "/client-projects" },
};

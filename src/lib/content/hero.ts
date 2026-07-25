// Hero chapter copy is verbatim from the project brief — not placeholder.

export type HeroChapter = {
  index: 1 | 2 | 3;
  start: number;
  end: number;
  eyebrow: string;
  heading: string;
  paragraph: string;
};

export const heroChapters: HeroChapter[] = [
  {
    index: 1,
    start: 0,
    end: 5,
    eyebrow: "ALCON / CREATIVE INTELLIGENCE",
    heading: "Ideas engineered to move people.",
    paragraph:
      "Alcon combines strategy, design, and emerging technology to turn complex challenges into clear, memorable brand experiences.",
  },
  {
    index: 2,
    start: 5,
    end: 10,
    eyebrow: "STRATEGY × DESIGN × AI",
    heading: "Human creativity. AI-powered momentum.",
    paragraph:
      "From brand identity and digital experiences to motion and campaigns, every touchpoint is designed as part of one connected creative system.",
  },
  {
    index: 3,
    start: 10,
    end: 15,
    eyebrow: "FROM CONCEPT TO IMPACT",
    heading: "Build the brand people remember.",
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

// PLACEHOLDER CONTENT — see src/lib/content/site.ts header. Slugs match the
// routes named in the project brief and must be preserved on content swap.

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  valueProposition: string;
  description: string[];
  deliverables: string[];
  process: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  accentIndex: 0 | 1 | 2 | 3 | 4;
};

export const services: Service[] = [
  {
    slug: "branding",
    name: "Branding & Identity",
    shortName: "Branding",
    summary:
      "Identity systems built to hold up across every surface a brand touches, from a favicon to a storefront.",
    valueProposition:
      "A distinct visual and verbal identity, engineered for consistency and built to scale with the business.",
    description: [
      "We start with positioning, not a mood board: what the brand needs to be true for, who it needs to convince, and what it needs to feel like doing business with.",
      "From there, identity systems are built as living toolkits — logo lock-ups, color and type systems, motion principles, and voice guidelines — so every future touchpoint stays on-brand without a design team re-solving it each time.",
    ],
    deliverables: [
      "Brand strategy & positioning",
      "Logo suite and usage guidelines",
      "Color, typography & iconography systems",
      "Brand guidelines document",
      "Stationery & core collateral",
    ],
    process: [
      { title: "Discover", description: "Stakeholder interviews, market and competitor scan, positioning workshop." },
      { title: "Define", description: "Narrow to one strategic direction: personality, promise, and visual territory." },
      { title: "Design", description: "Build the identity system across logo, color, type, and applied mockups." },
      { title: "Deliver", description: "Ship a guidelines document and production-ready source files." },
    ],
    faqs: [
      {
        question: "Do you design from scratch or refresh existing brands?",
        answer:
          "Both. Some engagements are full identity builds; others are focused refreshes that keep brand equity intact while modernizing the system.",
      },
    ],
    accentIndex: 0,
  },
  {
    slug: "motion",
    name: "Motion Graphics",
    shortName: "Motion",
    summary:
      "Animation and motion systems that give a brand rhythm — on screen, in ads, and inside product interfaces.",
    valueProposition:
      "Motion designed as a system, not a one-off video — reusable principles that scale across every future asset.",
    description: [
      "Motion is treated as a brand asset with its own rules: easing, timing, and composition principles that stay consistent whether the output is a 6-second social loop or a full explainer film.",
      "Work spans logo animation, kinetic typography, explainer video, and UI motion for digital products.",
    ],
    deliverables: [
      "Motion identity & animation principles",
      "Logo animation / stings",
      "Explainer and product videos",
      "Social-first animated content",
      "UI micro-interaction specs",
    ],
    process: [
      { title: "Script & storyboard", description: "Narrative structure and shot planning before any animation starts." },
      { title: "Style frames", description: "Key visual frames approved before full animation to lock direction early." },
      { title: "Animate", description: "Full production in industry-standard motion tooling." },
      { title: "Sound & polish", description: "Sound design, pacing pass, and format-specific exports." },
    ],
    faqs: [
      {
        question: "What formats do you deliver for social platforms?",
        answer:
          "Square, vertical, and widescreen cuts are produced from the same master, each optimized for its platform's safe zones and captioning needs.",
      },
    ],
    accentIndex: 1,
  },
  {
    slug: "editing",
    name: "Video Editing",
    shortName: "Editing",
    summary:
      "Post-production that turns raw footage into a paced, on-brand story — for campaigns, content, and long-form.",
    valueProposition:
      "Editing built around a clear narrative goal, not just trimming footage — every cut serves retention or conversion.",
    description: [
      "Editing starts with the goal of the piece: is it built to stop a scroll, hold attention for a full explainer, or support a paid campaign's performance metrics? The cut, pacing, and grade follow from that answer.",
      "Includes color grading, sound design, subtitling, and platform-specific versioning.",
    ],
    deliverables: [
      "Narrative and campaign editing",
      "Color grading",
      "Sound design & mixing",
      "Subtitling & localization-ready exports",
      "Platform-specific cutdowns",
    ],
    process: [
      { title: "Assembly", description: "Rough cut from selected footage against the brief." },
      { title: "Fine cut", description: "Pacing, transitions, and structure refined with client feedback." },
      { title: "Grade & sound", description: "Color and audio pass for a finished, consistent feel." },
      { title: "Export", description: "Deliverables versioned for every required platform and aspect ratio." },
    ],
    faqs: [
      {
        question: "Can you work from footage we've already shot?",
        answer: "Yes — raw-footage-only projects are common, and we can also support on-site production when needed.",
      },
    ],
    accentIndex: 2,
  },
  {
    slug: "social",
    name: "Social Media",
    shortName: "Social",
    summary:
      "Content systems and campaign management built for consistent posting and measurable growth.",
    valueProposition:
      "A content system, not a stream of one-off posts — built around a calendar, a visual language, and clear goals.",
    description: [
      "Social work is planned around a content system: recurring formats, a visual language tied to brand guidelines, and a calendar built to a cadence the team can actually sustain.",
      "Coverage spans content creation, scheduling, community management, and paid social support.",
    ],
    deliverables: [
      "Content strategy & calendar",
      "Templated and campaign post design",
      "Short-form video content",
      "Community management",
      "Paid social creative",
    ],
    process: [
      { title: "Audit", description: "Review current channels, audience, and performance baseline." },
      { title: "Strategy", description: "Define pillars, cadence, and formats for the next content cycle." },
      { title: "Produce", description: "Batch content production against the calendar." },
      { title: "Report", description: "Performance review and iteration on what's working." },
    ],
    faqs: [
      {
        question: "Which platforms do you manage?",
        answer: "Instagram, TikTok, LinkedIn, and YouTube are the most common; platform mix is set per client based on where the audience actually is.",
      },
    ],
    accentIndex: 3,
  },
  {
    slug: "tutorials",
    name: "Weekend Tutorials",
    shortName: "Tutorials",
    summary:
      "Hands-on creative sessions for teams and individuals who want to build real skills, not watch a lecture.",
    valueProposition:
      "Small, hands-on sessions focused on a single tool or skill — design, motion, or editing — with real output by the end.",
    description: [
      "Weekend sessions are kept small and hands-on: participants leave with a finished piece of work, not just notes.",
      "Topics rotate across design software, motion basics, and editing workflows depending on demand.",
    ],
    deliverables: [
      "Small-group hands-on sessions",
      "Take-home project files",
      "Resource and tool guides",
      "Follow-up Q&A support",
    ],
    process: [
      { title: "Choose a track", description: "Pick a focus area: design, motion, or editing." },
      { title: "Attend", description: "A focused weekend session with a working creative brief." },
      { title: "Build", description: "Work on a real deliverable with guidance throughout." },
      { title: "Take it home", description: "Leave with finished files and resources to keep practicing." },
    ],
    faqs: [
      {
        question: "Do I need prior experience?",
        answer: "Sessions are labeled by level; beginner tracks assume no prior experience with the tool being taught.",
      },
    ],
    accentIndex: 4,
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

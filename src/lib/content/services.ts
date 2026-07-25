// Service positioning: Alcon is a Dubai advertising and marketing agency
// with AI specialisation baked into every discipline. Copy is written to
// read as a real, credentialled service page — not brochure filler — with
// SEO keywords ("AI-powered", "Dubai", "creative agency", "advertising",
// "marketing", "performance", "content production") worked into the value
// propositions and body without keyword-stuffing.
//
// Slugs are preserved (branding, motion, editing, social, tutorials) so
// existing routes, sitemap entries, and mega-menu links keep resolving.

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
    name: "AI-Accelerated Branding & Identity",
    shortName: "Branding",
    summary:
      "Advertising-ready brand systems for Dubai and GCC businesses — positioning, identity, and guidelines built with AI-assisted exploration and a human creative director on every decision.",
    valueProposition:
      "A distinct, campaign-ready brand identity delivered in weeks instead of quarters — because AI compresses the exploration, not the craft.",
    description: [
      "Alcon builds brand identities that are engineered to sell, not just to look good in a case study. Every engagement starts with a positioning brief: what the brand needs to stand for, which buyer it needs to convert, and where it competes in the Dubai and wider GCC market. Nothing hits Figma before that answer is on the wall.",
      "AI accelerates the exploration phase — hundreds of directional concepts reviewed inside days, not weeks — but every finished logo, wordmark, colour system, and guideline document is finished by a human creative director. The output is a brand toolkit built to run in real advertising and marketing environments: paid social, out-of-home, product UI, and long-form content.",
      "Deliverables ship as living systems, not static PDFs. Teams get source files, motion primitives, voice rules, and campaign-ready templates, so the brand stays consistent whether the next asset is a Meta ad, a mall activation, or a keynote deck.",
    ],
    deliverables: [
      "Brand strategy, positioning & messaging framework",
      "Logo suite, wordmark & responsive lock-ups",
      "Colour, typography & iconography systems",
      "Voice, tone & copy guidelines",
      "Motion primitives for digital advertising",
      "Campaign-ready templates for paid social, print & OOH",
      "Full brand guidelines document with usage rules",
    ],
    process: [
      {
        title: "Discover",
        description:
          "Stakeholder interviews, competitor teardown across the GCC market, and a positioning workshop that ends with one written direction, not five options.",
      },
      {
        title: "Explore",
        description:
          "AI-assisted concept generation across dozens of visual and verbal territories, filtered down by the creative director to three you would actually ship.",
      },
      {
        title: "Design",
        description:
          "Build the identity system across logo, colour, type, and applied mockups — landing pages, ad units, product packaging, whatever the brand touches.",
      },
      {
        title: "Deliver",
        description:
          "Ship a production-grade guidelines document, source files, and a set of campaign-ready templates your team can pick up on day one.",
      },
    ],
    faqs: [
      {
        question: "Do you design brands from scratch or refresh existing ones?",
        answer:
          "Both. A full identity build takes six to ten weeks; a focused rebrand or refresh that preserves existing equity typically ships in three to five. Either way, you leave with a system your marketing team can actually run.",
      },
      {
        question: "How does AI change the branding process for clients?",
        answer:
          "It shortens the exploration phase — what used to be four weeks of moodboards is a few days of directed concept generation — so more of the timeline is spent on the strategic and craft decisions that actually differentiate the brand.",
      },
    ],
    accentIndex: 0,
  },
  {
    slug: "motion",
    name: "AI Motion Design & Video Advertising",
    shortName: "Motion",
    summary:
      "Motion graphics and video ads built for the platforms that matter — Meta, TikTok, YouTube, and connected TV — with AI-accelerated production keeping cost and turnaround honest.",
    valueProposition:
      "A motion system, not one-off videos — reusable frames, sound, and pacing rules that produce a month of ad creative from a single build.",
    description: [
      "Motion at Alcon is treated as a brand asset, not a per-asset expense. Every engagement produces a motion identity — easing curves, hero shots, sound design, and pacing rules — so the tenth ad in a campaign looks and feels like the first without a new production budget behind it.",
      "AI shows up in the parts of the pipeline where it earns its place: rough animatics, background generation, upscaling, and versioning across aspect ratios. Direction, storyboard, and the final grade are handled by motion designers. The result is a body of work that can flight across paid social, YouTube pre-roll, connected TV, and in-app formats without looking recycled.",
      "Work spans logo animation, kinetic typography, explainer film, product motion, and short-form advertising creative built for scroll-stopping performance.",
    ],
    deliverables: [
      "Motion identity & animation principles",
      "Logo animation & brand stings",
      "Explainer, product & founder-story films",
      "Short-form video ads for Meta, TikTok & YouTube",
      "Vertical, square & widescreen versioning from one master",
      "UI micro-interaction specs for product teams",
    ],
    process: [
      {
        title: "Brief & script",
        description:
          "Narrative structure and shot planning tied to the campaign's actual conversion goal, not a generic 'awareness' target.",
      },
      {
        title: "Style frames",
        description:
          "Key visual frames signed off before full animation, so direction is locked while there is still time to change it.",
      },
      {
        title: "Animate",
        description:
          "Production in industry-standard motion tooling, with AI accelerating the roughs, upscales, and background work.",
      },
      {
        title: "Sound & polish",
        description:
          "Sound design, pacing pass, and platform-specific exports built for the safe zones and captioning rules of each channel.",
      },
    ],
    faqs: [
      {
        question: "Which platforms and formats do you deliver for?",
        answer:
          "Meta (feed, reels, stories), TikTok, YouTube (pre-roll and shorts), LinkedIn, connected TV, and in-app placements. Every master ships in vertical, square, and widescreen with the platform-safe zones respected.",
      },
      {
        question: "How does AI actually shorten the motion turnaround?",
        answer:
          "It removes the slowest parts of the pipeline — animatic roughs, background plates, aspect-ratio versioning, upscaling — so more of the timeline is spent on direction, sound, and finish. The saving typically shows up as a 30–50% shorter delivery on campaign work.",
      },
    ],
    accentIndex: 1,
  },
  {
    slug: "editing",
    name: "AI-Assisted Video Editing & Post-Production",
    shortName: "Editing",
    summary:
      "Post-production for campaigns and content — colour, sound, subtitles, versioning — built around retention and conversion metrics, not just a finished cut.",
    valueProposition:
      "Every edit built backwards from a measurable outcome: watch-through, click-through, or booked call — not just a polished final master.",
    description: [
      "Editing at Alcon starts with the goal of the piece. A brand film aimed at retention is cut differently to a paid ad aimed at click-through, which is cut differently again to a founder-led explainer aimed at booked demos. That answer sets the pacing, the grade, and the sound before a single clip is trimmed.",
      "AI handles the mechanical work — rough assembly, transcript-first editing, subtitling and translation, upscaling — so the human editor spends their time on the decisions that actually move numbers: which shot leads, when the music drops, where the hook lands, and which cut converts.",
      "Every deliverable ships in every platform aspect ratio needed, with captions burned in or as sidecar SRTs. Colour is graded on calibrated displays; sound is mixed to broadcast loudness; nothing goes out that could not run as a paid ad the same day.",
    ],
    deliverables: [
      "Campaign, product & brand-film editing",
      "Colour grading on calibrated displays",
      "Sound design, mix & broadcast-loudness master",
      "AI-transcript-driven subtitles & localisation exports",
      "Vertical, square & widescreen cutdowns from one master",
      "Retention & drop-off analysis on delivered cuts",
    ],
    process: [
      {
        title: "Assembly",
        description:
          "Rough cut built against the brief, using AI transcript search to find the strongest takes fast rather than scrubbing timelines.",
      },
      {
        title: "Fine cut",
        description:
          "Pacing, transitions, and structure refined with the client on a shared review link, with time-coded feedback baked in.",
      },
      {
        title: "Grade & sound",
        description:
          "Colour pass on calibrated displays and full sound mix — dialogue, music, effects — to a consistent broadcast loudness target.",
      },
      {
        title: "Export",
        description:
          "Deliverables versioned for every platform and aspect ratio required, with subtitles and captions in every language the campaign flights in.",
      },
    ],
    faqs: [
      {
        question: "Can you edit from footage we have already shot?",
        answer:
          "Yes — raw-footage-only engagements are common. We can also handle the shoot end-to-end if a production is needed alongside the edit.",
      },
      {
        question: "How is AI used in the edit without losing the human decisions?",
        answer:
          "AI drives the transcript index, first-pass assembly, subtitling, translation, and upscaling. Every creative choice — which take leads, where the music comes in, how the grade sits — is made by the editor. The two together get you the finish of a full post house at agency turnaround.",
      },
    ],
    accentIndex: 2,
  },
  {
    slug: "social",
    name: "AI-Powered Social Media Marketing",
    shortName: "Social",
    summary:
      "Content systems, campaign management, and paid social creative for brands who need consistent posting and measurable growth — not just a monthly grid.",
    valueProposition:
      "A social system built as a marketing engine: fixed cadence, brand-consistent formats, and paid creative that ties back to real acquisition metrics.",
    description: [
      "Social at Alcon is planned as marketing, not as posting. Every engagement starts with a content system — recurring formats, a visual language tied to the brand guidelines, and a cadence the team can actually sustain — because inconsistent posting is the single biggest reason social budgets underperform.",
      "AI shows up across the workflow: idea generation against the brand's content pillars, copy variants for A/B testing, first-pass captions and translations, and creative iteration on winning ad formats. The strategy, the direction, and the community management are led by humans who understand the brand and the market.",
      "Coverage spans organic content production, community management across the major platforms, and paid social creative built to actually convert — not the generic template posts that most agencies bill as 'social media management'.",
    ],
    deliverables: [
      "Social strategy & 90-day content calendar",
      "Content-pillar system & templated post design",
      "Short-form video: reels, TikToks & YouTube shorts",
      "Community management on Instagram, TikTok, LinkedIn & X",
      "Paid social ad creative for Meta, TikTok & LinkedIn",
      "Monthly performance report with iteration plan",
    ],
    process: [
      {
        title: "Audit",
        description:
          "Review current channels, audience, and 90-day performance baseline — engagement, reach, and any paid results attached to them.",
      },
      {
        title: "Strategy",
        description:
          "Define content pillars, cadence, and formats. Set the paid creative hypotheses that will run alongside the organic calendar.",
      },
      {
        title: "Produce",
        description:
          "Batch content production against the calendar, with AI accelerating the ideation and copy pass — final edit and direction stays with the team.",
      },
      {
        title: "Report",
        description:
          "Monthly review of what worked, what did not, and what the next cycle changes based on the data.",
      },
    ],
    faqs: [
      {
        question: "Which social platforms do you manage?",
        answer:
          "Instagram, TikTok, LinkedIn, YouTube, and X are the most common. Platform mix is set per client based on where the audience actually converts, not on channel-of-the-month trends.",
      },
      {
        question: "Do you handle paid social ad spend as well as organic?",
        answer:
          "Yes. We produce the creative, run the tests, and report against campaign KPIs. Paid buying can be handled by us or by your existing media team — either works.",
      },
    ],
    accentIndex: 3,
  },
  {
    slug: "tutorials",
    name: "AI Creative Weekend Workshops",
    shortName: "Tutorials",
    summary:
      "Hands-on weekend workshops in AI-powered creative tools — for marketing teams, in-house designers, and independent creatives who want to leave with a finished piece of work, not a certificate.",
    valueProposition:
      "Small, hands-on sessions on the AI tools actually in use at Alcon — image, motion, and post — with a real deliverable in your hand by Sunday evening.",
    description: [
      "Weekend workshops are kept small and hands-on. Participants leave with a finished project — a rebrand exploration, an ad edit, a motion sting, a set of on-brand social frames — not just a stack of notes.",
      "Tracks rotate across the AI tools actually in use inside Alcon's own production pipeline: image generation, motion assist, transcript-first editing, and campaign creative workflows. Every session is taught by the people who use these tools on live client work every week.",
      "Suited to in-house marketing teams looking to level up, independent creatives adding AI to their workflow, and studios who want their team to leave a weekend faster than they arrived.",
    ],
    deliverables: [
      "Small-group hands-on weekend sessions",
      "Take-home project files & source assets",
      "AI tool guides & workflow playbooks",
      "Follow-up Q&A support after the session",
    ],
    process: [
      {
        title: "Choose a track",
        description:
          "Pick a focus area — AI image, AI motion, AI-assisted editing, or campaign creative — and a difficulty level.",
      },
      {
        title: "Attend",
        description:
          "A focused weekend session in Dubai with a real creative brief and a working project from hour one.",
      },
      {
        title: "Build",
        description:
          "Work on a real deliverable end-to-end with direct guidance from an Alcon creative lead throughout.",
      },
      {
        title: "Take it home",
        description:
          "Leave with finished files, the tool guides, and a follow-up channel for questions once you are practising on your own.",
      },
    ],
    faqs: [
      {
        question: "Do I need prior experience with these tools?",
        answer:
          "Sessions are labelled by level. Beginner tracks assume zero prior experience with the specific AI tool being taught; intermediate tracks assume you have shipped work in a related area before.",
      },
      {
        question: "Can you run a private workshop for our in-house team?",
        answer:
          "Yes — private team sessions are available on request, tailored to your brand's tools and current workflow rather than a generic curriculum.",
      },
    ],
    accentIndex: 4,
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

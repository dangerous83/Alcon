import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/content/site";
import { projectCategories } from "@/lib/content/projects";

const title = "Portfolio";
const description =
  "Selected work from Alcon — a Dubai advertising and creative agency specialising in AI-powered branding, motion, video editing, and social marketing.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "creative agency portfolio Dubai",
    "AI advertising work",
    "branding case studies UAE",
    "motion design portfolio",
    "video production Dubai",
  ],
  alternates: { canonical: `${siteConfig.url}/portfolio` },
};

// One placeholder slot per discipline the portfolio will fill up with.
// These render as visibly-empty "add case study" tiles rather than
// invented work — replace the summaries below with the real project name,
// hero image, and outcome once each engagement is cleared to publish.
const portfolioSlots = [
  {
    discipline: "Branding & Identity",
    category: "branding",
    intro:
      "Full brand builds and identity refreshes for Dubai and GCC businesses — engineered for advertising, not just presentation decks.",
  },
  {
    discipline: "Motion & Video Ads",
    category: "motion",
    intro:
      "Ad-ready motion identities, brand stings, and short-form video creative built for Meta, TikTok, YouTube, and connected TV.",
  },
  {
    discipline: "Post-Production & Editing",
    category: "editing",
    intro:
      "AI-assisted post on campaign, product, and brand films — colour, sound, subtitles, and platform versioning to a broadcast finish.",
  },
  {
    discipline: "Social Marketing",
    category: "social",
    intro:
      "Content systems and paid social campaigns that tie back to real acquisition metrics, not vanity engagement.",
  },
  {
    discipline: "Web & Product Design",
    category: "branding",
    intro:
      "Marketing sites, product interfaces, and landing-page systems built to convert paid traffic and hold organic ranking.",
  },
  {
    discipline: "3D & AI Video",
    category: "motion",
    intro:
      "Architectural, product, and generative-video work — the more experimental end of what an AI creative agency can ship.",
  },
];

const categoryHref = (slug: string) => {
  // Portfolio filters link into the closest existing service page. When
  // dedicated per-discipline portfolio pages are built, swap this map for
  // real /portfolio/<slug> hrefs.
  const map: Record<string, string> = {
    branding: "/services/branding",
    motion: "/services/motion",
    editing: "/services/editing",
    social: "/services/social",
  };
  return map[slug] ?? "/client-projects";
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="max-w-3xl">
        <SectionLabel>Portfolio</SectionLabel>
        <Heading as="h1" size="xl" className="mt-4">
          A working portfolio, not a highlight reel.
        </Heading>
        <p className="mt-5 text-lg text-text-secondary">
          Selected work across the disciplines Alcon actually ships: brand
          builds, motion identities, video ads, post-production, and paid
          social campaigns — for clients across Dubai, the wider GCC, and
          international brands with a regional presence.
        </p>
        <p className="mt-4 text-text-secondary">
          Case studies below are added as engagements clear for publication.
          For live client work already in market, browse the Clients menu
          in the header or the Client Projects index.
        </p>
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-2">
        {projectCategories.map((category) => (
          <span
            key={category.slug}
            className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary"
          >
            {category.label}
          </span>
        ))}
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioSlots.map((slot, index) => (
          <li key={`${slot.discipline}-${index}`}>
            <Link
              href={categoryHref(slot.category)}
              aria-label={`${slot.discipline} portfolio slot — pending`}
              className="group block rounded-[7px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
            >
              <div
                role="img"
                aria-hidden
                className="relative overflow-hidden rounded-[7px] border border-dashed border-white/15 bg-surface-elevated/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/30 group-hover:bg-surface-elevated/70"
                style={{ aspectRatio: "4 / 3" }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle at 75% 30%, rgba(40,112,255,0.35), transparent 55%), radial-gradient(circle at 25% 80%, rgba(209,45,255,0.25), transparent 55%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-background/50 text-text-primary transition-colors duration-500 group-hover:border-white/50">
                    <Plus size={20} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary">
                    Add case study
                  </span>
                </div>
                <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary/70">
                  Slot 0{index + 1}
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-magenta">
                {slot.discipline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {slot.intro}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-primary transition-colors group-hover:text-cyan-accent">
                See the service
                <ArrowRight size={14} strokeWidth={2} aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-20 rounded-[7px] border border-border bg-surface-elevated/60 p-8 sm:p-10">
        <Heading as="h2" size="md" className="max-w-2xl">
          Looking for live client work?
        </Heading>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Real, currently-in-market client sites and platforms are indexed
          under Client Projects — the Portfolio page above is where
          publishable case studies land as each one clears review.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/client-projects">View all client work</Button>
          <Button href="/get-quote" variant="secondary">
            Start a project
          </Button>
        </div>
      </div>
    </div>
  );
}

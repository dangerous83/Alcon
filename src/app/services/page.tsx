import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/content/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/content/site";

const title = "Services";
const description =
  "AI-powered advertising and marketing services from Alcon, a Dubai-based creative agency — branding, motion, video editing, social media, and hands-on AI workshops.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "advertising agency Dubai",
    "AI creative agency",
    "marketing agency UAE",
    "branding services",
    "video production Dubai",
    "AI motion design",
    "social media marketing Dubai",
  ],
  alternates: { canonical: `${siteConfig.url}/services` },
};

const outcomes = [
  {
    label: "Advertising-ready by design",
    body: "Every deliverable is built for a real campaign environment — paid social, connected TV, out-of-home — not a case-study PDF.",
  },
  {
    label: "AI where it earns its place",
    body: "AI accelerates ideation, versioning, and post-production. Direction, sound, and final craft stay with senior humans on the team.",
  },
  {
    label: "One system, one team",
    body: "Branding, motion, editing, and social all draw from the same brand system, so nothing you ship looks like it came from a different agency.",
  },
];

export default function ServicesIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionLabel>Services</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4 max-w-3xl">
        Advertising, marketing and creative services — engineered with AI,
        finished by humans.
      </Heading>
      <p className="mt-5 max-w-2xl text-lg text-text-secondary">
        Alcon is a Dubai advertising agency built for how brands move now:
        strategy and design, motion and video, social and post-production —
        all in one embedded creative team, all sharing one brand system.
      </p>
      <p className="mt-4 max-w-2xl text-text-secondary">
        Each service below is engineered around a measurable outcome — a
        launched brand, a converting ad, a sustained content calendar — not
        a stack of deliverables billed by the hour.
      </p>

      <ul className="mt-14 grid gap-4 sm:grid-cols-3">
        {outcomes.map((outcome) => (
          <li
            key={outcome.label}
            className="rounded-[7px] border border-border bg-surface p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-magenta">
              {outcome.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {outcome.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-20">
        <SectionLabel>Disciplines</SectionLabel>
        <Heading as="h2" size="lg" className="mt-3 max-w-2xl">
          Five services. One creative system.
        </Heading>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card as="li" key={service.slug}>
            <span className="font-mono text-xs text-text-secondary">
              0{service.accentIndex + 1}
            </span>
            <h3 className="mt-4 font-heading text-xl font-medium text-text-primary">
              {service.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {service.summary}
            </p>
            <Link
              href={`/services/${service.slug}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-primary transition-colors hover:text-cyan-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
            >
              View service
              <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </Link>
          </Card>
        ))}
      </ul>

      <div className="mt-24 rounded-[7px] border border-border bg-surface-elevated/60 p-8 sm:p-10">
        <Heading as="h2" size="md" className="max-w-2xl">
          Have a live brief? Let&apos;s scope it this week.
        </Heading>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Tell us the goal, the timeline, and where the work needs to land.
          A scoped proposal — deliverables, cost, and delivery date —
          typically comes back inside two working days.
        </p>
        <div className="mt-6">
          <Button href="/get-quote">Get a scoped quote</Button>
        </div>
      </div>
    </div>
  );
}

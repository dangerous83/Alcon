import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { siteConfig } from "@/lib/content/site";
import { assetPath } from "@/lib/asset-path";

const title = "Services";
const description =
  "Twelve connected advertising, design, animation, production, and marketing services from Alcon, a Dubai-based creative agency.";

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
  { label: "Advertising-ready by design", body: "Every deliverable is built for a real campaign environment—paid social, connected TV, outdoor, and every screen between." },
  { label: "AI where it earns its place", body: "AI accelerates ideation, versioning, and post-production. Direction and final craft stay with senior humans." },
  { label: "One system, one team", body: "Branding, motion, editing, and social draw from the same system, so everything feels unmistakably connected." },
];

export default function ServicesIndexPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services · Strategy · Design · Production"
        headline="One creative system. Every capability to make it matter."
        accent="matter"
        description="Strategy, design, motion, video, social, and AI-accelerated production—connected by one team and one standard of craft."
        image="/images/pages/services-hero.webp"
        imageAlt="Integrated creative studio tools connected in electric blue and violet light"
        primaryLabel="Build your project stack"
        primaryHref="/get-quote"
        secondaryLabel="Explore the work"
        secondaryHref="/portfolio"
        stats={[
          { value: "12 disciplines", label: "One connected studio" },
          { value: "AI-accelerated", label: "Human-directed craft" },
          { value: "Dubai + GCC", label: "Built for the market" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <ul className="grid gap-4 sm:grid-cols-3">
          {outcomes.map((outcome) => (
            <li key={outcome.label} className="rounded-2xl border border-border bg-surface p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fuchsia-400">{outcome.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{outcome.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-24">
          <SectionLabel>Disciplines</SectionLabel>
          <Heading as="h2" size="lg" className="mt-3 max-w-2xl">Twelve services. One creative system.</Heading>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.slug} className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-1 hover:border-white/25">
              <Link href={`/services/${service.slug}`} className="block h-full">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                  <Image src={assetPath(service.heroImage)} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-xs text-cyan-accent">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">{service.category}</p>
                  <h3 className="mt-3 font-heading text-xl font-medium text-text-primary">{service.shortName}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{service.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-primary transition-colors group-hover:text-cyan-accent">
                    View service <ArrowRight size={14} strokeWidth={2} aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta
        heading="Have a live brief? Let’s scope it this week."
        body="Tell us the goal, timeline, and where the work needs to land. We will shape the right team and a clear path forward."
        primaryLabel="Build Your Quote"
      />
    </main>
  );
}

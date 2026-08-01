import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ClientLinkGrid } from "@/components/clients/ClientLinkGrid";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { clientPlatformLinks, clientWebsiteLinks } from "@/lib/content/mega-menu";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Client Projects",
  description:
    "Explore live platforms and websites delivered by Alcon for clients across Dubai, the GCC, and international markets.",
  alternates: { canonical: `${siteConfig.url}/client-projects` },
};

export default function ClientProjectsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Clients · Live work in the world"
        headline="Built for real businesses. Shipped beyond the presentation."
        accent="Shipped"
        description="A cross-section of platforms, websites, brands, and campaign systems created for organisations moving in the real world."
        image="/images/pages/clients-hero.webp"
        imageAlt="Gallery of completed digital and campaign projects in a dark exhibition space"
        primaryLabel="Browse client projects"
        primaryHref="#client-work"
        secondaryLabel="Start your project"
        secondaryHref="/get-quote"
        stats={[
          { value: "150+ clients", label: "Across sectors and markets" },
          { value: "700+ projects", label: "From idea to launch" },
          { value: "Live work", label: "Products in the world" },
        ]}
      />

      <section id="client-work" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <SectionLabel>Selected work</SectionLabel>
        <Heading as="h2" size="lg" className="mt-4 max-w-2xl">
          Work chosen for range, not just polish.
        </Heading>
        <p className="mt-5 max-w-2xl text-text-secondary">
          Explore active platforms and published websites across the studio’s
          core disciplines. Every link leads to work already in market.
        </p>
        <div className="mt-16 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-accent">Digital products</p>
            <Heading as="h2" size="md" className="mt-3">Platforms built to perform.</Heading>
          </div>
          <Link href="/client-projects/platform" className="hidden items-center gap-2 text-sm text-text-secondary transition hover:text-cyan-accent sm:flex">
            View platforms <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="mt-8">
          <ClientLinkGrid items={clientPlatformLinks} kind="Platform" />
        </div>

        <div className="mt-24 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-400">Web experiences</p>
            <Heading as="h2" size="md" className="mt-3">Websites designed for action.</Heading>
          </div>
          <Link href="/client-projects/website" className="hidden items-center gap-2 text-sm text-text-secondary transition hover:text-cyan-accent sm:flex">
            View websites <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="mt-8">
          <ClientLinkGrid items={clientWebsiteLinks} kind="Website" />
        </div>
      </section>

      <FinalCta
        heading="Ready to become the next project we are proud to show?"
        body="Bring us the business goal and the challenge behind it. We will assemble the right creative and production team."
      />
    </main>
  );
}


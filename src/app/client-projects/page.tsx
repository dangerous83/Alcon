import type { Metadata } from "next";
import { ProjectBrowser } from "@/components/sections/ProjectBrowser";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
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
        <ProjectBrowser />
      </section>

      <FinalCta
        heading="Ready to become the next project we are proud to show?"
        body="Bring us the business goal and the challenge behind it. We will assemble the right creative and production team."
      />
    </main>
  );
}

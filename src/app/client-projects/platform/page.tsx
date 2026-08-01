import type { Metadata } from "next";
import { ClientLinkGrid } from "@/components/clients/ClientLinkGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { clientPlatformLinks } from "@/lib/content/mega-menu";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Platform Work",
  description: "Product and platform work built by Alcon.",
  alternates: { canonical: `${siteConfig.url}/client-projects/platform` },
};

export default function ClientProjectsPlatformPage() {
  return (
    <main>
      <PageHero
        eyebrow="Clients · Platform work"
        headline="Platforms built to work beyond the pitch."
        accent="work"
        description="Explore live digital products shaped around real workflows, real audiences, and measurable business movement."
        image="/images/pages/clients-hero.webp"
        imageAlt="Digital product gallery with illuminated platform screens"
        primaryLabel="Explore live platforms"
        primaryHref="#platform-work"
        secondaryLabel="Start a platform"
        secondaryHref="/get-quote"
        stats={[
          { value: "Live products", label: "Open the real deployed work" },
          { value: "End-to-end", label: "Strategy, UX, UI, and launch" },
          { value: "Built to scale", label: "Systems ready for growth" },
        ]}
      />

      <section id="platform-work" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <SectionLabel>Platform portfolio</SectionLabel>
        <Heading as="h2" size="lg" className="mt-4 max-w-3xl">Live products with a point of view.</Heading>
        <p className="mt-5 max-w-2xl text-text-secondary">Every cover below is captured from the live project. Open any card to experience the deployed platform.</p>
        <div className="mt-12"><ClientLinkGrid items={clientPlatformLinks} kind="Platform" /></div>
      </section>

      <FinalCta heading="Have a platform idea worth launching?" body="Bring the workflow, audience, and ambition. We will shape the product story and build the experience around it." />
    </main>
  );
}


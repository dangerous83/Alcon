import type { Metadata } from "next";
import { ClientLinkGrid } from "@/components/clients/ClientLinkGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { clientWebsiteLinks } from "@/lib/content/mega-menu";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Website Work",
  description: "Marketing sites and web experiences built by Alcon.",
  alternates: { canonical: `${siteConfig.url}/client-projects/website` },
};

export default function ClientProjectsWebsitePage() {
  return (
    <main>
      <PageHero
        eyebrow="Clients · Website work"
        headline="Websites built to earn the next action."
        accent="action"
        description="Explore live brand and marketing experiences designed to clarify the offer, build confidence, and move visitors forward."
        image="/images/pages/clients-hero.webp"
        imageAlt="Curated gallery of live brand websites on illuminated displays"
        primaryLabel="Explore live websites"
        primaryHref="#website-work"
        secondaryLabel="Start a website"
        secondaryHref="/get-quote"
        stats={[
          { value: "Live websites", label: "Open the real deployed work" },
          { value: "Conversion-led", label: "Clear journeys and next actions" },
          { value: "Brand-first", label: "Distinctive systems, not templates" },
        ]}
      />

      <section id="website-work" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <SectionLabel>Website portfolio</SectionLabel>
        <Heading as="h2" size="lg" className="mt-4 max-w-3xl">Published experiences, ready to explore.</Heading>
        <p className="mt-5 max-w-2xl text-text-secondary">Every cover below is captured from the live project. Open any card to see the website in market.</p>
        <div className="mt-12"><ClientLinkGrid items={clientWebsiteLinks} /></div>
      </section>

      <FinalCta heading="Ready for a website that earns attention?" body="We will turn the business story into a focused digital experience built to create confidence and action." />
    </main>
  );
}

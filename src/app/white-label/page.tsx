import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { WhiteLabelGallery } from "@/components/white-label/WhiteLabelGallery";
import { siteConfig } from "@/lib/content/site";
import { whiteLabelSamples } from "@/lib/content/white-label";

const title = "White Label";
const summary =
  "Production-ready websites you can rebrand and resell as your own—designed, built, and handed over under your name.";

export const metadata: Metadata = {
  title,
  description: summary,
  alternates: { canonical: `${siteConfig.url}/white-label` },
};

const howItWorks = [
  { step: "01", title: "Pick a direction", description: "Start from a proven build or brief us on the sector. Every option is a complete experience, not a theme to assemble." },
  { step: "02", title: "We make it yours", description: "Identity, palette, typography, imagery, and copy are rebuilt around your client while the underlying system stays reliable." },
  { step: "03", title: "You deliver it", description: "The work is handed over under your name, with no Alcon branding in the build, files, or client-facing documentation." },
];

export default function WhiteLabelPage() {
  return (
    <main>
      <PageHero
        eyebrow="White label · Invisible production partner"
        headline="Your client. Your brand. Our production engine."
        accent="Your brand"
        description="Add senior design and development capacity without adding overhead. We build the work; you own the relationship, presentation, and delivery."
        image="/images/pages/white-label-hero.webp"
        imageAlt="Modular unbranded website systems prepared for agency handover"
        primaryLabel="Explore ready builds"
        primaryHref="#sample-builds"
        secondaryLabel="Discuss a partnership"
        secondaryHref="/get-quote"
        stats={[
          { value: "100% unbranded", label: "Your name stays front and centre" },
          { value: "Production-ready", label: "Complete builds, not templates" },
          { value: "Flexible capacity", label: "Scale without permanent overhead" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <SectionLabel>How it works</SectionLabel>
            <Heading as="h2" size="lg" className="mt-4">Built quietly. Delivered confidently.</Heading>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <li key={item.step} className="rounded-2xl border border-border bg-surface-elevated p-6">
                <span className="font-mono text-xs text-cyan-accent">{item.step}</span>
                <h3 className="mt-8 font-heading text-lg font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div id="sample-builds" className="scroll-mt-24 mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Sample builds</SectionLabel>
              <Heading as="h2" size="lg" className="mt-3">{whiteLabelSamples.length} ready-to-rebrand websites</Heading>
            </div>
            <p className="max-w-md text-sm leading-6 text-text-secondary">
              Across retail, hospitality, property, fintech, and services—each one delivered under your brand, not ours.
            </p>
          </div>
          <WhiteLabelGallery samples={whiteLabelSamples} />
        </div>
      </section>

      <FinalCta
        heading="Need invisible capacity your clients can trust?"
        body="Tell us the sector, scope, and deadline. We will show you the right starting point and a clear white-label delivery plan."
        primaryLabel="Discuss a Partnership"
      />
    </main>
  );
}

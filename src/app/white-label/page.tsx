import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { WhiteLabelGallery } from "@/components/white-label/WhiteLabelGallery";
import { siteConfig } from "@/lib/content/site";
import { whiteLabelSamples } from "@/lib/content/white-label";

const title = "White Label";
const summary =
  "Production-ready websites you can rebrand and resell as your own — designed, built, and handed over under your name.";

export const metadata: Metadata = {
  title,
  description: summary,
  alternates: { canonical: `${siteConfig.url}/white-label` },
};

const howItWorks = [
  {
    step: "01",
    title: "Pick a direction",
    description:
      "Start from one of the builds below or brief us on a sector. Each is a complete site, not a theme to be assembled.",
  },
  {
    step: "02",
    title: "We rebrand it",
    description:
      "Identity, palette, typography, imagery, and copy are reworked to your client's brand — the layout stays proven.",
  },
  {
    step: "03",
    title: "You deliver it",
    description:
      "Handed over under your name, with no Alcon branding anywhere in the build or the handover documents.",
  },
];

export default function WhiteLabelPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="max-w-3xl">
        <SectionLabel>White Label</SectionLabel>
        <Heading as="h1" size="xl" className="mt-4">
          {title}
        </Heading>
        <p className="mt-4 text-lg text-text-secondary">{summary}</p>
        <p className="mt-4 text-text-secondary">
          Agencies, studios, and freelancers use Alcon as unbranded production
          capacity: you own the client relationship and the invoice, we build
          the work. The samples below are demonstration builds, each one
          rebrandable end to end.
        </p>
      </div>

      <ol className="mt-16 grid gap-8 sm:grid-cols-3">
        {howItWorks.map((item) => (
          <li key={item.step}>
            <span className="font-mono text-xs text-text-secondary">
              {item.step}
            </span>
            <h2 className="mt-2 font-heading text-lg font-semibold text-text-primary">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {item.description}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>Sample Builds</SectionLabel>
            <Heading as="h2" size="lg" className="mt-3">
              {whiteLabelSamples.length} ready-to-rebrand websites
            </Heading>
          </div>
          <p className="max-w-md text-sm text-text-secondary">
            Across retail, hospitality, property, fintech, and services — every
            one delivered under your brand, not ours.
          </p>
        </div>

        <WhiteLabelGallery samples={whiteLabelSamples} />
      </div>

      <div className="mt-20 rounded-[7px] border border-border bg-surface-elevated/60 p-8 sm:p-10">
        <Heading as="h2" size="md">
          Want one of these under your brand?
        </Heading>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Tell us which build fits your client and what needs to change. We
          will come back with scope, timeline, and resale pricing.
        </p>
        <div className="mt-6">
          <Button href="/get-quote">Talk to us about a partnership</Button>
        </div>
      </div>
    </div>
  );
}

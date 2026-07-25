import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A look at Alcon's work across branding, motion, social, and production.",
  alternates: { canonical: `${siteConfig.url}/portfolio` },
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionLabel>Portfolio</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4">
        Portfolio
      </Heading>
      <p className="mt-4 text-lg text-text-secondary">
        Browse work by discipline from the nav above, or see the full
        project index.
      </p>
      <div className="mt-8 space-y-4">
        <p className="text-text-secondary">
          This page is a placeholder pending real project data (see
          docs/content-map.md). The Portfolio menu links out to each
          discipline&apos;s service page; for actual client work, browse{" "}
          <span className="text-text-primary">Client Projects</span> below.
        </p>
      </div>
      <div className="mt-10">
        <Button href="/client-projects">View all work</Button>
      </div>
    </div>
  );
}

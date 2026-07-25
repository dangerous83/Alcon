import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Branding, motion graphics, video editing, social media, and weekend tutorials — Alcon's creative services for Dubai brands.",
  alternates: { canonical: `${siteConfig.url}/services` },
};

export default function ServicesIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionLabel>Services</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4 max-w-2xl">
        Five disciplines. One creative system.
      </Heading>
      <p className="mt-4 max-w-2xl text-text-secondary">
        Every engagement draws from the same brand system, so work stays
        consistent whether you start with an identity, a campaign, or a
        single video.
      </p>

      <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card as="li" key={service.slug}>
            <span className="font-mono text-xs text-text-secondary">
              0{service.accentIndex + 1}
            </span>
            <h2 className="mt-4 font-heading text-xl font-medium text-text-primary">
              {service.name}
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              {service.summary}
            </p>
            <Link
              href={`/services/${service.slug}`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
            >
              View service
              <span aria-hidden>→</span>
            </Link>
          </Card>
        ))}
      </ul>
    </div>
  );
}

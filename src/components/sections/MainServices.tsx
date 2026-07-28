import Link from "next/link";
import { services } from "@/lib/content/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { assetPath } from "@/lib/asset-path";

// The full catalogue (including Video Editing) still lives on /services and
// powers the routes; this section intentionally features a subset.
const featured = services.filter((service) => service.slug !== "editing");

function ServiceCards() {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
      {featured.map((service, index) => (
        <Card
          as="li"
          key={service.slug}
          className="flex flex-col bg-surface-elevated/70 p-5 backdrop-blur-sm"
        >
          <span className="font-mono text-[11px] text-text-secondary">
            0{index + 1}
          </span>
          <h3 className="mt-2 font-heading text-lg font-medium text-text-primary">
            {service.name}
          </h3>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">
            {service.summary}
          </p>
          <Link
            href={`/services/${service.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
          >
            Learn more
            <span aria-hidden>→</span>
          </Link>
        </Card>
      ))}
    </ul>
  );
}

function SectionCopy() {
  return (
    <>
      <SectionLabel>What we do</SectionLabel>
      <Heading as="h2" id="services-heading" size="lg" className="mt-4">
        One creative system, four disciplines.
      </Heading>
      <p className="mt-4 max-w-xl text-text-secondary">
        Every service is built to plug into the same brand system — so
        identity, motion, and content stay consistent no matter which team
        you start with.
      </p>
    </>
  );
}

/**
 * "One creative system, four disciplines."
 *
 * This section picks up exactly where the hero's scroll-scrub settles: the
 * hero video is one continuous clip that runs brain → skyline → growth-chart
 * of towers, and this section carries that same towers frame as a static
 * backdrop. The scrubbing all happens in the hero above — there is no second
 * scroll-scrubbed video here, so the journey reads as one connected clip that
 * simply finishes at this section rather than being split across two.
 */
export function MainServices() {
  return (
    <section
      className="relative overflow-hidden bg-[#010103]"
      aria-labelledby="services-heading"
    >
      {/* The towers finale the hero closes on, held as a still so this section
          continues straight out of the scrub above. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${assetPath("/images/services-poster.jpg")})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="lg:max-w-[62%]">
          <SectionCopy />
          <ServiceCards />
        </div>
      </div>
    </section>
  );
}

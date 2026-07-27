import Link from "next/link";
import { services } from "@/lib/content/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

export function MainServices() {
  // The full catalogue (including Video Editing) still lives on /services and
  // powers the routes; this homepage grid intentionally features a subset.
  const featured = services.filter((service) => service.slug !== "editing");

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
      aria-labelledby="services-heading"
    >
      <div className="max-w-2xl">
        <SectionLabel>What we do</SectionLabel>
        <Heading as="h2" id="services-heading" size="lg" className="mt-4">
          One creative system, four disciplines.
        </Heading>
        <p className="mt-4 text-text-secondary">
          Every service is built to plug into the same brand system — so
          identity, motion, and content stay consistent no matter which
          team you start with.
        </p>
      </div>

      {/* Cards occupy the left two-thirds; the right column is intentionally
          left empty as space for a future animation/feature. */}
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
        {featured.map((service, index) => (
          <Card as="li" key={service.slug} className="flex flex-col">
            <span className="font-mono text-xs text-text-secondary">
              0{index + 1}
            </span>
            <h3 className="mt-4 font-heading text-xl font-medium text-text-primary">
              {service.name}
            </h3>
            <p className="mt-3 flex-1 text-sm text-text-secondary">
              {service.summary}
            </p>
            <Link
              href={`/services/${service.slug}`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
            >
              Learn more
              <span aria-hidden>→</span>
            </Link>
          </Card>
        ))}
        </ul>
        {/* Reserved space for a future animation/feature. */}
        <div aria-hidden className="hidden lg:block" />
      </div>
    </section>
  );
}

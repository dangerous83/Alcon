"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { services } from "@/lib/content/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { assetPath } from "@/lib/asset-path";

// The full catalogue (including Video Editing) still lives on /services and
// powers the routes; this section intentionally features a subset.
const featured = services.filter((service) => service.slug !== "editing");

/**
 * The four discipline cards. Exported so the hero can render them as the final
 * phase of its one continuous scroll-scrub (over the growth-chart of towers),
 * and the reduced-motion fallback below can render the identical set. Summaries
 * are clamped so the four cards + heading fit the pinned viewport; the full
 * text lives on /services.
 */
export function ServicesCards() {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {featured.map((service, index) => (
        <Card
          as="li"
          key={service.slug}
          // The card's own translucent, blurred plate is what keeps it legible
          // over the bright towers — deliberately no full-section dark wash.
          className="flex flex-col bg-surface-elevated/80 p-4 backdrop-blur-md"
        >
          <span className="font-mono text-[11px] text-text-secondary">
            0{index + 1}
          </span>
          <h3 className="mt-2 font-heading text-base font-medium leading-tight text-text-primary">
            {service.name}
          </h3>
          <p className="mt-1.5 flex-1 text-sm leading-snug text-text-secondary line-clamp-2">
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

/** Heading + intro for the services section. Exported alongside the cards. */
export function ServicesCopy() {
  return (
    <>
      <SectionLabel>What we do</SectionLabel>
      <Heading as="h2" id="services-heading" size="lg" className="mt-3">
        One creative system, four disciplines.
      </Heading>
      <p className="mt-3 max-w-xl text-text-secondary">
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
 * For motion visitors this content is rendered by the hero as the FINAL phase
 * of one continuous scroll-scrub — the same clip runs brain → skyline → towers
 * without a break, and the cards resolve over the towers finale. So there is no
 * separate scrubbed section here (a second pinned section would put a visible
 * cut between the hero and this content); this component only provides the
 * reduced-motion / no-JS / SSR fallback: a static frame of the towers finale
 * with the cards on the left, no dark overlay.
 */
export function MainServices() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Motion visitors get this content inside the hero's scrub, so rendering it
  // again here would duplicate it — and put it after a section boundary, the
  // very cut we're removing. Render only for reduced-motion / no-JS / SSR.
  if (reducedMotion === false) return null;

  return (
    <section
      className="relative overflow-hidden bg-black"
      aria-labelledby="services-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${assetPath("/images/services-poster.jpg")})` }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="lg:max-w-[54%]">
          <ServicesCopy />
          <ServicesCards />
        </div>
      </div>
    </section>
  );
}

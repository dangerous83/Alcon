"use client";

import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { assetPath } from "@/lib/asset-path";

const printProducts = [
  {
    name: "Custom T-shirts",
    category: "Apparel",
    description: "Premium tees printed for teams, launches, events, and brand drops.",
    highlights: ["Premium cotton options", "DTF, screen print & embroidery"],
    image: "/images/print-products/print-tshirt.jpg",
    imageAlt: "Premium black custom printed T-shirt with electric blue and violet artwork",
  },
  {
    name: "Custom Hoodies",
    category: "Apparel",
    description: "Heavyweight branded hoodies with durable, high-impact finishing.",
    highlights: ["Heavyweight fleece options", "Print or embroidery finishing"],
    image: "/images/print-products/print-hoodie.jpg",
    imageAlt: "Premium black custom hoodie with electric blue and violet artwork",
  },
  {
    name: "Printed Mugs",
    category: "Drinkware",
    description: "Sharp, colour-rich mugs made for gifts, offices, and campaigns.",
    highlights: ["Vivid, durable colour", "Ideal for teams and gifting"],
    image: "/images/print-products/print-mugs.jpg",
    imageAlt: "Matte black printed ceramic mug with blue and violet artwork",
  },
  {
    name: "Custom Stickers",
    category: "Brand details",
    description: "Premium die-cut vinyl stickers that make every surface feel branded.",
    highlights: ["Custom shapes and sizes", "Durable vinyl finishing"],
    image: "/images/print-products/print-stickers.jpg",
    imageAlt: "Premium die-cut sticker collection with blue, violet, and magenta graphics",
  },
] as const;

export function ServicesCards() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const detailsId = useId();
  const activeProduct = printProducts[activeIndex ?? 0];

  return (
    <>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {printProducts.map((product, index) => {
          const isActive = activeIndex === index;

          return (
            <li key={product.name}>
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={detailsId}
                aria-label={`${isActive ? "Collapse" : "View"} details for ${product.name}`}
                onClick={() => setActiveIndex(isActive ? null : index)}
                style={{ backgroundImage: `url(${assetPath(product.image)})` }}
                className={`relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-black text-left shadow-[0_18px_55px_-34px_rgba(40,112,255,0.8)] hover:border-cyan-accent/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent sm:aspect-[16/10] ${
                  isActive
                    ? "border-cyan-accent/70 ring-1 ring-cyan-accent/35"
                    : "border-white/12"
                } bg-contain bg-center bg-no-repeat`}
              />
            </li>
          );
        })}
      </ul>

      <aside
        id={detailsId}
        data-open={activeIndex !== null}
        aria-hidden={activeIndex === null}
        aria-label={`${activeProduct.name} details`}
        style={{
          opacity: activeIndex === null ? 0 : 1,
          visibility: activeIndex === null ? "hidden" : "visible",
        }}
        className="absolute inset-x-3 bottom-16 z-40 max-h-[68svh] overflow-y-auto rounded-3xl border border-white/15 bg-[#080a12] shadow-[0_28px_90px_-28px_rgba(40,112,255,0.75)] lg:inset-x-auto lg:bottom-auto lg:right-[4vw] lg:top-[16vh] lg:max-h-[calc(100svh-9rem)] lg:w-[39vw] lg:max-w-[520px]"
      >
        <div
          role="img"
          aria-label={activeProduct.imageAlt}
          style={{ backgroundImage: `url(${assetPath(activeProduct.image)})` }}
          className="relative h-36 overflow-hidden border-b border-white/10 bg-black bg-contain bg-center bg-no-repeat sm:h-44 lg:h-52"
        >
          <button
            type="button"
            tabIndex={activeIndex === null ? -1 : 0}
            aria-label="Close product details"
            onClick={() => setActiveIndex(null)}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/20 bg-black/90 text-white hover:border-cyan-accent/70 hover:text-cyan-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-accent">
            {activeProduct.category}
          </p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-white sm:text-3xl">
            {activeProduct.name}
          </h3>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {activeProduct.description}
          </p>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {activeProduct.highlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs leading-5 text-white/80"
              >
                {highlight}
              </li>
            ))}
          </ul>

          <Link
            href="/get-quote#project-details"
            tabIndex={activeIndex === null ? -1 : 0}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2870FF] via-[#7138FF] to-[#D12DFF] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-18px_rgba(113,56,255,0.95)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          >
            Request a quote
            <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>
      </aside>
    </>
  );
}

export function ServicesCopy() {
  return (
    <>
      <SectionLabel className="lg:pt-14">Print &amp; merchandise</SectionLabel>
      <Heading as="h2" id="services-heading" size="sm" className="mt-2.5 max-w-lg">
        Put your brand on something people keep.
      </Heading>
      <p className="mt-2.5 max-w-xl text-sm leading-5 text-text-secondary sm:text-[15px] sm:leading-6">
        Premium custom print for teams, launches, events, client gifts, and
        everyday brand visibility—produced with sharp detail and a finish that
        feels considered.
      </p>
    </>
  );
}

function subscribeToReducedMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MainServices() {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => true
  );

  if (!reducedMotion) return null;

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

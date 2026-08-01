"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { assetPath } from "@/lib/asset-path";

const printProducts = [
  {
    name: "Custom T-shirts",
    category: "Apparel",
    description: "Premium tees printed for teams, launches, events, and brand drops.",
    image: "/images/print-products/print-tshirt.webp",
    imageAlt: "Premium black custom printed T-shirt with electric blue and violet artwork",
  },
  {
    name: "Custom Hoodies",
    category: "Apparel",
    description: "Heavyweight branded hoodies with durable, high-impact finishing.",
    image: "/images/print-products/print-hoodie.webp",
    imageAlt: "Premium black custom hoodie with electric blue and violet artwork",
  },
  {
    name: "Printed Mugs",
    category: "Drinkware",
    description: "Sharp, colour-rich mugs made for gifts, offices, and campaigns.",
    image: "/images/print-products/print-mugs.webp",
    imageAlt: "Matte black printed ceramic mug with blue and violet artwork",
  },
  {
    name: "Custom Stickers",
    category: "Brand details",
    description: "Premium die-cut vinyl stickers that make every surface feel branded.",
    image: "/images/print-products/print-stickers.webp",
    imageAlt: "Premium die-cut sticker collection with blue, violet, and magenta graphics",
  },
] as const;

export function ServicesCards() {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3">
      {printProducts.map((product, index) => (
        <li
          key={product.name}
          className="group overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated/90 shadow-[0_18px_55px_-34px_rgba(40,112,255,0.8)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-accent/45"
        >
          <Link
            href="/get-quote#project-details"
            className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          >
            <div className="relative h-16 overflow-hidden border-b border-white/10 sm:h-20">
              <Image
                src={assetPath(product.image)}
                alt={product.imageAlt}
                fill
                sizes="(min-width: 1024px) 17vw, 46vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-2 py-1 font-mono text-[9px] text-white/80 backdrop-blur-md">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-2.5 sm:p-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-cyan-accent sm:text-[9px]">
                {product.category}
              </p>
              <h3 className="mt-1.5 font-heading text-sm font-semibold leading-tight text-text-primary">
                {product.name}
              </h3>
              <p className="mt-1 hidden text-[11px] leading-4 text-text-secondary sm:line-clamp-2 sm:block">
                {product.description}
              </p>
              <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-text-primary transition group-hover:text-cyan-accent sm:text-xs">
                Request a quote
                <ArrowUpRight size={13} strokeWidth={1.9} aria-hidden />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
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

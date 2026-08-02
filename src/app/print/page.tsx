import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { printProducts } from "@/lib/content/print";
import { siteConfig } from "@/lib/content/site";
import { assetPath } from "@/lib/asset-path";

const title = "Custom Printing & Branded Merchandise Dubai";
const description =
  "Explore premium custom T-shirts, hoodies, mugs, tumblers, and stickers designed by Alcon for brands, teams, launches, events, and gifting in Dubai.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "custom printing Dubai",
    "branded merchandise Dubai",
    "custom T-shirt printing Dubai",
    "custom hoodies UAE",
    "custom mugs and tumblers Dubai",
    "custom stickers Dubai",
  ],
  alternates: { canonical: `${siteConfig.url}/print` },
};

export default function PrintPage() {
  return (
    <main>
      <PageHero
        eyebrow="Print · Apparel · Drinkware · Brand details"
        headline="Make the brand tangible—and worth keeping."
        accent="worth keeping"
        description="Premium custom print and branded merchandise for teams, campaigns, events, client gifts, and retail-ready drops across Dubai and the UAE."
        image="/images/print/print-overview-hero.webp"
        imageAlt="Premium collection of custom T-shirt, hoodie, drinkware, and stickers in a dark studio"
        primaryLabel="Explore print products"
        primaryHref="#print-products"
        secondaryLabel="Request a quote"
        secondaryHref="/get-quote"
        stats={[
          { value: "04 categories", label: "A focused merchandise range" },
          { value: "Brand-led", label: "Every detail designed together" },
          { value: "Production-ready", label: "Artwork prepared to print" },
        ]}
      />

      <section id="print-products" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Print & merchandise</SectionLabel>
            <Heading as="h2" size="lg" className="mt-5 max-w-3xl">
              Four product lines. One polished brand system.
            </Heading>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary">
              Choose a product to explore the materials, design approach, and
              production-ready outputs behind it.
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-400">
            Designed in Dubai
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {printProducts.map((product, index) => (
            <li key={product.slug}>
              <Link
                href={`/print/${product.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-border bg-surface-elevated transition duration-500 hover:-translate-y-1 hover:border-cyan-accent/40 hover:shadow-[0_28px_70px_-36px_rgba(22,199,255,0.75)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={assetPath(product.heroImage)}
                    alt={product.heroAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
                    <div>
                      <h2 className="font-heading text-2xl font-medium text-white sm:text-3xl">
                        {product.name}
                      </h2>
                      <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
                        {product.summary}
                      </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition group-hover:border-cyan-accent group-hover:bg-cyan-accent/15">
                      <ArrowUpRight size={18} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-24 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["01", "Designed as a brand", "Artwork, placement, product, colour, and finish are developed as one coherent decision."],
            ["02", "Prepared for production", "Files, dimensions, bleed, colours, and applications are organised to reduce avoidable production friction."],
            ["03", "Made for the real moment", "Every direction is judged by how it will be worn, held, gifted, photographed, and remembered."],
          ].map(([number, heading, body]) => (
            <article key={number} className="rounded-2xl border border-border bg-black/30 p-7">
              <span className="font-mono text-xs text-cyan-accent">{number}</span>
              <h3 className="mt-8 font-heading text-xl font-medium text-text-primary">{heading}</h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <FinalCta
        heading="Ready to make your brand something people keep?"
        body="Tell us what you want to produce, who it is for, and the moment it needs to own. We will shape the design and production-ready system around it."
        secondaryLabel="Explore Our Work"
      />
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { portfolioDisciplines } from "@/lib/content/portfolio";
import { siteConfig } from "@/lib/content/site";
import { assetPath } from "@/lib/asset-path";

const title = "Creative Portfolio";
const description =
  "Explore Alcon's branding, UI/UX, animation, social, videography, and photography portfolio across Dubai, the UAE, and the GCC.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "creative agency portfolio Dubai",
    "branding portfolio UAE",
    "animation portfolio Dubai",
    "UI UX portfolio UAE",
    "video production portfolio Dubai",
  ],
  alternates: { canonical: `${siteConfig.url}/portfolio` },
};

export default function PortfolioPage() {
  return (
    <main>
      <PageHero
        eyebrow="Portfolio · Eight creative disciplines"
        headline="A working portfolio, not a highlight reel."
        accent="portfolio"
        description="Eight creative disciplines. One standard: every idea must become work people notice, understand, and remember."
        image="/images/pages/portfolio-hero.webp"
        imageAlt="Curated gallery of creative frames, film, cameras, and sculptural work"
        primaryLabel="Explore the collections"
        primaryHref="#portfolio-collections"
        secondaryLabel="Start a project"
        secondaryHref="/get-quote"
        stats={[
          { value: "08 collections", label: "Explore by discipline" },
          { value: "700+ projects", label: "Delivered across formats" },
          { value: "One standard", label: "Strategy through finish" },
        ]}
      />

      <section id="portfolio-collections" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Explore by discipline</SectionLabel>
            <p className="mt-4 max-w-2xl text-text-secondary">
              Each collection connects the thinking, craft, and production
              outputs behind the work—without invented case studies.
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-400">
            08 collections
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {portfolioDisciplines.map((portfolio, index) => (
            <li key={portfolio.slug}>
              <Link
                href={`/portfolio/${portfolio.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-surface-elevated transition hover:-translate-y-1 hover:border-white/25"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={assetPath(portfolio.heroImage)}
                    alt={portfolio.heroAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary backdrop-blur-md">
                    Collection {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
                    <div>
                      <h2 className="font-heading text-2xl font-medium text-white sm:text-3xl">
                        {portfolio.name}
                      </h2>
                      <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
                        {portfolio.summary}
                      </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition group-hover:border-fuchsia-400 group-hover:bg-fuchsia-500/15">
                      <ArrowUpRight size={18} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta
        heading="Ready to make work worth adding to the portfolio?"
        body="Tell us what the next campaign, brand, platform, or production needs to achieve. We will bring the right disciplines together."
      />
    </main>
  );
}

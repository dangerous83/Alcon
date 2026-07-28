import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Brain, Cloud, Shield, type LucideIcon } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { assetPath } from "@/lib/asset-path";

/**
 * The three ways into Alcon — Services, Portfolio, Clients — each a card with
 * a client-supplied hero image (brain / cloud / shield) whose artwork sits in
 * the lower half, leaving the top for the card detail: an icon, a kicker, the
 * title, and a short line.
 */
type Pillar = {
  href: string;
  icon: LucideIcon;
  kicker: string;
  title: string;
  summary: string;
  image: string;
};

const pillars: Pillar[] = [
  {
    href: "/services",
    icon: Brain,
    kicker: "What we do",
    title: "Services",
    summary: "Branding, motion, social, and post — one AI-accelerated team.",
    image: "/images/feature-brain.webp",
  },
  {
    href: "/portfolio",
    icon: Cloud,
    kicker: "Selected work",
    title: "Portfolio",
    summary: "A living body of work, updated as we ship.",
    image: "/images/feature-cloud.webp",
  },
  {
    href: "/client-projects",
    icon: Shield,
    kicker: "Trusted worldwide",
    title: "Clients",
    summary: "Live platforms and sites shipped for brands worldwide.",
    image: "/images/feature-shield.webp",
  },
];

export function FeaturedProjects() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <SectionLabel>Explore</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            Three ways into Alcon.
          </Heading>
          <p className="mt-4 text-text-secondary">
            Start with what we do, browse the work, or meet the brands already
            building with us.
          </p>
        </div>
        <Button href="/get-quote" variant="secondary">
          Get a quote
        </Button>
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <li key={pillar.href}>
              <Link
                href={pillar.href}
                className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
              >
                <div
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050308] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/25"
                  style={{ aspectRatio: "3 / 4" }}
                >
                  <Image
                    src={assetPath(pillar.image)}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  {/* Keeps the top detail legible over the artwork. */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/20 to-transparent"
                  />

                  {/* Detail block, top-aligned over the black upper area of the
                      artwork: icon with the kicker + title beside it, then a
                      short two-line description. */}
                  <div className="absolute inset-x-0 top-0 p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-background/50 text-cyan-accent backdrop-blur-sm transition-colors duration-500 group-hover:border-cyan-accent/50">
                        <Icon size={20} strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary/80">
                          {pillar.kicker}
                        </p>
                        <h3 className="mt-0.5 font-heading text-xl font-semibold leading-tight text-text-primary">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                      {pillar.summary}
                    </p>
                  </div>

                  <span className="absolute bottom-5 right-5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-background/50 text-text-primary backdrop-blur-sm transition-colors duration-500 group-hover:border-cyan-accent/60 group-hover:text-cyan-accent">
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

/**
 * The three ways into Alcon — Services, Portfolio, Clients — each fronted by
 * an AI-generated brand image (Higgsfield, Alcon's violet/blue-on-black
 * palette). The images are served from Higgsfield's CDN, which is already
 * whitelisted in next.config `images.remotePatterns`. Swap `image` for a
 * local /images/ path once the assets are committed to the repo.
 */
const HF =
  "https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE";

const pillars = [
  {
    href: "/services",
    kicker: "What we do",
    title: "Services",
    summary:
      "Branding, motion, social, and post-production — one AI-accelerated creative team.",
    image: `${HF}/hf_20260726_213402_e377715c-db48-4a04-8ffa-6e33a09d5c85.png`,
  },
  {
    href: "/portfolio",
    kicker: "Selected work",
    title: "Portfolio",
    summary:
      "A living body of work across every discipline, updated as we ship.",
    image: `${HF}/hf_20260726_213404_69502eb6-4453-41cf-874a-ea705b0c0db3.png`,
  },
  {
    href: "/client-projects",
    kicker: "Trusted worldwide",
    title: "Clients",
    summary:
      "Live platforms and websites shipped for brands across the globe.",
    image: `${HF}/hf_20260726_213406_8ebf6d24-b25b-4973-a2ee-9ee375219e08.png`,
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
        {pillars.map((pillar) => (
          <li key={pillar.href}>
            <Link
              href={pillar.href}
              className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
            >
              <div
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/25"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                {/* Base gradient keeps the title legible over the artwork. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent"
                />
                <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary/80">
                  {pillar.kicker}
                </span>
                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
                  <span className="font-heading text-xl font-medium text-text-primary">
                    {pillar.title}
                  </span>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-background/50 text-text-primary transition-colors duration-500 group-hover:border-cyan-accent/60 group-hover:text-cyan-accent">
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-secondary">
                {pillar.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

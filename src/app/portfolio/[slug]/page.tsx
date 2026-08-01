import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  getPortfolioDiscipline,
  portfolioDisciplines,
} from "@/lib/content/portfolio";
import { siteConfig } from "@/lib/content/site";
import { assetPath } from "@/lib/asset-path";

export function generateStaticParams() {
  return portfolioDisciplines.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = getPortfolioDiscipline(slug);
  if (!portfolio) return {};

  const url = `${siteConfig.url}/portfolio/${portfolio.slug}`;
  const image = `${siteConfig.url}${portfolio.heroImage}`;
  return {
    title: `${portfolio.name} Portfolio`,
    description: portfolio.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${portfolio.name} Portfolio | Alcon`,
      description: portfolio.summary,
      url,
      type: "website",
      images: [{ url: image, width: 1672, height: 941, alt: portfolio.heroAlt }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function PortfolioDisciplinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = getPortfolioDiscipline(slug);
  if (!portfolio) notFound();

  const related = portfolio.related
    .map(getPortfolioDiscipline)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main>
      <section className="relative isolate min-h-[700px] overflow-hidden border-b border-border lg:min-h-[780px]">
        <Image
          src={assetPath(portfolio.heroImage)}
          alt={portfolio.heroAlt}
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.98)_34%,rgba(0,0,0,0.75)_57%,rgba(0,0,0,0.06)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-fuchsia-500/20 via-blue-500/10 to-transparent" />

        <div className="mx-auto flex min-h-[700px] max-w-7xl flex-col px-4 py-20 sm:px-6 lg:min-h-[780px] lg:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-text-secondary">
            <Link href="/portfolio" className="hover:text-text-primary">Portfolio</Link>{" "}
            / <span className="text-text-primary">{portfolio.name}</span>
          </nav>

          <div className="my-auto max-w-3xl py-14">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-fuchsia-400">
              {portfolio.eyebrow}
            </p>
            <AccentHeading
              text={portfolio.headline}
              accent={portfolio.accent}
              className="mt-6 max-w-3xl"
            />
            <p className="mt-7 max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
              {portfolio.summary}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/get-quote" size="lg">Start a project</Button>
              <Button href={portfolio.serviceHref} variant="secondary" size="lg">
                Explore the service
              </Button>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-3">
            {portfolio.stats.map((stat) => (
              <li key={stat.value} className="bg-black/60 px-5 py-4">
                <p className="font-heading text-sm font-medium text-text-primary">{stat.value}</p>
                <p className="mt-1 text-xs text-text-secondary">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionLabel>{portfolio.name} portfolio</SectionLabel>
            <Heading as="h2" size="lg" className="mt-5 max-w-xl">
              {portfolio.introHeading}
            </Heading>
          </div>
          <div className="space-y-6 text-base leading-8 text-text-secondary">
            {portfolio.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "text-xl text-text-primary" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <ul className="mt-20 grid gap-5 md:grid-cols-3">
          {portfolio.lenses.map((lens, index) => (
            <li key={lens.title} className="group overflow-hidden rounded-2xl border border-border bg-surface-elevated">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                <Image
                  src={assetPath(lens.image)}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-xs text-fuchsia-400">0{index + 1}</span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-medium text-text-primary">{lens.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{lens.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <SectionLabel>What the work includes</SectionLabel>
              <Heading as="h2" size="md" className="mt-4">
                Evidence of a complete creative system.
              </Heading>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {portfolio.evidence.map((item, index) => (
                <li key={item} className="rounded-xl border border-border bg-black/30 p-6">
                  <span className="font-mono text-xs text-fuchsia-400">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-8 text-sm text-text-primary">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <SectionLabel>Keep exploring</SectionLabel>
              <Heading as="h2" size="md" className="mt-4">Related portfolios</Heading>
            </div>
            <Link href="/portfolio" className="hidden text-sm text-text-secondary hover:text-text-primary sm:inline">
              View all work →
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="group overflow-hidden rounded-2xl border border-border bg-black/30">
                <Link href={`/portfolio/${item.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
                    <Image src={assetPath(item.heroImage)} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <h3 className="font-heading text-lg font-medium text-text-primary">{item.name}</h3>
                    <ArrowRight size={16} className="text-fuchsia-400 transition group-hover:translate-x-1" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta
        heading={portfolio.ctaHeading}
        body={portfolio.ctaBody}
        secondaryLabel="Explore All Work"
      />
    </main>
  );
}

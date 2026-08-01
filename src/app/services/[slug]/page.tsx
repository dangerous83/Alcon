import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/lib/content/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { FinalCta } from "@/components/sections/FinalCta";
import { siteConfig } from "@/lib/content/site";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { assetPath } from "@/lib/asset-path";

const accentThemes = [
  {
    eyebrow: "text-cyan-accent",
    glow: "from-cyan-accent/25 via-blue-500/10 to-transparent",
    line: "bg-cyan-accent",
    card: "hover:border-cyan-accent/50",
  },
  {
    eyebrow: "text-blue-400",
    glow: "from-blue-500/25 via-cyan-400/10 to-transparent",
    line: "bg-blue-400",
    card: "hover:border-blue-400/50",
  },
  {
    eyebrow: "text-fuchsia-400",
    glow: "from-fuchsia-500/25 via-violet-500/10 to-transparent",
    line: "bg-fuchsia-400",
    card: "hover:border-fuchsia-400/50",
  },
  {
    eyebrow: "text-violet-400",
    glow: "from-violet-500/25 via-blue-500/10 to-transparent",
    line: "bg-violet-400",
    card: "hover:border-violet-400/50",
  },
  {
    eyebrow: "text-amber-300",
    glow: "from-amber-400/20 via-violet-500/10 to-transparent",
    line: "bg-amber-300",
    card: "hover:border-amber-300/50",
  },
] as const;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const pageUrl = `${siteConfig.url}/services/${service.slug}`;
  const imageUrl = `${siteConfig.url}${service.heroImage}`;

  return {
    title: service.name,
    description: service.summary,
    keywords: service.keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: service.name,
      description: service.summary,
      url: pageUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1672,
          height: 941,
          alt: service.heroAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.name,
      description: service.summary,
      images: [imageUrl],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.related
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const theme = accentThemes[service.accentIndex];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            serviceJsonLd({
              name: service.name,
              description: service.summary,
              url: `${siteConfig.url}/services/${service.slug}`,
            }),
            breadcrumbJsonLd([
              { name: "Home", url: siteConfig.url },
              { name: "Services", url: `${siteConfig.url}/services` },
              {
                name: service.name,
                url: `${siteConfig.url}/services/${service.slug}`,
              },
            ]),
          ]),
        }}
      />

      <section className="relative isolate min-h-[720px] overflow-hidden border-b border-border lg:min-h-[800px]">
        <Image
          src={assetPath(service.heroImage)}
          alt={service.heroAlt}
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.97)_35%,rgba(0,0,0,0.74)_56%,rgba(0,0,0,0.08)_100%)]"
        />
        <div
          aria-hidden
          className={`absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t ${theme.glow}`}
        />

        <div className="mx-auto flex min-h-[720px] max-w-7xl flex-col px-4 py-20 sm:px-6 lg:min-h-[800px] lg:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-text-secondary">
            <Link href="/services" className="hover:text-text-primary">
              Services
            </Link>{" "}
            / <span className="text-text-primary">{service.shortName}</span>
          </nav>

          <div className="my-auto max-w-3xl py-14">
            <p
              className={`font-mono text-xs uppercase tracking-[0.22em] ${theme.eyebrow}`}
            >
              {service.heroEyebrow}
            </p>
            <AccentHeading
              text={service.heroHeadline}
              accent={service.heroAccent}
              className="mt-6 max-w-3xl"
            />
            <p className="mt-7 max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
              {service.valueProposition}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="/get-quote" size="lg">
                {service.cta.label}
              </Button>
              <Link
                href={`#${service.slug}-outcomes`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-text-primary transition hover:border-white/50 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
              >
                See the impact <span aria-hidden className="ml-2">↓</span>
              </Link>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-3">
            {service.heroStats.map((stat) => (
              <li key={stat.value} className="bg-black/60 px-5 py-4">
                <p className="font-heading text-sm font-medium text-text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-text-secondary">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className={`absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 bg-gradient-to-r ${theme.glow} blur-3xl`}
        />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <SectionLabel>{service.introLabel}</SectionLabel>
              <Heading as="h2" size="lg" className="mt-5 max-w-xl">
                {service.introHeading}
              </Heading>
            </div>
            <div className="space-y-6 text-base leading-8 text-text-secondary">
              {service.description.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? "text-xl text-text-primary" : undefined}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div id={`${service.slug}-outcomes`} className="scroll-mt-24 pt-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>What changes</SectionLabel>
                <Heading as="h2" size="md" className="mt-4 max-w-2xl">
                  Creative work measured by the difference it makes.
                </Heading>
              </div>
              <p className="max-w-md text-sm leading-6 text-text-secondary">
                Each outcome is designed into the strategy, the visual system,
                and the final production — not added as a line in the report.
              </p>
            </div>

            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {service.outcomes.map((outcome, index) => (
                <li
                  key={outcome.title}
                  className={`group overflow-hidden rounded-2xl border border-border bg-surface-elevated transition duration-300 ${theme.card}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                    <Image
                      src={assetPath(service.featureImages[index])}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span
                      className={`absolute bottom-4 left-4 font-mono text-xs ${theme.eyebrow}`}
                    >
                      0{index + 1}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-medium text-text-primary">
                      {outcome.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {outcome.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id={`${service.slug}-deliverables`}
        className="scroll-mt-24 border-y border-border bg-surface"
      >
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionLabel>Inside the engagement</SectionLabel>
          <Heading as="h2" size="md" className="mt-4 max-w-2xl">
            Everything needed to move from a strong idea to usable output.
          </Heading>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((item, index) => (
              <li
                key={item}
                className="group relative overflow-hidden rounded-xl border border-border bg-black/30 p-6 transition hover:-translate-y-1 hover:border-white/25"
              >
                <span
                  className={`absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition duration-300 group-hover:scale-x-100 ${theme.line}`}
                />
                <span className={`font-mono text-xs ${theme.eyebrow}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-10 text-sm leading-6 text-text-primary">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <SectionLabel>How it moves</SectionLabel>
            <Heading as="h2" size="md" className="mt-4">
              Clear decisions. Visible progress. No black box.
            </Heading>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2">
            {service.process.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border bg-surface-elevated p-6"
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-xs ${theme.eyebrow}`}>
                    0{index + 1}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h3 className="mt-8 font-heading text-xl font-medium text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {service.faqs.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionLabel>Useful answers</SectionLabel>
            <Heading as="h2" size="md" className="mt-4">
              Questions before we start?
            </Heading>
            <dl className="mt-10 divide-y divide-border border-y border-border">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="py-7">
                  <dt className="font-heading text-base font-medium text-text-primary">
                    {faq.question}
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-text-secondary">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <FinalCta
        heading={service.cta.heading}
        body={service.cta.body}
        primaryLabel={service.cta.label}
        secondaryLabel="Explore Our Work"
      />

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <SectionLabel>Keep exploring</SectionLabel>
              <Heading as="h2" size="md" className="mt-4">
                Related services
              </Heading>
            </div>
            <Link
              href="/services"
              className="hidden text-sm text-text-secondary transition hover:text-text-primary sm:inline"
            >
              View all services →
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <li
                key={item.slug}
                className="group overflow-hidden rounded-2xl border border-border bg-black/30"
              >
                <Link href={`/services/${item.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
                    <Image
                      src={assetPath(item.heroImage)}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-heading text-lg font-medium text-text-primary">
                      {item.shortName}
                    </h3>
                    <p className="mt-3 text-sm text-text-secondary">
                      Explore service <span aria-hidden>→</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

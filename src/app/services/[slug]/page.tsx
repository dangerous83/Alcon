import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/lib/content/services";
import { projects } from "@/lib/content/projects";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/content/site";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { generatedImages } from "@/lib/content/generated-images";

const serviceVisuals: Partial<
  Record<string, (typeof generatedImages)[keyof typeof generatedImages]>
> = {
  branding: generatedImages.brandingService,
  motion: generatedImages.motionService,
};

const brandingOutcomes = [
  {
    title: "Positioning that lands",
    description: "A clear market position and story your audience understands quickly.",
  },
  {
    title: "Identity that scales",
    description: "A distinctive visual and verbal system built for every touchpoint.",
  },
  {
    title: "Campaigns that connect",
    description: "Practical creative tools that turn the brand into consistent marketing.",
  },
];

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
  return {
    title: service.name,
    description: service.summary,
    keywords: service.keywords,
    alternates: { canonical: `${siteConfig.url}/services/${service.slug}` },
    openGraph: {
      title: service.name,
      description: service.summary,
      url: `${siteConfig.url}/services/${service.slug}`,
      type: "website",
      images:
        service.slug === "branding"
          ? [
              {
                url: `${siteConfig.url}/images/services/branding-hero-v2.webp`,
                width: 1681,
                height: 935,
                alt: "Strategic brand identity system illuminated in Alcon's electric blue and violet palette",
              },
            ]
          : undefined,
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
  const isBranding = service.slug === "branding";

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  // Related work only shows once real (non-placeholder) projects exist —
  // otherwise the section would be a grid of empty slots on every service
  // detail page, which reads as unfinished. Placeholder tiles live on the
  // Portfolio and Client Projects pages where they read intentionally.
  const relatedProjects = projects.filter(
    (project) => project.category === service.slug && !project.placeholder
  );

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

      {isBranding ? (
        <section className="relative isolate min-h-[720px] overflow-hidden border-b border-border lg:min-h-[780px]">
          <Image
            src="/images/services/branding-hero-v2.webp"
            alt="A premium brand identity system taking shape in glass, metal, electric blue, and violet light"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-[68%_center]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.96)_34%,rgba(0,0,0,0.74)_55%,rgba(0,0,0,0.12)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-t from-black to-transparent"
          />
          <div className="mx-auto flex min-h-[720px] max-w-7xl flex-col px-4 py-20 sm:px-6 lg:min-h-[780px] lg:px-8 lg:py-24">
            <nav aria-label="Breadcrumb" className="text-xs text-text-secondary">
              <Link href="/services" className="hover:text-text-primary">
                Services
              </Link>{" "}
              / <span className="text-text-primary">Branding</span>
            </nav>

            <div className="my-auto max-w-3xl py-16">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-accent">
                Branding agency Dubai · Strategy · Identity · Launch
              </p>
              <h1 className="mt-6 max-w-3xl font-heading text-5xl font-medium leading-[0.96] tracking-[-0.05em] text-text-primary sm:text-6xl lg:text-8xl">
                Build a brand they remember — and choose.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
                Alcon creates strategy-led brand identities, logo systems, and
                campaign toolkits for ambitious businesses across Dubai, the
                UAE, and the GCC. AI accelerates exploration; senior creative
                direction protects the idea.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button href="/get-quote" size="lg">
                  Start your brand transformation
                </Button>
                <Link
                  href="#branding-deliverables"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-text-primary transition hover:border-cyan-accent hover:text-cyan-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                >
                  See what you get <span aria-hidden className="ml-2">↓</span>
                </Link>
              </div>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-3">
              {[
                ["Dubai + GCC", "Market-aware strategy"],
                ["Human-directed AI", "More exploration, sharper decisions"],
                ["Campaign-ready", "A system your team can use"],
              ].map(([title, detail]) => (
                <li key={title} className="bg-black/55 px-5 py-4">
                  <p className="font-heading text-sm font-medium text-text-primary">
                    {title}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">{detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, rgba(40,112,255,0.4), transparent 50%), radial-gradient(circle at 10% 90%, rgba(209,45,255,0.3), transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-xs text-text-secondary">
              <Link href="/services" className="hover:text-text-primary">
                Services
              </Link>{" "}
              / <span className="text-text-primary">{service.shortName}</span>
            </nav>
            <SectionLabel className="mt-6">{service.shortName}</SectionLabel>
            <Heading as="h1" size="xl" className="mt-4 max-w-2xl">
              {service.name}
            </Heading>
            <p className="mt-4 max-w-xl text-lg text-text-secondary">
              {service.valueProposition}
            </p>
            <div className="mt-8">
              <Button href="/get-quote" size="lg">
                Start a {service.shortName.toLowerCase()} project
              </Button>
            </div>
          </div>
        </section>
      )}

      {isBranding ? (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <SectionLabel>Brand strategy + identity design</SectionLabel>
              <Heading as="h2" size="lg" className="mt-5 max-w-xl">
                More than a logo. A commercial identity system.
              </Heading>
              <p className="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
                Your brand should make the next campaign easier, the next sale
                more credible, and every customer touchpoint unmistakably yours.
              </p>
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

          <ul className="mt-20 grid gap-5 md:grid-cols-3">
            {brandingOutcomes.map((outcome, index) => (
              <li
                key={outcome.title}
                className="gradient-border rounded-2xl bg-surface-elevated p-7"
              >
                <span className="font-mono text-xs text-cyan-accent">
                  0{index + 1}
                </span>
                <h3 className="mt-10 font-heading text-xl font-medium text-text-primary">
                  {outcome.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {outcome.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              {service.description.map((paragraph) => (
                <p key={paragraph} className="text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
            {serviceVisuals[service.slug] ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={serviceVisuals[service.slug]!.src}
                  alt={serviceVisuals[service.slug]!.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <MediaFrame
                label={`${service.name} — hero image slot`}
                ratio="4/5"
              />
            )}
          </div>
        </section>
      )}

      <section
        id={isBranding ? "branding-deliverables" : undefined}
        className="scroll-mt-24 border-t border-border bg-surface"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Heading as="h2" size="md">
            {isBranding
              ? "Everything your brand needs to launch and grow"
              : "Deliverables"}
          </Heading>
          {isBranding && (
            <p className="mt-4 max-w-2xl text-text-secondary">
              A complete, usable brand system — tailored to your business,
              channels, and growth plan.
            </p>
          )}
          <ul
            className={`mt-10 grid gap-4 sm:grid-cols-2 ${
              isBranding ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {service.deliverables.map((item, index) => (
              <li
                key={item}
                className={
                  isBranding
                    ? "rounded-xl border border-border bg-black/30 p-5 text-sm leading-6 text-text-secondary"
                    : "border-t border-border pt-4 text-sm text-text-secondary"
                }
              >
                {isBranding && (
                  <span className="mb-8 block font-mono text-xs text-cyan-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Heading as="h2" size="md">
          {isBranding ? "From market signal to market-ready system" : "Process"}
        </Heading>
        {isBranding && (
          <p className="mt-4 max-w-2xl text-text-secondary">
            Four focused phases keep the work strategic, collaborative, and
            moving toward a confident launch.
          </p>
        )}
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, index) => (
            <li
              key={step.title}
              className={
                isBranding
                  ? "rounded-2xl border border-border bg-surface-elevated p-6"
                  : undefined
              }
            >
              <span className="font-mono text-xs text-text-secondary">
                0{index + 1}
              </span>
              <h3 className="mt-2 font-heading text-base font-medium text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {relatedProjects.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Heading as="h2" size="md">
              Related work
            </Heading>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <li key={project.slug}>
                  <MediaFrame
                    label={`${project.title} — placeholder visual`}
                    ratio="4/5"
                  />
                  <h3 className="mt-3 font-heading text-sm font-medium text-text-primary">
                    {project.title}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Heading as="h2" size="md">
            {isBranding ? "Questions before we start?" : "Frequently asked"}
          </Heading>
          <dl className="mt-8 space-y-6">
            {service.faqs.map((faq) => (
              <div key={faq.question} className="border-t border-border pt-6">
                <dt className="font-heading text-base font-medium text-text-primary">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm text-text-secondary">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {isBranding && (
        <section className="border-y border-border">
          <div className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 15% 100%, rgba(40,112,255,0.5), transparent 38%), radial-gradient(circle at 85% 0%, rgba(209,45,255,0.35), transparent 42%)",
              }}
            />
            <div className="relative mx-auto max-w-4xl text-center">
              <SectionLabel>Ready when you are</SectionLabel>
              <Heading as="h2" size="lg" className="mt-5">
                Your next chapter deserves a brand built for it.
              </Heading>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
                Tell us where the business is going. We’ll show you the brand
                strategy, identity, and launch system that can take it there.
              </p>
              <div className="mt-10">
                <Button href="/get-quote" size="lg">
                  Request a branding proposal
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Heading as="h2" size="md">
            Related services
          </Heading>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <Card as="li" key={item.slug}>
                <h3 className="font-heading text-base font-medium text-text-primary">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {item.summary}
                </p>
                <Link
                  href={`/services/${item.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                >
                  Learn more <span aria-hidden>→</span>
                </Link>
              </Card>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

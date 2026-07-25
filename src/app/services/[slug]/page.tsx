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
    alternates: { canonical: `${siteConfig.url}/services/${service.slug}` },
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

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const relatedProjects = projects.filter(
    (project) => project.category === service.slug
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
              label={`${service.name} — placeholder visual`}
              ratio="4/5"
            />
          )}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Heading as="h2" size="md">
            Deliverables
          </Heading>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="border-t border-border pt-4 text-sm text-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Heading as="h2" size="md">
          Process
        </Heading>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, index) => (
            <li key={step.title}>
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
            Frequently asked
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

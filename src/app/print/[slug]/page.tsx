import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Heading } from "@/components/ui/Heading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getPrintProduct, printProducts } from "@/lib/content/print";
import { siteConfig } from "@/lib/content/site";
import { assetPath } from "@/lib/asset-path";

export function generateStaticParams() {
  return printProducts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getPrintProduct(slug);
  if (!product) return {};

  const url = `${siteConfig.url}/print/${product.slug}`;
  const image = `${siteConfig.url}${product.heroImage}`;
  return {
    title: `${product.name} Dubai`,
    description: product.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} Dubai | Alcon`,
      description: product.summary,
      url,
      type: "website",
      images: [{ url: image, width: 1600, height: 900, alt: product.heroAlt }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function PrintProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getPrintProduct(slug);
  if (!product) notFound();

  const related = product.related
    .map(getPrintProduct)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main>
      <PageHero
        eyebrow={product.eyebrow}
        headline={product.headline}
        accent={product.accent}
        description={product.summary}
        image={product.heroImage}
        imageAlt={product.heroAlt}
        primaryLabel="Request a quote"
        primaryHref="/get-quote"
        secondaryLabel="Explore all print"
        secondaryHref="/print"
        stats={product.stats}
      />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionLabel>{product.name}</SectionLabel>
            <Heading as="h2" size="lg" className="mt-5 max-w-xl">
              {product.introHeading}
            </Heading>
          </div>
          <div className="space-y-6 text-base leading-8 text-text-secondary">
            {product.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "text-xl text-text-primary" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <ul className="mt-20 grid gap-5 md:grid-cols-3">
          {product.capabilities.map((capability, index) => (
            <li key={capability.title} className="group overflow-hidden rounded-2xl border border-border bg-surface-elevated">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                <Image
                  src={assetPath(capability.image)}
                  alt={`${capability.title} for ${product.name}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-xs text-cyan-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-medium text-text-primary">{capability.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{capability.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-8">
          <div>
            <SectionLabel>Production-ready outputs</SectionLabel>
            <Heading as="h2" size="md" className="mt-4">
              Everything needed to move from idea to item.
            </Heading>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {product.deliverables.map((item, index) => (
              <li key={item} className="rounded-xl border border-border bg-black/30 p-6">
                <span className="font-mono text-xs text-fuchsia-400">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-8 text-sm text-text-primary">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <SectionLabel>Keep exploring</SectionLabel>
              <Heading as="h2" size="md" className="mt-4">Related print products</Heading>
            </div>
            <Link href="/print" className="hidden text-sm text-text-secondary hover:text-text-primary sm:inline">
              View all print →
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug} className="group overflow-hidden rounded-2xl border border-border bg-black/30">
                <Link href={`/print/${item.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
                    <Image
                      src={assetPath(item.heroImage)}
                      alt={item.heroAlt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
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
        heading={product.ctaHeading}
        body={product.ctaBody}
        secondaryLabel="Explore All Print"
        secondaryHref="/print"
      />
    </main>
  );
}

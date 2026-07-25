import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/lib/content/blog";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { siteConfig } from "@/lib/content/site";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteConfig.url}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = post.content.filter((block) => block.heading);
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            blogPostingJsonLd({
              title: post.title,
              description: post.excerpt,
              url: `${siteConfig.url}/blog/${post.slug}`,
              datePublished: post.publishedAt,
              author: post.author,
            }),
            breadcrumbJsonLd([
              { name: "Home", url: siteConfig.url },
              { name: "Journal", url: `${siteConfig.url}/blog` },
              { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
            ]),
          ]),
        }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-text-secondary">
        <Link href="/blog" className="hover:text-text-primary">
          Journal
        </Link>{" "}
        / <span className="text-text-primary">{post.title}</span>
      </nav>

      <SectionLabel className="mt-6">{post.category}</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4">
        {post.title}
      </Heading>
      <p className="mt-4 text-sm text-text-secondary">
        <time dateTime={post.publishedAt}>{post.publishedAt}</time> ·{" "}
        {post.readingTimeMinutes} min read · {post.author}
      </p>

      {headings.length > 1 && (
        <nav
          aria-label="Table of contents"
          className="mt-10 rounded-2xl border border-border bg-surface p-6"
        >
          <p className="font-heading text-sm font-medium text-text-primary">
            In this article
          </p>
          <ul className="mt-3 space-y-2">
            {headings.map((block) => (
              <li key={block.heading}>
                <a
                  href={`#${slugify(block.heading!)}`}
                  className="text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                >
                  {block.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="prose-content mt-10 space-y-6">
        {post.content.map((block, index) => (
          <div key={index}>
            {block.heading && (
              <h2
                id={slugify(block.heading)}
                className="font-heading text-2xl font-medium text-text-primary"
              >
                {block.heading}
              </h2>
            )}
            <p className="mt-3 text-base leading-relaxed text-text-secondary">
              {block.body}
            </p>
          </div>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-border pt-10">
          <p className="font-heading text-sm font-medium text-text-primary">
            Related articles
          </p>
          <ul className="mt-4 space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

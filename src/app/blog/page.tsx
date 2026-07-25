import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/content/blog";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on branding, motion, and creative production from the Alcon team.",
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionLabel>Journal</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4">
        Notes on creative work.
      </Heading>

      <ul className="mt-16 space-y-6">
        {blogPosts.map((post) => (
          <Card as="li" key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent rounded-xl"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-accent">
                {post.category}
              </span>
              <h2 className="mt-3 font-heading text-xl font-medium text-text-primary">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {post.excerpt}
              </p>
              <p className="mt-4 text-xs text-text-secondary">
                {post.readingTimeMinutes} min read · {post.author}
              </p>
            </Link>
          </Card>
        ))}
      </ul>
    </div>
  );
}

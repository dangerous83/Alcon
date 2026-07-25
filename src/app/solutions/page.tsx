import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { navPages } from "@/lib/content/nav-pages";
import { siteConfig } from "@/lib/content/site";

const page = navPages.solutions;

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: { canonical: `${siteConfig.url}/solutions` },
};

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionLabel>{page.eyebrow}</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4">
        {page.title}
      </Heading>
      <p className="mt-4 text-lg text-text-secondary">{page.summary}</p>
      <div className="mt-8 space-y-4">
        {page.body.map((paragraph) => (
          <p key={paragraph} className="text-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-10">
        <Button href="/get-quote">Talk to us about a project</Button>
      </div>
    </div>
  );
}

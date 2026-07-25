import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { clientSubPages } from "@/lib/content/nav-pages";
import { siteConfig } from "@/lib/content/site";

const page = clientSubPages.website;

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: { canonical: `${siteConfig.url}/client-projects/website` },
};

export default function ClientProjectsWebsitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-text-secondary">
        <Link href="/client-projects" className="hover:text-text-primary">
          Clients
        </Link>{" "}
        / <span className="text-text-primary">Website</span>
      </nav>
      <SectionLabel className="mt-6">{page.eyebrow}</SectionLabel>
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
      <Link
        href="/client-projects"
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
      >
        View all work <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

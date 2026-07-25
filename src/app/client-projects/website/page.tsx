import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { clientWebsiteLinks } from "@/lib/content/mega-menu";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Website Work",
  description: "Marketing sites and web experiences built by Alcon.",
  alternates: { canonical: `${siteConfig.url}/client-projects/website` },
};

export default function ClientProjectsWebsitePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-text-secondary">
        <Link href="/client-projects" className="hover:text-text-primary">
          Clients
        </Link>{" "}
        / <span className="text-text-primary">Website</span>
      </nav>
      <SectionLabel className="mt-6">Clients / Website</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4">
        Website Work
      </Heading>
      <p className="mt-4 max-w-2xl text-lg text-text-secondary">
        Live marketing sites and web experiences. Each link opens the real,
        deployed project.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {clientWebsiteLinks.map((item) => (
          <Card as="li" key={item.url} className="p-5">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
            >
              <span className="font-heading text-base font-medium text-text-primary">
                {item.label}
              </span>
              <ExternalLink
                size={16}
                strokeWidth={1.75}
                aria-hidden
                className="shrink-0 text-text-secondary transition-colors group-hover:text-cyan-accent"
              />
            </a>
          </Card>
        ))}
      </ul>
    </div>
  );
}

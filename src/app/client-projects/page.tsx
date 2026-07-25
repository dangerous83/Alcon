import type { Metadata } from "next";
import { ProjectBrowser } from "@/components/sections/ProjectBrowser";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Client Projects",
  description:
    "Selected work from Alcon — a Dubai-based creative agency working across branding, motion, editing, and social.",
  alternates: { canonical: `${siteConfig.url}/client-projects` },
};

export default function ClientProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <SectionLabel>Selected work</SectionLabel>
      <Heading as="h1" size="xl" className="mt-4 max-w-2xl">
        Work chosen for range, not just polish.
      </Heading>
      <p className="mt-4 max-w-2xl text-text-secondary">
        A cross-section of recent projects across the studio's core
        disciplines.
      </p>
      <ProjectBrowser />
    </div>
  );
}

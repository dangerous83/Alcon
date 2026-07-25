import Link from "next/link";
import { projects } from "@/lib/content/projects";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Button } from "@/components/ui/Button";

export function FeaturedProjects() {
  const featured = projects.slice(0, 3);
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <SectionLabel>Selected work</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            Recent work, chosen for range.
          </Heading>
        </div>
        <Button href="/client-projects" variant="secondary">
          View all work
        </Button>
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/client-projects#${project.slug}`}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent rounded-2xl"
            >
              <MediaFrame
                label={`${project.title} — placeholder visual`}
                ratio="4/5"
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              />
              <h3 className="mt-4 font-heading text-base font-medium text-text-primary">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {project.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

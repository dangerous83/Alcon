import Link from "next/link";
import { Plus } from "lucide-react";
import { projects, projectCategories } from "@/lib/content/projects";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";

const categoryLabel = (slug: string) =>
  projectCategories.find((c) => c.slug === slug)?.label ?? "";

/**
 * Featured work grid on the homepage.
 *
 * Right now every project entry is a `placeholder: true` slot, so cards
 * render as visibly-empty "add project" tiles rather than fabricated case
 * studies. Once real projects exist in projects.ts (placeholder: false or
 * omitted) the same component renders them as finished project cards with
 * an image, title, and summary.
 */
export function FeaturedProjects() {
  const featured = projects.slice(0, 3);
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <SectionLabel>Selected work</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            A living portfolio, built as we ship.
          </Heading>
          <p className="mt-4 text-text-secondary">
            Featured project slots below — each one waiting on a live
            client case study. Full portfolio index lives one click away.
          </p>
        </div>
        <Button href="/client-projects" variant="secondary">
          View all work
        </Button>
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => {
          const isPlaceholder = project.placeholder;
          const label = categoryLabel(project.category);
          return (
            <li key={project.slug}>
              <Link
                href={`/client-projects#${project.slug}`}
                aria-label={
                  isPlaceholder
                    ? `${label} project slot — pending`
                    : project.title
                }
                className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
              >
                <div
                  className={clsx(
                    "relative overflow-hidden rounded-2xl border border-dashed border-white/15 bg-surface-elevated/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/30 group-hover:bg-surface-elevated/70"
                  )}
                  style={{ aspectRatio: "4 / 5" }}
                  role="img"
                  aria-hidden
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "radial-gradient(circle at 75% 30%, rgba(40,112,255,0.35), transparent 55%), radial-gradient(circle at 25% 80%, rgba(209,45,255,0.25), transparent 55%)",
                    }}
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-background/50 text-text-primary transition-colors duration-500 group-hover:border-white/50">
                      <Plus size={20} strokeWidth={2} aria-hidden />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary">
                      {label} slot
                    </span>
                  </div>
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary/70">
                    Project pending
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-base font-medium text-text-primary">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {project.summary}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { projects, projectCategories } from "@/lib/content/projects";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { clsx } from "@/lib/clsx";

/**
 * Client-projects browser. Renders finished projects as normal cards and
 * placeholder entries as visibly-empty "add case study" slots — same
 * visual language as the homepage featured grid, so both surfaces read as
 * intentional placeholders rather than half-built pages.
 */
export function ProjectBrowser() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const categoryLabel = (slug: string) =>
    projectCategories.find((c) => c.slug === slug)?.label ?? "";

  return (
    <div className="mt-12">
      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        <FilterButton
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        >
          All
        </FilterButton>
        {projectCategories.map((category) => (
          <FilterButton
            key={category.slug}
            active={activeCategory === category.slug}
            onClick={() => setActiveCategory(category.slug)}
          >
            {category.label}
          </FilterButton>
        ))}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, index) => {
          if (project.placeholder) {
            const label = categoryLabel(project.category);
            return (
              <li key={project.slug} id={project.slug}>
                <div
                  role="img"
                  aria-label={`${label} project slot — pending upload`}
                  className="relative overflow-hidden rounded-2xl border border-dashed border-white/15 bg-surface-elevated/40 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/30 hover:bg-surface-elevated/70"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "radial-gradient(circle at 75% 30%, rgba(40,112,255,0.35), transparent 55%), radial-gradient(circle at 25% 80%, rgba(209,45,255,0.25), transparent 55%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-background/50 text-text-primary">
                      <Plus size={20} strokeWidth={2} aria-hidden />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary">
                      {label} slot
                    </span>
                  </div>
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary/70">
                    Slot 0{index + 1}
                  </span>
                </div>
                <div className="mt-4">
                  <h2 className="font-heading text-base font-medium text-text-primary">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    {project.summary}
                  </p>
                </div>
              </li>
            );
          }

          return (
            <li key={project.slug} id={project.slug}>
              <div className="group focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-cyan-accent rounded-2xl">
                <MediaFrame
                  label={`${project.title} — hero image`}
                  ratio="4/5"
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-heading text-base font-medium text-text-primary">
                      {project.title}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      {project.summary}
                    </p>
                  </div>
                  {project.externalUrl && (
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 shrink-0 text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                      aria-label={`Open ${project.title} (opens in a new tab)`}
                    >
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-text-secondary">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent",
        active
          ? "border-transparent bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] text-text-primary"
          : "border-border text-text-secondary hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}

"use client";

import { useState } from "react";
import { Check, ChevronRight, Layers3, Sparkles } from "lucide-react";
import { services } from "@/lib/content/services";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";

export function QuoteBuilder() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string) {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  }

  const selectedServices = services.filter((service) => selected.includes(service.slug));

  function continueToForm() {
    document.getElementById("project-details")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <SectionLabel>Build your project stack</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            Choose the capabilities your idea needs.
          </Heading>
          <p className="mt-5 max-w-2xl text-text-secondary">
            Select one service or combine a complete team. We will use your
            choices to shape the right scope—not inflate the package.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_0.72fr] lg:items-start">
          <ul className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => {
              const active = selected.includes(service.slug);
              return (
                <li key={service.slug}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(service.slug)}
                    className={clsx(
                      "quote-service-card group relative flex min-h-40 w-full overflow-hidden rounded-2xl border p-5 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent",
                      active
                        ? "-translate-y-1 border-cyan-accent/60 bg-blue-500/10 shadow-[0_18px_60px_rgba(40,112,255,0.18)]"
                        : "border-border bg-surface-elevated hover:-translate-y-1 hover:border-white/25"
                    )}
                  >
                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/70 to-transparent opacity-0 transition group-hover:opacity-100" />
                    <span className="flex flex-1 flex-col">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                        {String(index + 1).padStart(2, "0")} · {service.category}
                      </span>
                      <span className="mt-7 font-heading text-xl font-medium text-text-primary">
                        {service.shortName}
                      </span>
                      <span className="mt-2 text-sm leading-6 text-text-secondary">
                        {service.summary}
                      </span>
                    </span>
                    <span
                      className={clsx(
                        "ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                        active
                          ? "border-cyan-accent bg-cyan-accent text-black"
                          : "border-white/20 text-text-secondary group-hover:border-white/50"
                      )}
                    >
                      {active ? <Check size={16} aria-hidden /> : <span aria-hidden>+</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="sticky top-28 overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-blue-950/20">
            <div className="flex items-center justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 text-white">
                <Layers3 size={19} aria-hidden />
              </span>
              <span className="font-mono text-xs text-cyan-accent">
                {String(selected.length).padStart(2, "0")} selected
              </span>
            </div>
            <Heading as="h3" size="sm" className="mt-6">Your project stack</Heading>
            {selectedServices.length === 0 ? (
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Select services to build a focused project brief.
              </p>
            ) : (
              <ul className="mt-5 space-y-2">
                {selectedServices.map((service) => (
                  <li key={service.slug} className="flex items-center gap-2 text-sm text-text-primary">
                    <Check size={14} className="text-cyan-accent" aria-hidden />
                    {service.shortName}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-2 text-sm text-text-primary">
                <Sparkles size={15} className="text-fuchsia-400" aria-hidden />
                Scope before pricing
              </div>
              <p className="mt-2 text-xs leading-5 text-text-secondary">
                We price the outcome, complexity, and timeline after reviewing
                your brief. No misleading instant total.
              </p>
            </div>

            <Button
              type="button"
              size="lg"
              className="mt-6 w-full"
              disabled={selected.length === 0}
              onClick={continueToForm}
            >
              Continue with {selected.length || "services"}
              <ChevronRight size={17} aria-hidden />
            </Button>
          </aside>
        </div>
      </section>

      <section id="project-details" className="scroll-mt-24 border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8 lg:py-32">
          <div>
            <SectionLabel>Complete the brief</SectionLabel>
            <Heading as="h2" size="lg" className="mt-4">
              Turn the selection into a real proposal.
            </Heading>
            <p className="mt-5 text-text-secondary">
              Add the goal, timing, and context. You will receive clear next
              steps from the studio, usually within one business day.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-black/30 p-6 sm:p-8">
            <QuoteForm selectedServices={selectedServices.map((service) => service.shortName)} />
          </div>
        </div>
      </section>
    </>
  );
}

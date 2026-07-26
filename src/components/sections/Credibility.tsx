import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

/**
 * No client-supplied testimonials, quotes, or metrics were available at
 * build time (see docs/content-changes.md) — this section states working
 * principles rather than inventing numbers or attributed quotes. Replace
 * with real testimonials once migrated from the source site.
 */
const principles = [
  {
    title: "Direct access to the people doing the work",
    description:
      "No account-manager layer between the brief and the designer. Feedback goes straight to the team producing the work.",
  },
  {
    title: "One system, not a pile of one-off assets",
    description:
      "Every deliverable is built against the same brand system, so nothing you get feels like it came from a different agency.",
  },
  {
    title: "AI where it earns its place",
    description:
      "AI tooling speeds up production and exploration; every output is reviewed and finished by a human before it ships.",
  },
];

export function Credibility() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>Why Alcon</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            Built to be a dependable creative partner.
          </Heading>
        </div>
        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {principles.map((principle) => (
            <Card as="li" key={principle.title}>
              <h3 className="font-heading text-lg font-medium text-text-primary">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm text-text-secondary">
                {principle.description}
              </p>
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";

const steps = [
  {
    title: "Understand",
    description:
      "Strategy sessions and audience research define what the brand needs to prove and to whom.",
  },
  {
    title: "Direct",
    description:
      "A creative direction is locked before production starts, so every asset pulls in one direction.",
  },
  {
    title: "Produce with AI-accelerated tooling",
    description:
      "Design, motion, and content production move faster with AI-assisted workflows — always reviewed and finished by the creative team, never shipped unchecked.",
  },
  {
    title: "Refine and ship",
    description:
      "Work is tested against the original goal, refined, and delivered production-ready.",
  },
];

export function CreativeProcess() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel>How we work</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            An AI-enhanced creative process, led by people.
          </Heading>
        </div>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="relative pl-6">
              <span
                aria-hidden
                className="absolute left-0 top-1 h-full w-px bg-[linear-gradient(180deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] opacity-40"
              />
              <span className="font-mono text-xs text-text-secondary">
                0{index + 1}
              </span>
              <h3 className="mt-2 font-heading text-lg font-medium text-text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

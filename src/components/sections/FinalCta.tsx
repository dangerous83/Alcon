import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

type FinalCtaProps = {
  heading?: ReactNode;
  body?: ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function FinalCta({
  heading = "Ready to build the brand people remember?",
  body = "Tell us about the project and we'll follow up with next steps — usually within one business day.",
  primaryLabel = "Start a Project",
  primaryHref = "/get-quote",
  secondaryLabel = "Explore Our Work",
  secondaryHref = "/portfolio",
}: FinalCtaProps = {}) {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(40,112,255,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(209,45,255,0.3), transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <Heading as="h2" size="lg">
          {heading}
        </Heading>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href={primaryHref} size="lg">
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} variant="secondary" size="lg">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

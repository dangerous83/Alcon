import { Heading } from "@/components/ui/Heading";

/**
 * The positioning statement's words, with no section chrome of its own.
 *
 * Shared so it reads identically in both places it appears: overlaid on the
 * right of the hero's third clip (where the brain sits left and the Dubai
 * skyline resolves inside it), and as the standalone centred section that
 * reduced-motion visitors get instead of the scrub. One copy, so the two
 * cannot drift apart.
 */
export function PositioningCopy({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Heading as="h2" size="lg" className="text-balance">
        Alcon is a Dubai-based creative agency for brands that need to move
        fast without losing their{" "}
        <span className="text-gradient">point of view</span>.
      </Heading>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
        We work as an embedded creative partner — combining strategy,
        design, and AI-accelerated production to take a brand from a clear
        idea to a finished, high-performing experience.
      </p>
    </div>
  );
}

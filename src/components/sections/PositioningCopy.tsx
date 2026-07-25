import { Heading } from "@/components/ui/Heading";
import { clsx } from "@/lib/clsx";

/**
 * The positioning statement's words, with no section chrome of its own.
 *
 * Shared so it reads identically in both places it appears: left-aligned in
 * a side column beside the hero's third clip (where the brain sits left and
 * the Dubai skyline resolves inside it), and centred as the standalone
 * section that reduced-motion visitors get instead of the scrub. One copy,
 * so the two cannot drift apart.
 */
export function PositioningCopy({
  className,
  align = "left",
}: {
  className?: string;
  /** Centring is only for the standalone section; the overlay reads left. */
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={clsx(centered ? "text-center" : "text-left", className)}>
      <Heading as="h2" size="lg" className="text-balance">
        Alcon is a Dubai-based creative agency for brands that need to move
        fast without losing their{" "}
        <span className="text-gradient">point of view</span>.
      </Heading>
      <p
        className={clsx(
          "mt-6 max-w-2xl text-lg text-text-secondary",
          centered && "mx-auto"
        )}
      >
        We work as an embedded creative partner — combining strategy,
        design, and AI-accelerated production to take a brand from a clear
        idea to a finished, high-performing experience.
      </p>
    </div>
  );
}

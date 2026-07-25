import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";

/**
 * The positioning statement, with no section chrome of its own.
 *
 * Shared so it reads identically in both places it appears: left-aligned in
 * a side column beside the hero's third clip (where the brain sits left and
 * the Dubai skyline resolves inside it), and centred as the standalone
 * section that reduced-motion visitors get instead of the scrub. One copy,
 * so the two cannot drift apart.
 *
 * Kept deliberately short. The video runs full-bleed, so the brain occupies
 * roughly the left three-quarters of the frame and this copy has to live in
 * what is left — a longer heading either wrapped into the artwork or forced
 * the video to be scaled down, which letterboxed the frame.
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
      {/* text-balance only when centred. Left-aligned, it shortens the
          heading's lines while the paragraph still fills the column, so the
          two blocks' right edges disagree and the whole thing reads
          misaligned. Letting both wrap to the same column width lines them
          up. */}
      <Heading as="h2" size="lg" className={clsx(centered && "text-balance")}>
        Dubai-based creative, built for{" "}
        {/* Same calligraphy accent as the hero headlines — see
            .heading-accent in globals.css. */}
        <em className="heading-accent">speed</em>.
      </Heading>
      <p className={clsx("mt-5 text-lg text-text-secondary", centered && "mx-auto max-w-2xl")}>
        Strategy, design, and AI-accelerated production in one embedded team.
      </p>
      <div className={clsx("mt-7 flex", centered && "justify-center")}>
        <Button href="/get-quote">Get in Touch</Button>
      </div>
    </div>
  );
}

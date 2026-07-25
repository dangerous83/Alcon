import { PositioningCopy } from "@/components/sections/PositioningCopy";

/**
 * Standalone centred version of the positioning statement.
 *
 * The motion build shows this copy overlaid on the hero's third clip
 * instead, so this section is rendered only on the reduced-motion path —
 * see StaticHero in ScrollVideoHero.tsx. Keeping it out of the normal page
 * flow avoids showing the same sentence twice in a row.
 */
export function PositioningStatement() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
      <PositioningCopy />
    </section>
  );
}

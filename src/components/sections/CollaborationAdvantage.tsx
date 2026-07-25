import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { generatedImages } from "@/lib/content/generated-images";

export function CollaborationAdvantage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionLabel>Direct collaboration</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            Work with the studio, not a layer of process.
          </Heading>
          <p className="mt-4 text-text-secondary">
            Being based in Dubai and staying intentionally small means
            decisions move fast: a call replaces a status deck, and changes
            get made in the same week they're requested.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-text-secondary">
            <li className="border-t border-border pt-4">
              A single point of contact for the full project, from strategy
              to delivery.
            </li>
            <li className="border-t border-border pt-4">
              Review cycles built around real conversations, not ticket
              queues.
            </li>
            <li className="border-t border-border pt-4">
              Production capacity across branding, motion, editing, and
              social — coordinated by one team.
            </li>
          </ul>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
          <Image
            src={generatedImages.collaboration.src}
            alt={generatedImages.collaboration.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

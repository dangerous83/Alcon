import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { generatedImages } from "@/lib/content/generated-images";

const capabilities = [
  "Brand strategy & positioning",
  "Identity systems & guidelines",
  "Motion design & animation",
  "Video production & editing",
  "Social content & community",
  "AI-accelerated production workflows",
  "Digital product & UI direction",
  "Campaign concepting",
];

export function Capabilities() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <SectionLabel>Capabilities</SectionLabel>
          <Heading as="h2" size="lg" className="mt-4">
            Everything a modern brand needs, under one roof.
          </Heading>
          <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {capabilities.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-t border-border pt-4 text-sm text-text-secondary"
              >
                <span
                  aria-hidden
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[linear-gradient(110deg,#2870FF_0%,#D12DFF_100%)]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
          <Image
            src={generatedImages.homepageFeatured.src}
            alt={generatedImages.homepageFeatured.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

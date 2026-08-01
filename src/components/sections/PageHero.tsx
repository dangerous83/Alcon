import Image from "next/image";
import { AccentHeading } from "@/components/ui/AccentHeading";
import { Button } from "@/components/ui/Button";
import { assetPath } from "@/lib/asset-path";

type PageHeroProps = {
  eyebrow: string;
  headline: string;
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  stats?: { value: string; label: string }[];
  animated?: boolean;
};

export function PageHero({
  eyebrow,
  headline,
  accent,
  description,
  image,
  imageAlt,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  stats,
  animated = false,
}: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden border-b border-border lg:min-h-[760px]">
      <Image
        src={assetPath(image)}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-center"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.98)_34%,rgba(0,0,0,0.76)_58%,rgba(0,0,0,0.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-fuchsia-500/20 via-blue-500/10 to-transparent" />

      {animated && (
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <span className="quote-orbit quote-orbit-one" />
          <span className="quote-orbit quote-orbit-two" />
          <span className="quote-scan" />
        </div>
      )}

      <div className="mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:min-h-[760px] lg:px-8">
        <div className="max-w-3xl py-10">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-accent">
            {eyebrow}
          </p>
          <AccentHeading
            text={headline}
            accent={accent}
            className="mt-6 max-w-3xl"
          />
          <p className="mt-7 max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
            {description}
          </p>
          {(primaryLabel || secondaryLabel) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {primaryLabel && primaryHref && (
                <Button href={primaryHref} size="lg">{primaryLabel}</Button>
              )}
              {secondaryLabel && secondaryHref && (
                <Button href={secondaryHref} variant="secondary" size="lg">
                  {secondaryLabel}
                </Button>
              )}
            </div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <ul className="mt-auto grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-3">
            {stats.map((stat) => (
              <li key={stat.value} className="bg-black/60 px-5 py-4">
                <p className="font-heading text-sm font-medium text-text-primary">{stat.value}</p>
                <p className="mt-1 text-xs text-text-secondary">{stat.label}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { revealCards } from "@/lib/content/reveal";
import { clsx } from "@/lib/clsx";

/**
 * HUD readout that overlays the hero once the scroll-scrub lands on the
 * front-view brain: three node cards on the left wired into the centre of
 * the frame, a data panel on the right, and the Continue Journey gate
 * beneath. Purely presentational — the scroll gate and the visibility
 * trigger live in ScrollVideoHero, which owns the scroll position.
 */
export function HeroReveal({
  visible,
  onContinue,
  /** Static variant drops the entrance animation and the fixed overlay frame. */
  variant = "overlay",
}: {
  visible: boolean;
  onContinue: () => void;
  variant?: "overlay" | "static";
}) {
  const [activeCard, setActiveCard] = useState(0);
  const card = revealCards[activeCard];
  const Icon = card.icon;
  const isOverlay = variant === "overlay";

  return (
    <div
      data-testid="hero-reveal"
      className={clsx(
        "z-20 flex w-full flex-col justify-center",
        isOverlay && "absolute inset-0 px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-16",
        isOverlay &&
          "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isOverlay && !visible && "pointer-events-none translate-y-6 opacity-0",
        isOverlay && visible && "translate-y-0 opacity-100"
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,26rem)] lg:gap-8">
          {/* Left: node cards, each wired toward the centre of the frame. */}
          {/* Three across on small screens, stacked plates from lg up: the
              full-height plate column can't fit a phone viewport alongside
              the readout, and this HUD must never scroll internally. */}
          <div
            role="tablist"
            aria-label="Explore Alcon"
            className="grid grid-cols-3 gap-2 lg:flex lg:flex-col lg:gap-3"
          >
            {revealCards.map((c, i) => {
              const CardIcon = c.icon;
              const isActive = i === activeCard;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCard(i)}
                  className={clsx(
                    "group relative flex flex-col items-start gap-1.5 border px-2.5 py-2.5 text-left backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet lg:flex-row lg:items-center lg:gap-3 lg:px-4 lg:py-3",
                    // Clipped corner reads as a HUD plate rather than a card.
                    "[clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]",
                    isActive
                      ? "border-violet/70 bg-violet/[0.12] shadow-[0_0_26px_-6px_rgba(113,56,255,0.6)]"
                      : "border-white/15 bg-black/50 hover:border-violet/45 hover:bg-black/70"
                  )}
                >
                  {/* Wire running from the plate toward the brain. */}
                  <span
                    aria-hidden
                    className={clsx(
                      "pointer-events-none absolute left-full top-1/2 hidden h-px transition-all duration-500 lg:block",
                      isActive
                        ? "w-10 bg-gradient-to-r from-magenta to-transparent opacity-100"
                        : "w-6 bg-gradient-to-r from-white/30 to-transparent opacity-60"
                    )}
                  />
                  <span
                    aria-hidden
                    className={clsx(
                      "flex h-7 w-7 shrink-0 items-center justify-center border transition-colors lg:h-9 lg:w-9",
                      isActive
                        ? "border-violet/60 bg-violet/15 text-magenta"
                        : "border-white/20 text-white/60 group-hover:text-violet"
                    )}
                  >
                    <CardIcon size={16} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "block font-mono text-[10px] tracking-[0.2em] transition-colors",
                        isActive ? "text-magenta" : "text-white/40"
                      )}
                    >
                      {c.code}
                    </span>
                    <span className="block font-heading text-xs font-semibold leading-tight text-white lg:truncate lg:text-sm">
                      {c.label}
                    </span>
                  </span>
                  <ChevronRight
                    size={14}
                    strokeWidth={2}
                    aria-hidden
                    className={clsx(
                      "hidden shrink-0 transition-all lg:block",
                      isActive
                        ? "translate-x-0 text-magenta opacity-100"
                        : "-translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Middle column stays empty on desktop so the brain reads through
              the centre of the frame, exactly as in the reference sketch. */}
          <div aria-hidden className="hidden lg:block" />

          {/* Right: the data readout for whichever node is selected. */}
          <div
            role="tabpanel"
            aria-live="polite"
            className="relative border border-violet/35 bg-black/65 p-4 backdrop-blur-md sm:p-5 lg:p-6 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]"
          >
            {/* Brand gradient hairline — the panel's strongest colour cue. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,#2870FF_20%,#7138FF_50%,#D12DFF_80%,transparent_100%)]"
            />

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-magenta">
                {/* The one deliberate cyan note left in the panel: a live
                    status light reads as an indicator, not as a theme. */}
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-accent opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-accent" />
                </span>
                {card.code} // ONLINE
              </span>
              <Icon size={16} strokeWidth={1.75} aria-hidden className="text-violet" />
            </div>

            <h2 className="mt-3 font-heading text-base font-bold leading-tight text-white sm:text-xl lg:mt-4 lg:text-2xl">
              {card.heading}
            </h2>
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-white/65 sm:line-clamp-none sm:text-sm lg:mt-3">
              {card.description}
            </p>

            <dl className="mt-3 grid grid-cols-3 gap-px overflow-hidden border border-white/10 bg-white/10 lg:mt-5">
              {card.metrics.map((metric) => (
                <div key={metric.label} className="bg-black/70 px-3 py-2.5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                    {metric.label}
                  </dt>
                  {/* Violet -> magenta rather than the full brand gradient:
                      each value clips the ramp across its own narrow box, so
                      a two-character figure would otherwise sample only the
                      blue end and read as a blue number. */}
                  <dd className="mt-1 bg-[linear-gradient(110deg,#7138FF_0%,#D12DFF_100%)] bg-clip-text font-heading text-sm font-semibold text-transparent">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Hidden on phones: the readout has to fit one viewport with no
                internal scroll, and the metrics row already carries the
                headline numbers. */}
            <ul className="mt-5 hidden space-y-2 sm:block">
              {card.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2.5 font-mono text-xs leading-relaxed text-white/70"
                >
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 bg-magenta" />
                  {bullet}
                </li>
              ))}
            </ul>

            <Link
              href={card.cta.href}
              className="group mt-4 inline-flex items-center gap-2 bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white sm:text-xs lg:mt-6 transition-all hover:brightness-115 hover:shadow-[0_0_26px_-6px_rgba(209,45,255,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
            >
              {card.cta.label}
              <ArrowRight
                size={14}
                strokeWidth={2}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* The gate: nothing scrolls past the hero until this is clicked. */}
        <div className="mt-5 flex flex-col items-center gap-2 lg:mt-8">
          <button
            type="button"
            onClick={onContinue}
            data-testid="continue-journey"
            className="group relative inline-flex items-center gap-2.5 border border-violet bg-black/70 px-7 py-3.5 shadow-[0_0_22px_-8px_rgba(113,56,255,0.8)] font-mono text-xs uppercase tracking-[0.22em] text-white backdrop-blur transition-all hover:border-magenta hover:bg-violet/15 hover:shadow-[0_0_34px_-6px_rgba(209,45,255,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]"
          >
            Continue Journey
            <ArrowRight
              size={14}
              strokeWidth={2}
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            Explore the nodes — the page holds here until you continue
          </p>
        </div>
      </div>
    </div>
  );
}

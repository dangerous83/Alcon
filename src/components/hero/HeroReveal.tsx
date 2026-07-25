"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { revealCards } from "@/lib/content/reveal";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";

const FORWARD_KEYS = new Set(["ArrowDown", "PageDown", " ", "Spacebar", "End"]);

/**
 * Sits directly under the hero's scroll-scrubbed video. Once the video
 * finishes and this panel scrolls into view, forward scroll/keyboard/touch
 * navigation is blocked until "Continue Journey" is clicked — the client's
 * explicit requirement. Reduced-motion users skip the gate and ease-in
 * entirely; the panel just renders as a normal, always-scrollable section.
 */
export function HeroReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting && entry.intersectionRatio > 0.5;
        setActive(intersecting);
        if (intersecting) setEntered(true);
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return; // gate only applies to the motion experience
    if (confirmed || !active) return;

    let touchY: number | null = null;

    function onWheel(e: WheelEvent) {
      if (e.deltaY > 0) e.preventDefault();
    }
    function onTouchStart(e: TouchEvent) {
      touchY = e.touches[0]?.clientY ?? null;
    }
    function onTouchMove(e: TouchEvent) {
      if (touchY == null) return;
      const currentY = e.touches[0]?.clientY ?? touchY;
      if (touchY - currentY > 0) e.preventDefault(); // finger moving up = scrolling down
    }
    function onKeyDown(e: KeyboardEvent) {
      if (FORWARD_KEYS.has(e.key)) e.preventDefault();
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [reducedMotion, confirmed, active]);

  function handleContinue() {
    setConfirmed(true);
    requestAnimationFrame(() => {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
    });
  }

  const card = revealCards[activeCard];
  const Icon = card.icon;
  const showEntered = reducedMotion !== false || entered;

  return (
    <section
      ref={sectionRef}
      aria-label="Explore Alcon"
      data-testid="hero-reveal"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-background py-20"
    >
      <div
        className={clsx(
          "mx-auto w-full max-w-6xl px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-8",
          showEntered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10">
          <div
            role="tablist"
            aria-label="Explore Alcon sections"
            className="flex flex-col gap-3"
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
                    "group flex items-center gap-4 rounded-[7px] border px-5 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent",
                    isActive
                      ? "border-cyan-accent/50 bg-white/[0.06]"
                      : "border-border bg-surface hover:border-cyan-accent/30 hover:bg-white/[0.04]"
                  )}
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-[7px] border transition-colors",
                      isActive
                        ? "border-cyan-accent/50 text-cyan-accent"
                        : "border-border text-text-secondary"
                    )}
                  >
                    <CardIcon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-text-primary">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-text-secondary">
                      {c.eyebrow}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="rounded-[7px] border border-border bg-surface-elevated/60 p-6 sm:p-8"
          >
            <span
              aria-hidden
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-[7px] bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] text-white"
            >
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-[#C7CBD6]">
              {card.eyebrow}
            </p>
            <h2 className="mt-2.5 font-heading text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
              {card.heading}
            </h2>
            <p className="mt-4 text-base text-text-secondary">{card.description}</p>
            <ul className="mt-5 space-y-2">
              {card.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 text-sm text-text-secondary"
                >
                  <Check
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-cyan-accent"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button href={card.cta.href} variant="secondary">
                {card.cta.label}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            type="button"
            onClick={handleContinue}
            data-testid="continue-journey"
          >
            Continue Journey
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { clsx } from "@/lib/clsx";
import type { WhiteLabelSample } from "@/lib/content/white-label";

export function WhiteLabelGallery({
  samples,
}: {
  samples: WhiteLabelSample[];
}) {
  // Index into `samples`, or null when the preview is closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const open = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpenIndex(index);
  };

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + samples.length) % samples.length;
      });
    },
    [samples.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [openIndex, close, step]);

  const active = openIndex !== null ? samples[openIndex] : null;

  return (
    <>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {samples.map((sample, index) => (
          <li
            key={sample.image}
            className="group overflow-hidden rounded-[7px] border border-border bg-surface transition-colors hover:border-white/25"
          >
            <button
              type="button"
              onClick={(event) => open(index, event.currentTarget)}
              aria-haspopup="dialog"
              className="relative block aspect-[16/9] w-full overflow-hidden bg-background text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
            >
              <Image
                src={assetPath(`/images/white-label/${sample.image}.webp`)}
                alt={`${sample.title} — ${sample.sector} white-label website design`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                priority={index < 3}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-300 group-hover:bg-background/50 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-[7px] border border-white/30 bg-background/70 px-4 py-2 text-xs font-medium text-text-primary backdrop-blur-sm">
                  <Maximize2 size={14} strokeWidth={2} aria-hidden />
                  Full preview
                </span>
              </span>
            </button>
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-magenta">
                {sample.sector}
              </p>
              <h3 className="mt-1.5 font-heading text-base font-semibold text-text-primary">
                {sample.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {sample.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} preview`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close preview"
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-[7px] border border-white/20 bg-surface/80 text-text-primary transition hover:border-white/40 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          >
            <X size={18} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous sample"
            className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-[7px] border border-white/20 bg-surface/80 p-2 text-text-primary transition hover:border-white/40 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent sm:left-4"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next sample"
            className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-[7px] border border-white/20 bg-surface/80 p-2 text-text-primary transition hover:border-white/40 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent sm:right-4"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>

          <div
            className="relative z-0 flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-[7px] border border-border bg-surface"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full shrink-0 bg-background">
              <Image
                src={assetPath(`/images/white-label/${active.image}.webp`)}
                alt={`${active.title} — ${active.sector} white-label website design, full preview`}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="border-t border-border p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-magenta">
                {active.sector}
              </p>
              <h3 className="mt-1.5 font-heading text-lg font-semibold text-text-primary">
                {active.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
                {active.description}
              </p>
            </div>
          </div>

          <p
            aria-hidden
            className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-text-secondary sm:bottom-6"
          >
            {(openIndex ?? 0) + 1} / {samples.length}
          </p>
        </div>
      )}
    </>
  );
}

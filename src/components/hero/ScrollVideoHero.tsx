"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroChapters, heroSummary, heroCtas } from "@/lib/content/hero";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";
import { assetPath } from "@/lib/asset-path";

const VIDEO_DURATION_FALLBACK = 15;
const SMOOTHING = 0.14;

export function ScrollVideoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [started, setStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return; // wait until known-false; skip entirely if true
    if (videoFailed) return;

    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    gsap.registerPlugin(ScrollTrigger);

    let scrollTrigger: ScrollTrigger | undefined;
    let rafId = 0;
    let targetTime = 0;
    let smoothedTime = 0;
    let lastChapterIndex = -1;
    let hasStarted = false;

    function computeChapterIndex(timeInSeconds: number) {
      if (timeInSeconds >= 10) return 2;
      if (timeInSeconds >= 5) return 1;
      return 0;
    }

    function onLoadedMetadata() {
      const duration =
        Number.isFinite(video!.duration) && video!.duration > 0
          ? video!.duration
          : VIDEO_DURATION_FALLBACK;

      scrollTrigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress;
          targetTime = progress * duration;

          if (!hasStarted && progress > 0.001) {
            hasStarted = true;
            setStarted(true);
          }

          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleX(${progress})`;
          }

          const chapterIdx = computeChapterIndex(progress * duration);
          if (chapterIdx !== lastChapterIndex) {
            lastChapterIndex = chapterIdx;
            setActiveChapter(chapterIdx);
          }
        },
      });

      function tick() {
        smoothedTime += (targetTime - smoothedTime) * SMOOTHING;
        if (Math.abs(smoothedTime - video!.currentTime) > 0.008) {
          try {
            video!.currentTime = smoothedTime;
          } catch {
            // ignore transient seek errors while metadata settles
          }
        }
        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }

    function onError() {
      setVideoFailed(true);
    }

    video.pause();
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("error", onError);

    if (video.readyState >= 1) onLoadedMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("error", onError);
      scrollTrigger?.kill();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, videoFailed]);

  if (reducedMotion === null) {
    // Avoid a flash of the wrong variant before we know the user's preference.
    return <div className="h-[100svh] bg-background" aria-hidden />;
  }

  if (reducedMotion) {
    return <StaticHero />;
  }

  return (
    <section
      ref={wrapperRef}
      className="relative h-[280vh] lg:h-[340vh]"
      aria-label="Alcon — Creative Intelligence"
    >
      <h1 className="sr-only">{heroSummary}</h1>

      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-background">
        {!videoFailed ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover [object-position:65%_center] sm:[object-position:center]"
            muted
            playsInline
            preload="auto"
            poster={assetPath("/images/hero-poster.jpg")}
            aria-hidden
          >
            <source
              media="(max-width: 767px)"
              src={assetPath("/video/hero-scroll-mobile.webm")}
              type="video/webm"
            />
            <source
              media="(max-width: 767px)"
              src={assetPath("/video/hero-scroll-mobile.mp4")}
              type="video/mp4"
            />
            <source src={assetPath("/video/hero-scroll.webm")} type="video/webm" />
            <source src={assetPath("/video/hero-scroll.mp4")} type="video/mp4" />
          </video>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${assetPath("/images/hero-poster.jpg")})` }}
          />
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent"
        />
        <div aria-hidden className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <div aria-hidden className="max-w-xl">
            {heroChapters.map((chapter, index) => (
              <div
                key={chapter.index}
                className={clsx(
                  "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  index === activeChapter
                    ? "static opacity-100 translate-y-0 blur-0"
                    : "absolute opacity-0 translate-y-3 blur-sm pointer-events-none"
                )}
              >
                <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-cyan-accent">
                  {chapter.eyebrow}
                </p>
                <p className="mt-4 font-heading text-3xl font-medium leading-[1.1] text-text-primary sm:text-4xl lg:text-5xl">
                  {chapter.heading}
                </p>
                <p className="mt-4 max-w-lg text-base text-text-secondary sm:text-lg">
                  {chapter.paragraph}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={heroCtas.primary.href} size="lg">
              {heroCtas.primary.label}
            </Button>
            <Button href={heroCtas.secondary.href} variant="secondary" size="lg">
              {heroCtas.secondary.label}
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-4" aria-hidden>
            <span className="font-mono text-xs text-text-secondary">
              0{activeChapter + 1} / 03
            </span>
            <div className="h-px w-32 flex-1 max-w-40 bg-white/15">
              <div
                ref={progressFillRef}
                className="h-full w-full origin-left bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className={clsx(
            "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary transition-opacity duration-500",
            started ? "opacity-0" : "opacity-100"
          )}
        >
          <span className="text-xs uppercase tracking-[0.2em]">
            Scroll to explore
          </span>
          <span className="h-8 w-px bg-gradient-to-b from-text-secondary to-transparent" />
        </div>
      </div>
    </section>
  );
}

function StaticHero() {
  const first = heroChapters[0];
  return (
    <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${assetPath("/images/hero-poster.jpg")})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent"
      />
      <div aria-hidden className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 max-w-xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-cyan-accent">
          {first.eyebrow}
        </p>
        <h1 className="mt-4 font-heading text-3xl font-medium leading-[1.1] text-text-primary sm:text-4xl lg:text-5xl">
          {first.heading}
        </h1>
        <p className="mt-4 max-w-lg text-base text-text-secondary sm:text-lg">
          {first.paragraph}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/get-quote" size="lg">
            Start a Project
          </Button>
          <Button href="/client-projects" variant="secondary" size="lg">
            Explore Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}

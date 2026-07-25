"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroChapters, heroSummary, heroCtas } from "@/lib/content/hero";
import { HeroReveal } from "@/components/hero/HeroReveal";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/clsx";
import { assetPath } from "@/lib/asset-path";

// One file, three scroll-scrubbed clips concatenated seamlessly:
//
//   0 .......... 15.04s   chapter loop (three headlines)
//   15.04s ..... 21.08s   zoom out to a front-on brain close-up
//   21.08s ..... 27.38s   the brain wires up and Dubai appears inside it
//
// CLIP1_END is where the chapter copy fades out ("phase B"). CLIP2_END is
// where the scrub settles on the centred front-view brain — that frame is
// the gate: the HUD sits on it and the page holds there. The third clip is
// the payoff *behind* Continue Journey, so the button earns its name rather
// than just jumping to the next section.
const CLIP1_END = 15.041667;
const CLIP2_END = 21.083333;
const VIDEO_DURATION_FALLBACK = 27.375;
// The source is encoded all-intra (every frame a keyframe), so seeking is a
// single-frame decode rather than a decode-forward from the last keyframe.
// That makes a snappier follow factor affordable without stutter.
const SMOOTHING = 0.22;
// Roughly a quarter-frame at 24fps — below this a seek isn't visible.
const SEEK_EPSILON = 0.01;
// How much video before the gate the HUD starts easing in, so it is fully
// up by the time the scrub settles rather than popping in on arrival.
const REVEAL_LEAD_SECONDS = 1.6;
const FORWARD_KEYS = new Set(["ArrowDown", "PageDown", " ", "Spacebar", "End"]);

export function ScrollVideoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  // Mirrors `confirmed` for the scroll clamp, which needs the released state
  // synchronously rather than on the next render.
  const confirmedRef = useRef(false);
  // Fraction of the pin range the gate holds at — the CLIP2_END frame rather
  // than the end of the scrub, since clip 3 plays only after Continue
  // Journey. Derived from the real duration once metadata lands; seeded from
  // the fallback so the clamp is never wrong-but-active on first paint.
  const gateProgressRef = useRef(CLIP2_END / VIDEO_DURATION_FALLBACK);

  const [activeChapter, setActiveChapter] = useState(0);
  const [started, setStarted] = useState(false);
  const [phaseB, setPhaseB] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
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
    let lastPhaseB = false;
    let lastRevealed = false;
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

      // Derived from the real duration so the gate lands on the right frame
      // even if the encode's length shifts by a frame or two.
      gateProgressRef.current = Math.min(1, CLIP2_END / duration);
      const revealAt = Math.max(
        0,
        (CLIP2_END - REVEAL_LEAD_SECONDS) / duration
      );

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

          const timeInSeconds = progress * duration;
          const chapterIdx = computeChapterIndex(timeInSeconds);
          if (chapterIdx !== lastChapterIndex) {
            lastChapterIndex = chapterIdx;
            setActiveChapter(chapterIdx);
          }

          const isPhaseB = timeInSeconds >= CLIP1_END;
          if (isPhaseB !== lastPhaseB) {
            lastPhaseB = isPhaseB;
            setPhaseB(isPhaseB);
          }

          const isRevealed = progress >= revealAt;
          if (isRevealed !== lastRevealed) {
            lastRevealed = isRevealed;
            setRevealed(isRevealed);
          }
        },
      });

      function tick() {
        smoothedTime += (targetTime - smoothedTime) * SMOOTHING;

        // Only issue a seek when the previous one has completed. Assigning
        // currentTime while `seeking` is true queues requests faster than the
        // decoder retires them, which is the main cause of laggy, rubbery
        // scrubbing — the video ends up chasing a backlog of stale positions.
        if (!video!.seeking && Math.abs(smoothedTime - video!.currentTime) > SEEK_EPSILON) {
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

  // The hard stop. Clamping the scroll position itself — rather than only
  // cancelling input events — is what actually guarantees the gate: a
  // scrollbar drag, a Tab that pulls an off-screen element into view, iOS
  // momentum, or a flick fast enough to jump the whole pin in one frame all
  // move the page without ever producing a cancellable wheel/touch/key
  // event. This runs from the start (not just once the HUD is up) so a fast
  // scroller can't clear the hero before `revealed` has flipped.
  useEffect(() => {
    if (reducedMotion !== false || confirmed) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // The gate frame's scroll position — where the scrub settles on the
    // centred brain, not the end of the pin. Everything past it is clip 3,
    // which is reserved for after Continue Journey. Recomputed per call so
    // viewport resizes don't strand the limit at a stale value.
    const gateMax = () =>
      wrapper.offsetTop +
      (wrapper.offsetHeight - window.innerHeight) * gateProgressRef.current;

    function clamp() {
      if (confirmedRef.current) return;
      const max = gateMax();
      if (window.scrollY > max) {
        window.scrollTo({ top: max, behavior: "instant" });
      }
    }

    window.addEventListener("scroll", clamp, { passive: true });
    window.addEventListener("resize", clamp);
    clamp(); // catch a restored scroll position on reload
    return () => {
      window.removeEventListener("scroll", clamp);
      window.removeEventListener("resize", clamp);
    };
  }, [reducedMotion, confirmed]);

  // Input-level blocking on top of the clamp. This is purely about feel:
  // once the HUD is up, forward gestures stop dead at the wall instead of
  // travelling and being snapped back. Scrolling back up stays free.
  useEffect(() => {
    if (reducedMotion !== false) return;
    if (!revealed || confirmed) return;

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
      if (touchY - currentY > 0) e.preventDefault(); // finger up = scrolling down
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
  }, [reducedMotion, revealed, confirmed]);

  function handleContinue() {
    // Released via the ref first: the clamp listener reads the ref, so this
    // has to be true before the scroll below starts, not a state update
    // later. Otherwise the clamp fights its own release animation.
    confirmedRef.current = true;
    setConfirmed(true);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    // Scroll to the end of the pin, not past it: that span is clip 3, so
    // this scrubs the Dubai reveal as the payoff for clicking. The user is
    // left on the last frame and scrolls onward themselves.
    requestAnimationFrame(() => {
      window.scrollTo({
        top: wrapper.offsetTop + wrapper.offsetHeight - window.innerHeight,
        behavior: "smooth",
      });
    });
  }

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
      /* Height stays proportional to the scrub's length (~18.6vh per second
         of video, ~22.6vh at lg) so scroll speed feels unchanged as clips
         are appended. */
      className="relative h-[510vh] lg:h-[620vh]"
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
            {/* MP4/H.264 is listed first deliberately: the browser picks the
                first source it can play, and the all-intra H.264 encodes are
                far smaller than the VP9 equivalents (VP9 compresses intra
                frames poorly). WebM is kept only for builds without H.264
                support, which then fall through to it. */}
            <source
              media="(max-width: 767px)"
              src={assetPath("/video/hero-scroll-mobile.mp4")}
              type="video/mp4"
            />
            <source
              media="(max-width: 767px)"
              src={assetPath("/video/hero-scroll-mobile.webm")}
              type="video/webm"
            />
            <source src={assetPath("/video/hero-scroll.mp4")} type="video/mp4" />
            <source src={assetPath("/video/hero-scroll.webm")} type="video/webm" />
          </video>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${assetPath("/images/hero-poster.jpg")})` }}
          />
        )}

        {/* Legibility scrim for the copy column, and nothing else — it fades
            out with the copy at the seam so the brain plays at full
            brightness for the reveal instead of sitting under a wash. */}
        <div
          aria-hidden
          className={clsx(
            "absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background/85 via-background/35 to-transparent transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[70%]",
            phaseB ? "opacity-0" : "opacity-100"
          )}
        />

        {/* mx-auto matches the header's container, so the copy column starts
            on the same vertical line as the logo. */}
        {/* mx-auto matches the header's container, so the copy column starts
            on the same vertical line as the logo. justify-center sits the
            copy on the optical middle of the frame. */}
        {/* Phase B (past the video1/video2 seam): the chapter copy and CTAs
            fade out so the final ~6s plays as a silent zoom into the brain,
            uninterrupted by text, handing off cleanly to the reveal panel. */}
        <div
          data-testid="hero-chapter-copy"
          className={clsx(
            "relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 py-24 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-8",
            phaseB ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
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
                <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-[#C7CBD6]">
                  {chapter.eyebrow}
                </p>
                <p className="mt-2.5 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                  {chapter.heading.map((segment, i) =>
                    segment.emphasis ? (
                      <em key={i} className="heading-accent">
                        {segment.text}
                      </em>
                    ) : (
                      <span key={i}>{segment.text}</span>
                    )
                  )}
                </p>
                <p className="mt-5 max-w-lg text-base text-text-secondary sm:text-lg">
                  {chapter.paragraph}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href={heroCtas.primary.href} size="lg">
              {heroCtas.primary.label}
            </Button>
            <Button href={heroCtas.secondary.href} variant="secondary" size="lg">
              {heroCtas.secondary.label}
            </Button>
          </div>
        </div>

        {/* Chapter meta pinned to the bottom of the frame so centring the
            copy doesn't drag the progress indicator up with it. */}
        <div
          className={clsx(
            "absolute inset-x-0 bottom-8 z-10 mx-auto w-full max-w-7xl px-4 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-8",
            phaseB ? "opacity-0" : "opacity-100"
          )}
          aria-hidden
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-secondary">
              0{activeChapter + 1} / 03
            </span>
            <div className="h-px w-32 max-w-40 flex-1 bg-white/15">
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

        {/* No scrim under the HUD. The readout and node plates each carry
            their own translucent black backing plus a backdrop blur, so they
            stay legible on their own — a full-frame wash on top of that only
            dimmed the brain, which is the thing worth looking at here. */}
        {/* Hidden again once confirmed, so clip 3's Dubai reveal plays with
            a clear frame instead of under the readout. */}
        <HeroReveal visible={revealed && !confirmed} onContinue={handleContinue} />
      </div>
    </section>
  );
}

function StaticHero() {
  const first = heroChapters[0];
  return (
    <>
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${assetPath("/images/hero-poster.jpg")})` }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background/85 via-background/35 to-transparent sm:w-[70%]"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="font-heading text-xs font-medium uppercase tracking-[0.2em] text-[#C7CBD6]">
            {first.eyebrow}
          </p>
          <h1 className="mt-2.5 font-heading text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {first.heading.map((segment, i) =>
              segment.emphasis ? (
                <em key={i} className="heading-accent">
                  {segment.text}
                </em>
              ) : (
                <span key={i}>{segment.text}</span>
              )
            )}
          </h1>
          <p className="mt-5 max-w-lg text-base text-text-secondary sm:text-lg">
            {first.paragraph}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/get-quote" size="lg">
              Start a Project
            </Button>
            <Button href="/client-projects" variant="secondary" size="lg">
              Explore Our Work
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Reduced motion: the HUD is still worth showing, but as a plain
        section with no entrance animation and no scroll gate — a user who
        asked for less motion shouldn't have their scroll held hostage. */}
    <section className="relative w-full bg-background px-4 py-20 sm:px-6 lg:px-8">
      <HeroReveal visible onContinue={() => {}} variant="static" />
    </section>
    </>
  );
}

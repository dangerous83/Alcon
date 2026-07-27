"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroChapters, heroSummary, heroCtas } from "@/lib/content/hero";
import { HeroReveal } from "@/components/hero/HeroReveal";
import { PositioningCopy } from "@/components/sections/PositioningCopy";
import { PositioningStatement } from "@/components/sections/PositioningStatement";
import { Button } from "@/components/ui/Button";
import { useIntroEntered } from "@/components/intro/intro-context";
import { clsx } from "@/lib/clsx";
import { assetPath } from "@/lib/asset-path";

// One file, three scroll-scrubbed clips concatenated seamlessly:
//
//   0 .......... 15.04s   chapter loop (three headlines)
//   15.04s ..... 21.08s   zoom out to a front-on brain close-up
//   21.08s ..... 27.38s   the brain wires up and Dubai appears inside it
//
// Each seam is a handover between overlays:
//
//   CLIP1_END      chapter copy fades out; the frame plays clean into the brain
//   CLIP2_END      the HUD clears and the video panel moves left, making room
//                  on the right for the positioning statement
//   COPY_REVEAL_AT the statement itself only fades in once the brain has
//                  turned into profile with the skyline resolved inside it —
//                  a couple of seconds after CLIP2_END, not at the seam
//
// The fourth clip — the brain dispersing into a growth-chart of towers — is
// NOT in this file. It is the scroll-scrubbed background of the services
// section below, which picks up from the exact brain frame this hero ends on.
//
// Scrolling runs straight through all three clips; nothing holds the page.
const CLIP1_END = 15.041667;
const CLIP2_END = 21.083333;
const VIDEO_DURATION_FALLBACK = 27.375;
// The source is encoded all-intra (every frame a keyframe), so seeking is a
// single-frame decode rather than a decode-forward from the last keyframe.
// That makes a snappier follow factor affordable without stutter.
const SMOOTHING = 0.35;
// Roughly a quarter-frame at 24fps — below this a seek isn't visible.
const SEEK_EPSILON = 0.01;
// Above this gap between target and smoothed time the ease is abandoned and
// the video snaps to the target. On a fast flick the smoothing was leaving
// the brain many frames behind the scroll position — visible as a laggy,
// rubbery hero — while seeks queued up chasing stale positions.
const SNAP_DELTA_SECONDS = 0.6;
// How much video before CLIP2_END the HUD starts easing in. Generous enough
// that the readout gets a real stretch of scroll to itself before the
// positioning statement takes over at the seam, rather than flashing past.
const REVEAL_LEAD_SECONDS = 4;
// The brain starts rotating into profile right at CLIP2_END, but the turn
// takes a couple of seconds and the Dubai skyline only becomes recognisable
// partway through it (checked frame-by-frame against the source). Showing
// the positioning copy any earlier put it over a brain that was still
// three-quarter/front-on with no skyline in it — this holds the copy until
// the side view and skyline are both established, independent of the video
// panel's own layout switch at CLIP2_END.
const COPY_REVEAL_AT = 24.4;

export function ScrollVideoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [started, setStarted] = useState(false);
  const [phaseB, setPhaseB] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [phaseC, setPhaseC] = useState(false);
  const [copyRevealed, setCopyRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  // False while the intro overlay is still up: the hero is inside a
  // display:none wrapper then, and a ScrollTrigger built against a zero-height
  // element has no scrub range — the video would sit frozen on frame 0 once
  // the intro reveals it. Wait for the reveal before wiring anything up.
  const introEntered = useIntroEntered();

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
    // Hold until the intro overlay is gone. Until then this component is
    // inside a display:none wrapper, so the wrapper measures 0 tall and the
    // ScrollTrigger built below would have an empty scroll range.
    if (!introEntered) return;

    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    gsap.registerPlugin(ScrollTrigger);

    let scrollTrigger: ScrollTrigger | undefined;
    let rafId = 0;
    let refreshRafId = 0;
    let targetTime = 0;
    let smoothedTime = 0;
    let lastChapterIndex = -1;
    let lastPhaseB = false;
    let lastRevealed = false;
    let lastPhaseC = false;
    let lastCopyRevealed = false;
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

          // Clip 3: the HUD steps aside for the positioning statement.
          const isPhaseC = timeInSeconds >= CLIP2_END;
          if (isPhaseC !== lastPhaseC) {
            lastPhaseC = isPhaseC;
            setPhaseC(isPhaseC);
          }

          // The copy itself waits a beat longer than the panel switch above,
          // until the brain has actually turned into profile with the
          // skyline visible in it.
          const isCopyRevealed = timeInSeconds >= COPY_REVEAL_AT;
          if (isCopyRevealed !== lastCopyRevealed) {
            lastCopyRevealed = isCopyRevealed;
            setCopyRevealed(isCopyRevealed);
          }
        },
      });

      // Re-measure once the browser has settled after the intro's reveal. The
      // hero's effect can run before the gate's own effect restores
      // `body.overflow`, so at create time the document may still be
      // scroll-locked and the trigger's end would clamp short. A refresh on the
      // next frame — after overflow is restored and layout is final — pins the
      // scrub range to the real 280/340vh section.
      refreshRafId = requestAnimationFrame(() => ScrollTrigger.refresh());

      // fastSeek, where supported, skips to the nearest keyframe without the
      // full seek pipeline. The source is all-intra so every frame is a
      // keyframe — this is effectively a direct jump.
      const seekVideo = (t: number) => {
        try {
          const v = video!;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyV = v as any;
          if (typeof anyV.fastSeek === "function") {
            anyV.fastSeek(t);
          } else {
            v.currentTime = t;
          }
        } catch {
          // ignore transient seek errors while metadata settles
        }
      };

      function tick() {
        const delta = targetTime - smoothedTime;

        if (Math.abs(delta) > SNAP_DELTA_SECONDS) {
          // Fast scroll: abandon the ease so the frame catches up in one
          // step instead of trailing the scroll position for many frames.
          smoothedTime = targetTime;
        } else {
          smoothedTime += delta * SMOOTHING;
        }

        // Only issue a seek when the previous one has completed. Assigning
        // currentTime while `seeking` is true queues requests faster than the
        // decoder retires them, which is the main cause of laggy, rubbery
        // scrubbing — the video ends up chasing a backlog of stale positions.
        if (!video!.seeking && Math.abs(smoothedTime - video!.currentTime) > SEEK_EPSILON) {
          seekVideo(smoothedTime);
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
      if (refreshRafId) cancelAnimationFrame(refreshRafId);
    };
  }, [reducedMotion, videoFailed, introEntered]);

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
      /* Back to the original scroll length. Keeping it proportional to the
         video (~18.6vh/s) meant 620vh of scrolling by the third clip, which
         was far too much travel; the scrub simply runs faster per pixel. */
      className="relative h-[280vh] lg:h-[340vh]"
      aria-label="Alcon — Creative Intelligence"
    >
      <h1 className="sr-only">{heroSummary}</h1>

      {/* Behind the video, kept a hair off pure black (#010103, a near-black
          requested by the client) rather than #000. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#010103]">
        {!videoFailed ? (
          <video
            ref={videoRef}
            // Full-bleed the whole way through. The brain that closes clip 3 is
            // handed straight to the services section below, whose scrubbed
            // background opens on the exact same full-bleed frame — so the two
            // read as one continuous video. (Clip 3 used to shrink to a left
            // panel here; that made the brain change size at the hand-off,
            // which read as a jarring zoom.)
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
        {/* HUD owns the front-brain stretch, then clears at the seam. */}
        <HeroReveal visible={revealed && !phaseC} />

        {/* Clip 3: the brain drifts to the left of frame and the Dubai
            skyline resolves inside it, leaving the right half open — that is
            where the positioning statement lands. Half-width and offset to
            the right rather than centred, so the copy never sits on top of
            the artwork. */}
        <div
          data-testid="hero-positioning"
          className={clsx(
            "pointer-events-none absolute inset-0 z-20 flex items-center transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            copyRevealed ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Right-side scrim: the video is full-bleed now, so the statement
              sits over the artwork — this darkens the right half for
              legibility and fades with the copy. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-l from-background via-background/70 to-transparent"
          />
          {/* Anchored left *within* a right-hand column, not right. */}
          <div className="relative ml-auto w-full px-6 sm:px-10 lg:w-1/2 lg:pl-0 lg:pr-10 xl:w-[46%]">
            <PositioningCopy className="mr-auto max-w-sm xl:max-w-md" />
          </div>
        </div>
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
        section with no entrance animation. */}
    <section className="relative w-full bg-background px-4 py-20 sm:px-6 lg:px-8">
      <HeroReveal visible variant="static" />
    </section>

    {/* The motion build overlays this copy on clip 3, which reduced-motion
        visitors never see, so it is rendered here as its own centred section
        instead. Without this the statement would be missing entirely for
        them — it is deliberately not in page.tsx. */}
    <PositioningStatement />
    </>
  );
}

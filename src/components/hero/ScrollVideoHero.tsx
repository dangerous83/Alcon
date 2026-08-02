"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroChapters, heroSummary, heroCtas } from "@/lib/content/hero";
import { HeroReveal } from "@/components/hero/HeroReveal";
import { PositioningCopy } from "@/components/sections/PositioningCopy";
import { PositioningStatement } from "@/components/sections/PositioningStatement";
import { ServicesCopy, ServicesCards } from "@/components/sections/MainServices";
import { Button } from "@/components/ui/Button";
import { useIntroEntered } from "@/components/intro/intro-context";
import { clsx } from "@/lib/clsx";
import { assetPath } from "@/lib/asset-path";

// ONE file, ONE pinned section, four scroll-scrubbed clips concatenated
// seamlessly. The whole journey is a single uninterrupted scrub — there is no
// second section to "cut" to, so the brain never jumps scale or restarts:
//
//   0 .......... 15.04s   chapter loop (three headlines)
//   15.04s ..... 21.08s   zoom out to a front-on brain close-up
//   21.08s ..... 27.38s   the brain wires up and Dubai appears inside it
//   27.38s ..... 32.42s   the brain disperses into a growth-chart of towers
//
// The overlays hand over as the scrub advances:
//
//   CLIP1_END      chapter copy fades out; the frame plays clean into the brain
//   CLIP2_END      the HUD clears, making room for the positioning statement
//   COPY_REVEAL_AT the statement fades in once the brain has turned into
//                  profile with the skyline resolved inside it (right of frame)
//   CLIP3_END      clip 4 begins: the statement fades out and the "One creative
//                  system, four disciplines" copy + cards take the LEFT of
//                  frame while the towers grow on the RIGHT — the finale of the
//                  same scrub, not a separate section below it
//
// The video stays full-bleed the whole way, so nothing resizes or cuts.
const CLIP1_END = 15.041667;
const CLIP2_END = 21.083333;
const CLIP3_END = 27.375;
const VIDEO_DURATION_FALLBACK = 32.416667;
// The scrub is non-linear: the first SCROLL_SPLIT of the page-scroll covers
// clips 1-3 (the brain build-up) at roughly the old per-pixel rate, and the
// remaining scroll is given to clip 4 so the towers-growth finale and the
// cards reveal get room to breathe rather than flashing past in ~15% of the
// travel a linear map would allot the 5s clip.
const SCROLL_SPLIT = 0.6;
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
// Clip 4: the brain fills the left of frame at first and only clears as it
// disperses into towers on the right. The "One creative system" copy + cards
// live on that left side, so they wait until the brain has moved off it
// (frame-checked ~3.1s into the 5s clip) — no dark overlay is used, the copy
// simply waits for black.
const SERVICES_REVEAL_AT = 30.5;

export function ScrollVideoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [activeChapter, setActiveChapter] = useState(0);
  const [started, setStarted] = useState(false);
  const [phaseB, setPhaseB] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [phaseC, setPhaseC] = useState(false);
  const [phaseD, setPhaseD] = useState(false);
  const [copyRevealed, setCopyRevealed] = useState(false);
  const [servicesRevealed, setServicesRevealed] = useState(false);
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
    let lastPhaseD = false;
    let lastCopyRevealed = false;
    let lastServicesRevealed = false;
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

      // Non-linear map: page-scroll 0..SCROLL_SPLIT covers clips 1-3, the rest
      // covers clip 4, so the towers finale gets a generous share of the travel.
      const progressToTime = (progress: number) => {
        if (progress <= SCROLL_SPLIT) {
          return (progress / SCROLL_SPLIT) * CLIP3_END;
        }
        return (
          CLIP3_END +
          ((progress - SCROLL_SPLIT) / (1 - SCROLL_SPLIT)) *
            (duration - CLIP3_END)
        );
      };

      scrollTrigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress;
          const timeInSeconds = progressToTime(progress);
          targetTime = timeInSeconds;

          if (!hasStarted && progress > 0.001) {
            hasStarted = true;
            setStarted(true);
          }

          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleX(${progress})`;
          }

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

          // HUD eases in a few seconds of video before the clip2/clip3 seam.
          const isRevealed = timeInSeconds >= CLIP2_END - REVEAL_LEAD_SECONDS;
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

          // Clip 4 (the towers finale): the panel opens up to full-bleed and
          // the services content takes over.
          const isPhaseD = timeInSeconds >= CLIP3_END;
          if (isPhaseD !== lastPhaseD) {
            lastPhaseD = isPhaseD;
            setPhaseD(isPhaseD);
          }

          // The positioning statement owns clip 3 only: it fades in once the
          // brain is in profile with the skyline (right of frame) and fades
          // back out as clip 4 begins, so it never sits over the towers.
          const isCopyRevealed =
            timeInSeconds >= COPY_REVEAL_AT && timeInSeconds < CLIP3_END;
          if (isCopyRevealed !== lastCopyRevealed) {
            lastCopyRevealed = isCopyRevealed;
            setCopyRevealed(isCopyRevealed);
          }

          // The services copy + cards resolve on the left once the brain has
          // dispersed off it into the towers on the right.
          const isServicesRevealed = timeInSeconds >= SERVICES_REVEAL_AT;
          if (isServicesRevealed !== lastServicesRevealed) {
            lastServicesRevealed = isServicesRevealed;
            setServicesRevealed(isServicesRevealed);
          }
        },
      });

      // Re-measure once the browser has settled after the intro's reveal. The
      // hero's effect can run before the gate's own effect restores
      // `body.overflow`, so at create time the document may still be
      // scroll-locked and the trigger's end would clamp short. A refresh on the
      // next frame — after overflow is restored and layout is final — pins the
      // scrub range to the real 460/560vh section.
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
      /* One pinned section for the whole four-clip scrub. Tall enough that the
         non-linear map (see SCROLL_SPLIT) gives clips 1-3 roughly the old
         per-pixel rate over the first ~60% and hands the towers finale a
         generous last ~40%. */
      className="relative h-[380vh] sm:h-[460vh] lg:h-[560vh]"
      aria-label="Alcon — Creative Intelligence"
    >
      <h1 className="sr-only">{heroSummary}</h1>

      {/* Solid black backdrop behind the video, so the video's own black
          background blends into it with no visible edge (the object-contain
          letterbox and the open right/left of frame sit on the same black). */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
        {!videoFailed ? (
          <video
            ref={videoRef}
            className={clsx(
              "absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              // Clips 1-2 fill the frame.
              "h-full w-full object-cover [object-position:65%_center] sm:[object-position:center]",
              // Clips 3-4 switch to object-contain (whole frame visible, no
              // crop). Clip 3 is a panel on the left with the brain, the right
              // free for the statement; clip 4 opens the SAME element up to
              // full width so the brain grows smoothly into the towers finale —
              // object-fit stays `contain` across the clip3/clip4 handover, so
              // it scales rather than popping. It is one continuous scrub in one
              // pinned section: nothing cuts to a second video or section.
              phaseC && "lg:object-contain",
              phaseC &&
                !phaseD &&
                "lg:w-[60%] lg:[object-position:left_center] xl:w-[64%]"
            )}
            muted
            playsInline
            {...({
              // iOS Safari inline-playback attribute (kept alongside
              // playsInline because older WebKit still honours the
              // vendor-prefixed form). Without it the browser can promote the
              // video to a fullscreen player mid-scroll on some devices.
              "webkit-playsinline": "true",
              // Tencent X5 (WeChat / QQ browsers on Android) inline hint —
              // otherwise the video takes over the full screen on scroll.
              "x5-video-player-type": "h5-page",
              "x5-video-player-fullscreen": "false",
            } as Record<string, string>)}
            disablePictureInPicture
            disableRemotePlayback
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

        {/* Edge-fade overlays that hide the vertical cut where the video's
            content ends and the black background begins. The video is a black
            source on a black backdrop, so wherever the video element (or its
            visible content) stops on the wide viewport, a sharp line shows.
            These gradients bridge that seam with a soft transparent→black
            fade. Two states matter:

            - Clip 3 (phaseC && !phaseD): the video is a 60/64%-wide left panel.
              Its right edge sits at ~60/64% of the viewport and is the visible
              cut — fade it out with a gradient straddling that edge.
            - Clip 4 (phaseD): the video is object-contain full-bleed, so its
              16:9 content leaves narrower letterbox margins on the far left
              and right — fade both edges into black.

            All are lg-only: below lg the video is object-cover full-bleed,
            fills the frame, no cut. */}
        <div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-y-0 z-[5] hidden bg-gradient-to-r from-transparent via-black/70 to-black transition-opacity duration-700 lg:block",
            "lg:left-[48%] lg:w-[24%] xl:left-[52%] xl:w-[24%]",
            phaseC && !phaseD ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-[14%] bg-gradient-to-r from-black via-black/70 to-transparent transition-opacity duration-700 lg:block",
            phaseD ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-[14%] bg-gradient-to-l from-black via-black/70 to-transparent transition-opacity duration-700 lg:block",
            phaseD ? "opacity-100" : "opacity-0"
          )}
        />

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
            "relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-5 py-20 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 sm:py-24 lg:px-8",
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
                <p className="mt-2.5 font-heading text-[2rem] font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
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
                <p className="mt-4 max-w-lg text-[15px] leading-6 text-text-secondary sm:mt-5 sm:text-lg">
                  {chapter.paragraph}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
            <Button href={heroCtas.primary.href} size="lg" className="w-full sm:w-auto">
              {heroCtas.primary.label}
            </Button>
            <Button
              href={heroCtas.secondary.href}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
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

        {/* Clip 3: the video is a panel on the left with the brain and the
            resolved Dubai skyline, so the right of the sticky frame is plain
            near-black — that is where the positioning statement lands, no scrim
            needed. Fades out again as clip 4 opens the video to full-bleed. */}
        <div
          data-testid="hero-positioning"
          className={clsx(
            "pointer-events-none absolute inset-0 z-20 flex items-end sm:items-center transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            copyRevealed ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Mobile scrim: on small screens the video is full-bleed
              object-cover, so the positioning copy needs its own dark backing
              to stay legible over the brain. Fades in with the copy and
              disappears at lg where the video panel already clears the right
              of frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/85 to-transparent lg:hidden"
          />
          <div className="relative ml-auto w-full px-5 pb-10 sm:px-10 sm:pb-0 lg:w-1/2 lg:pl-0 lg:pr-10 xl:w-[46%]">
            <PositioningCopy className="mr-auto max-w-sm xl:max-w-md" />
          </div>
        </div>

        {/* Clip 4 (the towers finale): the brain has dispersed into a
            growth-chart of towers on the RIGHT, leaving the black left of frame
            for the "One creative system, four disciplines" copy + the four
            discipline cards. This is the end of the SAME scrub — the services
            content resolving over the towers — not a separate section, so there
            is no cut. No dark overlay: the copy waits for the left to clear
            (servicesRevealed) and each card carries its own translucent plate. */}
        <div
          data-testid="hero-services"
          className={clsx(
            "absolute inset-0 z-20 flex items-end sm:items-center transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            servicesRevealed ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={!servicesRevealed}
        >
          {/* Mobile scrim behind the services block. On lg the towers finale
              already clears the left of frame for this content, so no wash
              needed there. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 lg:hidden"
          />
          <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pb-0 sm:pt-0 lg:px-8">
            <div className="lg:max-w-[54%]">
              <ServicesCopy />
              <ServicesCards />
            </div>
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


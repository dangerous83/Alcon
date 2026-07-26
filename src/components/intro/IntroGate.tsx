"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { clsx } from "@/lib/clsx";
import { IntroEnteredContext } from "./intro-context";

// Sessions, not visits: a full-screen intro on every single page load (back
// button, opening a link in a new tab) would be far more annoying than
// welcoming. Shown once per tab until it's closed.
const SESSION_KEY = "alcon-intro-seen";

// The clip is ~5s. If `ended` never arrives (a stalled buffer, a browser that
// silently refuses to play), this releases the visitor anyway rather than
// trapping them behind a frozen overlay.
const PLAYBACK_TIMEOUT_MS = 12_000;

// Matches the fade duration on the overlay below.
const FADE_MS = 700;

type Phase = "idle" | "playing" | "dismissing";

/**
 * Full-screen video intro shown once per session ahead of the homepage.
 *
 * The clip does not autoplay: it holds on its first frame until the visitor
 * presses "Begin Your Journey", then runs through to the end and rests on its
 * final frame. That final frame is the homepage hero's opening frame, so the
 * cross-fade into the page reads as one continuous shot.
 *
 * Skipped entirely for prefers-reduced-motion, same convention as the hero.
 */
export function IntroGate({ children }: { children: React.ReactNode }) {
  // Default `false` (intro visible) so the SSG'd HTML already contains the
  // intro overlay and hides the sections beneath. On GitHub Pages the raw
  // HTML shipped to the browser is a static export of this initial render —
  // if the default were `null`, every visitor would see the homepage text
  // flash into place before hydration finished, and JS-disabled clients
  // would see nothing but sections. `useEffect` still upgrades to `true`
  // when reduced-motion is on or the intro was already dismissed this tab.
  const [entered, setEntered] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Guards against `ended` and the timeout both firing.
  const finishedRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
    if (reducedMotion || alreadySeen) setEntered(true);
  }, []);

  useEffect(() => {
    if (entered) return;
    // Showing over the homepage rather than replacing it, so the page
    // beneath must not scroll while the intro is up.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [entered]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase("dismissing");
    // Unmounts only once the overlay is fully invisible.
    window.setTimeout(() => setEntered(true), FADE_MS);
  }, []);

  function handleEnter() {
    sessionStorage.setItem(SESSION_KEY, "1");

    const video = videoRef.current;
    if (videoFailed || !video) {
      finish();
      return;
    }

    setPhase("playing");
    window.setTimeout(finish, PLAYBACK_TIMEOUT_MS);

    // play() rejects when the browser blocks or can't decode the source —
    // no reason to strand the visitor on a still frame in that case.
    const played = video.play();
    if (played) played.catch(() => finish());
  }

  return (
    <>
      {/* Kept in the DOM so crawlers (and JS-disabled clients that never
          get past the intro) still see every section, but visually and
          interactively suppressed while the intro is up. Without this the
          static HTML flashes every homepage section into place before the
          overlay renders on top on slow connections. */}
      {/* Publishes `entered` to the tree below. The scroll hero waits on it
          before creating its ScrollTrigger — measuring the trigger while the
          wrapper is display:none collapses the scrub range to zero and freezes
          the hero on frame 0 after the reveal. */}
      <IntroEnteredContext.Provider value={entered}>
        <div
          aria-hidden={!entered || undefined}
          // `hidden` (display:none) rather than `invisible`: leaving the sections
          // in the layout let the page scroll behind the intro overlay before
          // hydration set body overflow:hidden. Crawlers read the raw HTML, so
          // display:none does not hurt SEO.
          className={clsx(!entered && "hidden")}
        >
          {children}
        </div>
      </IntroEnteredContext.Provider>

      {!entered && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Alcon intro"
          className={clsx(
            "fixed inset-0 z-[100] overflow-hidden bg-background transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            phase === "dismissing" ? "opacity-0" : "opacity-100"
          )}
        >
          {!videoFailed ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              // No autoPlay and no loop, deliberately: the clip waits on its
              // first frame for the button, plays once, and rests on its last
              // frame — which is where the homepage hero picks up.
              muted
              playsInline
              preload="auto"
              poster={assetPath("/images/intro-poster.jpg")}
              onEnded={finish}
              // Only a failure of the <video> itself counts. React's
              // synthetic onError also fires for each child <source> that
              // can't load, so a browser lacking H.264 would trip this on
              // the mp4 and drop to the poster even though the webm below it
              // plays perfectly well. Native `error` events from <source>
              // don't bubble; React's simulated bubbling is what surfaces
              // them here.
              onError={(event) => {
                if (event.target === event.currentTarget) setVideoFailed(true);
              }}
            >
              {/* MP4 first (smaller, and universally supported in the
                  browsers real visitors use), WebM after as the fallback for
                  builds without H.264 — same ordering as the hero. Without
                  the WebM the intro silently degrades to its poster on any
                  such browser, which is how this was caught. */}
              <source
                media="(max-width: 767px)"
                src={assetPath("/video/intro-start-mobile.mp4")}
                type="video/mp4"
              />
              <source
                media="(max-width: 767px)"
                src={assetPath("/video/intro-start-mobile.webm")}
                type="video/webm"
              />
              <source
                src={assetPath("/video/intro-start.mp4")}
                type="video/mp4"
              />
              <source
                src={assetPath("/video/intro-start.webm")}
                type="video/webm"
              />
            </video>
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${assetPath("/images/intro-poster.jpg")})`,
              }}
            />
          )}

          {/* Ambient decor — side circuit lattices and a neural overlay
              across the brain. All decorative, hidden from AT, and fades out
              with the CTA the moment the clip starts running. */}
          <div
            aria-hidden
            className={clsx(
              "pointer-events-none absolute inset-0 z-[5]",
              "transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              phase === "idle" ? "opacity-100" : "opacity-0"
            )}
          >
            <IntroSideCircuit side="left" />
            <IntroSideCircuit side="right" />
            <IntroBrainOverlay />
          </div>

          {/* No scrim over the video. The button sits just below the brain —
              low enough to clear the artwork at every aspect ratio, high
              enough to still read as part of the composition — and fades out
              the moment playback starts, so nothing sits on top of the clip
              while it runs. */}
          <div
            className={clsx(
              "absolute inset-x-0 top-[70%] z-10 flex -translate-y-1/2 flex-col items-center justify-center px-4",
              "transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              phase === "idle"
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            )}
          >
            <button
              type="button"
              onClick={handleEnter}
              tabIndex={phase === "idle" ? undefined : -1}
              // Same gradient as the site's primary Button — the intro is the
              // first thing a visitor sees, so it should already look Alcon.
              className="intro-echo-btn group inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-8 py-4 font-heading text-base font-medium text-text-primary shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_40px_-8px_rgba(113,56,255,0.55)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_40px_-4px_rgba(113,56,255,0.75)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent active:brightness-95"
            >
              Begin Your Journey
              <ArrowRight
                size={16}
                strokeWidth={2}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <p className="mt-6 max-w-md text-center font-body text-sm leading-relaxed text-text-secondary sm:text-base">
              Alcon pairs sharp <span className="text-text-primary">marketing strategy</span> with in-house{" "}
              <span className="text-text-primary">AI specialists</span> — building intelligent campaigns,
              automations, and creative systems that move the metrics that matter.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Vertical circuit lattice on the flanks of the intro — mirrors on the right
 * so nothing on the page feels empty. Coloured with the brand gradient stops
 * (electric blue → violet → magenta → cyan) and animated via CSS keyframes
 * declared in globals.css, so `prefers-reduced-motion` neutralises it too.
 */
function IntroSideCircuit({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <svg
      className={clsx(
        "absolute top-1/2 hidden h-[80vh] w-[18vw] max-w-[280px] -translate-y-1/2 md:block",
        isLeft ? "left-0" : "right-0 -scale-x-100"
      )}
      viewBox="0 0 200 800"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      <path
        className="intro-circuit-path"
        stroke="#2870FF"
        d="M20 40 L20 180 L90 180 L90 300 L40 300 L40 440 L110 440 L110 560 L60 560 L60 720"
        style={{ animationDelay: "0s" }}
      />
      <path
        className="intro-circuit-path"
        stroke="#7138FF"
        d="M150 20 L150 140 L80 140 L80 260 L160 260 L160 380 L100 380 L100 500 L170 500 L170 620 L120 620 L120 760"
        style={{ animationDelay: "1s" }}
      />
      <path
        className="intro-circuit-path"
        stroke="#D12DFF"
        d="M60 80 L130 80 L130 220 L50 220 L50 360 L140 360 L140 480 L70 480 L70 640 L150 640 L150 780"
        style={{ animationDelay: "2s" }}
      />
      <path
        className="intro-circuit-path"
        stroke="#16C7FF"
        d="M180 100 L180 240 L110 240 L110 340 L170 340 L170 460 L90 460 L90 580 L180 580 L180 700"
        style={{ animationDelay: "0.5s", strokeWidth: 1 }}
      />

      {[
        { cx: 20, cy: 40, color: "#2870FF", delay: "0s" },
        { cx: 90, cy: 300, color: "#7138FF", delay: "0.4s" },
        { cx: 150, cy: 20, color: "#D12DFF", delay: "0.8s" },
        { cx: 160, cy: 380, color: "#16C7FF", delay: "1.2s" },
        { cx: 60, cy: 640, color: "#2870FF", delay: "1.6s" },
        { cx: 170, cy: 500, color: "#7138FF", delay: "2s" },
        { cx: 130, cy: 220, color: "#D12DFF", delay: "2.4s" },
      ].map((node, i) => (
        <circle
          key={i}
          className="intro-circuit-node"
          cx={node.cx}
          cy={node.cy}
          r={2}
          fill={node.color}
          style={{ color: node.color, animationDelay: node.delay }}
        />
      ))}
    </svg>
  );
}

/**
 * Neural-trace overlay draped across the brain in the intro poster/video. The
 * paths are hand-tuned to follow the sulci in the reference frame so the
 * strokes read as circuits firing along the cortex rather than an unrelated
 * lattice floating on top.
 */
function IntroBrainOverlay() {
  return (
    <svg
      className="absolute left-1/2 top-[8%] h-[52vh] w-[54vw] max-w-[720px] -translate-x-1/2"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      <path
        className="intro-brain-trace"
        stroke="#16C7FF"
        d="M120 200 Q160 150 200 170 T280 200 Q300 230 260 260 T180 280"
        style={{ animationDelay: "0s" }}
      />
      <path
        className="intro-brain-trace"
        stroke="#D12DFF"
        d="M140 240 Q180 210 220 230 T300 220 Q320 250 280 290"
        style={{ animationDelay: "1s" }}
      />
      <path
        className="intro-brain-trace"
        stroke="#7138FF"
        d="M110 180 Q150 130 210 150 Q260 170 290 140 T340 180"
        style={{ animationDelay: "2s" }}
      />
      <path
        className="intro-brain-trace"
        stroke="#2870FF"
        d="M160 300 Q200 270 250 290 T320 310"
        style={{ animationDelay: "1.5s" }}
      />
      <path
        className="intro-brain-trace"
        stroke="#16C7FF"
        d="M130 260 Q170 230 200 250 Q230 270 260 250 T310 260"
        style={{ animationDelay: "2.5s" }}
      />
    </svg>
  );
}

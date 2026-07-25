"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { clsx } from "@/lib/clsx";

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
  // null = not yet decided (avoids a flash of the wrong state before the
  // reduced-motion query and sessionStorage are read on mount).
  const [entered, setEntered] = useState<boolean | null>(null);
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
    setEntered(reducedMotion || alreadySeen);
  }, []);

  useEffect(() => {
    if (entered !== false) return;
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
      {children}

      {entered === null && (
        // Same background colour as the intro/homepage so there's nothing
        // to flash — just an instant, unstyled hold until we know which
        // state to render.
        <div aria-hidden className="fixed inset-0 z-[100] bg-background" />
      )}

      {entered === false && (
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

          {/* No scrim over the video. The button is centred in the frame and
              fades out the moment playback starts, so nothing sits on top of
              the clip while it runs. */}
          <div
            className={clsx(
              "absolute inset-0 z-10 flex items-center justify-center px-4",
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
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-8 py-4 font-heading text-base font-medium text-text-primary shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_40px_-8px_rgba(113,56,255,0.55)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_40px_-4px_rgba(113,56,255,0.75)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent active:brightness-95"
            >
              Begin Your Journey
              <ArrowRight
                size={16}
                strokeWidth={2}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

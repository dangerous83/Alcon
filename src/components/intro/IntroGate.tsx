"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { assetPath } from "@/lib/asset-path";
import { clsx } from "@/lib/clsx";

// Sessions, not visits: a full-screen intro on every single page load (back
// button, opening a link in a new tab) would be far more annoying than
// welcoming. Shown once per tab until it's closed.
const SESSION_KEY = "alcon-intro-seen";

/**
 * Full-screen video intro shown once per session ahead of the homepage.
 * Skipped entirely for prefers-reduced-motion, same convention as the hero.
 */
export function IntroGate({ children }: { children: React.ReactNode }) {
  // null = not yet decided (avoids a flash of the wrong state before the
  // reduced-motion query and sessionStorage are read on mount).
  const [entered, setEntered] = useState<boolean | null>(null);
  const [dismissing, setDismissing] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

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

  function handleEnter() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissing(true);
    // Matches the fade duration below — unmounts only once it's invisible.
    window.setTimeout(() => setEntered(true), 700);
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
            dismissing ? "opacity-0" : "opacity-100"
          )}
        >
          {!videoFailed ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={assetPath("/images/intro-poster.jpg")}
              onError={() => setVideoFailed(true)}
            >
              <source
                media="(max-width: 767px)"
                src={assetPath("/video/intro-start-mobile.mp4")}
                type="video/mp4"
              />
              <source
                src={assetPath("/video/intro-start.mp4")}
                type="video/mp4"
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

          {/* No scrim: the button sits in the clear space at the bottom of
              the frame instead of a black wash dimming the video to make
              it legible. */}
          <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center px-4 sm:bottom-14">
            <button
              type="button"
              onClick={handleEnter}
              className="group inline-flex items-center gap-2 rounded-[7px] border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/70 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
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

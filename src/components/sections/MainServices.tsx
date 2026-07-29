"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/lib/content/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { assetPath } from "@/lib/asset-path";
import { useIntroEntered } from "@/components/intro/intro-context";
import { clsx } from "@/lib/clsx";

// Same scrub tuning as the hero, so this reads as the tail of one continuous
// scroll-scrub. The clip picks up on the exact brain frame the hero settles
// on and disperses it into a growth-chart of towers.
const SMOOTHING = 0.35;
const SEEK_EPSILON = 0.01;
const SNAP_DELTA_SECONDS = 0.6;
const DURATION_FALLBACK = 5.041667;
// The brain fills the left of frame at the start of the clip and only clears
// as it disperses into towers on the right. The copy column lives on that
// left side, so it stays hidden until the brain has moved off it — no dark
// overlay is used to force legibility, the copy simply waits for black.
// Gated on the video's actually-displayed time (not raw scroll position), so
// the smoothing lag between scroll and frame can't reveal the copy while the
// brain is still on the left. Frame-checked: by ~3.3s the left of frame is
// black. Expressed as a fraction of the clip so it survives a duration change.
const COPY_REVEAL_FRACTION = 0.65;

// The full catalogue (including Video Editing) still lives on /services and
// powers the routes; this section intentionally features a subset.
const featured = services.filter((service) => service.slug !== "editing");

function ServiceCards() {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {featured.map((service, index) => (
        <Card
          as="li"
          key={service.slug}
          // The card's own translucent, blurred plate is what keeps it legible
          // over the bright towers — deliberately no full-section dark wash.
          className="flex flex-col bg-surface-elevated/80 p-4 backdrop-blur-md"
        >
          <span className="font-mono text-[11px] text-text-secondary">
            0{index + 1}
          </span>
          <h3 className="mt-2 font-heading text-base font-medium leading-tight text-text-primary">
            {service.name}
          </h3>
          {/* Clamped so the four cards + heading fit the pinned viewport under
              the fixed header; the full summary lives on /services. */}
          <p className="mt-1.5 flex-1 text-sm leading-snug text-text-secondary line-clamp-2">
            {service.summary}
          </p>
          <Link
            href={`/services/${service.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
          >
            Learn more
            <span aria-hidden>→</span>
          </Link>
        </Card>
      ))}
    </ul>
  );
}

function SectionCopy() {
  return (
    <>
      <SectionLabel>What we do</SectionLabel>
      <Heading as="h2" id="services-heading" size="lg" className="mt-3">
        One creative system, four disciplines.
      </Heading>
      <p className="mt-3 max-w-xl text-text-secondary">
        Every service is built to plug into the same brand system — so
        identity, motion, and content stay consistent no matter which team
        you start with.
      </p>
    </>
  );
}

/**
 * "One creative system, four disciplines."
 *
 * This is where the hero's scroll-scrub finishes. The hero hands off on the
 * exact brain frame this clip opens on, and scrolling into this section
 * carries straight on: the brain disperses into a growth-chart of towers that
 * settles on the RIGHT of the frame, while the copy and four discipline cards
 * resolve on the LEFT — so the whole journey reads as one continuous clip that
 * ends here. The video is full-bleed and centred (not a shrunk side panel),
 * and there is no dark overlay: the copy waits for the brain to clear the left
 * of frame rather than being forced legible by a wash over the artwork.
 *
 * Falls back to a static frame of the towers finale for reduced-motion / no-JS
 * / SSR, with the same left-copy / right-artwork composition.
 */
export function MainServices() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const introEntered = useIntroEntered();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false || videoFailed) return;
    // Wait for the intro to clear: until then the whole page (this section
    // included) sits in a display:none wrapper, so a ScrollTrigger built now
    // would measure a zero-height section and have no scrub range.
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
    let lastRevealed = false;

    function onLoadedMetadata() {
      const duration =
        Number.isFinite(video!.duration) && video!.duration > 0
          ? video!.duration
          : DURATION_FALLBACK;

      const revealTime = COPY_REVEAL_FRACTION * duration;

      scrollTrigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          targetTime = self.progress * duration;
        },
      });

      refreshRafId = requestAnimationFrame(() => ScrollTrigger.refresh());

      const seekVideo = (t: number) => {
        try {
          const v = video!;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyV = v as any;
          if (typeof anyV.fastSeek === "function") anyV.fastSeek(t);
          else v.currentTime = t;
        } catch {
          // ignore transient seek errors while metadata settles
        }
      };

      function tick() {
        const delta = targetTime - smoothedTime;
        if (Math.abs(delta) > SNAP_DELTA_SECONDS) smoothedTime = targetTime;
        else smoothedTime += delta * SMOOTHING;

        // Reveal the copy off the frame actually on screen (smoothedTime), not
        // the scroll position, so the brain has really cleared the left before
        // the heading and cards fade in over it.
        const isRevealed = smoothedTime >= revealTime;
        if (isRevealed !== lastRevealed) {
          lastRevealed = isRevealed;
          setRevealed(isRevealed);
        }

        if (
          !video!.seeking &&
          Math.abs(smoothedTime - video!.currentTime) > SEEK_EPSILON
        ) {
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

  // SSR, first paint, or reduced motion: a static frame of the towers finale
  // (the frame the scrub ends on) with the same left-copy / right-artwork
  // composition. No dark overlay — the towers sit on the right, the copy on
  // the black left of the frame.
  if (reducedMotion !== false || videoFailed) {
    return (
      <section
        className="relative overflow-hidden bg-[#010103]"
        aria-labelledby="services-heading"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${assetPath("/images/services-poster.jpg")})` }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="lg:max-w-[54%]">
            <SectionCopy />
            <ServiceCards />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      // Tall enough to give the 5s clip a comfortable scrub. The composition is
      // pinned for the whole section and only the video scrubs, so it ENDS on
      // the full frame: the growth-chart of towers fully formed on the right,
      // the four cards resolved on the left.
      className="relative h-[220vh] lg:h-[240vh]"
      aria-labelledby="services-heading"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#010103]">
        {/* Scroll-scrubbed background, full-bleed and centred (NOT a shrunk
            left panel): the brain disperses into a growth-chart of towers that
            settles on the right of the frame, leaving the black left of frame
            open for the copy. No dark overlay. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          muted
          playsInline
          preload="auto"
          poster={assetPath("/images/services-poster.jpg")}
          aria-hidden
        >
          <source
            media="(max-width: 767px)"
            src={assetPath("/video/services-scroll-mobile.mp4")}
            type="video/mp4"
          />
          <source
            media="(max-width: 767px)"
            src={assetPath("/video/services-scroll-mobile.webm")}
            type="video/webm"
          />
          <source src={assetPath("/video/services-scroll.mp4")} type="video/mp4" />
          <source src={assetPath("/video/services-scroll.webm")} type="video/webm" />
        </video>

        {/* Copy + the four disciplines on the LEFT, over the black left of the
            frame. Held hidden until the brain has dispersed off that side
            (COPY_REVEAL_PROGRESS), so it never sits on top of the artwork and
            needs no dark wash to stay readable. */}
        <div
          className={clsx(
            "relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pt-20 pb-10 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-8",
            revealed ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="lg:max-w-[54%]">
            <SectionCopy />
            <ServiceCards />
          </div>
        </div>
      </div>
    </section>
  );
}

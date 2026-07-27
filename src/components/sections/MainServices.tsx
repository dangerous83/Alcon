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

// Same scrub tuning as the hero, so the background reads as one continuous
// system with it. The clip picks up from the exact brain frame the hero ends
// on and disperses into the growth-chart of towers.
const SMOOTHING = 0.35;
const SEEK_EPSILON = 0.01;
const SNAP_DELTA_SECONDS = 0.6;
const DURATION_FALLBACK = 5.041667;

// The full catalogue (including Video Editing) still lives on /services and
// powers the routes; this section intentionally features a subset.
const featured = services.filter((service) => service.slug !== "editing");

function ServiceCards({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={clsx(
        "grid gap-3 sm:grid-cols-2",
        compact ? "mt-6" : "mt-8"
      )}
    >
      {featured.map((service, index) => (
        <Card
          as="li"
          key={service.slug}
          className={clsx(
            "flex flex-col bg-surface-elevated/70 backdrop-blur-sm",
            compact ? "p-4" : "p-5"
          )}
        >
          <span className="font-mono text-[11px] text-text-secondary">
            0{index + 1}
          </span>
          <h3
            className={clsx(
              "mt-2 font-heading font-medium text-text-primary",
              compact ? "text-base leading-tight" : "text-lg"
            )}
          >
            {service.name}
          </h3>
          <p
            className={clsx(
              "mt-1.5 flex-1 text-text-secondary",
              compact
                ? "text-[13px] leading-snug"
                : "text-sm leading-relaxed"
            )}
          >
            {service.summary}
          </p>
          <Link
            href={`/services/${service.slug}`}
            className={clsx(
              "inline-flex items-center gap-1 text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded",
              compact ? "mt-3" : "mt-4"
            )}
          >
            Learn more
            <span aria-hidden>→</span>
          </Link>
        </Card>
      ))}
    </ul>
  );
}

function SectionCopy({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <SectionLabel>What we do</SectionLabel>
      <Heading
        as="h2"
        id="services-heading"
        size={compact ? "md" : "lg"}
        className={compact ? "mt-3" : "mt-4"}
      >
        One creative system, four disciplines.
      </Heading>
      <p
        className={clsx(
          "max-w-xl text-text-secondary",
          compact ? "mt-3 text-sm" : "mt-4"
        )}
      >
        Every service is built to plug into the same brand system — so
        identity, motion, and content stay consistent no matter which team you
        start with.
      </p>
    </>
  );
}

export function MainServices() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  // This section is pulled up over the hero's tail (-mt-[100svh]). While the
  // hero is still finishing (its positioning statement), this stays invisible
  // so the statement shows through; the instant this section's own scrub
  // starts it fades in — on the exact same brain frame the hero closes on, so
  // the hand-off is seamless rather than a second brain.
  const [covering, setCovering] = useState(false);
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
    let lastCovering = false;

    function onLoadedMetadata() {
      const duration =
        Number.isFinite(video!.duration) && video!.duration > 0
          ? video!.duration
          : DURATION_FALLBACK;

      scrollTrigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          targetTime = self.progress * duration;
          // Reveal only once our own scrub has started (progress > 0), so the
          // hero's tail stays visible underneath until the exact hand-off.
          const isCovering = self.progress > 0.0005;
          if (isCovering !== lastCovering) {
            lastCovering = isCovering;
            setCovering(isCovering);
          }
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

  // SSR, first paint, or reduced motion: a plain readable section over a
  // static poster (the brain frame the hero hands off on). The client upgrades
  // motion-OK visitors to the scrubbed-video version below. Rendering the
  // grid here keeps the content in the static HTML for crawlers and no-JS.
  if (reducedMotion !== false || videoFailed) {
    return (
      <section
        className="relative overflow-hidden bg-[#010103]"
        aria-labelledby="services-heading"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${assetPath("/images/services-poster.jpg")})` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="lg:max-w-[62%]">
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
      // Pulled up by one viewport (-mt-[100svh]) and lifted above the hero
      // (z-20) so this section PINS exactly as the hero's scrub ends. The clip
      // opens on the same brain frame the hero closes on, so the two read as
      // one continuous scroll-scrubbed video with no gap and no repeated brain.
      //
      // Tall enough to give the 5s clip a comfortable scrub. The composition
      // (cards left, towers right) is pinned for the whole section, and only
      // the video scrubs — so it ENDS on the full frame: heading + all four
      // cards still in place with the growth-chart fully formed on the right.
      className="relative z-20 -mt-[100svh] h-[220vh] lg:h-[240vh]"
      aria-labelledby="services-heading"
    >
      <div
        className={clsx(
          "sticky top-0 h-[100svh] w-full overflow-hidden bg-[#010103] transition-opacity duration-300 ease-out",
          covering ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* Scroll-scrubbed background: the growth-chart clip, picking up from
            the brain frame the hero ended on. Matches the hero's full-bleed
            object-position so the hand-off frame is pixel-identical. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover [object-position:65%_center] sm:[object-position:center]"
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

        {/* Legibility scrim: darkens the left where the cards sit, fading out
            to the right where the towers rise. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"
        />

        {/* Pinned composition, top-aligned below the fixed header so the
            heading is always visible; on very short viewports only the last
            card's base clips rather than the title. */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-start px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <div className="lg:max-w-[58%]">
            <SectionCopy compact />
            <ServiceCards compact />
          </div>
        </div>
      </div>
    </section>
  );
}

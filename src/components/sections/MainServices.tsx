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

function ServiceCards({
  compact = false,
  single = false,
}: {
  compact?: boolean;
  single?: boolean;
}) {
  return (
    <ul
      className={clsx(
        "grid gap-3",
        single ? "grid-cols-1" : "sm:grid-cols-2",
        compact ? "mt-5" : "mt-8"
      )}
    >
      {featured.map((service, index) => (
        <Card
          as="li"
          key={service.slug}
          className={clsx(
            "flex flex-col bg-surface-elevated/70 backdrop-blur-sm",
            single ? "p-3.5" : compact ? "p-4" : "p-5"
          )}
        >
          <div className={single ? "flex items-baseline gap-2" : undefined}>
            <span className="font-mono text-[11px] text-text-secondary">
              0{index + 1}
            </span>
            <h3
              className={clsx(
                "font-heading font-medium text-text-primary",
                single
                  ? "text-sm leading-tight"
                  : compact
                    ? "mt-2 text-base leading-tight"
                    : "mt-2 text-lg"
              )}
            >
              {service.name}
            </h3>
          </div>
          {/* In the narrow single-column layout the summary is clamped so the
              four cards always fit the pinned viewport; the /services page
              carries the full text. */}
          <p
            className={clsx(
              "flex-1 text-text-secondary",
              single
                ? "mt-1 line-clamp-2 text-xs leading-snug"
                : compact
                  ? "mt-1.5 text-[13px] leading-snug"
                  : "mt-1.5 text-sm leading-relaxed"
            )}
          >
            {service.summary}
          </p>
          <Link
            href={`/services/${service.slug}`}
            className={clsx(
              "inline-flex items-center gap-1 font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded",
              single ? "mt-2 text-[13px]" : "text-sm",
              !single && (compact ? "mt-3" : "mt-4")
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

function SectionCopy({
  compact = false,
  hideIntro = false,
}: {
  compact?: boolean;
  hideIntro?: boolean;
}) {
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
      {!hideIntro && (
        <p
          className={clsx(
            "max-w-xl text-text-secondary",
            compact ? "mt-3 text-sm" : "mt-4"
          )}
        >
          Every service is built to plug into the same brand system — so
          identity, motion, and content stay consistent no matter which team
          you start with.
        </p>
      )}
    </>
  );
}

export function MainServices() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
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
      // Tall enough to give the 5s clip a comfortable scrub. The composition
      // (four cards left, video panel right) is pinned for the whole section,
      // and only the video scrubs — so it ENDS on the full frame: the four
      // cards still in place with the growth-chart fully formed in the panel.
      className="relative h-[220vh] lg:h-[240vh]"
      aria-labelledby="services-heading"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#010103]">
        {/* Scroll-scrubbed background in the SAME left panel as the hero's
            clip 3 (object-contain, no crop / no zoom), so the brain that opens
            clip 4 is the exact size and position the hero closes on — the two
            connect without the frame changing side or size. Cards sit on the right. */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover [object-position:65%_center] sm:[object-position:center] lg:w-[60%] lg:object-contain lg:[object-position:left_center] xl:w-[64%]"
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

        {/* On mobile the video is full-bleed, so darken the left for the cards;
            on lg the video is a left panel and the cards sit on plain
            background on the right, so the scrim fades out there. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent lg:hidden"
        />

        {/* Pinned composition: video (brain → towers) on the left, the four
            disciplines on the right — mirroring the hero's clip 3 (artwork
            left, copy right), so the two sections hand off on the same side
            instead of the brain jumping across the screen. Top-aligned below
            the fixed header. */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-start px-4 pb-8 pt-20 sm:px-6 sm:pt-24 lg:px-8">
          <div className="lg:ml-auto lg:w-[40%] xl:w-[36%]">
            <SectionCopy compact hideIntro />
            <ServiceCards compact single />
          </div>
        </div>
      </div>
    </section>
  );
}

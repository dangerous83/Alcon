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

function ServiceCards() {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {featured.map((service, index) => (
        <Card
          as="li"
          key={service.slug}
          className="flex flex-col bg-surface-elevated/70 p-5 backdrop-blur-sm"
        >
          <span className="font-mono text-xs text-text-secondary">
            0{index + 1}
          </span>
          <h3 className="mt-3 font-heading text-lg font-medium text-text-primary">
            {service.name}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
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
      <Heading as="h2" id="services-heading" size="lg" className="mt-4">
        One creative system, four disciplines.
      </Heading>
      <p className="mt-4 max-w-xl text-text-secondary">
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
      className="relative bg-[#010103]"
      aria-labelledby="services-heading"
    >
      {/* Scroll-scrubbed background pinned for the length of the section: the
          growth-chart clip, picking up from the brain frame the hero ended on.
          The content below scrolls over it, so it isn't boxed into one
          viewport. Towers sit on the right of the frame; the cards on the left
          are translucent, so the video reads through them either way. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover [object-position:70%_center] sm:[object-position:center]"
            muted
            playsInline
            preload="auto"
            poster={assetPath("/images/services-poster.jpg")}
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
          {/* Legibility scrim: darkens the left where the cards sit, fading
              out to the right where the towers rise. */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="lg:max-w-[60%]">
          <SectionCopy />
          <ServiceCards />
        </div>
        {/* Extra travel so the clip finishes on the towers before the section
            releases and the next one scrolls in. */}
        <div aria-hidden className="h-[45vh] lg:h-[60vh]" />
      </div>
    </section>
  );
}

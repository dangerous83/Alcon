"use client";

import { useEffect } from "react";

/**
 * Forces every full page load to start at the very top.
 *
 * The homepage hero is a ~340vh scroll-scrubbed section. Browsers restore the
 * previous scroll offset on reload, which could drop a returning visitor part
 * way down that section — onto a near-black video frame with the footer in
 * view — instead of at the hero's opening frame. Setting scrollRestoration to
 * "manual" and jumping to the top on mount guarantees the page always opens on
 * the hero, never mid-scroll or at the footer.
 *
 * Skipped when the URL carries a hash so in-page anchors (e.g. the skip link)
 * still work.
 */
export function ScrollTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}

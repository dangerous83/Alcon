"use client";

import { createContext, useContext } from "react";

/**
 * True once the intro overlay has been dismissed — or was never shown at all
 * (reduced motion, or a returning visitor this session).
 *
 * Anything rendered below the intro gate lives inside a `display:none`
 * wrapper while the overlay is up, so it has no layout box. The scroll-scrubbed
 * hero reads this to know when it has actually become visible: creating its
 * GSAP ScrollTrigger against a zero-height element collapses the scrub range to
 * nothing, which leaves the video frozen on frame 0 after the reveal. It waits
 * for `true` before wiring the trigger up.
 *
 * Defaults to `true` so any consumer used outside the gate (other pages, tests)
 * behaves as normally visible.
 */
export const IntroEnteredContext = createContext<boolean>(true);

export const useIntroEntered = () => useContext(IntroEnteredContext);

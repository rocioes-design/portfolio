"use client";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { GooeyTextReveal } from "../components/ui/gooey-text-reveal";

const PLAYED_KEY = "intro-reveal-played";

// Plays the gooey reveal on the first home page visit of a browser session only.
// While it plays, the marker highlight stays hidden and is swiped in once the text is legible.
export function IntroTitle({ children }: { children: React.ReactNode }) {
  const [alreadyPlayed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(PLAYED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [markerPending, setMarkerPending] = useState(false);
  const showMarker = useCallback(() => setMarkerPending(false), []);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!alreadyPlayed && !reducedMotion) setMarkerPending(true);
  }, [alreadyPlayed]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(PLAYED_KEY, "1");
    } catch {}
  }, []);

  return (
    <GooeyTextReveal
      className={`framer-bio-title${markerPending ? " marker-pending" : ""}`}
      disabled={alreadyPlayed}
      duration={1.4}
      stagger={0.12}
      blurAmount={0.4}
      onComplete={showMarker}
    >
      {children}
    </GooeyTextReveal>
  );
}

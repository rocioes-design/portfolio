"use client";
import { useEffect } from "react";
import "./magic-cursor.css";

// Sparkle trail adapted from bucharitesh's Magic Cursor (21st.dev), without the glow trail
// or text-shadow: only the falling sparkles. Sparkle shape from Lucide (ISC license).
const SPARKLE_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>';

interface MagicCursorProps {
  /** How long each sparkle falls, in ms. */
  duration?: number;
  /** Minimum time between sparkles, in ms. */
  minTimeBetween?: number;
  /** Minimum pointer travel between sparkles, in px. */
  minDistanceBetween?: number;
  colors?: string[];
  sizes?: string[];
}

const ANIMATIONS = ["mc-fall-1", "mc-fall-2", "mc-fall-3"];
const DEFAULT_COLORS = ["#DF517A", "#E66089", "#F29BB5"];
const DEFAULT_SIZES = ["1.4rem", "1rem", "0.6rem"];
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export function MagicCursor({
  duration = 1500,
  minTimeBetween = 250,
  minDistanceBetween = 75,
  colors = DEFAULT_COLORS,
  sizes = DEFAULT_SIZES,
}: MagicCursorProps) {
  useEffect(() => {
    // Only for mouse-driven devices, and never for people who prefer reduced motion.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    let count = 0;
    let lastTime = 0;
    let lastPos = { x: -9999, y: -9999 };

    const spawn = (x: number, y: number) => {
      const star = document.createElement("div");
      star.className = "magic-cursor-star";
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.fontSize = pick(sizes);
      star.style.color = pick(colors);
      star.style.animationName = ANIMATIONS[count++ % ANIMATIONS.length];
      star.style.animationDuration = `${duration}ms`;
      star.innerHTML = SPARKLE_SVG;
      document.body.appendChild(star);
      setTimeout(() => star.remove(), duration);
    };

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const farEnough = Math.hypot(e.clientX - lastPos.x, e.clientY - lastPos.y) >= minDistanceBetween;
      const longEnough = now - lastTime > minTimeBetween;
      if (farEnough || longEnough) {
        spawn(e.clientX, e.clientY);
        lastTime = now;
        lastPos = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.querySelectorAll(".magic-cursor-star").forEach((el) => el.remove());
    };
  }, [duration, minTimeBetween, minDistanceBetween, colors, sizes]);

  return null;
}

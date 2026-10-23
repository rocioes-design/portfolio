"use client";

import { useState } from "react";

// The Bloom mark: four circles meeting at the center, with a four-point star in the negative space.
export const BLOOM_PATH = "M50 6a22 22 0 0 1 22 22a22 22 0 0 1 0 44a22 22 0 0 1-44 0a22 22 0 0 1 0-44A22 22 0 0 1 50 6ZM50 36Q53 47 64 50Q53 53 50 64Q47 53 36 50Q47 47 50 36Z";

// Spins a full turn each time the pointer moves onto it (always forward, never back on leave).
// It's a small, occasional delight, so it can run a little longer than regular UI motion.
export function BloomLogo() {
  const [turns, setTurns] = useState(0);
  return (
    <span
      className="bloom-logo"
      aria-hidden="true"
      onPointerEnter={() => setTurns((t) => t + 1)}
      style={{ "--turns": turns } as React.CSSProperties}
    >
      <svg viewBox="0 0 100 100"><path fillRule="evenodd" d={BLOOM_PATH} /></svg>
    </span>
  );
}

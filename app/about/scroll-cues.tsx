"use client";
import { useEffect, useState } from "react";
import { HandDrawnFilters } from "../../components/ui/hand-drawn";

// Two ways to say "there's more below" on About, both borrowed from old printed books.
// Both jump to the FAQ.

// A catchword: the first word of the next page, set at the bottom right of this one
export function Catchword() {
  return (
    <p className="catchword">
      <a href="#about-faq-title">
        Questions…
        <svg viewBox="0 0 22 22" aria-hidden="true"><path d="M3 4C11 3 16 7 15 17M11 14l4 4 4-5" /></svg>
      </a>
    </p>
  );
}

// A manicule (☞): the little pointing hand printers used in margins, inked in sepia and pointing down.
// It waits at the bottom of the screen and fades away once you start scrolling.
export function PointingHand() {
  const [away, setAway] = useState(false);
  useEffect(() => {
    const check = () => setAway(window.scrollY > 60);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  return (
    <a className="pointing-hand" href="#about-faq-title" aria-label="Skip down to the questions" data-away={away || undefined} tabIndex={away ? -1 : undefined}>
      <svg viewBox="0 0 40 66" aria-hidden="true">
        <defs><HandDrawnFilters id="manicule" wobble={0.5} /></defs>
        <g filter="url(#manicule-ink)">
          {/* Cuff, with a ruffle of lace at its edge */}
          <path className="pointing-hand__fill" d="M7 2H33V12H7Z" />
          <path className="pointing-hand__ink" d="M7 2H33V12H7Z" />
          <path className="pointing-hand__hatch" d="M11 3.5V10.5M15 3.5V10.5M19 3.5V10.5M23 3.5V10.5M27 3.5V10.5M31 3.5V10.5" />
          <path className="pointing-hand__ink" d="M7 12Q9 15 11 12Q13 15 15 12Q17 15 19 12Q21 15 23 12Q25 15 27 12Q29 15 31 12Q32 14 33 12" />
          {/* The hand: back of the hand, curled fingers, and the index finger pointing down */}
          <path className="pointing-hand__fill pointing-hand__ink" d="M10 14C8.5 20 8 25 10 31L12.2 52Q14.6 58.5 17 52L17.4 35Q20 39 22.8 35Q25.4 38.6 28 34.6Q30.6 37.4 31.6 32C32.4 25 31.4 19 30.6 14Z" />
          <path className="pointing-hand__ink" d="M10.4 22Q15 25 17.2 31.5M13.2 51Q14.6 54.6 16 51M17.6 35Q18.4 30 20.4 29M22.8 35Q23.6 30.4 25.4 29.6M28 34.6Q28.8 30.6 30 30" />
          <path className="pointing-hand__hatch" d="M26 17L29 20M25 20.5L29.5 25M26.5 25.5L30 29" />
        </g>
      </svg>
    </a>
  );
}

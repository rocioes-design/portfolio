"use client";

import { useEffect, useRef, useState } from "react";
import { SIGNATURE_STROKES, SIGNATURE_TIMELINE, SIGNATURE_VIEWBOX } from "./signature-data";

const DRAW_MS = 2000; // the whole signature, start to finish

// One gesture: the pen eases in, writes at an even pace, and settles at the end.
const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

// "Rocío Espinosa" written out in one continuous pen motion the first time it scrolls into view.
// The server renders it fully drawn (so it shows without JavaScript); the browser hides it, then draws it.
// Visitors who prefer reduced motion get the finished signature right away.
export function SignatureReveal({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const paths = Array.from(el.querySelectorAll("path"));
    setArmed(true);
    let frame = 0;
    const draw = (start: number) => (now: number) => {
      const t = Math.min(1, (now - start) / DRAW_MS);
      const pen = ease(t) * SIGNATURE_TIMELINE;
      paths.forEach((p, i) => {
        const { at, len } = SIGNATURE_STROKES[i];
        p.style.strokeDashoffset = String(1.02 - Math.min(1, Math.max(0, (pen - at) / len)) * 1.02);
      });
      if (t < 1) frame = requestAnimationFrame(draw(start));
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect();
        frame = requestAnimationFrame((now) => draw(now)(now));
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <svg ref={ref} className={`signature${armed ? " is-armed" : ""} ${className}`} viewBox={SIGNATURE_VIEWBOX} role="img" aria-label="Rocío Espinosa">
      {SIGNATURE_STROKES.map((s, i) => <path key={i} d={s.d} pathLength={1} />)}
    </svg>
  );
}

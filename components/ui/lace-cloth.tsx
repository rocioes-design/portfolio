"use client";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./lace-cloth.css";

// A linen cloth edged with needle lace. The lace is drawn to the cloth's real size (measured),
// so the scallops stay round however tall the content gets. From the outside in:
// a raised scalloped edge with tiny picot loops, a fan motif in solid "cloth stitch" in every
// scallop shaped like a scallop shell, small flowers on an open hexagonal mesh, and a ladder band where it meets the linen.
// The threads are white with a soft shadow and the mesh is see-through, like real lace.

type P = [number, number];
const EDGE = 20; // scallop centres sit this far in from the outer edge
const R = 17; // scallop radius
const STEP = 32; // less than 2 × R, so neighbouring scallops overlap into a notch
const LACE = 60; // lace band width; the linen starts here
const n = (v: number) => v.toFixed(1);
const pt = (p: P) => `${n(p[0])} ${n(p[1])}`;

function along(len: number) {
  const k = Math.max(3, Math.round((len - 2 * EDGE) / STEP));
  return Array.from({ length: k + 1 }, (_, i) => EDGE + (i * (len - 2 * EDGE)) / k);
}

// A scallop-shell fan opening "up" (outward) from its base: a rim of five rounded lobes,
// ribs running out to each lobe, and a small ring at the base
function fan(): { fill: string; cord: string; ribs: string } {
  const B: P = [0, 7];
  const at = (deg: number, r: number): P => {
    const a = (deg * Math.PI) / 180;
    return [B[0] + Math.sin(a) * r, B[1] - Math.cos(a) * r];
  };
  const lobes = 5, from = -72, span = 144, R0 = 10.5;
  let rim = `M${pt(B)}L${pt(at(from, R0))}`;
  let ribs = "";
  for (let k = 0; k < lobes; k++) {
    const a0 = from + (span * k) / lobes, a1 = from + (span * (k + 1)) / lobes, mid = (a0 + a1) / 2;
    rim += `Q${pt(at(mid, R0 * 1.3))} ${pt(at(a1, R0))}`;
    ribs += `M${pt(at(mid, 2.4))}L${pt(at(mid, R0 * 0.98))}`;
  }
  rim += "Z";
  const ring = `M${B[0] + 1.9} ${B[1]}A1.9 1.9 0 1 1 ${B[0] - 1.9} ${B[1]}A1.9 1.9 0 1 1 ${B[0] + 1.9} ${B[1]}Z`;
  return { fill: rim, cord: rim + ring, ribs };
}
const FAN = fan();

// A small four-petal flower for the mesh between scallops
const SPRIG = (() => {
  let d = "";
  for (const a of [0, 90, 180, 270]) {
    const r = (a * Math.PI) / 180;
    const dir: P = [Math.cos(r), Math.sin(r)];
    const side: P = [-dir[1], dir[0]];
    const tip: P = [dir[0] * 5, dir[1] * 5];
    d += `M0 0Q${pt([dir[0] * 2.6 + side[0] * 2, dir[1] * 2.6 + side[1] * 2])} ${pt(tip)}Q${pt([dir[0] * 2.6 - side[0] * 2, dir[1] * 2.6 - side[1] * 2])} 0 0Z`;
  }
  return d;
})();

export function LaceCloth({ children, className }: { children: ReactNode; className?: string }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 560, h: 620 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { w, h } = size;
  const xs = along(w);
  const ys = along(h);

  // Scallop centres clockwise round the cloth (top, right, bottom, left), corners once each
  const ring: { c: P; a: number }[] = [
    ...xs.map((x, i) => ({ c: [x, EDGE] as P, a: i === 0 ? -45 : i === xs.length - 1 ? 45 : 0 })),
    ...ys.slice(1, -1).map((y) => ({ c: [w - EDGE, y] as P, a: 90 })),
    ...xs.slice().reverse().map((x, i) => ({ c: [x, h - EDGE] as P, a: i === 0 ? 135 : i === xs.length - 1 ? 225 : 180 })),
    ...ys.slice(1, -1).reverse().map((y) => ({ c: [EDGE, y] as P, a: 270 })),
  ];

  // The outer edge: an arc of each scallop between the points where it meets its neighbours
  const meet = (A: P, B: P): P => {
    const dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy);
    const hh = Math.sqrt(Math.max(0, R * R - (d / 2) ** 2));
    return [(A[0] + B[0]) / 2 + (dy / d) * hh, (A[1] + B[1]) / 2 - (dx / d) * hh];
  };
  const meets = ring.map((s, i) => meet(s.c, ring[(i + 1) % ring.length].c));
  let edge = `M${pt(meets[meets.length - 1])}`;
  const picots: P[] = [];
  ring.forEach((s, i) => {
    const from = meets[(i - 1 + ring.length) % ring.length], to = meets[i];
    const a0 = Math.atan2(from[1] - s.c[1], from[0] - s.c[0]);
    let a1 = Math.atan2(to[1] - s.c[1], to[0] - s.c[0]);
    while (a1 < a0) a1 += Math.PI * 2;
    edge += `A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${pt(to)}`;
    // Tiny loops of thread standing off the edge
    const count = Math.max(3, Math.round(((a1 - a0) * R) / 6));
    for (let k = 1; k < count; k++) {
      const t = a0 + ((a1 - a0) * k) / count;
      picots.push([s.c[0] + Math.cos(t) * (R + 1.5), s.c[1] + Math.sin(t) * (R + 1.5)]);
    }
  });
  edge += "Z";

  // The heading: two cords with ladder rungs between them, just outside the linen
  const hi = LACE - 9, ho = LACE - 3;
  const box = (inset: number) => `M${inset} ${inset}H${w - inset}V${h - inset}H${inset}Z`;
  let rungs = "";
  for (let x = hi + 3; x < w - hi; x += 3.2) rungs += `M${n(x)} ${hi}V${ho}M${n(x)} ${h - ho}V${h - hi}`;
  for (let y = ho + 3; y < h - ho; y += 3.2) rungs += `M${hi} ${n(y)}H${ho}M${w - ho} ${n(y)}H${w - hi}`;

  // Small flowers on the mesh between neighbouring scallops (not at the corners)
  const sprigs: P[] = [];
  const inset = EDGE + 15;
  xs.slice(0, -1).forEach((x, i) => { if (i > 0 && i < xs.length - 2 || xs.length < 4) { const m = (x + xs[i + 1]) / 2; sprigs.push([m, inset], [m, h - inset]); } });
  ys.slice(0, -1).forEach((y, i) => { if (i > 0 && i < ys.length - 2 || ys.length < 4) { const m = (y + ys[i + 1]) / 2; sprigs.push([inset, m], [w - inset, m]); } });

  return (
    <div ref={ref} className={`lace-cloth ${className || ""}`}>
      <svg className="lace-cloth__fabric" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <defs>
          {/* Tulle: an open hexagonal mesh of fine thread */}
          <pattern id={`${id}-net`} width="6" height="10.4" patternUnits="userSpaceOnUse">
            <path d="M0 1.7L3 0L6 1.7V5.2L3 6.9L0 5.2ZM3 6.9V10.4" fill="none" stroke="#FFFDF8" strokeWidth=".5" />
          </pattern>
          {/* Cloth stitch: threads woven close together, so the motifs read as solid */}
          <pattern id={`${id}-cloth`} width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="1.6" height="1.6" fill="rgba(255,253,248,.82)" />
            <path d="M0 .4H1.6M.4 0V1.6" stroke="rgba(214,200,176,.5)" strokeWidth=".35" />
          </pattern>
          <pattern id={`${id}-weave`} width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="#EFE8DB" />
            <path d="M0 .5H3M.5 0V3" stroke="rgba(150,130,100,.055)" strokeWidth="1" />
          </pattern>
          <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(120,96,64,.14)" />
            <stop offset="1" stopColor="rgba(120,96,64,0)" />
          </linearGradient>
        </defs>

        <g className="lace-cloth__lace">
          {/* The open mesh, between the outer edge and the heading */}
          <path d={`${edge}${box(hi)}`} fillRule="evenodd" fill={`url(#${id}-net)`} />
          {/* Motifs in cloth stitch, outlined with a raised cord */}
          {ring.map(({ c, a }, i) => (
            <g key={i} transform={`translate(${pt(c)}) rotate(${a})`}>
              <path d={FAN.fill} fill={`url(#${id}-cloth)`} />
              <path className="lace-cloth__cord" d={FAN.cord} />
              <path className="lace-cloth__cord lace-cloth__cord--fine" d={FAN.ribs} />
            </g>
          ))}
          {sprigs.map((p, i) => (
            <g key={`s${i}`} transform={`translate(${pt(p)})`}>
              <path d={SPRIG} fill={`url(#${id}-cloth)`} />
              <path className="lace-cloth__cord lace-cloth__cord--fine" d={SPRIG} />
              <circle className="lace-cloth__cord lace-cloth__cord--fine" r="1" />
            </g>
          ))}
          <path className="lace-cloth__cord lace-cloth__cord--edge" d={edge} />
          <g className="lace-cloth__cord lace-cloth__cord--fine">
            {picots.map((p, i) => <circle key={i} cx={n(p[0])} cy={n(p[1])} r="1.15" />)}
          </g>
          <path className="lace-cloth__cord" d={`${box(hi)}${box(ho)}`} />
          <path className="lace-cloth__cord lace-cloth__cord--fine" d={rungs} />
        </g>

        {/* The linen, with a soft fold at the join and a running stitch holding the lace on */}
        <rect x={LACE} y={LACE} width={w - 2 * LACE} height={h - 2 * LACE} fill={`url(#${id}-weave)`} />
        <rect x={LACE} y={LACE} width={w - 2 * LACE} height="6" fill={`url(#${id}-fold)`} />
        <path className="lace-cloth__fold" d={box(LACE)} />
        <path className="lace-cloth__stitch" d={box(LACE + 5)} />
      </svg>
      <div className="lace-cloth__content">{children}</div>
    </div>
  );
}

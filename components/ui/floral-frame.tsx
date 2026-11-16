"use client";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./floral-frame.css";
import { HandDrawnFilters } from "./hand-drawn";

// A botanical frame in the style of old hand-coloured book borders: a flowering vine winds
// round the card, flower clusters sit in the corners and sprays creep in from the inner corners
// so the opening reads as a soft arch. Every leaf and petal is inked and washed with colour.
// Drawn to the measured size, like the lace cloth.

type P = [number, number];
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const mul = (a: P, k: number): P => [a[0] * k, a[1] * k];
const unit = (a: P): P => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };
const perp = (a: P): P => [-a[1], a[0]];
const pt = (p: P) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
const deg = (v: P) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;

function bez(p0: P, c1: P, c2: P, p1: P, t: number): P {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * p0[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * p1[i];
  return [f(0), f(1)];
}

type Leaf = { outline: string; shade: string; veins: string; hatch: string; tone: "leaf" | "leaf-dark" };
type Art = {
  stems: string[]; strands: string[]; leaves: Leaf[];
  flowers: { c: P; r: number; a: number }[]; buds: { c: P; r: number; a: number }[];
  roses?: { c: P; r: number; a: number }[]; dots?: { c: P; r: number }[]; hairs?: string[];
};

// A small repeatable "random" number from a position, so the hand-drawn irregularities
// come out the same on the server and in the browser
function wiggle(p: P, k: number) {
  const v = Math.sin(p[0] * 12.9898 + p[1] * 78.233 + k * 37.719) * 43758.5453;
  return v - Math.floor(v) - 0.5;
}

// A leaf with a curved midrib, side veins, hatched shading on one half and an irregular edge.
// Some are toothed, some lobed like an oak leaf.
function leaf(art: Art, base: P, tip: P, o: { dark?: boolean; teeth?: boolean; lobes?: number; bend?: number; width?: number } = {}) {
  const d = sub(tip, base);
  const L = Math.hypot(d[0], d[1]);
  const s = perp(unit(d));
  const lobes = o.lobes ?? (wiggle(base, 1) > 0.25 ? 3 : 0);
  const W = L * (o.width ?? (lobes ? 0.48 : 0.36));
  const bend = (o.bend ?? 0.07) * L;
  const N = lobes ? 24 : 16;
  const mid = (t: number) => add(add(base, mul(d, t)), mul(s, bend * Math.sin(Math.PI * t)));
  const shape = (t: number) => (lobes ? 0.62 + 0.38 * Math.abs(Math.sin(Math.PI * (lobes + 0.5) * t)) : 1);
  const half = (t: number) => (W / 2) * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.85) * shape(t);
  const edge = (t: number, side: 1 | -1, i: number) =>
    add(mid(t), mul(s, side * half(t) * (o.teeth && !lobes && i % 2 ? 1.16 : 1) * (1 + wiggle(base, i * side) * 0.12)));
  const ts = Array.from({ length: N + 1 }, (_, i) => i / N);
  const left = ts.map((t, i) => edge(t, 1, i));
  const right = ts.map((t, i) => edge(t, -1, i));
  const mids = ts.map(mid);
  const outline = `M${left.map(pt).join("L")}L${right.slice(0, -1).reverse().map(pt).join("L")}Z`;
  const shade = `M${left.map(pt).join("L")}L${mids.slice(0, -1).reverse().map(pt).join("L")}Z`;
  let veins = `M${mids.slice(0, N - 1).map(pt).join("L")}`;
  for (const t of [0.24, 0.42, 0.6, 0.76]) {
    for (const side of [1, -1] as const) {
      veins += `M${pt(mid(t))}Q${pt(add(mid(t + 0.06), mul(s, side * half(t) * 0.35)))} ${pt(add(mid(t + 0.14), mul(s, side * half(t + 0.14) * 0.8)))}`;
    }
  }
  // Engraver's hatching on the shaded half: short parallel strokes from the midrib outward
  let hatch = "";
  for (let t = 0.12; t < 0.86; t += 0.055) {
    hatch += `M${pt(add(mid(t), mul(s, half(t) * 0.18)))}L${pt(add(mid(t + 0.07), mul(s, half(t + 0.07) * 0.86)))}`;
  }
  const tone = o.dark ? "leaf-dark" : "leaf";
  art.leaves.push({ outline, shade, veins, hatch, tone });
}

// The vine along one side. Points are worked out in "strip" space (s runs along the side,
// o runs across the band from the outer edge) and mapped onto the page.
function sideVine(art: Art, len: number, band: number, map: (p: P) => P, salt: number) {
  const c = band / 2;
  const A = band * 0.17;
  const start = band * 0.85, end = len - band * 0.85;
  const n = Math.max(2, Math.round((end - start) / (band * 1.3)));
  const hw = (end - start) / n;
  let main = "", second = "";
  for (let i = 0; i < n; i++) {
    const s0 = start + i * hw, s1 = s0 + hw, sign = (i + salt) % 2 ? 1 : -1;
    const p0: P = [s0, c], c1: P = [s0 + hw * 0.36, c + sign * A * 1.33], c2: P = [s1 - hw * 0.36, c + sign * A * 1.33], p1: P = [s1, c];
    main += `${i ? "" : `M${pt(map(p0))}`}C${pt(map(c1))} ${pt(map(c2))} ${pt(map(p1))}`;
    // A thinner second stem twines round the first, crossing it at every node
    second += `${i ? "" : `M${pt(map(p0))}`}C${pt(map([c1[0], c - sign * A * 0.7]))} ${pt(map([c2[0], c - sign * A * 0.7]))} ${pt(map(p1))}`;
    const peak = bez(p0, c1, c2, p1, 0.5);
    const hollow = -sign;
    const kind = (i + salt) % 3;
    if (kind === 0) {
      const fc: P = [s0 + hw / 2, c + hollow * A * 1.05];
      art.stems.push(`M${pt(map(peak))}L${pt(map(fc))}`);
      art.flowers.push({ c: map(fc), r: band * 0.17, a: i * 23 });
      leaf(art, map(peak), map([peak[0] + hw * 0.4, c + hollow * A * 1.9]), { dark: true, teeth: true, width: 0.32 });
    } else if (kind === 1) {
      leaf(art, map(peak), map([peak[0] - hw * 0.46, c + hollow * A * 1.7]), { teeth: i % 2 === 0 });
      leaf(art, map(peak), map([peak[0] + hw * 0.46, c + hollow * A * 1.7]), { dark: true, bend: -0.07 });
    } else {
      const bc: P = [s0 + hw * 0.64, c + hollow * A * 1.15];
      art.stems.push(`M${pt(map(peak))}Q${pt(map([s0 + hw * 0.62, peak[1]]))} ${pt(map(bc))}`);
      art.buds.push({ c: map(bc), r: band * 0.07, a: deg(sub(map(bc), map(peak))) });
      leaf(art, map(peak), map([peak[0] - hw * 0.42, c + hollow * A * 1.6]), { teeth: true });
    }
    // Leaves on the outer side of each bend
    for (const t of [0.2, 0.8]) {
      const b = bez(p0, c1, c2, p1, t);
      leaf(art, map(b), map([b[0] + (t < 0.5 ? -1 : 1) * hw * 0.24, c + sign * A * 2.45]), { dark: t > 0.5, bend: t < 0.5 ? 0.08 : -0.08 });
    }
  }
  art.stems.push(main);
  art.strands.push(second);
}

// A spray creeping in from one inner corner: two arms hugging the edges, with leaves,
// flowers and buds. Drawn for the top left; map() mirrors it into the other corners.
function cornerSpray(art: Art, size: number, map: (p: P) => P) {
  const arms: [P, P, P, P][] = [
    [[18, 18], [size * 0.3, 2], [size * 0.7, 24], [size, 14]],
    [[18, 18], [2, size * 0.3], [24, size * 0.7], [14, size]],
  ];
  arms.forEach((arm, k) => {
    art.stems.push(`M${pt(map(arm[0]))}C${pt(map(arm[1]))} ${pt(map(arm[2]))} ${pt(map(arm[3]))}`);
    [0.2, 0.34, 0.5, 0.66, 0.82].forEach((t, j) => {
      const b = bez(...arm, t);
      const tan = unit(sub(bez(...arm, Math.min(1, t + 0.02)), b));
      const side = (j % 2 ? 1 : -1) * (k ? -1 : 1);
      const l = size * (0.24 - t * 0.09);
      const tip = add(add(b, mul(tan, l * 0.65)), mul(perp(tan), side * l * 0.75));
      leaf(art, map(b), map(tip), { dark: j % 2 === 1, teeth: j % 3 === 0 });
    });
    const fb = bez(...arm, 0.42);
    const inward: P = k ? [1, 0] : [0, 1];
    const fc = add(fb, mul(inward, size * 0.13));
    art.stems.push(`M${pt(map(fb))}L${pt(map(fc))}`);
    art.flowers.push({ c: map(fc), r: size * 0.085, a: k * 30 });
    const end = arm[3];
    const tipDir: P = k ? [0, 1] : [1, 0];
    art.buds.push({ c: map(add(end, mul(tipDir, 3))), r: size * 0.04, a: deg(sub(map(add(end, tipDir)), map(end))) });
  });
  leaf(art, map([16, 16]), map([size * 0.36, size * 0.34]), { dark: true, teeth: true, width: 0.4 });
  art.flowers.push({ c: map([20, 20]), r: size * 0.12, a: 12 });
}

const PETAL = (r: number) =>
  `M0 ${-r * 0.1}C${r * 0.46} ${-r * 0.28} ${r * 0.5} ${-r * 0.92} ${r * 0.12} ${-r}Q0 ${-r * 0.9} ${-r * 0.12} ${-r}C${-r * 0.5} ${-r * 0.92} ${-r * 0.46} ${-r * 0.28} 0 ${-r * 0.1}Z`;

// Fine lines from the base of each petal, like the striations in a hand-coloured print
const STRIATIONS = (r: number) =>
  `M0 ${-r * 0.2}L0 ${-r * 0.78}M${r * 0.05} ${-r * 0.22}Q${r * 0.2} ${-r * 0.5} ${r * 0.2} ${-r * 0.72}M${-r * 0.05} ${-r * 0.22}Q${-r * 0.2} ${-r * 0.5} ${-r * 0.2} ${-r * 0.72}`;

type Mode = "wash" | "ink";

// Each flower and bud is drawn twice: once as colour (under the wash filter), once as line work
function Flower({ c, r, a, id, mode }: { c: P; r: number; a: number; id: string; mode: Mode }) {
  const petal = PETAL(r);
  const lines = STRIATIONS(r);
  return (
    <g transform={`translate(${pt(c)}) rotate(${a.toFixed(0)})`}>
      {[0, 72, 144, 216, 288].map((t) => (
        <g key={t} transform={`rotate(${(t + wiggle(c, t) * 8).toFixed(1)})`}>
          {mode === "wash" ? <path d={petal} fill={`url(#${id}-petal)`} /> : <><path className="floral-frame__petal" d={petal} /><path className="floral-frame__striation" d={lines} /></>}
        </g>
      ))}
      {mode === "wash" ? (
        <circle className="floral-frame__heart" r={(r * 0.26).toFixed(2)} />
      ) : (
        <>
          <circle className="floral-frame__heart-ink" r={(r * 0.26).toFixed(2)} />
          {Array.from({ length: 11 }, (_, i) => {
            const t = (i / 11) * Math.PI * 2;
            const rr = r * (0.34 + wiggle(c, i) * 0.08);
            return <circle key={i} className="floral-frame__stamen" cx={(Math.cos(t) * rr).toFixed(2)} cy={(Math.sin(t) * rr).toFixed(2)} r={(r * 0.05).toFixed(2)} />;
          })}
        </>
      )}
    </g>
  );
}

function Bud({ c, r, a, id, mode }: { c: P; r: number; a: number; id: string; mode: Mode }) {
  const body = `M0 0C${r} ${-r * 0.4} ${r * 0.75} ${-r * 1.8} 0 ${-r * 2.3}C${-r * 0.75} ${-r * 1.8} ${-r} ${-r * 0.4} 0 0Z`;
  const sepal = (side: number) => `M0 0Q${side * r * 0.9} ${-r * 0.5} ${side * r * 0.35} ${-r * 1.2}Q${side * r * 0.25} ${-r * 0.5} 0 0Z`;
  const fold = `M0 ${-r * 0.3}Q${r * 0.3} ${-r * 1.2} 0 ${-r * 2.1}`;
  return (
    <g transform={`translate(${pt(c)}) rotate(${(a + 90).toFixed(0)}) translate(0 ${(r * 0.4).toFixed(2)})`}>
      {mode === "wash" ? (
        <>
          <path d={body} fill={`url(#${id}-petal)`} />
          <path className="floral-frame__sepal" d={sepal(1)} />
          <path className="floral-frame__sepal" d={sepal(-1)} />
        </>
      ) : (
        <>
          <path className="floral-frame__petal" d={body} />
          <path className="floral-frame__striation" d={fold} />
          <path className="floral-frame__edge" d={sepal(1)} />
          <path className="floral-frame__edge" d={sepal(-1)} />
        </>
      )}
    </g>
  );
}

export function FloralFrame({ children, className }: { children: ReactNode; className?: string }) {
  const id = `ff${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 760, h: 640 });

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
  const compact = w < 560;
  const band = compact ? 38 : 54;
  const spray = compact ? 84 : 134;

  const art: Art = { stems: [], strands: [], leaves: [], flowers: [], buds: [] };
  sideVine(art, w, band, ([s, o]) => [s, o], 0);
  sideVine(art, w, band, ([s, o]) => [w - s, h - o], 1);
  sideVine(art, h, band, ([s, o]) => [o, h - s], 1);
  sideVine(art, h, band, ([s, o]) => [w - o, s], 0);
  for (const [fx, fy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]] as P[]) {
    const m = ([x, y]: P): P => [fx > 0 ? band + x : w - band - x, fy > 0 ? band + y : h - band - y];
    cornerSpray(art, spray, m);
    // A cluster where the vines meet in the corner
    const corner = ([x, y]: P): P => [fx > 0 ? x : w - x, fy > 0 ? y : h - y];
    const cc: P = [band * 0.5, band * 0.5];
    leaf(art, corner(cc), corner([band * 1.25, band * 0.15]), { dark: true, teeth: true });
    leaf(art, corner(cc), corner([band * 0.15, band * 1.25]), { teeth: true });
    art.flowers.push({ c: corner(cc), r: band * 0.3, a: 18 });
  }

  return (
    <div ref={ref} className={`floral-frame ${className || ""}`}>
      <svg className="floral-frame__art" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <Botanical art={art} id={id} />
      </svg>
      <div className="floral-frame__content">{children}</div>
    </div>
  );
}

// A loose spray for a page corner: a flower cluster with leafy arms reaching along the top
// and down the side. Drawn for the top left; flip it with CSS for the top right.
const CORNER_W = 200, CORNER_H = 150;
function cornerArt() {
  const art: Art = { stems: [], strands: [], leaves: [], flowers: [], buds: [] };
  const arms: [P, P, P, P][] = [
    [[16, 16], [70, 0], [130, 26], [192, 14]],
    [[16, 16], [0, 50], [28, 96], [14, 142]],
  ];
  arms.forEach((arm, k) => {
    art.stems.push(`M${pt(arm[0])}C${pt(arm[1])} ${pt(arm[2])} ${pt(arm[3])}`);
    art.strands.push(`M${pt(add(arm[0], [3, 3]))}C${pt(add(arm[1], k ? [8, 0] : [0, 9]))} ${pt(add(arm[2], k ? [8, 0] : [0, 9]))} ${pt(bez(...arm, 0.7))}`);
    [0.16, 0.28, 0.4, 0.52, 0.64, 0.76, 0.88].forEach((t, j) => {
      const b = bez(...arm, t);
      const tan = unit(sub(bez(...arm, Math.min(1, t + 0.02)), b));
      const side = (j % 2 ? 1 : -1) * (k ? -1 : 1);
      const l = 30 - t * 14;
      leaf(art, b, add(add(b, mul(tan, l * 0.6)), mul(perp(tan), side * l * 0.78)), { dark: j % 2 === 1, teeth: j % 3 === 0 });
    });
    for (const t of k ? [0.5] : [0.36, 0.7]) {
      const b = bez(...arm, t);
      const fc = add(b, k ? [16, 6] : [6, 16]);
      art.stems.push(`M${pt(b)}L${pt(fc)}`);
      art.flowers.push({ c: fc, r: 10, a: t * 90 });
    }
    const end = arm[3];
    art.buds.push({ c: add(end, k ? [0, 3] : [3, 0]), r: 4.5, a: k ? 90 : 0 });
  });
  leaf(art, [16, 16], [58, 52], { dark: true, teeth: true, width: 0.4 });
  leaf(art, [16, 16], [62, 26], { teeth: true });
  art.flowers.push({ c: [20, 20], r: 16, a: 12 });
  art.flowers.push({ c: [48, 34], r: 9, a: 40 });
  return art;
}
const CORNER = cornerArt();

export function FloralCorner({ className }: { className?: string }) {
  const id = `fc${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg className={`floral-corner ${className || ""}`} viewBox={`-4 -4 ${CORNER_W + 8} ${CORNER_H + 8}`} aria-hidden="true">
      <Botanical art={CORNER} id={id} />
    </svg>
  );
}

// A broad, rounded rose petal pointing up from the centre, with a soft notch at the tip
const ROSE_PETAL = (r: number) =>
  `M0 ${-r * 0.12}C${r * 0.62} ${-r * 0.18} ${r * 0.72} ${-r * 0.92} ${r * 0.24} ${-r}Q${r * 0.06} ${-r * 0.97} 0 ${-r * 0.9}Q${-r * 0.06} ${-r * 0.97} ${-r * 0.24} ${-r}C${-r * 0.72} ${-r * 0.92} ${-r * 0.62} ${-r * 0.18} 0 ${-r * 0.12}Z`;

// An open rose, seen slightly from the side: a ring of wide outer petals, a ring of smaller
// ones turned between them, and a cupped heart. Each ring gets its wash and then its ink, so
// petals in front cleanly overlap the ones behind.
function Rose({ c, r, a, id }: { c: P; r: number; a: number; id: string }) {
  const rings = [
    { size: r, turn: 36, tone: "rose-outer", lines: true },
    { size: r * 0.66, turn: 0, tone: "rose-mid", lines: true },
  ];
  const heart = `M${-r * 0.3} ${-r * 0.02}Q${-r * 0.32} ${-r * 0.36} 0 ${-r * 0.38}Q${r * 0.32} ${-r * 0.36} ${r * 0.3} ${-r * 0.02}Q0 ${r * 0.22} ${-r * 0.3} ${-r * 0.02}Z`;
  const heartLines = `M${-r * 0.16} ${-r * 0.12}Q0 ${-r * 0.3} ${r * 0.16} ${-r * 0.12}M${-r * 0.22} ${-r * 0.02}Q0 ${r * 0.1} ${r * 0.22} ${-r * 0.02}`;
  return (
    <g transform={`translate(${pt(c)}) rotate(${a.toFixed(0)}) scale(1 .86)`}>
      {rings.map(({ size, turn, tone, lines }, k) => {
        const petal = ROSE_PETAL(size);
        const angles = [0, 72, 144, 216, 288].map((t) => t + turn + wiggle(c, t + k) * 10);
        return (
          <g key={k}>
            <g filter={`url(#${id}-wash)`}>{angles.map((t) => <path key={t} d={petal} fill={`url(#${id}-${tone})`} transform={`rotate(${t.toFixed(1)})`} />)}</g>
            <g filter={`url(#${id}-ink)`}>
              {angles.map((t) => (
                <g key={t} transform={`rotate(${t.toFixed(1)})`}>
                  <path className="floral-frame__petal" d={petal} />
                  {lines && <path className="floral-frame__striation" d={STRIATIONS(size)} />}
                </g>
              ))}
            </g>
          </g>
        );
      })}
      <path d={heart} fill={`url(#${id}-rose-heart)`} filter={`url(#${id}-wash)`} />
      <g filter={`url(#${id}-ink)`}>
        <path className="floral-frame__petal" d={heart} />
        <path className="floral-frame__petal" d={heartLines} />
      </g>
    </g>
  );
}

// A Victorian page divider: a knotted figure-eight in the middle, and on each side a vine that
// waves outward with a cabbage rose, a smaller rose, open flowers, buds, berry sprigs and leaves.
// The right half is drawn once and mirrored for the left.
const DIV_W = 360, DIV_H = 76, MID = DIV_W / 2;
function dividerArt() {
  const art: Art = { stems: [], strands: [], leaves: [], flowers: [], buds: [], roses: [], dots: [], hairs: [] };
  const vine: [P, P, P, P][] = [
    [[MID + 6, 42], [MID + 20, 53], [MID + 42, 53], [MID + 58, 41]],
    [[MID + 58, 41], [MID + 74, 29], [MID + 96, 27], [MID + 112, 36]],
    [[MID + 112, 36], [MID + 126, 44], [MID + 142, 47], [MID + 156, 40]],
    [[MID + 156, 40], [MID + 165, 35], [MID + 171, 31], [MID + 175, 32]],
  ];
  art.stems.push(`M${pt(vine[0][0])}${vine.map((s) => `C${pt(s[1])} ${pt(s[2])} ${pt(s[3])}`).join("")}c3 2 2 6-1 5`);
  // A thinner vine twines over and under the main one
  art.strands.push(`M${pt([MID + 4, 37])}C${pt([MID + 18, 23])} ${pt([MID + 42, 21])} ${pt([MID + 58, 41])}C${pt([MID + 70, 53])} ${pt([MID + 90, 55])} ${pt([MID + 106, 47])}`);

  const at = (i: number, t: number) => bez(...vine[i], t);
  const ctrl = (from: P, to: P): P => [(from[0] + to[0]) / 2 + 3, (from[1] + to[1]) / 2];
  const stalk = (from: P, to: P) => art.stems.push(`M${pt(from)}Q${pt(ctrl(from, to))} ${pt(to)}`);
  // A bud sits right on the end of its stalk and points the way the stalk is heading
  const budAt = (from: P, to: P, r: number) => {
    stalk(from, to);
    art.buds.push({ c: to, r, a: deg(sub(to, ctrl(from, to))) });
  };

  // Flowers, in the order they appear going outward
  stalk(at(1, 0.28), [MID + 76, 29]);
  art.roses!.push({ c: [MID + 78, 20], r: 11, a: 6 });
  stalk(at(2, 0.42), [MID + 128, 50]);
  art.roses!.push({ c: [MID + 129, 56], r: 7.5, a: 176 });
  stalk(at(0, 0.55), [MID + 34, 59]);
  art.flowers.push({ c: [MID + 34, 62], r: 5.5, a: 20 });
  stalk(at(2, 0.78), [MID + 148, 28]);
  art.flowers.push({ c: [MID + 149, 25], r: 5, a: 50 });
  budAt(at(3, 0.45), [MID + 168, 24], 2.6);
  budAt([MID + 90, 51], [MID + 96, 58], 2.4);
  budAt(at(1, 0.95), [MID + 112, 23], 2.4);

  // Berry sprigs: a hair-thin stalk that splits, each fork ending in a berry
  const sprig = (from: P, to: P) => {
    const berries: P[] = [add(to, [0, -1.5]), add(to, [-3, -3.4]), add(to, [2.8, -3.6])];
    art.hairs!.push(`M${pt(from)}L${pt(to)}${berries.map((b) => `M${pt(to)}L${pt(b)}`).join("")}`);
    art.dots!.push(...berries.map((c, i) => ({ c, r: i ? 0.95 : 1.15 })));
  };
  sprig(at(0, 0.2), [MID + 16, 30]);
  sprig(at(2, 0.18), [MID + 118, 26]);
  sprig(at(3, 0.5), [MID + 166, 50]);

  // Small leaves all along, alternating above and below the vine
  vine.forEach((seg, i) => {
    const ts = i === 3 ? [0.25, 0.6, 0.9] : [0.1, 0.28, 0.46, 0.64, 0.82, 0.96];
    ts.forEach((t, j) => {
      const b = bez(...seg, t);
      const tan = unit(sub(bez(...seg, Math.min(1, t + 0.02)), b));
      const side = (i + j) % 2 ? 1 : -1;
      const L = 13.5 - i * 1.5 - (j % 2) * 1.5;
      leaf(art, b, add(add(b, mul(tan, L * 0.5)), mul(perp(tan), side * L * 0.85)), { dark: j % 2 === 0, width: 0.42, lobes: 0 });
    });
  });
  leaf(art, [MID + 74, 30], [MID + 62, 22], { dark: true, width: 0.45, lobes: 0 });
  leaf(art, [MID + 76, 30], [MID + 92, 24], { width: 0.45, lobes: 0 });
  return art;
}
const DIVIDER = dividerArt();
// The knot in the middle: one smooth figure-eight, rounded at both ends, finished with a pair
// of tiny leaves and a berry above and below
const KNOT = `M${MID} 40C${MID + 12} 33 ${MID + 9} 21 ${MID} 21C${MID - 9} 21 ${MID - 12} 33 ${MID} 40C${MID + 12} 47 ${MID + 9} 59 ${MID} 59C${MID - 9} 59 ${MID - 12} 47 ${MID} 40Z`;
const KNOT_ART: Art = (() => {
  const art: Art = { stems: [KNOT], strands: [], leaves: [], flowers: [], buds: [], dots: [{ c: [MID, 13], r: 1.2 }, { c: [MID, 67], r: 1.2 }], hairs: [`M${MID} 21V14M${MID} 59V66`] };
  for (const s of [-1, 1]) {
    leaf(art, [MID, 21], [MID + s * 7, 15], { dark: s > 0, width: 0.45, lobes: 0 });
    leaf(art, [MID, 59], [MID + s * 7, 65], { dark: s < 0, width: 0.45, lobes: 0 });
  }
  return art;
})();

export function FloralDivider({ className }: { className?: string }) {
  const id = `fd${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg className={`floral-divider ${className || ""}`} viewBox={`0 0 ${DIV_W} ${DIV_H}`} aria-hidden="true">
      <Botanical art={DIVIDER} id={id} wobble={0.6} />
      <g transform={`translate(${DIV_W} 0) scale(-1 1)`}><Botanical art={DIVIDER} id={id} withDefs={false} /></g>
      <Botanical art={KNOT_ART} id={id} withDefs={false} />
    </svg>
  );
}

function Botanical({ art, id, withDefs = true, wobble = 1 }: { art: Art; id: string; withDefs?: boolean; wobble?: number }) {
  return (
    <>
        {withDefs && <defs>
          <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#CBD6A4" />
            <stop offset="1" stopColor="#879A5C" />
          </linearGradient>
          <linearGradient id={`${id}-leaf-dark`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#AEBC83" />
            <stop offset="1" stopColor="#64774A" />
          </linearGradient>
          {/* Petals are pale at the base and wash into orange at the tip */}
          <linearGradient id={`${id}-petal`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFF1D6" />
            <stop offset=".55" stopColor="#FCC56E" />
            <stop offset="1" stopColor="#FAA532" />
          </linearGradient>
          {/* Rose petals: pale outer petals, deepening to orange towards the heart */}
          <linearGradient id={`${id}-rose-outer`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFEBC8" />
            <stop offset="1" stopColor="#FCC067" />
          </linearGradient>
          <linearGradient id={`${id}-rose-mid`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FDCB7C" />
            <stop offset="1" stopColor="#FAA532" />
          </linearGradient>
          <linearGradient id={`${id}-rose-heart`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F7A13A" />
            <stop offset="1" stopColor="#DB7E14" />
          </linearGradient>
          <HandDrawnFilters id={id} wobble={wobble} />
        </defs>}
        {/* Colour goes down as a watercolour wash, then the ink lines on top, layer by layer */}
        <g filter={`url(#${id}-ink)`}>
          {art.strands.map((d, i) => <path key={`si${i}`} className="floral-frame__strand-ink" d={d} />)}
          {art.strands.map((d, i) => <path key={`s${i}`} className="floral-frame__strand" d={d} />)}
          {art.stems.map((d, i) => <path key={`ti${i}`} className="floral-frame__stem-ink" d={d} />)}
          {art.stems.map((d, i) => <path key={`t${i}`} className="floral-frame__stem" d={d} />)}
        </g>
        <g filter={`url(#${id}-wash)`}>
          {art.leaves.map((l, i) => (
            <g key={`lw${i}`}>
              <path d={l.outline} fill={`url(#${id}-${l.tone})`} />
              <path className="floral-frame__shade" d={l.shade} />
            </g>
          ))}
        </g>
        <g filter={`url(#${id}-ink)`}>
          {art.leaves.map((l, i) => (
            <g key={`li${i}`}>
              <path className="floral-frame__hatch" d={l.hatch} />
              <path className="floral-frame__vein" d={l.veins} />
              <path className="floral-frame__edge" d={l.outline} />
            </g>
          ))}
        </g>
        <g filter={`url(#${id}-wash)`}>{art.buds.map((b, i) => <Bud key={`bw${i}`} {...b} id={id} mode="wash" />)}</g>
        <g filter={`url(#${id}-ink)`}>{art.buds.map((b, i) => <Bud key={`bi${i}`} {...b} id={id} mode="ink" />)}</g>
        <g filter={`url(#${id}-wash)`}>{art.flowers.map((f, i) => <Flower key={`fw${i}`} {...f} id={id} mode="wash" />)}</g>
        <g filter={`url(#${id}-ink)`}>{art.flowers.map((f, i) => <Flower key={`fi${i}`} {...f} id={id} mode="ink" />)}</g>
        {art.hairs && <g filter={`url(#${id}-ink)`}>{art.hairs.map((d, i) => <path key={`h${i}`} className="floral-frame__hair" d={d} />)}</g>}
        {art.roses?.map((f, i) => <Rose key={`r${i}`} {...f} id={id} />)}
        {art.dots && <g filter={`url(#${id}-ink)`}>{art.dots.map((d, i) => <circle key={`d${i}`} className="floral-frame__berry" cx={d.c[0].toFixed(1)} cy={d.c[1].toFixed(1)} r={d.r.toFixed(2)} />)}</g>}
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import "./vine-nav.css";
import { HandDrawnFilters } from "./hand-drawn";

// The header nav on inner pages: a trailing vine with brown leaves.
// The page links always show under the vine; hovering it makes the leaves swing, and each link parts
// the leaves right above it. On phones a Menu button opens the links in a small linen card.

type Pt = [number, number];
type Seg = [Pt, Pt, Pt, Pt];

// The vine enters at the top right and droops leftward in four soft waves.
// Each wave ends where a link hangs, so the links sit at the segment joints.
const VINE: Seg[] = [
  [[360, 6], [332, 8], [318, 22], [288, 23]],
  [[288, 23], [256, 24], [240, 12], [206, 13]],
  [[206, 13], [172, 14], [158, 26], [126, 26]],
  [[126, 26], [96, 26], [82, 16], [52, 17]],
  [[52, 17], [32, 18], [20, 26], [16, 33]],
];
const VINE_D = `M${VINE[0][0]}${VINE.map((s) => `C${s[1]} ${s[2]} ${s[3]}`).join("")}c-2 5 1 9 5 8c3-1 3-5 0-5`;
// A thin branch that hangs past the header on the right, like the end of a trailing plant
const DROP_D = "M338 10C343 28 333 46 339 63C343 74 338 82 343 92";

function at(s: Seg, t: number): Pt {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * s[0][i] + 3 * u * u * t * s[1][i] + 3 * u * t * t * s[2][i] + t * t * t * s[3][i];
  return [f(0), f(1)];
}

const LINKS = [
  { href: "/", label: "Home", joint: 3 },
  { href: "/about", label: "About", joint: 2 },
  { href: "/work", label: "Work", joint: 1 },
  { href: "/sketches", label: "Sketches", joint: 0 },
].map((link) => ({ ...link, at: VINE[link.joint][3] }));

type Leaf = { x: number; y: number; len: number; rest: number; open: number; part?: number; link?: number; tone: number; delay: number };

// The links always show under the vine. Two leaves sit above each link: hovering the vine lifts them,
// and hovering one link parts its own pair a little further. Smaller leaves along the vine just sway.
const LEAVES: Leaf[] = [
  ...LINKS.flatMap(({ joint }, i) => {
    const [lx, ly] = at(VINE[joint + 1], 0.14);
    const [rx, ry] = at(VINE[joint], 0.86);
    return [
      { x: lx, y: ly, len: 28, rest: 200, open: 214, part: 232, link: i, tone: i % 3, delay: i * 25 },
      { x: rx, y: ry, len: 26, rest: -20, open: -34, part: -52, link: i, tone: (i + 1) % 3, delay: i * 25 + 15 },
    ];
  }),
  ...VINE.slice(0, 4).flatMap((seg, i) => {
    const [ux, uy] = at(seg, 0.42);
    const [dx, dy] = at(seg, 0.6);
    return [
      { x: ux, y: uy, len: 21, rest: i % 2 ? -38 : -142, open: i % 2 ? -26 : -154, tone: (i + 2) % 3, delay: 40 },
      { x: dx, y: dy, len: 19, rest: i % 2 ? 158 : 22, open: i % 2 ? 172 : 8, tone: i % 3, delay: 55 },
    ];
  }),
  { x: 341, y: 30, len: 17, rest: 20, open: 4, tone: 1, delay: 20 },
  { x: 335, y: 48, len: 16, rest: 150, open: 168, tone: 0, delay: 40 },
  { x: 341, y: 68, len: 15, rest: 30, open: 12, tone: 2, delay: 60 },
  { x: 343, y: 92, len: 14, rest: 80, open: 64, tone: 1, delay: 80 },
];

function leafPath(len: number) {
  const w = len * 0.42;
  const s = 3; // a short stalk before the blade
  const b = len - s;
  return `M0 0L${s} 0C${s + b * 0.22} ${-w * 0.62} ${s + b * 0.68} ${-w * 0.6} ${len} 0C${s + b * 0.68} ${w * 0.6} ${s + b * 0.22} ${w * 0.62} ${s} 0Z`;
}

const TONES = [
  ["#6F5339", "#A07E5B"],
  ["#7E6045", "#B39170"],
  ["#5E4630", "#8E6E4F"],
];

// `label` names the landmark; the design system shows a second copy, so it gets its own name
export function VineNav({ label = "Main navigation" }: { label?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const nav = useRef<HTMLElement>(null);
  const id = "vine";
  const listId = `${useId().replace(/[^a-zA-Z0-9]/g, "")}-pages`;

  // On phones the links live in a small card opened by the Menu button; a tap outside or Esc closes it
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!nav.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <nav
      ref={nav}
      className="vine-nav"
      aria-label={label}
      data-open={open || undefined}
      data-active={active ?? undefined}
      onPointerEnter={(e) => { if (e.pointerType === "mouse" && window.matchMedia("(min-width: 701px)").matches) setOpen(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") { setOpen(false); setActive(null); } }}
      onFocus={(e) => { if ((e.target as HTMLElement).tagName === "A") setOpen(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { setOpen(false); setActive(null); } }}
    >
      <button type="button" className="vine-nav__menu" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((o) => !o)}>Menu</button>
      <svg className="vine-nav__plant" viewBox="0 0 360 100" aria-hidden="true">
        <defs>
          {TONES.map(([dark, light], i) => (
            <linearGradient key={i} id={`${id}-tone-${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={dark} />
              <stop offset="1" stopColor={light} />
            </linearGradient>
          ))}
          <HandDrawnFilters id={id} wobble={0.6} rim="#3e2a18" />
        </defs>
        <g filter={`url(#${id}-ink)`}>
        <path className="vine-nav__stem" d={VINE_D} />
        <path className="vine-nav__stem vine-nav__stem--thin" d={DROP_D} />
        {LEAVES.map((leaf, i) => (
          <g key={i} transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)})`}>
            <g className="vine-nav__leaf" data-link={leaf.link} style={{ "--rest": `${leaf.rest}deg`, "--open": `${leaf.open}deg`, "--part": `${leaf.part ?? leaf.open}deg`, "--delay": `${leaf.delay}ms` } as React.CSSProperties}>
              <path d={leafPath(leaf.len)} fill={`url(#${id}-tone-${leaf.tone})`} />
              <path className="vine-nav__vein" d={`M3 0Q${leaf.len * 0.6} -.7 ${leaf.len - 2} 0`} />
              <path className="vine-nav__edge" d={leafPath(leaf.len)} />
            </g>
          </g>
        ))}
        </g>
      </svg>
      <ol id={listId}>
        {LINKS.map(({ href, label, at: [x, y] }, i) => (
          <li key={href} style={{ "--x": `${x}px`, "--y": `${y + 9}px` } as React.CSSProperties}>
            <Link
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
            >{label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

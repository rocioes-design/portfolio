"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { BLOOM_PATH } from "../../components/ui/bloom-logo";

// Adapted from Rare UI's Rail TOC: a rail runs through a dot for every heading, solid up to where
// you are and dashed after. The Bloom mark rides the rail and rolls as it travels.
export type TocItem = { id: string; label: string; depth?: number };

const RAIL_X = 6;
const INDENT = 16;
const LABEL_GAP = 16;
const OFFSET = 96; // how far below the top of the window a heading counts as reached
const TRAVEL = { stiffness: 140, damping: 26, mass: 0.6 };

type Point = { x: number; y: number };
type Geometry = { nodes: Point[]; d: string; width: number; height: number };

// Straight down at each depth, with a diagonal where the depth changes
function buildPath(nodes: Point[]) {
  const points: Point[] = [{ x: nodes[0].x, y: 0 }, nodes[0]];
  for (let i = 1; i < nodes.length; i++) {
    const from = nodes[i - 1], to = nodes[i];
    if (from.x !== to.x) {
      const bend = (to.y - from.y) * 0.3;
      points.push({ x: from.x, y: from.y + bend }, { x: to.x, y: to.y - bend });
    }
    points.push(to);
  }
  return points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
}

// The rail only runs downward, so its length can be found from a y by halving
function lengthAtY(path: SVGPathElement, total: number, y: number) {
  let lo = 0, hi = total;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y < y) lo = mid;
    else hi = mid;
  }
  return hi;
}

export function RailToc({ items, title = "Overview" }: { items: TocItem[]; title?: string }) {
  const reduced = useReducedMotion() ?? false;
  const list = useRef<HTMLUListElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const path = useRef<SVGPathElement>(null);
  const [geometry, setGeometry] = useState<Geometry>();
  const [reached, setReached] = useState(1);
  const lengths = useRef<number[]>([]);
  const total = useRef(0);
  const placed = useRef(false);
  const pinned = useRef<number | null>(null); // a clicked heading holds until the reader scrolls

  const target = useMotionValue(0);
  const travel = useSpring(target, TRAVEL);
  const distance = reduced ? target : travel;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const filled = useMotionValue(0);
  // One full turn every 60px of rail
  const spin = useTransform(distance, (l) => (reduced ? 0 : (l / 60) * 360));

  const pose = useCallback((l: number) => {
    const p = path.current;
    if (!p || !total.current) return;
    const at = p.getPointAtLength(l);
    x.set(at.x);
    y.set(at.y);
    filled.set(l / total.current);
    setReached(lengths.current.filter((n) => n <= l + 0.5).length);
  }, [x, y, filled]);
  useMotionValueEvent(distance, "change", pose);

  const sync = useCallback(() => {
    const nodes = lengths.current;
    if (!nodes.length) return;
    if (pinned.current !== null) {
      target.set(nodes[pinned.current]);
      return;
    }
    // The anchor line slides to the bottom near the end of the page, so the last headings can still be reached
    const scrollTop = window.scrollY, view = window.innerHeight;
    const remaining = Math.max(0, document.documentElement.scrollHeight - view - scrollTop);
    const line = Math.min(OFFSET, scrollTop);
    const anchor = line + Math.max(0, view - line - remaining);
    const tops = items.map((item) => document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity);
    const index = tops.findLastIndex((top) => top <= anchor);
    let next: number;
    if (index === -1) next = nodes[0];
    else if (index === nodes.length - 1) next = nodes[index];
    else {
      const span = tops[index + 1] - tops[index];
      const progress = span > 0 ? (anchor - tops[index]) / span : 0;
      next = nodes[index] + Math.min(1, Math.max(0, progress)) * (nodes[index + 1] - nodes[index]);
    }
    target.set(next);
    if (!placed.current) {
      placed.current = true;
      travel.jump(next);
      pose(next);
    }
  }, [items, target, travel, pose]);

  useLayoutEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const measure = () => {
      const nodes = items.map((item, i) => {
        const row = rows.current[i];
        return { x: RAIL_X + (item.depth ?? 0) * INDENT, y: row ? row.offsetTop + row.offsetHeight / 2 : 0 };
      });
      setGeometry({ nodes, d: buildPath(nodes), width: Math.max(...nodes.map((n) => n.x)) + RAIL_X + 4, height: ul.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ul);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [items]);

  useLayoutEffect(() => {
    const p = path.current;
    if (!p || !geometry) return;
    total.current = p.getTotalLength();
    lengths.current = geometry.nodes.map((n) => lengthAtY(p, total.current, n.y));
    sync();
    pose(distance.get());
  }, [geometry, sync, pose, distance]);

  useEffect(() => {
    let userScrolled = false;
    const intent = () => { userScrolled = true; };
    const onScroll = () => {
      if (pinned.current !== null && userScrolled) pinned.current = null;
      sync();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", intent, { passive: true });
    window.addEventListener("touchstart", intent, { passive: true });
    window.addEventListener("keydown", intent);
    window.addEventListener("resize", sync);
    const reset = () => { userScrolled = false; };
    window.addEventListener("rail-toc-select", reset);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", intent);
      window.removeEventListener("touchstart", intent);
      window.removeEventListener("keydown", intent);
      window.removeEventListener("resize", sync);
      window.removeEventListener("rail-toc-select", reset);
    };
  }, [sync]);

  const select = (index: number) => {
    const el = document.getElementById(items[index].id);
    if (!el) return;
    pinned.current = index;
    window.dispatchEvent(new Event("rail-toc-select"));
    sync();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 24, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${items[index].id}`);
  };

  const active = Math.max(0, reached - 1);

  // The rail can be taller than the window: keep the current heading in view inside it
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const box = nav.current, row = rows.current[active];
    if (!box || !row || box.scrollHeight <= box.clientHeight) return;
    const top = row.offsetTop + (list.current?.offsetTop ?? 0);
    if (top < box.scrollTop + 40 || top > box.scrollTop + box.clientHeight - 60) {
      box.scrollTo({ top: top - box.clientHeight / 2, behavior: reduced ? "auto" : "smooth" });
    }
  }, [active, reduced]);

  return (
    <nav className="rail-toc" ref={nav} aria-label="Design system sections">
      <a className="rail-toc__title" href="#overview" onClick={(e) => { e.preventDefault(); pinned.current = null; window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); }}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h8M2 12h10" /></svg>
        {title}
      </a>
      <ul className="rail-toc__list" ref={list}>
        {geometry && (
          <svg className="rail-toc__rail" width={geometry.width} height={geometry.height} aria-hidden="true">
            <path ref={path} d={geometry.d} className="rail-toc__track" />
            <motion.path d={geometry.d} className="rail-toc__fill" style={{ pathLength: filled }} />
            {geometry.nodes.map((node, i) => (
              <circle key={items[i].id} cx={node.x} cy={node.y} r={3.5} className={i < reached ? "rail-toc__dot is-reached" : "rail-toc__dot"} />
            ))}
          </svg>
        )}
        {geometry && (
          <motion.span className="rail-toc__bloom" style={{ x, y, rotate: spin }} aria-hidden="true">
            <svg viewBox="0 0 100 100"><path fillRule="evenodd" d={BLOOM_PATH} /></svg>
          </motion.span>
        )}
        {items.map((item, i) => (
          <li key={item.id} ref={(el) => { rows.current[i] = el; }}>
            <a
              href={`#${item.id}`}
              className="rail-toc__link"
              aria-current={i === active ? "location" : undefined}
              style={{ paddingLeft: RAIL_X + (item.depth ?? 0) * INDENT + LABEL_GAP }}
              onClick={(e) => { e.preventDefault(); select(i); }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

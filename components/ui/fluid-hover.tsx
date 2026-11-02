"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { spring } from "./motion";

// A single highlight per list that glides to the item under the pointer instead of each item
// blinking on its own. After Fluid Functionalism's fluid hover:
// - only click targets register, and items should touch so the highlight can glide between them
// - empty space puts it out, unless `nearest` keeps the closest item lit (use it when items have gaps)
// - a fresh entry fades in where the pointer lands instead of sliding over from the last spot
// - it travels on transform, on the fast tier; reduced motion keeps the fade and drops the travel
type Rect = { x: number; y: number; w: number; h: number };
type Options = { nearest?: boolean; axis?: "x" | "y" | "xy"; inset?: (el: HTMLElement) => Partial<Rect> };

export function useFluidHover(container: RefObject<HTMLElement | null>, { nearest = false, axis = "y", inset }: Options = {}) {
  const items = useRef(new Map<number, HTMLElement>());
  const [active, setActive] = useState<number | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [session, setSession] = useState(0);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

  // When nothing is lit the last rect stays, so the highlight fades out where it was
  const measure = useCallback((index: number | null) => {
    const el = index === null ? null : items.current.get(index);
    if (!el) return;
    const base = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    setRect({ ...base, ...inset?.(el) });
  }, [inset]);

  const pick = useCallback((event: React.MouseEvent) => {
    let found: number | null = null;
    let best = Infinity;
    items.current.forEach((el, index) => {
      const r = el.getBoundingClientRect();
      const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
      if (inside) { found = index; best = -1; return; }
      if (!nearest || best < 0) return;
      const dx = event.clientX - (r.left + r.width / 2), dy = event.clientY - (r.top + r.height / 2);
      const d = axis === "x" ? Math.abs(dx) : axis === "y" ? Math.abs(dy) : Math.hypot(dx, dy);
      if (d < best) { best = d; found = index; }
    });
    setActive(found);
  }, [nearest, axis]);

  useEffect(() => { measure(active); }, [active, measure]);

  // Re-measure when the list resizes, so the highlight never sits on a stale rect
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure(activeRef.current));
    observer.observe(el);
    return () => observer.disconnect();
  }, [container, measure]);

  const register = useCallback((index: number) => (el: HTMLElement | null) => {
    if (el) items.current.set(index, el);
    else items.current.delete(index);
  }, []);

  return {
    active,
    rect,
    session,
    register,
    handlers: {
      onMouseEnter: () => setSession((s) => s + 1),
      onMouseMove: pick,
      onMouseLeave: () => setActive(null),
    },
  };
}

export function FluidHoverHighlight({ hover, className }: { hover: ReturnType<typeof useFluidHover>; className?: string }) {
  const reduced = useReducedMotion() ?? false;
  const { rect, active, session } = hover;
  if (!rect) return null;
  const lit = active !== null;
  return (
    <motion.span
      key={session}
      className={className}
      aria-hidden="true"
      style={{ position: "absolute", top: 0, left: 0, width: rect.w, height: rect.h, pointerEvents: "none" }}
      initial={{ x: rect.x, y: rect.y, opacity: 0 }}
      animate={{ x: rect.x, y: rect.y, opacity: lit ? 1 : 0 }}
      transition={{
        x: reduced ? { duration: 0 } : spring.fast,
        y: reduced ? { duration: 0 } : spring.fast,
        opacity: lit ? { duration: spring.fast.duration } : spring.fast.exit,
      }}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { heroFx, type HeroFxKind } from "./herofx-data";

// The Figma exports can't animate, so the hero card's weather animation from the design canvas
// is laid over the screenshot. Box is in screen points (402pt wide frame); the animation runs at
// that native size and is scaled down to the mockup, so drops and beams keep their proportions.
export function ScreenFx({ kind, box }: { kind: HeroFxKind; box: [number, number, number, number] }) {
  const [x, y, w, h] = box;
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setScale(el.offsetWidth / w);
    const ro = new ResizeObserver(() => setScale(el.offsetWidth / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  const fx = heroFx[kind];
  return <div ref={ref} className="wh-scrfx" aria-hidden="true" style={{ left: `${(x / 402) * 100}%`, top: `calc(${y} * 100cqw / 402)`, width: `${(w / 402) * 100}%`, height: `calc(${h} * 100cqw / 402)` }}>
    <div style={{ width: w, height: h, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}>
      <div className={fx.cls} dangerouslySetInnerHTML={{ __html: fx.html }} />
    </div>
  </div>;
}

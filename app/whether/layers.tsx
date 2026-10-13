"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Scroll from a 7° morning to a 21° afternoon. Layers come off at the time the app says they would.
const START = 8, END = 15; // 8:00am to 3:00pm
const items = [
  { name: "Light jacket", role: "Outer layer", icon: "clothes-jacket.svg", off: 13, tag: "Off by 1:00pm" },
  { name: "Sweater", role: "Mid layer", icon: "clothes-sweater.svg", off: 11, tag: "Off by 11:00am" },
  { name: "T-shirt", role: "Base layer, for the warm afternoon", icon: "clothes-tshirt.svg" },
  { name: "Pants", role: "Bottom", icon: "clothes-pants.svg" },
];

const clock = (h: number) => {
  const whole = Math.floor(h); const min = Math.round((h - whole) * 60 / 30) * 30;
  const hh = min === 60 ? whole + 1 : whole; const mm = min === 60 ? 0 : min;
  const ampm = hh >= 12 ? "pm" : "am"; const h12 = hh > 12 ? hh - 12 : hh;
  return `${h12}:${mm === 0 ? "00" : "30"}${ampm}`;
};

export function Layers() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const hour = useTransform(scrollYProgress, [0.08, 0.92], [START, END], { clamp: true });
  const bg = useTransform(scrollYProgress, [0.08, 0.92], ["#C9D3FF", "#FFE08A"]);
  const [h, setH] = useState(START);
  useMotionValueEvent(hour, "change", (v) => setH(v));
  const t = reduce ? END : h;
  const temp = Math.round(7 + (t - START) * 2);

  return <section ref={ref} className="wh-layers" aria-labelledby="layers-title">
    <motion.div className="wh-layers__stage" style={{ background: reduce ? "#FFE08A" : bg }}>
      <div className="wh-layers__copy">
        <p className="wh-kicker">Finding 05 · Dress for the whole day</p>
        <h2 id="layers-title">Cold morning,<br />warm afternoon.</h2>
        <p>Reviewers kept saying the same thing: the advice is right at 8am and wrong by lunch. So every layer in Whether comes with a “when”. Scroll through Sofía’s day.</p>
        <div className="wh-layers__clock" aria-live="polite">
          <span className="wh-layers__temp">{temp}°</span>
          <span className="wh-layers__time">{clock(t)}</span>
        </div>
      </div>
      <ul className="wh-layers__stack">
        {items.map((it) => {
          const gone = it.off !== undefined && t >= it.off;
          return <li key={it.name} className={`wh-row${gone ? " is-off" : ""}`}>
            <img src={`/media/whether/ui/${it.icon}`} alt="" />
            <span><b>{it.name}</b><small>{gone ? "In your bag" : it.role}</small></span>
            {it.tag && <em>{gone ? "Off ✓" : it.tag}</em>}
          </li>;
        })}
      </ul>
    </motion.div>
  </section>;
}

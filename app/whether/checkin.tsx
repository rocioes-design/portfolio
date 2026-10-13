"use client";

import { useState } from "react";

// The evening check-in, playable. Drip's accessory follows the temperature, and the comfort marker moves.
const answers = {
  cold: { label: "Too cold", drip: "drip-checkin-cold.svg", alt: "Drip in a beanie, shivering", reply: "Got it. Tomorrow I’ll dress you a little warmer.", step: 2, tone: "cold" },
  right: { label: "Just right", drip: "drip-checkin-right.svg", alt: "Drip smiling with its eyes closed", reply: "Perfect. Same again tomorrow.", step: 3, tone: "right" },
  hot: { label: "Too hot", drip: "drip-checkin-hot.svg", alt: "Drip in sunglasses, sweating", reply: "Noted. Tomorrow I’ll go a little lighter.", step: 4, tone: "hot" },
} as const;
type Key = keyof typeof answers;

export function CheckIn() {
  const [pick, setPick] = useState<Key | null>(null);
  const a = pick ? answers[pick] : null;
  return <div className={`wh-check${a ? ` is-${a.tone}` : ""}`}>
    <div className="wh-check__drip">
      <img key={a?.drip ?? "logo"} src={`/media/whether/ui/${a?.drip ?? "drip-v2-rain.svg"}`} alt={a?.alt ?? "Drip, the Whether mascot, in a yellow rain hat"} />
    </div>
    <div className="wh-check__card">
      <p className="wh-check__q">How did today feel?</p>
      <div className="wh-check__btns" role="group" aria-label="How did today feel?">
        {(Object.keys(answers) as Key[]).map((k) => <button key={k} type="button" className={`b-${k}`} aria-pressed={pick === k} onClick={() => setPick(k)}>{answers[k].label}</button>)}
      </div>
      <p className="wh-check__reply" aria-live="polite">{a ? a.reply : "Tap one. This is the whole check-in."}</p>
      <div className="wh-scale" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => <span key={i} className={i === (a?.step ?? 3) ? "on" : ""} />)}
      </div>
      <div className="wh-scale__ends"><span>Runs cold</span><span>Runs warm</span></div>
    </div>
  </div>;
}

"use client";

import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

// The competitive benchmark (2026-10-06) as a map: how much setup an app needs vs. how personal its advice gets.
// Positions are a reading of the benchmark, not a score. Prices and ratings are from October 2026.
type Kind = "closet" | "weather" | "niche" | "us";
const kinds: Record<Kind, string> = { closet: "Closet app", weather: "Weather app with an avatar", niche: "Niche", us: "My app" };

const apps: { id: string; name: string; kind: Kind; x: number; y: number; meta: string; take: string }[] = [
  { id: "puttogether", name: "PutTogether", kind: "closet", x: 84, y: 74, meta: "iOS only · $9.99/mo", take: "The most complete on weather: “feels like” temperature, rain chance and separate morning and evening advice. Expensive, and only on iPhone." },
  { id: "cladwell", name: "Cladwell", kind: "closet", x: 70, y: 62, meta: "iOS + Android · about $7.99/mo", take: "Plans the week ahead from the forecast and your calendar. Works best with a small capsule closet of 30–50 pieces." },
  { id: "acloset", name: "Acloset", kind: "closet", x: 78, y: 48, meta: "iOS + Android · free up to 100 items", take: "Daily outfits from the forecast, but it only reads the air temperature. The weather logic is thinner than the marketing." },
  { id: "pureple", name: "Pureple", kind: "closet", x: 90, y: 34, meta: "iOS + Android · premium from $14.99/mo", take: "A basic temperature and a weather icon next to your outfit." },
  { id: "whering", name: "Whering", kind: "closet", x: 82, y: 18, meta: "iOS + Android", take: "A closet organizer first. A weather-aware planner only arrived in September 2026." },
  { id: "weatherfit", name: "Weather Fit", kind: "weather", x: 24, y: 34, meta: "iOS + Watch · $3.99/mo", take: "The closest to my idea: an avatar dressed for the forecast, widgets and a morning notification. But the outfit is the same for everyone." },
  { id: "dailydress", name: "Daily Dress Me", kind: "weather", x: 12, y: 22, meta: "iOS + Android · free", take: "Outfit ideas from the forecast, and you can switch cities for a trip. Running since 2014." },
  { id: "thewear", name: "TheWear & co.", kind: "weather", x: 30, y: 10, meta: "iOS · free", take: "Simple rules based on the temperature. Low ratings, around 2.5★." },
  { id: "goldilocks", name: "Goldilocks Run Club", kind: "niche", x: 28, y: 54, meta: "iOS · for runners", take: "The only app that learns: if you felt too cold last time, it adjusts the next suggestion. But only for runs." },
  { id: "whether", name: "Whether", kind: "us", x: 20, y: 81, meta: "iPhone + Android", take: "Instant like a weather app, personal like a closet app, with no closet to photograph. One tap a day teaches it how you feel the weather." },
];

// ● yes · ◐ partly · ○ no · – not found in the benchmark
type Mark = "yes" | "part" | "no" | "nf";
const cols = ["No closet to set up", "Learns how you feel", "Changes through the day", "Other cities & trips"];
const rows: [string, Mark[], string?][] = [
  ["PutTogether", ["no", "no", "yes", "nf"]],
  ["Cladwell", ["no", "no", "no", "part"], "Plans the week, not trips"],
  ["Acloset", ["no", "no", "no", "nf"]],
  ["Weather Fit", ["yes", "no", "nf", "nf"]],
  ["Daily Dress Me", ["yes", "no", "nf", "yes"]],
  ["Goldilocks Run Club", ["yes", "part", "nf", "nf"], "Learns, but only for runs"],
  ["Whether", ["yes", "yes", "yes", "yes"]],
];
const markLabel: Record<Mark, string> = { yes: "Yes", part: "Partly", no: "No", nf: "Not found" };

const sources = [
  ["PutTogether, “The Weather-First Closet App, 2026” (written by a competitor)", "https://www.puttogether.world/guides/digital-closet/wake-up-already-dressed-ai-outfit-app-weather-2026"],
  ["StylePal, “Best What to Wear App 2026” (also written by a competitor)", "https://www.stylepal.app/news/what-to-wear-app"],
  ["Weather Fit press kit", "https://weatherfit.com/press-kit.html"],
  ["Daily Dress Me on the App Store", "https://apps.apple.com/us/app/daily-dress-me-what-to-wear/id6447927117"],
  ["GetWardrobe, wardrobe app comparison 2026", "https://getwardrobe.com/compare/"],
  ["Indyx, Acloset vs. Whering", "https://www.myindyx.com/versus/acloset-vs-whering"],
  ["Cladwell on the App Store", "https://apps.apple.com/app/id1140550878"],
  ["Goldilocks Run Club on the App Store", "https://apps.apple.com/app/id6761847896"],
  ["TheWear on mwm.ai", "https://mwm.ai/apps/thewear/1481102346"],
];

export function Benchmark() {
  const reduce = useReducedMotion();
  const [sel, setSel] = useState("whether");
  const app = apps.find((a) => a.id === sel)!;
  const others = apps.filter((a) => a.kind !== "us");
  const us = apps.find((a) => a.kind === "us")!;

  return <div className="wh-bench">
    <div className="wh-bench__grid">
      <motion.div className="wh-map" initial={reduce ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.4 }}>
        <div className="wh-map__zone" aria-hidden="true"><span>The gap: instant <em>and</em> personal.<br />No other app does both.</span></div>
        <span className="wh-map__ax wh-map__ax--x" aria-hidden="true"><b>Instant</b><i>Setup</i><b>Photograph your closet</b></span>
        <span className="wh-map__ax wh-map__ax--y" aria-hidden="true"><b>Generic</b><i>Advice</i><b>Made for you</b></span>
        {others.map((a, i) => <span key={a.id} className="wh-map__pt" style={{ "--x": a.x, "--y": a.y } as CSSProperties}>
          <motion.span variants={{ hidden: { opacity: 0, scale: 0.4 }, show: { opacity: 1, scale: 1, transition: { delay: 0.15 + i * 0.09, type: "spring", stiffness: 260, damping: 16 } } }} style={{ display: "block" }}>
            <button type="button" className={`wh-chip is-${a.kind}`} aria-pressed={sel === a.id} onClick={() => setSel(a.id)} onMouseEnter={() => setSel(a.id)} onFocus={() => setSel(a.id)} style={{ animationDelay: `-${(i * 0.7) % 4}s` }}>{a.name}</button>
          </motion.span>
        </span>)}
        <span className="wh-map__pt wh-map__pt--us" style={{ "--x": us.x, "--y": us.y } as CSSProperties}>
          <motion.span variants={{ hidden: { opacity: 0, y: -260 }, show: { opacity: 1, y: 0, transition: { delay: 0.15 + others.length * 0.09 + 0.3, type: "spring", stiffness: 180, damping: 11 } } }} style={{ display: "block" }}>
            <button type="button" className="wh-chip is-us" aria-pressed={sel === "whether"} onClick={() => setSel("whether")} onMouseEnter={() => setSel("whether")} onFocus={() => setSel("whether")}>
              <img src="/media/whether/ui/drip-v2-rain.svg" alt="" />Whether
            </button>
          </motion.span>
        </span>
      </motion.div>

      <div className={`wh-bench__card is-${app.kind}`} aria-live="polite">
        <p className="wh-bench__kind">{kinds[app.kind]}</p>
        <h3>{app.name}</h3>
        <p className="wh-bench__meta">{app.meta}</p>
        <p>{app.take}</p>
        <p className="wh-bench__hint">Point at an app on the map to read its notes.</p>
      </div>
    </div>

    <div className="wh-legend" aria-hidden="true">
      <span className="is-closet">Closet apps</span><span className="is-weather">Weather apps with an avatar</span><span className="is-niche">Niche (runners)</span>
    </div>

    <h3 id="matrix-title" className="wh-matrix__title">What each app covers</h3>
    <div className="wh-matrix__wrap">
      <table className="wh-matrix" aria-labelledby="matrix-title">
        <thead><tr><th scope="col">App</th>{cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>{rows.map(([name, marks, note]) => <tr key={name} className={name === "Whether" ? "is-us" : ""}>
          <th scope="row">{name}{note && <small>{note}</small>}</th>
          {marks.map((m, i) => <td key={cols[i]}><span className={`wh-mark is-${m}`} title={markLabel[m]}><span className="sr-only">{markLabel[m]}</span></span></td>)}
        </tr>)}</tbody>
      </table>
      <p className="wh-matrix__key"><span className="wh-mark is-yes" /> Yes <span className="wh-mark is-part" /> Partly <span className="wh-mark is-no" /> No <span className="wh-mark is-nf" /> Not found</p>
    </div>

    <div className="wh-bench__foot">
      <p className="wh-bench__chat"><b>The sneaky competitor is a chatbot.</b> Plenty of people just ask AI what to wear today. So <strong>Whether</strong> has to be faster than typing the question.</p>
      <details className="wh-sources">
        <summary>Sources and caveats<svg className="wh-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
        <p>Two of the comparison articles were written by competing apps, so I treated their rankings with care. Prices and ratings are from October 2026 and change often. Kids’ apps (Reima Weather, Kid Weather) were in the benchmark too, but they teach layering through dress-up games, so they aren’t on the map.</p>
        <ul>{sources.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer">{t} ↗</a></li>)}</ul>
      </details>
    </div>
  </div>;
}

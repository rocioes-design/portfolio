import { Nunito_Sans } from "next/font/google";
import { Footer, Header } from "../components";
import { WeatherFx } from "./fx";
import { Layers } from "./layers";
import { CheckIn } from "./checkin";
import { Benchmark } from "./benchmark";
import { ScreenFx } from "./screenfx";
import type { HeroFxKind } from "./herofx-data";
import "./whether.css";

// Whether case study. Each chapter is a full-width weather panel, and Drip dresses for it.
// Facts come from drafts/weather-outfit-case-study.md (the long version, with the full research).

export const metadata = { title: "Whether case study — Rocío Espinosa" };

const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--font-nunito" });

const ui = (f: string) => `/media/whether/ui/${f}`;
const shot = (f: string) => `/media/whether/screens/${f}.webp`;
const media = (f: string) => `/media/whether/${f}`;

const meta = [
  ["Project", "Self-initiated, real product"],
  ["Role", "Product designer & builder"],
  ["Platform", "iPhone and Android"],
  ["Year", "2026"],
  ["Disciplines", "Research · UX/UI · Brand · Mascot"],
];

const findings = [
  ["Weather advice should be simple.", "Wardrobe apps can personalize outfits, but setting them up takes time. Weather apps give you instant recommendations, but they’re generic and don’t account for your personal preferences.", "Useful from day one. More personal over time."],
  ["One bad suggestion can break trust.", "35% of reviews that mention the weather rated the experience 3 stars or lower. The complaints usually say that recommendations make no sense: sandals in the snow, sweaters in a heatwave.", "The weather logic is the main product."],
  ["Everyone experiences the weather differently.", "The same forecast can mean a light jacket for one person and a heavy coat for another. Most weather apps treat everyone the same, leaving users to figure out what works for them.", "Personalize gradually, learning from every bit of feedback."],
  ["Setup is why people quit.", "“A whole day taking photos” before getting any recommendations. Users usually don’t have time before heading out.", "No closet catalog. Two questions instead."],
  ["Getting dressed is a decision you make for the whole day.", "Many reviews mentioned layering, highlighting a common frustration: an outfit that works in the morning might be too warm by the afternoon.", "Help people dress for the whole day ahead."],
  ["People expect to plan for other places or trips.", "Many reviews ask to change the city or plan a trip.", "A city search and a packing list."],
  ["Getting dressed shouldn’t feel stressful.", "Users appreciate quick-glance widgets and clear, simple language. When deciding what to wear already feels overwhelming, more data only adds to the noise.", "One answer, in simple words."],
];
const tints = ["#FFEFC2", "#FFE6E0", "#EFE9FB", "#E3F7E6", "#DDF1FD", "#FFEFC2", "#EFE9FB"];

const loop = [["Set up in 30 seconds", "#E3F7E6"], ["Get one answer", "#FFEFC2"], ["Check in", "#EFE9FB"], ["It gets to know you", "#DDF1FD"]];

const onboarding = ["o1-welcome", "o2-location", "o3-cold", "o4-around", "o5-hours", "o6-notify", "o7-allset"];

const forecasts = [
  ["home-sunny", "Sunny", "17°", "#FFC83D"],
  ["home-rainy", "Rain later", "14°", "#4CB8F5"],
  ["home-cold", "Very hot", "39°", "#FF8066"],
  ["home-snowy", "Snow", "-2°", "#B9DDF5"],
  ["home-night", "Night, dark mode", "-5°", "#B9A3F0"],
];

const trip = [["trip-typical", "23 days out", "Typical weather, a draft list"], ["trip-early", "7 days out", "An early forecast, still firming up"], ["trip-forecast", "5 days out", "The forecast is here. 2 things changed"]];

const palette = [["Leaf Green", "#58CC6A", "Actions"], ["Sunny", "#FFC83D", "Sun"], ["Sky", "#4CB8F5", "Rain"], ["Lavender", "#9B7EDE", "The app’s voice"], ["Coral", "#FF8066", "Heat"], ["Night", "#B9A3F0", "After sunset"], ["Dark", "#263238", "All text"], ["Cream", "#FFFDF7", "Background"]];

const next = ["Activities", "“Why this?”", "Weather alerts", "My clothes", "Family profiles", "Occasions"];

// iPhone chrome on every mockup: status bar, Dynamic Island and home indicator.
// The main screens start at the top edge, so the status bar sits above them in the screen color (top).
// Onboarding screens already leave room at the top, so it floats over them (inset).
// Home screens: which canvas animation plays on the hero card, and where that card sits (x, y, w, h in points).
const homeFx: Record<string, [HeroFxKind, [number, number, number, number]]> = {
  "home-sunny": ["sun", [14.5, 134, 373, 203]],
  "home-rainy": ["rain", [14.5, 134, 373, 203]],
  "home-cold": ["hot", [14.5, 134, 373, 225]],
  "home-snowy": ["snow", [14.5, 134, 373, 203]],
  "home-night": ["night", [14.5, 134, 373, 181]],
  "out-active": ["sun", [14.5, 134, 373, 225]],
};

function Phone({ src, alt, className = "", top = "#FEFDF7", dark = false, inset = false }: { src: string; alt: string; className?: string; top?: string; dark?: boolean; inset?: boolean }) {
  const fx = homeFx[src.split("/").pop()!.replace(".webp", "")];
  return <figure className={`wh-phone${dark ? " is-dark" : ""}${inset ? " is-inset" : ""} ${className}`}>
    <div className="wh-sb" style={inset ? undefined : { background: top }} aria-hidden="true">
      <span className="wh-sb__time">9:41</span>
      <span className="wh-sb__island" />
      <svg className="wh-sb__icons" viewBox="0 0 76 14" fill="currentColor">
        <rect x="0" y="8.5" width="3.2" height="4" rx="1" /><rect x="4.6" y="6.5" width="3.2" height="6" rx="1" /><rect x="9.2" y="4.2" width="3.2" height="8.3" rx="1" /><rect x="13.8" y="1.8" width="3.2" height="10.7" rx="1" />
        <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><path d="M22.4 5.3a9.8 9.8 0 0 1 13.2 0" /><path d="M25 8a6 6 0 0 1 8 0" /></g><path d="M29 12.6 27 10.5a2.9 2.9 0 0 1 4 0Z" />
        <rect x="43.5" y="1.5" width="27" height="11.5" rx="3.6" fill="none" stroke="currentColor" strokeOpacity=".38" /><rect x="45.5" y="3.5" width="21" height="7.5" rx="2" /><path d="M72.2 5.4c1 .3 1.6 1.1 1.6 1.9s-.6 1.6-1.6 1.9Z" opacity=".4" />
      </svg>
    </div>
    <div className="wh-scr">
      <img src={src} alt={alt} loading="lazy" />
      {fx && <ScreenFx kind={fx[0]} box={fx[1]} />}
    </div>
    <span className="wh-home" aria-hidden="true" />
  </figure>;
}

export default function WhetherPage() {
  return <main className={`wh ${nunito.variable}`}>
    <div className="page-shell"><Header /></div>

    {/* HERO: a sunny morning */}
    <section className="wh-panel wh-hero" aria-labelledby="wh-title">
      <WeatherFx kind="sun" seed={3} />
      <div className="wh-hero__inner">
        <img className="wh-hero__drip" src={ui("drip-v2-rain.svg")} alt="Drip, the Whether mascot: a glass raindrop in a yellow rain hat" />
        <div>
          <p className="wh-kicker">Case study · 2026</p>
          <h1 id="wh-title">Whether</h1>
          <p className="wh-hero__tag">What to wear, whatever the weather.</p>
        </div>
      </div>
    </section>

    <section className="wh-meta">
      <dl>{meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <div className="wh-meta__intro">
        <p className="wh-lead">Weather apps tell you it’s 14°. Whether tells you to take the jacket, and when you can take it off.</p>
        <p>It’s a phone app that turns the forecast into <b>one clear answer for the whole day</b>: what to wear, what to bring, and when a layer can come off. The user checks in every day to answer one question, “How did today feel?”, and Whether uses each answer to improve future recommendations.</p>
      </div>
    </section>

    {/* THE PROBLEM: rain */}
    <section className="wh-panel wh-rain" aria-labelledby="problem-title">
      <WeatherFx kind="rain" seed={11} />
      <div className="wh-wide">
        <p className="wh-kicker">01 · The problem</p>
        <h2 id="problem-title" className="wh-quote">“It’s 14°. But do I need a jacket?”</h2>
        <div className="wh-cols">
          <p>14° in summer is not the same as 14° in winter. Temperature alone doesn’t tell the whole story. Wind can make it feel colder, the temperature might rise by 8° in the afternoon, and some people simply feel the cold more than others.</p>
          <p>Wardrobe apps try to solve this, but many ask you to photograph and upload your entire closet before they can help. Getting dressed shouldn’t take that long.</p>
        </div>
      </div>
    </section>

    {/* RESEARCH: cloudy, numbers */}
    <section className="wh-panel wh-cloud" aria-labelledby="research-title">
      <WeatherFx kind="wind" seed={5} dense={0.7} />
      <div className="wh-wide">
        <p className="wh-kicker">02 · Research</p>
        <h2 id="research-title" className="wh-h2">2,787 reviews analyzed with AI to uncover what existing apps get right and wrong.</h2>
        <p className="wh-big">Reviews from competing apps were analyzed using Claude Opus 5.5 to identify recurring frustrations, user expectations, and opportunities for improvement.</p>
        <div className="wh-stats">
          <div><b>2,787</b><span>App Store reviews</span></div>
          <div><b>10</b><span>competing apps</span></div>
          <div><b>211</b><span>reviews about the weather</span></div>
        </div>
      </div>
    </section>

    {/* BENCHMARK: a weather map of the market */}
    <section className="wh-panel wh-bench-panel" aria-labelledby="bench-title">
      <div className="wh-wide">
        <p className="wh-kicker">02 · Research · Benchmark</p>
        <h2 id="bench-title" className="wh-h2">Fast or personal. Pick one.</h2>
        <p className="wh-big">First I benchmarked the apps that already answer “what should I wear today?”: closet apps, weather apps with an avatar, and a few niche ones for runners and kids. Mapped by how much setup they need and how personal the advice gets, one corner was empty.</p>
        <Benchmark />
      </div>
    </section>

    <section className="wh-findings" aria-label="Seven key findings">
      {findings.map(([t, why, so], i) => <article key={t} className="wh-finding" style={{ background: tints[i] }}>
        <span className="wh-finding__n">{String(i + 1).padStart(2, "0")}</span>
        <h3>{t}</h3>
        <p>{why}</p>
        <p className="wh-finding__so">→ {so}</p>
      </article>)}
    </section>

    {/* SOFIA: lavender */}
    <section className="wh-panel wh-lav" aria-labelledby="persona-title">
      <div className="wh-wide wh-persona">
        <figure className="wh-persona__photo"><img src={media("persona-sofia-v2.webp")} alt="Portrait of Sofía Ríos, smiling by the sea on a windy day" loading="lazy" /></figure>
        <div>
          <p className="wh-kicker">Meet Sofía · a proto-persona built from the reviews</p>
          <h2 id="persona-title" className="wh-h2">31, Buenos Aires, out of the house from 8am to 7pm. Always colder than everyone else.</h2>
          <div className="wh-persona__lists">
            <div><h3>She wants</h3><ul><li>To leave home dressed for the whole day</li><li>To not carry things she won’t need</li><li>To not get caught in the rain on the way home</li></ul></div>
            <div><h3>She’s tired of</h3><ul><li>Forecasts that don’t match how she feels</li><li>Carrying her jacket all afternoon</li><li>Photographing her closet for an app</li></ul></div>
          </div>
        </div>
      </div>
    </section>

    {/* THE IDEA: green */}
    <section className="wh-panel wh-green" aria-labelledby="idea-title">
      <div className="wh-wide wh-idea">
        <div>
          <p className="wh-kicker">03 · The idea</p>
          <h2 id="idea-title" className="wh-h1">One answer<br />to get to know you.</h2>
          <p className="wh-big">No weather report. A sentence, an outfit and a “bring” list, for the whole time you’re out. Then one question every evening.</p>
          <ol className="wh-loop">{loop.map(([l, c], i) => <li key={l} style={{ background: c, animationDelay: `${i * 0.6}s` }}><span>{i + 1}</span>{l}</li>)}</ol>
        </div>
        <Phone src={shot("home-sunny")} alt="Today screen: 17°C sunny, 'The sun is doing the most today', the day strip and the outfit" className="tilt-r" />
      </div>
    </section>

    {/* LAYERS: scroll-driven, cold to warm */}
    <Layers />

    {/* CHECK-IN: night lavender, playable */}
    <section className="wh-panel wh-dusk" aria-labelledby="check-title">
      <WeatherFx kind="night" seed={19} dense={0.6} />
      <div className="wh-wide wh-checkwrap">
        <div>
          <p className="wh-kicker">Finding 03 · Everyone experiences the weather differently</p>
          <h2 id="check-title" className="wh-h2">Three buttons, once a day. That’s how Whether learns.</h2>
          <p>The check-in is easy enough to do every evening. Drip, the mascot, shows each answer, and its accessory always follows the temperature: a beanie when you were cold, sunglasses when you were hot. It feels like telling a friend how your day went.</p>
        </div>
        <CheckIn />
      </div>
    </section>

    {/* SCREENS */}
    <section className="wh-panel wh-sky" aria-labelledby="onb-title">
      <div className="wh-wide"><p className="wh-kicker">04 · The app</p><h2 id="onb-title" className="wh-h2">Set up in 30 seconds. No closet photos required.</h2>
        <p className="wh-big">Tell Whether where you are, how sensitive you are to the cold, how you get around, and when you’re usually out. Then get straight to a personalized recommendation for the day.</p></div>
      <div className="wh-marquee" aria-label="Onboarding screens"><div className="wh-marquee__track">
        {[...onboarding, ...onboarding].map((s, i) => <Phone key={i} inset src={shot(s)} alt={i < onboarding.length ? `Onboarding step ${i + 1}` : ""} />)}
      </div></div>
    </section>

    <section className="wh-panel wh-cream" aria-labelledby="today-title">
      <div className="wh-wide"><h2 id="today-title" className="wh-h2">Today, whatever the weather.</h2>
        <p className="wh-big">The big number is how it <i>feels</i>. The headline is a sentence, not a number. Each condition has its own color, always with a word, since no brand color passes contrast with white text. So text on color is always Dark.</p></div>
      <div className="wh-forecasts">
        {forecasts.map(([s, label, temp, c]) => <div key={s} className="wh-forecast" style={{ background: c }}>
          <span className="wh-forecast__t">{temp}</span>
          <Phone src={shot(s)} alt={`Today screen, ${label}`} dark={s === "home-night"} top={s === "home-night" ? "#1A2234" : undefined} />
          <span className="wh-forecast__l">{label}</span>
        </div>)}
      </div>
    </section>

    <section className="wh-panel wh-yellow" aria-labelledby="out-title">
      <div className="wh-wide wh-split">
        <div>
          <h2 id="out-title" className="wh-h2">Not everyone has a routine.</h2>
          <p>The first idea was a button that changed based on the time of day. But some people work from home, and plenty of people don’t follow a fixed routine.</p>
          <p>Instead of guessing what users are doing, the center button always offers the same two options: <b>Heading out now?</b> and <b>Check in</b>.</p>
          <p><b>One consistent entry point. No assumptions about your day.</b></p>
        </div>
        <div className="wh-pair">
          <Phone top="#CCCBC7" src={shot("heading-out-sheet")} alt="Heading out sheet: back in about 2–3 hours, a mini outfit answer" className="tilt-l" />
          <Phone src={shot("out-active")} alt="Today while out: 'Out until 7:00pm', sunset at 6:50, a layer for after sunset" className="tilt-r" />
        </div>
      </div>
    </section>

    <section className="wh-panel wh-coral" aria-labelledby="trip-title">
      <div className="wh-wide"><h2 id="trip-title" className="wh-h2">Madrid in 23 days? Start with an estimate, not a promise.</h2>
        <p className="wh-big">The forecast gets more reliable as your trip approaches. Whether makes that uncertainty visible, moving from typical weather to early forecasts and finally to the actual forecast, while showing how each update changes your packing list.</p>
        <p className="wh-big"><b>Plan ahead with what’s known. Adjust as the forecast gets clearer.</b></p></div>
      <ol className="wh-trip">
        {trip.map(([s, when, what]) => <li key={s}><Phone src={shot(s)} alt={`Trip screen, ${when}: ${what}`} /><b>{when}</b><span>{what}</span></li>)}
      </ol>
    </section>

    {/* BRAND */}
    <section className="wh-panel wh-cream wh-name" aria-labelledby="name-title">
      <div className="wh-wide">
        <p className="wh-kicker">05 · Brand</p>
        <h2 id="name-title" className="wh-swap" aria-label="Weather, whether"><span>Weather</span><span>Whether</span></h2>
        <p className="wh-big">The app answers <i>whether</i> to wear a jacket and <i>whether</i> to take an umbrella. The name holds the whole idea: the decision, not the data.</p>
      </div>
    </section>

    <section className="wh-palette" aria-label="Color palette">
      {palette.map(([n, hex, use]) => <div key={n} style={{ background: hex, color: n === "Dark" ? "#FFFDF7" : "#263238" }}><b>{n}</b><span>{hex}</span><small>{use}</small></div>)}
    </section>

    <section className="wh-panel wh-sky2" aria-labelledby="drip-title">
      <WeatherFx kind="rain" seed={23} dense={0.5} />
      <div className="wh-wide">
        <h2 id="drip-title" className="wh-h2">A coat hanger, a sun in a beanie… then a raindrop in a rain hat.</h2>
        <p className="wh-big">The first logos looked polished but didn’t feel like Whether. A mascot can literally dress for the weather, and live inside the app. We tried a cloud, a raindrop and a sun, and chose <b>Drip</b>: the boldest silhouette, and smiling suns are everywhere.</p>
        <img className="wh-wideimg" src={media("logo-journey.svg")} alt="From four flat logo concepts, to glass tests, to three mascots, to Drip" loading="lazy" />
        <div className="wh-drips">
          {[["drip-v2-rain.svg", "Rain hat", "On the logo"], ["drip-v2-sun.svg", "Sunglasses", "Sunny days"], ["drip-v2-cold.svg", "Beanie and scarf", "Cold days"], ["drip-v2-dark-logo.svg", "Night glass", "Dark mode"]].map(([f, t, s]) => <figure key={f}><img src={ui(f)} alt={`Drip: ${t}`} loading="lazy" /><figcaption><b>{t}</b>{s}</figcaption></figure>)}
        </div>
      </div>
    </section>

    {/* NIGHT: coming soon */}
    <section className="wh-panel wh-night" aria-labelledby="soon-title">
      <WeatherFx kind="night" seed={41} />
      <div className="wh-wide">
        <p className="wh-kicker">06 · What’s next</p>
        <h2 id="soon-title" className="wh-h1">Coming soon<br />to your phone.</h2>
        <p className="wh-big">Whether is currently in development, powered by Open-Meteo’s free weather data.</p>
        <p className="wh-big">The home-screen widget brings the day’s outfit recommendation at a glance, without needing to open the app.</p>
        <p className="wh-big">After launch, this section will include the production build, user testing results, and key learnings.</p>
        <div className="wh-widgets">
          <img src={shot("widget-small")} alt="Small widget: 9°, layers today, jacket off by 1:00pm" loading="lazy" />
          <img src={shot("widget-medium")} alt="Medium widget: wear layers, jacket off by lunch, with the day strip" loading="lazy" />
          <img src={shot("widget-evening")} alt="Evening widget: how did today feel? with three buttons" loading="lazy" />
          <span className="wh-icons"><img src={media("logo/whether-app-icon-centered.svg")} alt="Whether app icon" /><img src={media("logo/whether-app-icon-dark-centered.svg")} alt="Whether app icon for dark mode" /></span>
        </div>
        <ul className="wh-next">{next.map((n) => <li key={n}>{n}</li>)}</ul>
        <dl className="wh-credits"><div><dt>Research, design, brand and build</dt><dd>Rocío Espinosa</dd></div><div><dt>Weather data</dt><dd>Open-Meteo</dd></div><div><dt>Logo, mascot and icon exploration</dt><dd>AI-assisted, chosen and refined by me</dd></div></dl>
      </div>
    </section>

    <div className="page-shell"><Footer /></div>
  </main>;
}

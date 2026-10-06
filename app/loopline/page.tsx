import fs from "node:fs";
import path from "node:path";
import { Inter } from "next/font/google";
import { Footer, Header } from "../components";
import { ZoomMedia } from "./zoom-image";
import "../casestudy/casestudy.css";
import "./loopline.css";

// Loopline case study. Reuses the Subsure case-study layout (casestudy.css) with Loopline's own accent.

export const metadata = { title: "Loopline case study — Rocío Espinosa" };

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-inter" });

const index = [
  { label: "01 Context", items: [["overview", "1.1", "Overview"], ["problem", "1.2", "Problem statement"]] },
  { label: "02 Research", items: [["brief", "2.1", "The brief"], ["key-findings", "2.2", "Key findings"], ["persona", "2.3", "User persona"], ["user-needs", "2.4", "User needs"], ["scenarios", "2.5", "User scenarios"]] },
  { label: "03 Design", items: [["key-idea", "3.1", "Standing schedule + exceptions"], ["decisions", "3.2", "Design decisions"], ["colors", "3.3", "One color, one meaning"], ["screens", "3.4", "Final screens"], ["prototypes", "3.5", "Interactive prototypes"]] },
  { label: "04 Reflection", items: [["learnings", "4.1", "What I learned"], ["next-steps", "4.2", "Next steps"]] },
];

const facts = [["Role", "Product Designer"], ["Platform", "Desktop web app"], ["Tools", "Figma, Claude Code"]];

// Small filled icons (24×24) for the icon tiles.
const ICONS: Record<string, React.ReactNode> = {
  sparkle: <path d="M12 2c.6 4.9 2.6 6.9 7.5 7.5-4.9.6-6.9 2.6-7.5 7.5-.6-4.9-2.6-6.9-7.5-7.5C9.4 8.9 11.4 6.9 12 2Zm6.5 12c.3 2.3 1.2 3.2 3.5 3.5-2.3.3-3.2 1.2-3.5 3.5-.3-2.3-1.2-3.2-3.5-3.5 2.3-.3 3.2-1.2 3.5-3.5Z" />,
  layers: <><path d="M12 2.5 22 7.4l-10 4.9L2 7.4l10-4.9Z" /><path d="m4.2 11 7.8 3.8 7.8-3.8 2.2 1.1-10 4.9-10-4.9L4.2 11Z" /><path d="m4.2 15.6 7.8 3.8 7.8-3.8 2.2 1.1-10 4.9-10-4.9 2.2-1.1Z" /></>,
  grid: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></>,
  eye: <path fillRule="evenodd" d="M12 5C6.6 5 2.8 9.1 1.6 11.4a1.4 1.4 0 0 0 0 1.2C2.8 14.9 6.6 19 12 19s9.2-4.1 10.4-6.4a1.4 1.4 0 0 0 0-1.2C21.2 9.1 17.4 5 12 5Zm0 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  pencil: <><path d="M16.6 3.4a2.5 2.5 0 0 1 3.5 0l.5.5a2.5 2.5 0 0 1 0 3.5L9.4 18.6 3.5 20.5l1.9-5.9L16.6 3.4Z" /></>,
  shield: <path fillRule="evenodd" d="M12 2 4 5.2V11c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5.2L12 2Zm-1.1 13.9-3.6-3.6 1.4-1.4 2.2 2.2 4.6-4.6 1.4 1.4-6 6Z" />,
  tag: <path fillRule="evenodd" d="M3 4.6C3 3.7 3.7 3 4.6 3h6.3c.4 0 .8.2 1.1.5l8.5 8.5c.6.6.6 1.6 0 2.2l-6.3 6.3c-.6.6-1.6.6-2.2 0L3.5 12a1.6 1.6 0 0 1-.5-1.1V4.6ZM7.6 9.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" />,
  bulb: <><path d="M12 2a7 7 0 0 0-4 12.8V17c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-2.2A7 7 0 0 0 12 2Z" /><path d="M9 19.5h6V21c0 .6-.4 1-1 1h-4a1 1 0 0 1-1-1v-1.5Z" /></>,
};

function Icon({ name, color }: { name: string; color: string }) {
  return <span className="ll-icon" style={{ color }} aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor">{ICONS[name]}</svg></span>;
}

const principles = [
  { name: "Simplicity", icon: "sparkle", color: "#F97316", chip: "Minimal interpretation", text: "Use visuals that are easy to understand. Managers shouldn’t have to interpret or analyze anything to know what will happen." },
  { name: "Consistency", icon: "layers", color: "#8B5CF6", chip: "Same patterns everywhere", text: "Features, colors and patterns behave the same way across the whole app." },
];

const keyFindings = [
  "Most changes are exceptions, not new schedules. The weekly routine is stable; what changes is one day here and there.",
  "Changes happen in different moments: planning ahead, the day before, live during a shift, and after the fact from home.",
  "Managers think in situations, not fields. They say “we start an hour late tomorrow”, not “edit Shift 1 start time”.",
];

const userNeeds = [
  "Set up the regular week in one place",
  "Change one day without breaking the rest",
  "See what a change will do before saving it",
  "Correct past days so the metrics are fixed",
  "Understand why this information matters",
];

const scenarios = {
  columns: ["Scenario", "What the manager needs", "How the design handles it"],
  rows: [
    ["1. Long-term planning", "Enter shifts and breaks for the coming months", "Edit schedule sets operating days, shifts and breaks once, as a standing schedule that repeats every week, with a live weekly preview."],
    ["2. Holiday", "Remove the shifts on the holiday and add them back the day after", "Add exception → Holiday / closed day. The preview lists every shift that will be removed before anything is applied."],
    ["3. Late start tomorrow", "Start one hour later to make time for repairs", "Day actions → Edit this day. Changing Shift 1 to 7:00 AM marks it as Modified, updates the day summary and saves as a Late start."],
    ["4. Longer breaks, live", "Give the crew more rest when the plant is ahead of schedule", "Add exception → Break adjustment, or edit the exact break times for that day."],
    ["5. Overtime", "Run one extra hour", "Add exception → Overtime, or move the shift’s end time. Either way it saves as Overtime."],
    ["6. Retroactive fix", "A break was logged as downtime; fix it from home", "Open the past day → Edit this day → move the break, so the metrics can be recalculated."],
    ["7. New operating days", "Switch from Mon–Fri to Tue–Sat", "Edit schedule → operating days. The weekly preview updates as days are toggled."],
  ],
};

const decisions = [
  { title: "Start from the situation, not the fields", icon: "grid", color: "#F97316", chip: "6 exception types", principle: "Simplicity", text: "Add exception opens with the type of change: Holiday, Late start, Early end, Overtime, Break adjustment or Custom. The manager picks what happened in their own words, and the form only asks for what that change needs." },
  { title: "Preview the impact before saving", icon: "eye", color: "#8B5CF6", chip: "Live preview", principle: "Simplicity", text: "Every edit shows its result next to the form: the weekly preview in Edit schedule and “Impact on schedule” in Add exception. Removed shifts are crossed out, so nothing happens by surprise." },
  { title: "Make every change visible", icon: "pencil", color: "#EC4899", chip: "Modified · Unchanged", principle: "Simplicity", text: "Edited shifts and breaks get a Modified or Unchanged label, the original time stays visible, and a day summary shows the final result. An “Unsaved changes” status sits next to Save." },
  { title: "Prevent errors early", icon: "shield", color: "#16A34A", chip: "Inline validation", principle: "Simplicity", text: "Rules like “breaks must fall within their shift” are checked as the manager types. The field turns red, the message says exactly what’s wrong, and Save stays disabled until it’s fixed." },
  { title: "Name the change for the manager", icon: "tag", color: "#3B82F6", chip: "Auto-named changes", principle: "Consistency", text: "Editing a day by hand is classified automatically: moving a start later saves as Late start, ending earlier as Early end. The same names appear in the calendar, the day view and the alerts." },
  { title: "Explain why it matters", icon: "bulb", color: "#F59E0B", chip: "Dismissible banner", principle: "Simplicity", text: "A short, dismissible banner connects the task to the outcome: accurate shifts and breaks let the AI tell downtime apart from planned breaks. It turns admin work into something with a purpose." },
];

const colors = [
  { name: "Running", token: "status/running", hex: "#81D307" },
  { name: "Empty belt", token: "status/empty-belt", hex: "#FBBF24" },
  { name: "Downtime", token: "status/downtime", hex: "#E52525" },
  { name: "Break / planned break", token: "status/planned-break", hex: "#E25E00" },
  { name: "Exception", token: "schedule/exception", hex: "#7C3AED" },
  { name: "No operation", token: "status/no-operation", hex: "#A3A3A3" },
];

const screens = [
  { file: "overview.webp", title: "Operations overview", caption: "Efficiency metrics, the facility timeline and today’s schedule context, using the same status colors as the schedule." },
  { file: "schedule.webp", title: "Plant schedule", caption: "The week at a glance with shifts, breaks and exceptions, plus a detailed day view." },
  { file: "edit-schedule.webp", title: "Edit schedule", caption: "Operating days, shifts and breaks grouped by shift, with a live weekly preview." },
  { file: "add-exception.webp", title: "Add exception", caption: "Exception type, affected dates and a preview of the impact on the schedule." },
  { file: "edit-exception.webp", title: "Edit exception", caption: "Change one day’s shifts and breaks, with Modified labels and a day summary before saving." },
  { file: "add-shift.png", title: "Add shift", caption: "Name, times, breaks, and whether the shift joins the standing schedule or specific dates." },
];

// Prototype links are hidden for now (holiday: claude.ai/artifact/DckUWxJ5pPq81E4bxMTPLN, late start: claude.ai/artifact/A1Q2c5XwnFReMAx6YQMpuA).
const prototypes = [
  { title: "Adding a holiday", story: "Scenario 2", text: "Pick Holiday / closed day, check which shifts will be removed, and apply. The week and day views update, with an Undo.", video: "prototype-holiday.mp4" },
  { title: "Late start tomorrow", story: "Scenario 3", text: "Open tomorrow, edit the day, move Shift 1 to 7:00 AM and save. Moving a break outside its shift shows the validation.", video: "prototype-late-start.mp4" },
];

const learnings = [
  "Data input is part of the product’s value. The AI is only as good as the schedule behind it, so the input flow deserves as much care as the dashboard.",
  "Naming the situation beats exposing the settings. Exception types turned seven different scenarios into one simple flow.",
  "Consistency is easy to lose in a big file. The same orange meant “empty belt” on one screen and “break” on another until I moved every color to a named token.",
];

const nextSteps = [
  "Test with 3–5 operations managers, using the scenarios as tasks, especially the late start and the retroactive fix.",
  "Design for the floor: live changes like longer breaks probably happen on a phone, so a mobile quick action comes next.",
  "Show a confirmation when a past day is edited, so managers know the metrics were recalculated.",
  "Measure success: days with an accurate schedule, how often downtime is corrected after the fact, and how long a typical change takes.",
];

const media = (file: string) => `/media/loopline/${file}`;
const exists = (file: string) => fs.existsSync(path.join(process.cwd(), "public", "media", "loopline", file));

function LooplineMark() {
  return (
    <svg className="ll-mark" viewBox="0 0 26 22" aria-hidden="true">
      <rect x="3.2" y="3.2" width="15.6" height="15.6" rx="4" transform="rotate(45 11 11)" fill="#8b5cf6" />
      <circle cx="17.5" cy="11" r="7" fill="#ec4899" stroke="var(--ll-bg, #fff)" strokeWidth="2" />
    </svg>
  );
}

function Arrow() {
  return <svg className="cs-arrow" viewBox="0 0 40 16" aria-hidden="true"><path d="M1 8h36M30 2l7 6-7 6" /></svg>;
}

function ArrowList({ items }: { items: string[] }) {
  return <ul className="cs-arrow-list">{items.map((item) => <li key={item}><Arrow />{item}</li>)}</ul>;
}

function Section({ id, number, title, children, wide = false }: { id: string; number: string; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section id={id} className={`cs-section${wide ? " cs-section--wide" : ""}`} aria-labelledby={`${id}-title`}>
      <span className="cs-number">{number}</span>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

function Table({ columns, rows, label }: { columns: string[]; rows: string[][]; label: string }) {
  return (
    <div className="cs-table-wrap" role="region" aria-label={label} tabIndex={0}>
      <table className="cs-table">
        <thead><tr>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

// Shows the exported screen when it exists in public/media/loopline, otherwise a labeled placeholder.
function Shot({ file, alt }: { file: string; alt: string }) {
  if (exists(file)) return <img className="ll-shot" src={media(file)} alt={alt} loading="lazy" />;
  return <div className="ll-shot ll-shot--empty" role="img" aria-label={`${alt} (image coming soon)`}><span>Add <code>public/media/loopline/{file}</code></span></div>;
}

export default function Loopline() {
  return <main className={`ll ${inter.variable}`}><div className="page-shell"><Header />
    <section className="cs-hero">
      <div className="cs-brand">
        <span>Welcome to</span>
        <h1 className="ll-lockup"><LooplineMark />Loopline</h1>
        <p>Turning schedule input into downtime data you can trust</p>
        <dl className="ll-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </div>
      <nav className="cs-index" aria-label="Case study contents">
        {index.map((group) => (
          <div className="cs-index__group" key={group.label}>
            <span>{group.label}</span>
            <ol>{group.items.map(([id, number, label]) => <li key={id}><a href={`#${id}`}><b>{number}</b> {label}</a></li>)}</ol>
          </div>
        ))}
      </nav>
    </section>

    <Section id="overview" number="1.1" title="Overview">
      <p>Loopline’s <u>Operations Monitor</u> is a concept for recycling operations managers. An AI system watches the conveyor belts and detects two kinds of lost time: <b>downtime</b>, when the belts stop, and <b>empty belt time</b>, when they run with no material on them. To tell a real stoppage apart from a lunch break or the end of a shift, the AI needs the manager’s shifts and breaks. I designed how managers enter and edit them.</p>
      <div className="cs-task"><span>Main task</span><mark>Keep shifts and breaks up to date</mark></div>
    </Section>

    <Section id="problem" number="1.2" title="Problem statement">
      <p>Operations managers need a quick way to set up their usual schedule and adjust it when real life gets in the way: holidays, repairs, overtime or longer breaks. If the schedule is wrong, the metrics are wrong. Planned breaks show up as downtime, and the manager stops trusting the product. The challenge was to make an admin task that feels like a chore <mark>fast, clear and hard to get wrong</mark>.</p>
    </Section>

    <Section id="brief" number="2.1" title="The brief">
      <p>The brief set two design principles that guided every decision.</p>
      <div className="ll-principles">
        {principles.map((p) => <div key={p.name} className="ll-card"><Icon name={p.icon} color={p.color} /><h3>{p.name}</h3><p>{p.text}</p><span className="ll-chip">{p.chip}</span></div>)}
      </div>
    </Section>

    <Section id="key-findings" number="2.2" title="Key findings">
      <p className="ll-lead">Mapping the manager’s situations side by side showed three patterns:</p>
      <ArrowList items={keyFindings} />
    </Section>

    <Section id="persona" number="2.3" title="User persona" wide>
      <p className="ll-note">A proto-persona, built from the brief’s scenarios rather than interviews.</p>
      <div className="cs-persona">
        <aside className="cs-persona__card">
          <img className="cs-persona__photo ll-photo" src="/media/loopline/persona-daniel.png" alt="Portrait of Daniel Brooks" />
          <h3>Daniel Brooks</h3>
          <p className="cs-persona__role">Recycling Operations Manager</p>
          <dl>
            <div><dt>Workplace</dt><dd>Riverside Recycling</dd></div>
            <div><dt>Shifts</dt><dd>2 a day, Mon–Fri</dd></div>
            <div><dt>Tech comfort</dt><dd>Medium</dd></div>
            <div><dt>Devices</dt><dd>Desktop and phone</dd></div>
          </dl>
          <blockquote>“I just need the numbers to reflect what actually happened on the floor.”</blockquote>
        </aside>
        <div className="cs-persona__details">
          <h4>Background</h4>
          <p>Daniel runs a recycling center with two shifts a day. He spends most of his day on the floor, not at a desk. He checks the dashboard in the morning and sometimes at night from home, and he’s the one who answers when the numbers look wrong.</p>
          <h4>Goals</h4>
          <ul><li>Know how efficiently the plant is running</li><li>Set up the weekly schedule once and forget about it</li><li>Fix the schedule quickly when plans change</li></ul>
          <h4>Pain points</h4>
          <ul><li>Every unplanned stop looks like downtime, even when it was a break</li><li>Schedules change often: repairs, holidays, overtime</li><li>No time for complex admin tools</li></ul>
          <h4>Needs</h4>
          <ul><li>A standing schedule that repeats automatically</li><li>A fast way to change a single day</li><li>Confidence that the change was saved correctly</li></ul>
        </div>
      </div>
    </Section>

    <Section id="user-needs" number="2.4" title="User needs">
      <div className="ll-centered"><ArrowList items={userNeeds} /></div>
    </Section>

    <Section id="scenarios" number="2.5" title="User scenarios" wide>
      <p className="ll-lead">Each scenario from the brief became something the design had to handle:</p>
      <Table {...scenarios} label="User scenarios and how the design handles them" />
    </Section>

    <Section id="key-idea" number="3.1" title="Standing schedule + exceptions">
      <p>Most scenarios are one-off changes, so I split scheduling into two layers. The <mark>standing schedule</mark> is the normal week: set once, repeated automatically. <mark>Exceptions</mark> change specific dates and override the standing schedule without touching it.</p>
      <div className="ll-layers" aria-hidden="true">
        <div className="ll-layer ll-layer--ex"><b>Exception</b><span>Thu 14 · Holiday</span></div>
        <div className="ll-layer ll-layer--std"><b>Standing schedule</b><span>Mon–Fri · 2 shifts · 4 breaks</span></div>
      </div>
      <p>It works like a recurring meeting in a calendar: you can move one meeting without changing the whole series. Managers always know what’s normal and what’s special, and one click brings a day back to the standing schedule.</p>
    </Section>

    <Section id="decisions" number="3.2" title="Design decisions" wide>
      <div className="ll-decisions">
        {decisions.map((d) => <article key={d.title} className="ll-card"><Icon name={d.icon} color={d.color} /><h3>{d.title}</h3><p>{d.text}</p><div className="ll-chips"><span className="ll-chip">{d.chip}</span><span className="ll-chip ll-chip--principle">{d.principle}</span></div></article>)}
      </div>
    </Section>

    <Section id="colors" number="3.3" title="One color, one meaning" wide>
      <p className="ll-lead">The brief asked for consistency, but the first version broke it: the same orange meant “empty belt” on the overview and “break” on the schedule. I moved every status to a named token, so each color means one thing on every screen.</p>
      <ul className="ll-swatches">
        {colors.map((c) => <li key={c.token}><span style={{ background: c.hex }} /><b>{c.name}</b><code>{c.token}</code><small>{c.hex}</small></li>)}
      </ul>
    </Section>

    <Section id="screens" number="3.4" title="Final screens" wide>
      <div className="ll-screens">
        {screens.map((s) => (
          <figure key={s.file}>
            {exists(s.file)
              ? <ZoomMedia className="ll-shot" src={media(s.file)} alt={`${s.title} screen`} caption={s.title} />
              : <Shot file={s.file} alt={`${s.title} screen`} />}
            <figcaption><b>{s.title}</b>{s.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Section>

    <Section id="prototypes" number="3.5" title="Interactive prototypes" wide>
      <p className="ll-lead">Two flows built as clickable prototypes, recorded in action. Click a recording to watch it larger.</p>
      <div className="ll-protos">
        {prototypes.map((p) => (
          <article key={p.title}>
            {exists(p.video)
              ? <ZoomMedia video className="ll-shot" src={media(p.video)} alt={`${p.title} prototype in action`} caption={p.title} />
              : <Shot file={p.video} alt={`${p.title} prototype in action`} />}
            <span className="ll-tag">{p.story}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
    </Section>

    <Section id="learnings" number="4.1" title="What I learned">
      <ArrowList items={learnings} />
    </Section>

    <Section id="next-steps" number="4.2" title="Next steps">
      <ArrowList items={nextSteps} />
    </Section>

    <Footer />
  </div></main>;
}

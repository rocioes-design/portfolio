import { Footer, Header } from "../components";
import "./casestudy.css";

// Subsure case study, rebuilt from the old Framer site's /casestudy page.

const index = [
  { label: "01 Context", items: [["overview", "1.1", "Overview"], ["problem", "1.2", "Define the problem"]] },
  { label: "02 Research", items: [["research-approach", "2.1", "Research approach"], ["key-findings", "2.2", "Key findings"], ["user-research", "2.3", "User research"], ["persona", "2.4", "User persona"], ["user-needs", "2.5", "User needs"], ["journey", "2.6", "User journey mapping"]] },
  { label: "03 Result", items: [["user-flow", "3.1", "User flow"], ["benchmarking", "3.2", "Benchmarking"], ["wireframes", "3.3", "Low & high fidelity wireframes"]] },
];

const researchApproach = [
  "Reviewed existing subscription-management apps to compare common patterns and features",
  "Identified recurring pain points such as forgotten trials, unclear renewal dates, and difficult cancellation flows",
  "Looked at how users typically organize recurring expenses across banking apps, notes, reminders, and spreadsheets",
];

const keyFindings = [
  "Users want to see all subscriptions in one place rather than jumping between multiple apps and bank statements.",
  "Users need a clear view of upcoming charges so they can avoid surprises.",
  "People want to know whether a charge is actually a subscription and whether the app is accurate.",
  "Cancellation and editing actions should be easy to find, not hidden.",
  "A simple, uncluttered dashboard is essential because users usually check this information quickly.",
];

const userNeeds = [
  "See all subscriptions in one place",
  "Know what is recurring vs one-time",
  "Understand upcoming costs quickly",
  "Cancel or manage subscriptions easily",
  "Control and flexibility",
  "Reminders and alerts",
  "Simple organization",
];

const journey = {
  columns: ["Stage", "User goal", "Actions", "Pain points", "Emotions", "Design opportunities"],
  rows: [
    ["1. Awareness", "Realize she is spending too much on subscriptions", "Notices a bank charge she does not remember", "Subscription costs feel scattered and unclear", "Confused, anxious", "Surface monthly total and recurring charges clearly"],
    ["2. Discovery", "Find a tool to manage subscriptions", "Looks for an app or starts using the product", "Unsure whether the app can detect all subscriptions accurately", "Hopeful, cautious", "Strong onboarding that explains how the app works"],
    ["3. Onboarding / Setup", "Connect accounts or add subscriptions", "Links bank account or enters subscriptions manually", "Setup may feel too long or too invasive", "Slightly impatient", "Progressive onboarding, trust messaging, optional manual entry"],
    ["4. Review dashboard", "See everything in one place", "Scans subscriptions, upcoming payments, and totals", "Too much data at once can be overwhelming", "Relieved if clear, frustrated if cluttered", "Clear hierarchy, filters, summary cards"],
    ["5. Manage subscriptions", "Cancel or manage subscriptions", "Opens a subscription, reviews details, cancels or edits it", "Cancellation flows are often confusing or hidden", "Determined, skeptical", "Simple action buttons, clear state changes, confirmation steps"],
    ["6. Ongoing use", "Stay informed over time", "Checks alerts, renewal reminders, and monthly spend", "Forgetting to check can lead to surprise charges again", "More in control", "Reminders, alerts, and digest summaries"],
  ],
};

const benchmarking = {
  columns: ["App", "Positioning", "Subscription handling", "Strengths", "UX trade-offs to note"],
  rows: [
    ["Rocket Money", "All-in-one personal finance app with subscription cancellation, budgeting, spending, credit, and net worth tracking.", "Connects bank/credit card accounts, automatically detects recurring charges, and lets Premium members cancel subscriptions in a few taps.", "Strong “find and cancel” value proposition; good for users who want subscriptions inside a broader money app.", "Feels broader than a pure subscription tool, so the subscription flow has to compete with many other finance features."],
    ["Monarch Money", "Full finance app with budgeting, reports, goals, partner sharing, and recurring/subscription tracking across web, iOS, and Android.", "Automatically detects recurring subscriptions, shows bills and subscriptions in calendar/list views, and adds reminders.", "Strong hierarchy and organization around recurring items; good for showing dashboards and calendar/list switching.", "More of a full finance ecosystem than a focused tracker, so the recurring-payments feature is one part of a larger product."],
    ["Emma", "Budgeting app that tracks bills and subscriptions, with recurring-payment features and account connectivity.", "Tracks subscriptions and bills in one place, detects recurring payments, and includes cancellation actions for unwanted subscriptions.", "Clear subscription-centric language and strong recurring-payment framing, which is useful for a product concept focused on visibility and control.", "The product also spans budgeting and broader money-management features, so the tracker competes with adjacent finance tasks."],
    ["Trim", "Money-saving app that tracks spending, manages budgets, and helps monitor/cancel subscriptions.", "Analyzes connected transactions to identify subscriptions automatically and can monitor/cancel unwanted subscriptions.", "Strong for automation and “do the work for me” behavior; good reference for a low-effort, high-reassurance UX.", "There is less public detail on the current interface than for Rocket Money or Monarch."],
  ],
};

const screens = [
  { src: "/media/casestudy/screens-1.png", alt: "Welcome screen with the Subsure logo and a Get started button, next to the Add an account screen with Google, email and passkey options" },
  { src: "/media/casestudy/screens-2.png", alt: "Home screen with current subscriptions and monthly spend, next to the All subscriptions list" },
  { src: "/media/casestudy/screens-3.png", alt: "Budget screen with current spend and yearly charts, next to a subscription detail screen for Google" },
  { src: "/media/casestudy/screens-4.png", alt: "Add subscription form, next to the Edit subscription form with cancel and pause actions" },
];

function SubsureMark() {
  return <svg className="cs-mark" viewBox="0 0 94 149" aria-hidden="true"><path d="M1.75 33.47H0V61.7h34.45c3.21 0 4.38 4.36 1.46 5.82l-6.71 3.2A64.2 64.2 0 0 1 1.75 77.4H0v28.23h33.57c3.21 0 4.38 4.37 1.46 5.83l-7 3.2a63.3 63.3 0 0 1-26.28 6.11H0V149h33.57l3.8-4.66c16.34-18.92 35.32-28.81 55.17-28.81H94V87.3H60.43c-3.21 0-4.38-4.36-1.46-5.82l7-3.2a63.3 63.3 0 0 1 26.27-6.11h1.46V43.94H59.55c-3.21 0-4.38-4.37-1.46-5.82l6.72-3.2A64.2 64.2 0 0 1 92.25 28.23h1.46V0H60.14l-3.8 4.66C40.58 23.57 21.31 33.47 1.75 33.47Z" /></svg>;
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

export default function CaseStudy() {
  return <main><div className="page-shell"><Header />
    <section className="cs-hero">
      <div className="cs-brand">
        <SubsureMark />
        <span>Welcome to</span>
        <h1>Subsure</h1>
        <p>All your subscriptions, in one view</p>
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
      <p>Subscription Tracker is a mobile-first concept designed to help users manage recurring payments <u>in one place</u>. The app lets users quickly review subscriptions, understand upcoming charges, and access cancellation actions with a clearer, more organized interface.</p>
      <div className="cs-task"><span>Main task</span><mark>Track recurring subscriptions</mark></div>
    </Section>

    <Section id="problem" number="1.2" title="Problem statement">
      <p>Users need a simple way to track recurring subscriptions, understand upcoming payments, and manage cancellations without relying on fragmented financial tools. Current solutions either lack clarity or overwhelm users with unnecessary complexity.</p>
    </Section>

    <Section id="research-approach" number="2.1" title="Research approach">
      <ArrowList items={researchApproach} />
    </Section>

    <Section id="key-findings" number="2.2" title="Key findings">
      <ArrowList items={keyFindings} />
    </Section>

    <Section id="user-research" number="2.3" title="User research">
      <p>To better understand how people manage subscriptions, I combined secondary research with product benchmarking and user pain-point analysis. The goal was to <mark>identify</mark> the most common frustrations around recurring payments, cancellation flows, and subscription visibility.</p>
      <blockquote className="cs-quote">“I just want to know what I’m paying for before my card gets hit again.”</blockquote>
    </Section>

    <Section id="persona" number="2.4" title="User persona" wide>
      <div className="cs-persona">
        <aside className="cs-persona__card">
          <img className="cs-persona__photo" src="/media/casestudy/persona-valeria.png" alt="Portrait of Valeria Gómez" />
          <h3>Valeria Gómez</h3>
          <p className="cs-persona__role">Community Manager</p>
          <dl>
            <div><dt>Age</dt><dd>29</dd></div>
            <div><dt>Location</dt><dd>Buenos Aires</dd></div>
            <div><dt>Tech comfort</dt><dd>High</dd></div>
            <div><dt>Devices</dt><dd>iPhone, laptop, banking apps, calendar, notes app</dd></div>
          </dl>
          <blockquote>“I just want to know what I’m paying for before my card gets hit again.”</blockquote>
        </aside>
        <div className="cs-persona__details">
          <h4>Background</h4>
          <p>Valeria uses several digital subscriptions for work and personal life: streaming, cloud storage, design tools, food delivery, and fitness apps. She usually signs up for free trials or monthly plans, then forgets about them until her card gets charged. She wants to stay in control of her recurring expenses without spending too much time managing them.</p>
          <h4>Goals</h4>
          <ul><li>See all subscriptions in one place</li><li>Know how much she spends monthly</li><li>Catch trial endings and upcoming renewals</li><li>Cancel or manage subscriptions quickly</li><li>Avoid surprise charges</li></ul>
          <h4>Pain points</h4>
          <ul><li>Bank statements are hard to scan</li><li>Subscription charges are often hidden or mislabeled</li><li>She forgets about free trials</li><li>Canceling subscriptions is often annoying and unclear</li><li>She does not want to manually track everything in a spreadsheet.</li></ul>
          <h4>Needs</h4>
          <ul><li>Automatic detection of recurring payments</li><li>Clear monthly total</li><li>Upcoming payment alerts</li><li>Simple cancellation access</li><li>Trustworthy categorization and labels</li></ul>
        </div>
      </div>
    </Section>

    <Section id="user-needs" number="2.5" title="User needs">
      <div className="cs-needs">
        <ArrowList items={userNeeds} />
        <img className="cs-needs__phone" src="/media/casestudy/user-needs-phone.png" alt="Subsure home screen showing current subscriptions and monthly spend" />
      </div>
    </Section>

    <Section id="journey" number="2.6" title="User journey mapping" wide>
      <Table {...journey} label="User journey map" />
    </Section>

    <Section id="user-flow" number="3.1" title="User flow" wide>
      <img className="cs-flow" src="/media/casestudy/user-flow.png" alt="User flow: log in, onboarding, connect an account or add subscriptions manually, dashboard overview, review a subscription, take action, set reminders or notifications, and return to the dashboard" />
    </Section>

    <Section id="benchmarking" number="3.2" title="Benchmarking" wide>
      <Table {...benchmarking} label="Benchmarking of subscription apps" />
    </Section>

    <Section id="wireframes" number="3.3" title="Low & high fidelity wireframes" wide>
      <div className="cs-screens">{screens.map((s) => <img key={s.src} src={s.src} alt={s.alt} loading="lazy" />)}</div>
    </Section>

    <Footer />
  </div></main>;
}

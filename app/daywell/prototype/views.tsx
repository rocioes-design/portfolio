"use client";

import { useState } from "react";
import { Icon, Logomark, type IconName } from "./icons";
import { Badge, Select } from "./ui";
import {
  HOLIDAYS, LEAVE, ME, PEOPLE, addDays, available, conflictsFor, dayCount, eachDay, isWeekend, monthLabel, overlaps, shortDate,
  toDate, weekday, workingDays, type LeaveType, type Request, type Status,
} from "./data";

export type Role = "employee" | "manager";

/* ---------- App shell ---------- */

const NAV: [IconName, string, string?][] = [
  ["home", "Dashboard"], ["chart", "Executive overview"], ["network", "Organization chart"], ["target", "Performance reviews", "3"],
  ["folder", "Employee directory"], ["clock", "Time & attendance"], ["wallet", "Payroll & compensation"], ["graduation", "Learning & development"],
];

const IDENTITY: Record<Role, { name: string; title: string; initials: string }> = {
  employee: { name: "Olivia Bennett", title: "Content Specialist", initials: "OB" },
  manager: { name: "Hannah Lee", title: "Marketing Manager", initials: "HL" },
};

export function Shell({ role, onRole, breadcrumb, children }: { role: Role; onRole: (r: Role) => void; breadcrumb: string[]; children: React.ReactNode }) {
  const active = role === "employee" ? "Dashboard" : "Time & attendance";
  const me = IDENTITY[role];
  return (
    <div className="dw-app">
      <nav className="dw-sidebar" aria-label="Main">
        <div className="dw-workspace">
          <span className="dw-monogram">AC</span>
          <span className="dw-workspace__name"><strong>Acme Workspace</strong><small>12 members</small></span>
          <Icon name="chevronsUpDown" size={22} />
        </div>
        <div className="dw-search"><Icon name="search" size={16} /><span>Search</span><kbd>⌘K</kbd></div>
        <ul className="dw-nav">
          {NAV.map(([icon, label, count]) => (
            <li key={label} className={label === active ? "is-active" : ""} aria-current={label === active ? "page" : undefined}>
              <Icon name={icon} size={18} />{label}
              {count && <span className="dw-nav__count">{count}</span>}
              {label === "Employee directory" && <Icon name="chevronDown" size={18} className="dw-nav__chev" />}
            </li>
          ))}
        </ul>
        <div className="dw-files">
          <div className="dw-files__head">FILES<Icon name="plus" size={20} /></div>
          {[["Policies", "#f5b70a"], ["Payslips", "#7c6ad8"], ["Contracts", "#e04f2c"]].map(([label, color]) => (
            <div key={label} className="dw-files__item"><Icon name="chevronRight" size={16} /><svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true"><path d="M0 2.5A2.5 2.5 0 0 1 2.5 0h4l2 2.2h7A2.5 2.5 0 0 1 18 4.7v8.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 0 13.5z" fill={color} /></svg>{label}</div>
          ))}
        </div>
        <div className="dw-me">
          <span className="dw-monogram dw-monogram--round">{me.initials}</span>
          <span className="dw-me__name"><strong>{me.name}</strong><small>{me.title}</small></span>
          <Icon name="settings" size={18} />
        </div>
      </nav>
      <div className="dw-main">
        <header className="dw-topbar">
          <p className="dw-breadcrumb">{breadcrumb.map((b, i) => <span key={b} className={i === breadcrumb.length - 1 && breadcrumb.length > 1 ? "is-current" : ""}>{b}</span>)}</p>
          <div className="dw-topbar__end">
            <Select
              className="dw-role" label="View as" value={role} demo="role"
              options={[{ value: "employee", label: "Employee" }, { value: "manager", label: "Manager" }]}
              onChange={(v) => onRole(v as Role)} placeholder="Role"
            />
            <button type="button" className="dw-iconbtn dw-iconbtn--outline" aria-label="Theme"><Icon name="sun" size={18} /></button>
            <Logomark size={40} />
          </div>
        </header>
        <main className="dw-content">{children}</main>
      </div>
    </div>
  );
}

/* ---------- Requests table (both roles) ---------- */

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" }, { value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "declined", label: "Declined" },
];

function Table({ rows, manager, selected, onToggle, onToggleAll, onReview, flash }: {
  rows: Request[]; manager: boolean; selected: string[]; flash: string[];
  onToggle?: (id: string) => void; onToggleAll?: () => void; onReview?: (id: string, d: "approve" | "decline") => void;
}) {
  const pending = rows.filter((r) => r.status === "pending");
  const allOn = pending.length > 0 && pending.every((r) => selected.includes(r.id));
  return (
    <div className={`dw-table ${manager ? "dw-table--manager" : ""}`} role="table" aria-label="Recent requests">
      <div className="dw-tr dw-tr--head" role="row">
        {manager && <span role="columnheader"><input type="checkbox" className="dw-check" checked={allOn} onChange={onToggleAll} aria-label="Select all pending requests" /></span>}
        <span role="columnheader"><Icon name="file" size={16} />Leave type</span>
        {manager && <span role="columnheader"><Icon name="user" size={16} />Employee</span>}
        <span role="columnheader"><Icon name="calendar" size={16} />Amount</span>
        <span role="columnheader"><Icon name="loader" size={16} />Status</span>
        <span role="columnheader"><Icon name="pen" size={16} />Notes</span>
        <span role="columnheader" className="dw-tr__actions"><Icon name="check" size={16} />Actions</span>
      </div>
      {rows.length === 0 && <p className="dw-table__empty">No requests with this status.</p>}
      {rows.map((r) => {
        const person = PEOPLE[r.person];
        const isSel = selected.includes(r.id);
        return (
          <div key={r.id} role="row" className={`dw-tr ${isSel ? "is-selected" : ""} ${flash.includes(r.id) ? "is-flash" : ""}`} data-demo={`row-${r.id}`}>
            {manager && (
              <span role="cell">
                <input type="checkbox" className="dw-check" checked={isSel} disabled={r.status !== "pending"} onChange={() => onToggle?.(r.id)} aria-label={`Select ${person.name}'s request`} data-demo={`select-${r.id}`} />
              </span>
            )}
            <span role="cell" className="dw-cell2"><strong>{LEAVE[r.type].label}</strong><small>{shortDate(r.start)} - {shortDate(r.end)}</small></span>
            {manager && <span role="cell" className="dw-cell2"><strong>{person.name}</strong><small>{person.id}</small></span>}
            <span role="cell">{dayCount(workingDays(r.start, r.end))}</span>
            <span role="cell"><Badge status={r.status} /></span>
            <span role="cell" className="dw-tr__note">{r.reason ?? (manager ? r.note : undefined)}</span>
            <span role="cell" className="dw-tr__actions">
              {manager && r.status === "pending" && (
                <>
                  <button type="button" className="dw-iconbtn dw-iconbtn--sm" aria-label={`Decline ${person.name}'s request`} onClick={() => onReview?.(r.id, "decline")} data-demo={`decline-${r.id}`}><Icon name="x" size={16} /></button>
                  <button type="button" className="dw-iconbtn dw-iconbtn--sm" aria-label={`Approve ${person.name}'s request`} onClick={() => onReview?.(r.id, "approve")} data-demo={`approve-${r.id}`}><Icon name="check" size={16} /></button>
                </>
              )}
              <button type="button" className="dw-iconbtn dw-iconbtn--sm" aria-label="More actions"><Icon name="more" size={18} /></button>
            </span>
          </div>
        );
      })}
      <p className="dw-table__foot">Showing {rows.length} {rows.length === 1 ? "request" : "requests"}</p>
    </div>
  );
}

function TableToolbar({ filter, onFilter }: { filter: string; onFilter: (v: string) => void }) {
  return (
    <div className="dw-toolbar">
      <h2 className="dw-h2">Recent requests</h2>
      <div className="dw-toolbar__end">
        <Select className="dw-filter" label="Filter by status" value={filter} options={STATUS_FILTERS} onChange={onFilter} placeholder="All statuses" />
        <button type="button" className="dw-iconbtn" aria-label="Download as CSV"><Icon name="download" size={22} /></button>
      </div>
    </div>
  );
}

const byFilter = (filter: string) => (r: Request) => filter === "all" || r.status === (filter as Status);

/* ---------- Employee dashboard ---------- */

export function EmployeeDashboard({ all, flash, onRequest }: { all: Request[]; flash: string[]; onRequest: (t: LeaveType | null) => void }) {
  const [filter, setFilter] = useState("all");
  const mine = all.filter((r) => r.person === ME);
  return (
    <>
      <section className="dw-greeting">
        <h1>Good morning, Olivia!</h1>
        <p>Here's an overview of your time off.</p>
      </section>
      <div className="dw-section-head">
        <h2 className="dw-h2">Time off</h2>
        <button type="button" className="dw-btn dw-btn--primary dw-btn--lg" onClick={() => onRequest(null)} data-demo="request-open"><Icon name="plus" size={20} />Request time off</button>
      </div>
      <div className="dw-balances">
        {(Object.keys(LEAVE) as LeaveType[]).map((t) => {
          const left = available(t, all);
          const pending = mine.filter((r) => r.type === t && r.status === "pending").reduce((n, r) => n + workingDays(r.start, r.end), 0);
          return (
            <article key={t} className="dw-card dw-balance">
              <h3><span className="dw-emoji dw-emoji--md">{LEAVE[t].emoji}</span>{LEAVE[t].label}</h3>
              <p className="dw-balance__value"><b key={left} className="dw-tick">{left}</b> {left === 1 ? "day" : "days"} <em>available</em></p>
              <p className="dw-balance__pending">{pending > 0 ? `${dayCount(pending)} waiting for approval` : " "}</p>
              <button type="button" className="dw-cta" onClick={() => onRequest(t)}>Request <Icon name="arrowRight" size={18} strokeWidth={2} /></button>
            </article>
          );
        })}
      </div>
      <hr className="dw-rule" />
      <div className="dw-split">
        <Week mine={mine} />
        <aside className="dw-quick" aria-label="Quick info">
          <h3><Icon name="info" size={18} />Quick info</h3>
          {([["fileText", "Leave policy", "Check the company rules", "#e8f1fd", "#2f6fe4"], ["calendar", "Team calendar", "See who’s away", "#fdeaf3", "#d6337c"], ["help", "Need help?", "Contact HR", "#e6f7ee", "#119a55"]] as [IconName, string, string, string, string][]).map(([icon, title, sub, bg, fg]) => (
            <div key={title} className="dw-quick__item">
              <span className="dw-quick__icon" style={{ background: bg, color: fg }}><Icon name={icon} size={18} /></span>
              <span><strong>{title}</strong><small>{sub}</small></span>
              <Icon name="chevronRight" size={20} />
            </div>
          ))}
        </aside>
      </div>
      <TableToolbar filter={filter} onFilter={setFilter} />
      <Table rows={mine.filter(byFilter(filter))} manager={false} selected={[]} flash={flash} />
    </>
  );
}

/** "Your upcoming week": Olivia's leave as a bar, holidays as chips. */
function Week({ mine }: { mine: Request[] }) {
  const [monday, setMonday] = useState("2025-12-22");
  const days = eachDay(monday, addDays(monday, 6));
  const week = { id: "week", person: ME, type: "annual" as LeaveType, start: days[0], end: days[6], status: "approved" as Status };
  const leave = mine.filter((r) => r.status !== "declined" && overlaps(r, week));
  return (
    <section className="dw-card dw-week" aria-label="Your upcoming week">
      <header>
        <h3><span className="dw-week__icon"><Icon name="calendar" size={18} /></span>Your upcoming week</h3>
        <div className="dw-week__nav">
          <button type="button" className="dw-iconbtn dw-iconbtn--sm" onClick={() => setMonday(addDays(monday, -7))} aria-label="Previous week"><Icon name="chevronLeft" size={18} /></button>
          <button type="button" className="dw-iconbtn dw-iconbtn--sm" onClick={() => setMonday(addDays(monday, 7))} aria-label="Next week"><Icon name="chevronRight" size={18} /></button>
          <strong>{monthLabel(days[3])}</strong>
        </div>
      </header>
      <div className="dw-week__grid">
        {days.map((d, i) => (
          <div key={d} className={`dw-week__day ${isWeekend(d) ? "is-weekend" : ""}`} style={{ gridColumn: i + 1 }}>
            <small>{weekday(d)}</small><b>{toDate(d).getUTCDate()}</b>
          </div>
        ))}
        {leave.map((r) => {
          const from = Math.max(0, days.indexOf(r.start < days[0] ? days[0] : r.start));
          const to = days.indexOf(r.end > days[6] ? days[6] : r.end);
          return (
            <div key={r.id} className={`dw-week__leave dw-week__leave--${r.status}`} style={{ gridColumn: `${from + 1} / ${to + 2}` }}>
              <span className="dw-dot" />{r.status === "pending" ? "Your time off · waiting for approval" : "Your time off"}
            </div>
          );
        })}
        {days.filter((d) => HOLIDAYS[d]).map((d) => (
          <div key={d} className="dw-week__holiday" style={{ gridColumn: days.indexOf(d) + 1 }}>
            <span className="dw-emoji">🎄</span><strong>{HOLIDAYS[d].replace(" Day", "")}</strong><small>Holiday</small>
          </div>
        ))}
      </div>
      <button type="button" className="dw-link dw-link--blue dw-week__more">See calendar</button>
    </section>
  );
}

/* ---------- Manager: time-off requests ---------- */

export function ManagerRequests({ all, selected, flash, onToggle, onToggleAll, onClear, onReview, onBulk }: {
  all: Request[]; selected: string[]; flash: string[];
  onToggle: (id: string) => void; onToggleAll: (ids: string[]) => void; onClear: () => void;
  onReview: (id: string, d: "approve" | "decline") => void; onBulk: (k: "approve" | "decline") => void;
}) {
  const [filter, setFilter] = useState("all");
  // Pending first, sorted once when the page opens, so rows don't jump around as they get approved.
  const [order] = useState(() => {
    const rank: Record<Status, number> = { pending: 0, approved: 1, declined: 2 };
    return [...all].sort((a, b) => rank[a.status] - rank[b.status] || a.start.localeCompare(b.start)).map((r) => r.id);
  });
  const pos = (r: Request) => (order.includes(r.id) ? order.indexOf(r.id) : -1);
  // Only this season's requests: Olivia's older history belongs to her own dashboard.
  const rows = all.filter((r) => r.end >= "2025-12-01").sort((a, b) => pos(a) - pos(b)).filter(byFilter(filter));
  const pending = all.filter((r) => r.status === "pending");
  const upcoming = all.filter((r) => r.status === "approved" && r.end >= "2025-12-10");
  const conflicts = pending.filter((r) => conflictsFor(r, all).length > 0);
  const pendingIds = rows.filter((r) => r.status === "pending").map((r) => r.id);
  return (
    <>
      <section className="dw-greeting dw-greeting--tight">
        <h1>Time-off requests</h1>
        <p>Review and manage your team's time off.</p>
      </section>
      <div className="dw-summary">
        {([["⏰", "Pending requests", pending.length, pending.length === 1 ? "request" : "requests", "Review"], ["➡️", "Upcoming time off", upcoming.length, upcoming.length === 1 ? "leave" : "leaves", "See calendar"]] as const).map(([emoji, title, n, unit, cta]) => (
          <article key={title} className="dw-card dw-balance">
            <h3><span className="dw-emoji dw-emoji--md">{emoji}</span>{title}</h3>
            <p className="dw-balance__value"><b key={n} className="dw-tick">{n}</b> {unit}</p>
            <button type="button" className="dw-cta">{cta} <Icon name="arrowRight" size={18} strokeWidth={2} /></button>
          </article>
        ))}
        <article className="dw-card dw-balance">
          <h3><span className="dw-warn"><Icon name="alert" size={26} strokeWidth={2.2} /></span>Team coverage</h3>
          <p className="dw-balance__value"><b key={conflicts.length} className="dw-tick">{conflicts.length}</b> {conflicts.length === 1 ? "conflict" : "conflicts"}</p>
          <button type="button" className="dw-cta">View conflicts <Icon name="arrowRight" size={18} strokeWidth={2} /></button>
        </article>
      </div>
      <hr className="dw-rule" />
      <TableToolbar filter={filter} onFilter={setFilter} />
      <div className={`dw-bulk ${selected.length ? "is-open" : ""}`} aria-hidden={!selected.length}>
        <div className="dw-bulk__inner">
          <span className="dw-bulk__count"><input type="checkbox" className="dw-check" checked readOnly tabIndex={-1} />{selected.length} {selected.length === 1 ? "request" : "requests"} selected</span>
          <button type="button" className="dw-link dw-link--blue" onClick={onClear} tabIndex={selected.length ? 0 : -1}>Clear selection</button>
          <span className="dw-bulk__spacer" />
          <button type="button" className="dw-btn dw-btn--primary" onClick={() => onBulk("approve")} tabIndex={selected.length ? 0 : -1} data-demo="bulk-approve"><Icon name="check" size={18} strokeWidth={2.2} />Approve selected</button>
          <button type="button" className="dw-btn dw-btn--danger" onClick={() => onBulk("decline")} tabIndex={selected.length ? 0 : -1} data-demo="bulk-decline"><Icon name="x" size={18} strokeWidth={2.2} />Decline selected</button>
        </div>
      </div>
      <Table
        rows={rows} manager selected={selected} flash={flash} onToggle={onToggle} onReview={onReview}
        onToggleAll={() => onToggleAll(pendingIds)}
      />
    </>
  );
}

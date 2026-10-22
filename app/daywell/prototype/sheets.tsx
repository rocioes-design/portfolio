"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { Avatar, Select, SheetTitle, StatusIcon, Success } from "./ui";
import {
  HOLIDAYS, LEAVE, PEOPLE, TODAY, addDays, available, conflictsFor, dayCount, eachDay, holidaysIn, isWeekend, longDate,
  mediumDate, mondayOf, monthLabel, toDate, weekday, workingDays, type LeaveType, type Request,
} from "./data";

const TYPE_OPTIONS = (Object.keys(LEAVE) as LeaveType[]).map((t) => ({
  value: t,
  label: <span className="dw-option"><span className="dw-emoji">{LEAVE[t].emoji}</span>{LEAVE[t].label}</span>,
}));

/* ---------- Request time off (employee) ---------- */

export function RequestSheet({ initialType, all, onClose, onSubmit }: {
  initialType: LeaveType | null; all: Request[]; onClose: () => void; onSubmit: (r: Omit<Request, "id" | "status" | "person">) => void;
}) {
  const [type, setType] = useState<LeaveType | null>(initialType);
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [picking, setPicking] = useState(false);
  const [sent, setSent] = useState(false);

  const days = start && end ? workingDays(start, end) : 0;
  const balance = type ? available(type, all) : 0;
  const hasRange = Boolean(type && start && end);
  const ok = hasRange && days > 0 && days <= balance;
  const holidays = start && end ? holidaysIn(start, end) : [];

  if (sent) {
    return (
      <Success
        title="Your request was sent"
        text="Hannah Lee will review it. You'll get an email and a notification as soon as she does."
        primary={onClose}
      />
    );
  }

  return (
    <form className="dw-sheet" onSubmit={(e) => { e.preventDefault(); if (ok && type && start && end) { onSubmit({ type, start, end, note: note.trim() || undefined }); setSent(true); } }}>
      <SheetTitle title="Request time off" onClose={onClose} />
      <div className="dw-sheet__body">
        <div className="dw-field">
          <span className="dw-field__label">Type of leave</span>
          <Select label="Type of leave" value={type} options={TYPE_OPTIONS} onChange={(v) => setType(v as LeaveType)} placeholder="Select type of leave" demo="type" />
        </div>

        <div className="dw-field dw-daterange">
          <span className="dw-field__label">Date range</span>
          <div className="dw-daterange__fields">
            {(["start", "end"] as const).map((which) => {
              const value = which === "start" ? start : end;
              return (
                <button key={which} type="button" className={`dw-select__button dw-datefield ${value ? "" : "is-placeholder"}`} onClick={() => setPicking(true)} data-demo={`date-${which}`} aria-label={which === "start" ? "Start date" : "End date"}>
                  <Icon name="calendar" size={20} />
                  <span>{value ? longDate(value) : which === "start" ? "Start date" : "End date"}</span>
                  <Icon name="chevronDown" size={18} />
                </button>
              );
            })}
          </div>
          {picking && (
            <RangeCalendar
              start={start} end={end} onClose={() => setPicking(false)}
              onChange={(s, e) => { setStart(s); setEnd(e); }}
            />
          )}
        </div>

        {hasRange && type && (
          <div className="dw-field dw-appear">
            <span className="dw-field__label">Balance after request</span>
            {days === 0 ? (
              <div className="dw-alert dw-alert--warning"><Icon name="alert" size={18} /><div><strong>No working days in this range</strong><span>Weekends and public holidays don't use your balance.</span></div></div>
            ) : ok ? (
              <div className="dw-alert dw-alert--success"><Icon name="circleCheck" size={18} /><div><strong>You’ll have {dayCount(balance - days)} remaining</strong><span>{dayCount(days)} from {balance} available</span></div></div>
            ) : (
              <div className="dw-alert dw-alert--error"><Icon name="alert" size={18} /><div><strong>That’s more than your balance</strong><span>You have {dayCount(balance)} of {LEAVE[type].label.toLowerCase()} available</span></div></div>
            )}
          </div>
        )}

        <label className="dw-field">
          <span className="dw-field__label dw-field__label--icon"><Icon name="message" size={16} />Add a note <em>(optional)</em></span>
          <textarea className="dw-input dw-textarea" placeholder="Type your message here" value={note} onChange={(e) => setNote(e.target.value)} data-demo="request-note" />
        </label>

        {type && (
          <section className="dw-details dw-appear" aria-label="Leave details">
            <h3>Leave details</h3>
            <div className="dw-details__row"><span className="dw-emoji dw-emoji--md">{LEAVE[type].emoji}</span><div><strong>{LEAVE[type].label}</strong><span>{LEAVE[type].kind}</span></div></div>
            <div className="dw-details__row"><Icon name="fileText" size={22} className="dw-details__icon" /><div><strong>Policy</strong><span>Working days only. Weekends and public holidays are not counted in your leave days.</span></div></div>
            {holidays.length > 0 && (
              <div className="dw-details__row"><Icon name="calendar" size={22} className="dw-details__icon" /><div><strong>Holidays in this period</strong><span>{holidays.map((d) => `${mediumDate(d)} · ${HOLIDAYS[d]}`).join(", ")}</span></div></div>
            )}
          </section>
        )}
      </div>
      <footer className="dw-sheet__actions">
        <button type="button" className="dw-btn dw-btn--secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="dw-btn dw-btn--primary" disabled={!ok} data-demo="request-submit">Submit request</button>
      </footer>
    </form>
  );
}

/** One month at a time; first click sets the start, second click the end. */
function RangeCalendar({ start, end, onChange, onClose }: { start: string | null; end: string | null; onChange: (s: string, e: string | null) => void; onClose: () => void }) {
  const [month, setMonth] = useState(() => `${(start ?? TODAY).slice(0, 7)}-01`);
  const [hover, setHover] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!root.current?.contains(t) && !t.closest(".dw-datefield")) onClose();
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);

  const shift = (n: number) => { const d = toDate(month); d.setUTCMonth(d.getUTCMonth() + n); setMonth(d.toISOString().slice(0, 10)); };
  const first = mondayOf(month);
  const nextMonth = (() => { const d = toDate(month); d.setUTCMonth(d.getUTCMonth() + 1); return d.toISOString().slice(0, 10); })();
  const cells = eachDay(first, addDays(mondayOf(addDays(nextMonth, -1)), 6));
  const rangeEnd = end ?? (start && hover && hover > start ? hover : null);

  const pick = (d: string) => {
    if (!start || end || d < start) onChange(d, null);
    else { onChange(start, d); onClose(); }
  };

  return (
    <div className="dw-calendar" ref={root} role="dialog" aria-label="Choose dates">
      <div className="dw-calendar__head">
        <button type="button" className="dw-iconbtn" onClick={() => shift(-1)} aria-label="Previous month"><Icon name="chevronLeft" size={18} /></button>
        <strong>{monthLabel(month)}</strong>
        <button type="button" className="dw-iconbtn" onClick={() => shift(1)} aria-label="Next month"><Icon name="chevronRight" size={18} /></button>
      </div>
      <div className="dw-calendar__grid">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <span key={d} className="dw-calendar__dow">{d}</span>)}
        {cells.map((d) => {
          const inMonth = d.slice(0, 7) === month.slice(0, 7);
          const past = d < TODAY;
          const inRange = start && rangeEnd && d >= start && d <= rangeEnd;
          const cls = [
            "dw-calendar__day", !inMonth && "is-out", isWeekend(d) && "is-weekend", HOLIDAYS[d] && "is-holiday",
            inRange && "is-range", d === start && "is-start", d === rangeEnd && "is-end", d === TODAY && "is-today",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={d} type="button" className={cls} disabled={past} data-demo={`day-${d}`} title={HOLIDAYS[d]}
              onClick={() => pick(d)} onMouseEnter={() => setHover(d)}
              aria-label={`${longDate(d)}${HOLIDAYS[d] ? `, ${HOLIDAYS[d]}` : ""}`}
            >
              {toDate(d).getUTCDate()}
            </button>
          );
        })}
      </div>
      <p className="dw-calendar__legend"><span className="dw-dot" />Public holiday</p>
    </div>
  );
}

/* ---------- Approve / decline one request (manager) ---------- */

/** "Mon, Dec 22 – Fri, Dec 26, 2025" (the year once, when both dates share it). */
const rangeLabel = (start: string, end: string) =>
  start.slice(0, 4) === end.slice(0, 4) ? `${longDate(start).slice(0, -6)} – ${longDate(end)}` : `${longDate(start)} – ${longDate(end)}`;

export function ReviewSheet({ request, decision, all, onClose, onConfirm }: {
  request: Request; decision: "approve" | "decline"; all: Request[]; onClose: () => void; onConfirm: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const person = PEOPLE[request.person];
  const approve = decision === "approve";
  const conflicts = conflictsFor(request, all);
  const days = eachDay(request.start, request.end).slice(0, 7);
  const first = person.name.split(" ")[0];

  if (done) {
    return (
      <Success
        tone={approve ? "approved" : "declined"}
        title={approve ? "Request approved" : "Request declined"}
        text={`${first} will get an email and a notification.${approve ? " The days are now blocked in the team calendar." : ""}`}
        primary={onClose}
      />
    );
  }

  const span = (s: string, e: string) => {
    const from = Math.max(0, days.indexOf(s < days[0] ? days[0] : s));
    const toIdx = days.indexOf(e > days[days.length - 1] ? days[days.length - 1] : e);
    return { gridColumn: `${from + 1} / ${toIdx + 2}` };
  };

  return (
    <form className="dw-sheet" onSubmit={(e) => { e.preventDefault(); if (approve || message.trim()) { onConfirm(message.trim()); setDone(true); } }}>
      <SheetTitle title={approve ? "Approve request" : "Decline request"} onClose={onClose} />
      <div className="dw-sheet__body">
        <div className="dw-review__who">
          <div className="dw-review__person">
            <Avatar person={request.person} size={60} />
            <div><strong>{person.name}</strong><span>{person.id}</span><span>{person.team}</span></div>
          </div>
          <div className="dw-review__leave">
            <strong><span className="dw-emoji">{LEAVE[request.type].emoji}</span>{LEAVE[request.type].label}</strong>
            <span className="dw-review__dates"><Icon name="calendar" size={18} />{rangeLabel(request.start, request.end)}</span>
            <span className="dw-review__days">{workingDays(request.start, request.end)} working {workingDays(request.start, request.end) === 1 ? "day" : "days"}{holidaysIn(request.start, request.end).length > 0 ? " · holiday excluded" : ""}</span>
          </div>
        </div>

        <section className="dw-field">
          <span className="dw-field__label dw-field__label--icon"><Icon name="users" size={16} />Team coverage</span>
          <div className="dw-coverage">
            {conflicts.length > 0 ? (
              <p className="dw-coverage__alert dw-coverage__alert--warning"><Icon name="alert" size={16} />This request overlaps with {conflicts.length} other team {conflicts.length === 1 ? "member’s" : "members’"} leave</p>
            ) : (
              <p className="dw-coverage__alert dw-coverage__alert--ok"><Icon name="circleCheck" size={16} />No one else in the team is off on these days</p>
            )}
            <div className="dw-coverage__grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((d) => <span key={d} className={`dw-coverage__day ${isWeekend(d) || HOLIDAYS[d] ? "is-off" : ""}`}>{weekday(d)}<b>{toDate(d).toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</b></span>)}
              <span className="dw-coverage__bar dw-coverage__bar--self" style={span(request.start, request.end)}>{person.name}</span>
              {conflicts.map((c) => <span key={c.id} className="dw-coverage__bar dw-coverage__bar--other" style={span(c.start, c.end)}>{PEOPLE[c.person].name}</span>)}
            </div>
          </div>
        </section>

        <section className="dw-field">
          <span className="dw-field__label dw-field__label--icon"><Icon name="message" size={16} />Notes from employee</span>
          <p className={`dw-quote ${request.note ? "" : "is-empty"}`}>{request.note ?? "No additional notes were added."}</p>
        </section>

        <label className="dw-field">
          <span className="dw-field__label dw-field__label--icon"><Icon name="message" size={16} />{approve ? <>Add a note <em>(optional)</em></> : <>Add a reason <b className="dw-required">*</b></>}</span>
          <textarea className="dw-input dw-textarea" placeholder={approve ? "Type your message here" : "Let them know why, so they can plan around it"} value={message} onChange={(e) => setMessage(e.target.value)} data-demo="review-message" />
        </label>
      </div>
      <footer className="dw-sheet__actions">
        <button type="button" className="dw-btn dw-btn--secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className={`dw-btn ${approve ? "dw-btn--primary" : "dw-btn--danger"}`} disabled={!approve && !message.trim()} data-demo="review-confirm">
          <Icon name={approve ? "check" : "x"} size={18} strokeWidth={2.2} />{approve ? "Approve" : "Decline"}
        </button>
      </footer>
      <p className="dw-sheet__footnote"><Icon name="bell" size={16} />This request will be marked as {approve ? "approved" : "declined"} and {first} will be notified.</p>
    </form>
  );
}

/* ---------- Approve / decline several requests at once ---------- */

export function BulkDialog({ kind, count, conflicts, onCancel, onConfirm }: {
  kind: "approve" | "decline"; count: number; conflicts: number; onCancel: () => void; onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const approve = kind === "approve";
  return (
    <form className="dw-confirm" onSubmit={(e) => { e.preventDefault(); if (approve || reason.trim()) onConfirm(reason.trim()); }}>
      <StatusIcon tone={approve ? "approved" : "declined"} size={30} />
      <h2>{approve ? "Approve" : "Decline"} {count} {count === 1 ? "request" : "requests"}?</h2>
      <p>{approve ? "These requests will be marked as approved and each employee will be notified." : "The selected requests will be declined, and the employees will be notified."}</p>
      <hr />
      {approve ? (
        <dl className="dw-confirm__facts">
          <div><dt>Requests selected</dt><dd>{count}</dd></div>
          <div><dt>Coverage conflicts</dt><dd className={conflicts ? "is-warning" : ""}>{conflicts}</dd></div>
        </dl>
      ) : (
        <label className="dw-field">
          <span className="dw-field__label dw-field__label--icon"><Icon name="message" size={16} />Reason for declining <b className="dw-required">*</b></span>
          <textarea className="dw-input dw-textarea" placeholder="Type your reason here" value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />
        </label>
      )}
      <div className="dw-confirm__actions">
        <button type="button" className="dw-btn dw-btn--secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className={`dw-btn ${approve ? "dw-btn--primary" : "dw-btn--danger"}`} disabled={!approve && !reason.trim()} data-demo="bulk-confirm">
          {approve ? "Approve requests" : "Decline requests"}
        </button>
      </div>
    </form>
  );
}

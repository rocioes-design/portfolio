"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { PEOPLE, type Status } from "./data";

/** Keeps something mounted long enough to play its exit animation. */
export function usePresence(open: boolean, ms = 250) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      // A short delay so the closed styles paint before the open ones (otherwise nothing animates).
      // A timer rather than animation frames, so it also opens in background tabs and recordings.
      const t = setTimeout(() => setShown(true), 30);
      return () => clearTimeout(t);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
  return { mounted, shown };
}

/** Remembers the last non-null value, so a closing drawer keeps its content while it slides out. */
export function useLast<T>(value: T | null) {
  const last = useRef(value);
  if (value !== null) last.current = value;
  return last.current;
}

const STATUS_LABEL: Record<Status, string> = { pending: "Pending", approved: "Approved", declined: "Declined" };

export function Badge({ status }: { status: Status }) {
  return <span className={`dw-badge dw-badge--${status}`}>{STATUS_LABEL[status]}</span>;
}

export function Avatar({ person, size = 40 }: { person: string; size?: number }) {
  const p = PEOPLE[person];
  if (p?.photo) return <img className="dw-avatar" src={p.photo} alt="" width={size} height={size} />;
  const initials = (p?.name ?? "?").split(" ").map((w) => w[0]).join("").slice(0, 2);
  return <span className="dw-avatar dw-avatar--initials" style={{ width: size, height: size, fontSize: size * 0.36 }}>{initials}</span>;
}

interface Option { value: string; label: React.ReactNode }

/** A small listbox-style dropdown. Closes on outside click and Escape. */
export function Select({ value, options, onChange, placeholder, demo, className = "", label }: {
  value: string | null; options: Option[]; onChange: (v: string) => void; placeholder: string; demo?: string; className?: string; label: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  const current = options.find((o) => o.value === value);
  return (
    <div className={`dw-select ${className}`} ref={root}>
      <button type="button" className={`dw-select__button ${current ? "" : "is-placeholder"}`} aria-haspopup="listbox" aria-expanded={open} aria-label={label} data-demo={demo} onClick={() => setOpen((o) => !o)}>
        <span>{current ? current.label : placeholder}</span>
        <Icon name="chevronDown" size={18} />
      </button>
      {open && (
        <ul className="dw-select__menu" role="listbox" aria-label={label}>
          {options.map((o) => (
            <li key={o.value}>
              <button type="button" role="option" aria-selected={o.value === value} data-demo={demo && `${demo}-${o.value}`} onClick={() => { onChange(o.value); setOpen(false); }}>
                {o.label}
                {o.value === value && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Right-hand drawer with a dimmed backdrop. */
export function Drawer({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: React.ReactNode; label: string }) {
  const { mounted, shown } = usePresence(open, 260);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.documentElement.style.overflow = "hidden"; // the page behind shouldn't scroll
    return () => { document.removeEventListener("keydown", esc); document.documentElement.style.overflow = ""; };
  }, [open, onClose]);
  if (!mounted) return null;
  return (
    <div className={`dw-layer ${shown ? "is-open" : ""}`}>
      <div className="dw-scrim" onClick={onClose} />
      <aside className="dw-drawer" role="dialog" aria-modal="true" aria-label={label}>{children}</aside>
    </div>
  );
}

/** Centered confirmation dialog. */
export function Modal({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: React.ReactNode; label: string }) {
  const { mounted, shown } = usePresence(open, 220);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);
  if (!mounted) return null;
  return (
    <div className={`dw-layer dw-layer--center ${shown ? "is-open" : ""}`}>
      <div className="dw-scrim" onClick={onClose} />
      <div className="dw-modal" role="alertdialog" aria-modal="true" aria-label={label}>{children}</div>
    </div>
  );
}

export function SheetTitle({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="dw-sheet__title">
      <span className="dw-sheet__badge"><Icon name="calendar" size={30} strokeWidth={1.6} /></span>
      <h2>{title}</h2>
      <button type="button" className="dw-iconbtn dw-sheet__close" onClick={onClose} aria-label="Close" data-demo="sheet-close"><Icon name="x" size={24} /></button>
    </header>
  );
}

/** The green tick and red cross from the Figma file. */
export function StatusIcon({ tone, size = 44 }: { tone: "approved" | "declined"; size?: number }) {
  return <img className="dw-success__icon" src={`/media/daywell/prototype/icon-${tone}.svg`} alt="" width={size} height={size} />;
}

/** Success state shared by every sheet. */
export function Success({ tone = "approved", title, text, primary, secondary }: {
  tone?: "approved" | "declined"; title: string; text: string; primary: () => void; secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div className="dw-success">
      <StatusIcon tone={tone} />
      <h2>{title}</h2>
      <p>{text}</p>
      <button type="button" className="dw-btn dw-btn--primary dw-btn--wide" onClick={primary} data-demo="success-done" autoFocus>Done</button>
      {secondary && <button type="button" className="dw-btn dw-btn--secondary dw-btn--wide" onClick={secondary.onClick}>{secondary.label}</button>}
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BLOOM_PATH } from "../../components/ui/bloom-logo";

// Live specimens that need state: replaying a motion, or a value you can copy

export function Swatch({ name, hex, token, usage }: { name: string; hex: string; token?: string; usage: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <li className="ds-swatch">
      <button type="button" className="ds-swatch__chip" style={{ background: hex }} onClick={copy} aria-label={`Copy ${hex}`}>
        <span className="ds-swatch__copied" aria-live="polite">{copied ? "Copied" : ""}</span>
      </button>
      <div className="ds-swatch__meta">
        <strong>{name}</strong>
        <code>{token ? `--${token}` : hex}</code>
        <span>{usage}</span>
        <code className="ds-swatch__hex">{hex}</code>
      </div>
    </li>
  );
}

// Replays an animation by remounting its child
export function Replay({ children, label = "Replay" }: { children: (key: number) => ReactNode; label?: string }) {
  const [key, setKey] = useState(0);
  return (
    <div className="ds-replay">
      <div className="ds-replay__stage">{children(key)}</div>
      <button type="button" className="ds-replay__button" onClick={() => setKey((k) => k + 1)}>{label}</button>
    </div>
  );
}

export function MarkerDemo() {
  return (
    <Replay>
      {(key) => <p className="ds-marker-demo framer-bio-title" key={key}><mark className="marker">Product Designer</mark></p>}
    </Replay>
  );
}

// The FAQ answer bubble, with the same spring as the About page
export function SendDemo() {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(true);
  return (
    <div className="ds-replay">
      <div className="ds-replay__stage ds-send-demo">
        <button type="button" className="about-faq__question" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Are you taking freelance work?</button>
        <AnimatePresence mode="popLayout" initial={false}>
          {open && (
            <motion.div
              key="answer"
              className="about-faq__reply"
              initial={{ opacity: 0, scale: 0.6, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: reduced ? 0 : 0.16, ease: [0.4, 0, 1, 1] } }}
              transition={reduced ? { duration: 0 } : { type: "spring", visualDuration: 0.42, bounce: 0.28 }}
              style={{ originX: 1, originY: 1 }}
            >
              <div className="about-faq__answer"><p>Yes! Email me.</p></div>
              <span className="about-faq__avatar" aria-hidden="true"><svg viewBox="0 0 100 100"><path fillRule="evenodd" d={BLOOM_PATH} /></svg></span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button type="button" className="ds-replay__button" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Open"}</button>
    </div>
  );
}

export function WindowDemo() {
  return (
    <Replay>
      {(key) => <div className="ds-window-demo" key={key}><div className="ds-window-demo__bar"><i /><i /><i /></div></div>}
    </Replay>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import "./project-window.css";

export type ProjectClip = { src: string; label: string; alt: string };
export type ProjectWindowData = {
  domain: string;
  title: string;
  facts: [string, string][];
  description: string;
  clips: ProjectClip[];
  link?: { href: string; label: string };
};

// A project shown in a desktop-style window: videos on the left, title, facts and a short
// description on the right. Uses the native <dialog>, so Esc closes it and focus stays inside.
// Clips play one after another; visitors who prefer reduced motion get controls and no autoplay.
export function ProjectWindow({ project, open, start = 0, onClose }: { project: ProjectWindowData; open: boolean; start?: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [clip, setClip] = useState(start);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => { setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      setClip(start);
      setProgress(0);
      dialog.current?.showModal();
      root.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      root.style.overflow = "";
    }
    return () => { root.style.overflow = ""; };
  }, [open, start]);

  const current = project.clips[clip];
  const show = (i: number) => { setClip((i + project.clips.length) % project.clips.length); setProgress(0); };

  return (
    <dialog
      ref={dialog}
      className="pw"
      aria-labelledby="pw-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="pw__window">
        <header className="pw__bar">
          <span className="pw__lights">
            <button type="button" className="pw__light pw__light--close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" /></svg>
            </button>
            <span className="pw__light" aria-hidden="true" />
            <span className="pw__light" aria-hidden="true" />
          </span>
          <span className="pw__domain">{project.domain}</span>
        </header>

        <div className="pw__body">
          <div className="pw__stage">
            {open && current && (
              <video
                key={current.src} className="pw__video" src={current.src} aria-label={current.alt}
                muted playsInline autoPlay={!reducedMotion} controls={reducedMotion} preload="auto"
                onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration) setProgress(v.currentTime / v.duration); }}
                onEnded={() => { if (!reducedMotion) show(clip + 1); }}
              />
            )}
            <div className="pw__clips" role="tablist" aria-label="Videos">
              {project.clips.map((c, i) => (
                <button key={c.src} type="button" role="tab" aria-selected={i === clip} className="pw__clip" onClick={() => show(i)}>
                  <span>{c.label}</span>
                  <span className="pw__clip-progress" aria-hidden="true" style={{ transform: `scaleX(${i === clip ? progress : i < clip ? 1 : 0})` }} />
                </button>
              ))}
            </div>
          </div>

          <aside className="pw__info">
            <h2 id="pw-title" className="pw__title">{project.title}</h2>
            <dl className="pw__facts">
              {project.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <p className="pw__description">{project.description}</p>
            {project.link && (
              <a className="pw__link" href={project.link.href} target="_blank" rel="noreferrer">
                {project.link.label} <span aria-hidden="true">↗</span>
              </a>
            )}
          </aside>
        </div>
      </div>
    </dialog>
  );
}

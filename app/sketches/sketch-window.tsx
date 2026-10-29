"use client";

import { useEffect, useRef, useState } from "react";

export type Sketch = {
  file: string; // shown in the title bar, like a file name
  title: string; // accessible name for the window and the embedded page
  href: string; // full-screen version
  embed: { src: string; width: number; height: number }; // the page is drawn at this size, then scaled to fit
  wide?: boolean; // spans both columns
};

// A desktop-style window with a live, clickable sketch inside, scaled down to the window's width.
export function SketchWindow({ sketch }: { sketch: Sketch }) {
  const body = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / sketch.embed.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [sketch.embed.width]);

  return (
    <article className={`sketch-window${sketch.wide ? " sketch-window--wide" : ""}`} aria-label={sketch.title}>
      <header className="sketch-window__bar">
        <span className="sketch-window__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="sketch-window__file">{sketch.file}</span>
        <a className="sketch-window__open" href={sketch.href} target="_blank" rel="noreferrer" aria-label={`Open ${sketch.title} full screen`} title="Open full screen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
        </a>
      </header>
      <div className="sketch-window__body" ref={body} style={{ height: sketch.embed.height * scale || undefined, aspectRatio: scale ? undefined : `${sketch.embed.width} / ${sketch.embed.height}` }}>
        {/* On phones the scaled sketch is too small to use, so a tap opens it full screen instead */}
        <a className="sketch-window__tap" href={sketch.href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true" />
        {scale > 0 && (
          <iframe
            src={sketch.embed.src}
            title={sketch.title}
            loading="lazy"
            width={sketch.embed.width}
            height={sketch.embed.height}
            style={{ transform: `scale(${scale})` }}
          />
        )}
      </div>
    </article>
  );
}

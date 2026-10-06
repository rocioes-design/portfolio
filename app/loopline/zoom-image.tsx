"use client";

import { useEffect, useRef, useState } from "react";

// Media that opens larger in a modal when clicked. Uses the native <dialog>,
// so Esc closes it and focus stays inside while it's open.
// Videos behave like GIFs on the page (silent, looping, no controls) and only play while on screen;
// visitors who prefer reduced motion see a still frame instead.
export function ZoomMedia({ src, alt, caption, video = false, className = "" }: { src: string; alt: string; caption?: string; video?: boolean; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const thumb = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      dialog.current?.showModal();
      root.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      root.style.overflow = "";
    }
    return () => { root.style.overflow = ""; };
  }, [open]);

  // Play the inline video only while it's visible (and the modal is closed).
  useEffect(() => {
    const v = thumb.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !open) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [open]);

  return (
    <>
      <button type="button" className={`ll-zoom ${className}`} onClick={() => setOpen(true)} aria-label={`Enlarge: ${alt}`}>
        {video
          ? <video ref={thumb} src={src} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
          : <img src={src} alt={alt} loading="lazy" />}
        <span className="ll-zoom__hint" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
          Enlarge
        </span>
      </button>
      <dialog
        ref={dialog}
        className="ll-lightbox"
        aria-label={alt}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <figure>
          {video
            ? (open && <video src={src} autoPlay muted loop playsInline controls aria-label={alt} />)
            : <img src={src} alt={alt} />}
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
        <button type="button" className="ll-lightbox__close" onClick={() => setOpen(false)} aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </dialog>
    </>
  );
}

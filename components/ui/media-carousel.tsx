"use client";
import { useEffect, useRef, useState } from "react";
import "./media-carousel.css";

export type CarouselMedia = { type: "image" | "video"; src: string; alt: string };

// Swipeable, snap-scrolling carousel. Videos play only while they are on screen,
// and not at all (controls instead) for visitors who prefer reduced motion.
export function MediaCarousel({ media, label }: { media: CarouselMedia[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setIndex(Math.round(track.scrollLeft / track.clientWidth));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting) video.play().catch(() => {});
        else video.pause();
      }),
      { threshold: 0.6 },
    );
    track.querySelectorAll("video").forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [reducedMotion]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * track.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="media-carousel" role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="media-carousel__track" ref={trackRef}>
        {media.map((item, i) => (
          <div className="media-carousel__slide" key={item.src} aria-roledescription="slide" aria-label={`${i + 1} of ${media.length}`}>
            {item.type === "video"
              ? <video src={item.src} aria-label={item.alt} muted loop playsInline preload="metadata" controls={reducedMotion} />
              : <img src={item.src} alt={item.alt} loading="lazy" />}
          </div>
        ))}
      </div>
      {media.length > 1 && <>
        <button className="media-carousel__arrow media-carousel__arrow--prev" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous slide">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
        </button>
        <button className="media-carousel__arrow media-carousel__arrow--next" onClick={() => goTo(index + 1)} disabled={index === media.length - 1} aria-label="Next slide">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
        </button>
        <div className="media-carousel__dots">
          {media.map((item, i) => (
            <button key={item.src} className="media-carousel__dot" aria-label={`Go to slide ${i + 1}`} aria-current={i === index ? "true" : undefined} onClick={() => goTo(i)} />
          ))}
        </div>
      </>}
    </div>
  );
}

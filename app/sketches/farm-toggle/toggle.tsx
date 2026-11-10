"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { H, W, clamp, createScene, css, key3, smooth } from "./draw";

// Knob centre, in scene pixels: where it rests on the left, and how far it travels
const KNOB_LEFT = 40;
const KNOB_TRAVEL = 104;
const KNOB_RADIUS = 36;
const LENS = 60; // the knob shows this many scene pixels across, slightly magnified

const pageBg = key3("#f8f5ee", "#e2a172", "#0d0f2b");
const pageInk = key3("#5b3a1e", "#4a2412", "#f6e3b4");

export function FarmToggle() {
  const page = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLCanvasElement>(null);
  const lens = useRef<HTMLCanvasElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const mood = useRef<HTMLSpanElement>(null);
  const [night, setNight] = useState(false);
  // pos is where the knob is (0 morning, 1 night); it springs towards target unless it's being dragged
  const sim = useRef({ pos: 0, vel: 0, target: 0, dragging: false, moved: false, startX: 0, startPos: 0 });
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    const ctx = scene.current!.getContext("2d")!;
    const lensCtx = lens.current!.getContext("2d")!;
    lensCtx.imageSmoothingEnabled = false;
    const draw = createScene();
    let frame = 0, last = performance.now(), shown = "";

    const loop = (now: number) => {
      const s = sim.current;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!s.dragging) {
        for (let i = 0; i < 2; i++) { // spring, in two substeps
          s.vel += ((230 * (s.target - s.pos) - 19 * s.vel) * dt) / 2;
          s.pos += (s.vel * dt) / 2;
        }
        if (Math.abs(s.target - s.pos) < 0.0004 && Math.abs(s.vel) < 0.002) { s.pos = s.target; s.vel = 0; }
      }
      const t = clamp(s.pos);
      draw(ctx, t, now / 1000);

      // The knob may overshoot a little; the time of day doesn't
      const cx = KNOB_LEFT + clamp(s.pos, -0.03, 1.03) * KNOB_TRAVEL;
      knob.current!.style.left = `${((cx - KNOB_RADIUS) / W) * 100}%`;
      lensCtx.drawImage(scene.current!, cx - LENS / 2, (H - LENS) / 2, LENS, LENS, 0, 0, 300, 300);

      const style = page.current!.style;
      style.setProperty("--ft-bg", css(pageBg(t)));
      style.setProperty("--ft-ink", css(pageInk(t)));
      style.setProperty("--ft-glow", (0.55 * smooth(0.5, 1, t)).toFixed(3));

      // 9:00 am to 10:30 pm, in ten-minute steps
      const mins = Math.round((540 + t * 810) / 10) * 10, h = Math.floor(mins / 60);
      const label = `${((h + 11) % 12) + 1}:${String(mins % 60).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
      if (label !== shown) {
        shown = clock.current!.textContent = label;
        mood.current!.textContent = t < 0.3 ? "Sunny" : t < 0.7 ? "Sunset" : "Night";
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  // A short chiptune click, falling for night and rising for morning
  function click(toNight: boolean) {
    try {
      const ac = (audio.current ??= new AudioContext());
      const t0 = ac.currentTime, osc = ac.createOscillator(), gain = ac.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(toNight ? 620 : 520, t0);
      osc.frequency.exponentialRampToValueAtTime(toNight ? 310 : 1040, t0 + 0.07);
      gain.gain.setValueAtTime(0.05, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);
      osc.connect(gain).connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + 0.1);
    } catch { /* sound is optional */ }
  }

  function commit(next: number) {
    const s = sim.current;
    if (next !== s.target) click(next === 1);
    s.target = next;
    setNight(next === 1);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { s.pos = next; s.vel = 0; }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    Object.assign(sim.current, { dragging: true, moved: false, startX: e.clientX, startPos: clamp(sim.current.pos) });
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const s = sim.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    if (s.moved) { s.pos = clamp(s.startPos + dx / ((scene.current!.clientWidth * KNOB_TRAVEL) / W)); s.vel = 0; }
  }
  // A click flips it; a drag lands on whichever side is closer
  function onPointerUp() {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    commit(s.moved ? (s.pos > 0.5 ? 1 : 0) : 1 - s.target);
  }
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); commit(1 - sim.current.target); }
    else if (e.key === "ArrowRight") commit(1);
    else if (e.key === "ArrowLeft") commit(0);
  }

  return (
    <div className="ft-page" ref={page}>
      <div className="ft-stage">
        <div className="ft-toggle" role="switch" aria-checked={night} aria-label="Night time" tabIndex={0} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={onKeyDown}>
          <div className="ft-well">
            <canvas ref={scene} width={W} height={H} />
            <div className="ft-knob" ref={knob}><canvas ref={lens} width={300} height={300} /></div>
          </div>
        </div>
        <div className="ft-caption" aria-hidden="true"><span ref={clock}>9:00 am</span><span ref={mood}>Sunny</span></div>
      </div>
    </div>
  );
}

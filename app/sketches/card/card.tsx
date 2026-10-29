"use client";

import { useEffect, useRef, useState } from "react";
import { H, LAYERS, W, seeded, type Fonts } from "./draw";

// ASCII grid, in card pixels
const CELL_W = 4.5;
const CELL_H = 7;
const CLOUD = ".:-=+"; // the base, thin where the clouds are light and dense where the card is deeper
const INK = "%#@"; // the logo and engraved text, always dense so they stand out
const NOISE = "!<>-_/\[]{}=+*^?#%@$&01";

// One loop, in seconds: the card builds out of characters, turns solid, tilts, comes apart
// into its layers, floats, goes back together, and breaks back into characters.
const T = { wipe: 2.2, tilt: 3.6, lift: 4.4, settle: 8.6, untilt: 9.6, unwipe: 10.8, scatter: 11.6, end: 13.2 };
const WIPE = 0.9;
const LAYER_GAP = 44; // px between lifted layers

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const progress = (t: number, start: number, length: number) => clamp((t - start) / length);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutExpo = (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

type Cell = { x: number; y: number; glyph: string; color: string; sx: number; sy: number; ex: number; ey: number; delay: number; exitDelay: number };

function pixels(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  draw(ctx);
  return ctx.getImageData(0, 0, W, H).data;
}

// Average colour and coverage of one cell
function sample(data: Uint8ClampedArray, x: number, y: number) {
  let r = 0, g = 0, b = 0, a = 0, n = 0;
  for (let py = Math.floor(y); py < Math.floor(y + CELL_H); py++) {
    for (let px = Math.floor(x); px < Math.floor(x + CELL_W); px++) {
      const i = (py * W + px) * 4, alpha = data[i + 3];
      r += data[i] * alpha; g += data[i + 1] * alpha; b += data[i + 2] * alpha; a += alpha; n++;
    }
  }
  return a ? { r: r / a, g: g / a, b: b / a, coverage: a / n / 255 } : { r: 0, g: 0, b: 0, coverage: 0 };
}

// Samples the finished card into a grid of characters, each with a start point off to the side
function buildCells(fonts: Fonts): Cell[] {
  const [base, ...marks] = LAYERS;
  const baseData = pixels((ctx) => base.draw(ctx, fonts));
  const markData = pixels((ctx) => marks.filter((l) => l.id !== "sheen").forEach((l) => l.draw(ctx, fonts, "ink")));
  const rand = seeded(42);
  const grid: { x: number; y: number; lum: number; color: string; ink: number }[] = [];

  for (let y = 0; y + CELL_H <= H; y += CELL_H) {
    for (let x = 0; x + CELL_W <= W; x += CELL_W) {
      const card = sample(baseData, x, y);
      if (card.coverage < 0.6) continue; // the rounded corners
      const mark = sample(markData, x, y);
      const ink = mark.coverage > 0.12 ? mark : null;
      // On the white page the clouds need to be a bit deeper than the card itself to show up
      const { r, g, b } = ink ?? { r: card.r * 0.65 + 91 * 0.35, g: card.g * 0.65 + 80 * 0.35, b: card.b * 0.65 + 200 * 0.35 };
      grid.push({ x, y, lum: 0.299 * card.r + 0.587 * card.g + 0.114 * card.b, color: `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`, ink: ink ? mark.coverage : 0 });
    }
  }

  // Spread the clouds across the whole ramp, whatever their actual brightness range
  const lums = grid.filter((c) => !c.ink).map((c) => c.lum);
  const low = Math.min(...lums), high = Math.max(...lums);

  return grid.map(({ x, y, lum, color, ink }) => {
    const glyph = ink
      ? INK[Math.min(INK.length - 1, Math.floor(ink * 2.4 * INK.length))]
      : CLOUD[Math.min(CLOUD.length - 1, Math.floor(((high - lum) / (high - low || 1)) * CLOUD.length))];
    const angle = rand() * Math.PI * 2, distance = 260 + rand() * 420;
    const outAngle = rand() * Math.PI * 2, outDistance = 200 + rand() * 360;
    return {
      x: x + CELL_W / 2,
      y: y + CELL_H / 2,
      glyph,
      color,
      sx: W / 2 + Math.cos(angle) * distance,
      sy: H / 2 + Math.sin(angle) * distance * 0.6,
      ex: x + Math.cos(outAngle) * outDistance,
      ey: y + Math.sin(outAngle) * outDistance * 0.6 - 60,
      // Sweeps in from the left, with some randomness so it never looks like a scan
      delay: (x / W) * 0.8 + rand() * 0.5,
      exitDelay: (x / W) * 0.5 + rand() * 0.4,
    };
  });
}

export function AsciiCard({ fonts }: { fonts: Fonts }) {
  const stage = useRef<HTMLDivElement>(null);
  const ascii = useRef<HTMLCanvasElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const clock = useRef({ elapsed: 0, last: 0 });
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stageEl = stage.current!, sceneEl = scene.current!, asciiEl = ascii.current!;
    const actx = asciiEl.getContext("2d")!;
    let cells: Cell[] = [];
    let size = { w: 0, h: 0, scale: 1 };
    let lastT = -1; // resizing a canvas clears it, so the last frame is drawn again

    const resize = () => {
      const { width, height } = stageEl.getBoundingClientRect();
      size = { w: width, h: height, scale: Math.min(1.5, (width - 48) / W, (height - 120) / (H + 140)) };
      asciiEl.width = Math.round(width * dpr * 1.5);
      asciiEl.height = Math.round(height * dpr * 1.5);
      if (lastT >= 0) render(lastT);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stageEl);
    resize();

    function render(t: number) {
      lastT = t;
      const { w, h, scale } = size;
      const tilt = easeInOut(progress(t, T.tilt, 0.9)) * (1 - easeInOut(progress(t, T.untilt, 0.9)));
      // The lifted stack grows upward, so the whole card drops a little to stay centered
      sceneEl.style.transform = `translate(-50%,-50%) translateY(${tilt * 40 * scale}px) scale(${scale * (1 - tilt * 0.12)}) rotateX(${tilt * 56}deg) rotateZ(${tilt * -34}deg)`;

      layers.current.forEach((el, i) => {
        if (!el) return;
        const up = easeOut(progress(t, T.lift + i * 0.08, 1));
        const down = easeInOut(progress(t, T.settle + (LAYERS.length - 1 - i) * 0.06, 0.9));
        const lift = up * (1 - down);
        const bob = Math.sin((t - T.lift) * 1.7 + i * 0.9) * 5 * lift;
        el.style.transform = `translateZ(${i * LAYER_GAP * lift + bob}px)`;
        el.style.setProperty("--lift", lift.toFixed(3));
      });

      // The solid card shows between the two wipes; characters fill in the rest
      const wipeIn = easeInOut(progress(t, T.wipe, WIPE));
      const wipeOut = easeInOut(progress(t, T.unwipe, WIPE));
      const solid = t >= T.wipe && t < T.unwipe + WIPE;
      sceneEl.style.opacity = solid ? "1" : "0";
      sceneEl.style.clipPath = t < T.wipe + WIPE ? `inset(0 ${(1 - wipeIn) * 100}% 0 0)` : t >= T.unwipe ? `inset(0 0 0 ${wipeOut * 100}%)` : "none";

      const k = (asciiEl.width / w);
      actx.setTransform(1, 0, 0, 1, 0, 0);
      actx.clearRect(0, 0, asciiEl.width, asciiEl.height);
      if (solid && t >= T.wipe + WIPE && t < T.unwipe) return;
      const ox = (w - W * scale) / 2, oy = (h - H * scale) / 2;
      actx.setTransform(k * scale, 0, 0, k * scale, k * ox, k * oy);
      actx.font = `600 6.6px ${fonts.mono}`;
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      const tick = Math.floor(t * 16);
      const edgeIn = wipeIn * W, edgeOut = wipeOut * W;

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        let x = c.x, y = c.y, alpha = 1, glyph = c.glyph;
        if (t < T.wipe + WIPE) {
          if (c.x < edgeIn) continue;
          const p = progress(t, c.delay, 1.1);
          if (p <= 0) continue;
          const e = easeOutExpo(p);
          x = c.sx + (c.x - c.sx) * e;
          y = c.sy + (c.y - c.sy) * e;
          alpha = Math.min(1, p * 2.5);
          // Characters flicker while they travel and settle on their glyph just after landing
          if (p < 0.85) glyph = NOISE[(i * 7 + tick) % NOISE.length];
        } else if (t < T.scatter) {
          if (c.x > edgeOut) continue;
        } else {
          const p = progress(t, T.scatter + c.exitDelay, 1);
          const e = p * p * p;
          x = c.x + (c.ex - c.x) * e;
          y = c.y + (c.ey - c.y) * e;
          alpha = 1 - p;
          if (p > 0.08) glyph = NOISE[(i * 7 + tick) % NOISE.length];
          if (alpha <= 0) continue;
        }
        actx.globalAlpha = alpha;
        actx.fillStyle = c.color;
        actx.fillText(glyph, x, y);
      }
      actx.globalAlpha = 1;

      // A thin bright line rides the edge of each wipe
      const edge = t < T.wipe + WIPE ? (wipeIn > 0 && wipeIn < 1 ? edgeIn : -1) : wipeOut > 0 && wipeOut < 1 ? edgeOut : -1;
      if (edge >= 0) {
        const g = actx.createLinearGradient(edge - 10, 0, edge + 2, 0);
        g.addColorStop(0, "rgba(120,108,226,0)");
        g.addColorStop(1, "rgba(120,108,226,.8)");
        actx.fillStyle = g;
        actx.fillRect(edge - 10, -4, 12, H + 8);
      }
    }

    // Canvas text doesn't make the browser fetch a font, so load the ones the card uses first.
    // Each layer then draws itself once; the loop only moves them.
    const weights = [`300 17px ${fonts.mono}`, `600 9px ${fonts.mono}`, `400 12px ${fonts.sans}`, `600 16px ${fonts.sans}`];
    Promise.all(weights.map((font) => document.fonts.load(font))).catch(() => {}).then(() => {
      if (cancelled) return;
      layers.current.forEach((el, i) => {
        el?.querySelectorAll("canvas").forEach((canvas) => {
          canvas.width = W * dpr * 2;
          canvas.height = H * dpr * 2;
          const ctx = canvas.getContext("2d")!;
          ctx.scale(dpr * 2, dpr * 2);
          LAYERS[i].draw(ctx, fonts, canvas.dataset.tone === "ink" ? "ink" : "light");
        });
      });
      cells = buildCells(fonts);

      // ?t=5 freezes the loop at that second, handy for tweaking one moment
      const frozen = new URLSearchParams(location.search).get("t");
      if (reduced || frozen) {
        render(frozen ? Number(frozen) : T.wipe + WIPE + 0.2); // reduced motion gets just the finished card
        return;
      }
      const loop = (now: number) => {
        const c = clock.current;
        if (!pausedRef.current) c.elapsed += Math.min(0.05, (now - (c.last || now)) / 1000);
        c.last = now;
        render(c.elapsed % T.end);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      clock.current.last = 0;
    };
  }, [fonts, reduced]);

  return (
    <div className="ca-stage" ref={stage}>
      <canvas className="ca-ascii" ref={ascii} aria-hidden="true" />
      <div className="ca-scene" ref={scene} role="img" aria-label="A lilac payment card that builds itself out of text characters, then lifts apart into its layers: base, sheen, holder name, card number and logo.">
        {LAYERS.map((layer, i) => (
          <div className={`ca-layer ca-layer--${layer.id}`} key={layer.id} ref={(el) => { layers.current[i] = el; }}>
            <canvas />
            {layer.toned && <canvas className="ca-layer__ink" data-tone="ink" />}
            {i > 0 && <span className="ca-layer__label">{layer.label}</span>}
          </div>
        ))}
      </div>
      {!reduced && (
        <button className="ca-toggle" type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? "Play" : "Pause"}
        </button>
      )}
    </div>
  );
}

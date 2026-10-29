// Everything on the card is drawn on canvas from these functions, so the ASCII version
// and the real layers line up exactly. Units are card pixels.
export const W = 420;
export const H = 234; // same ratio as the Figma card (684 × 380)
export const RADIUS = 14;

export type Fonts = { mono: string; sans: string };
// Engravings are white on the card, but once a layer lifts off over the white page they're
// drawn again in ink so they stay readable
export type Tone = "light" | "ink";

// Small seeded random, so the clouds are the same on every load
export function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cardPath(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, RADIUS);
}

// Periwinkle base with soft white clouds, lightest top-left and bottom-right
export function drawBase(ctx: CanvasRenderingContext2D) {
  const rand = seeded(7);
  ctx.save();
  cardPath(ctx);
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#b9b2f0");
  g.addColorStop(0.45, "#a59ce8");
  g.addColorStop(0.75, "#9a91e2");
  g.addColorStop(1, "#b2aaee");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const blob = (x: number, y: number, r: number, color: string) => {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, color);
    rg.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
    ctx.fillStyle = rg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  const clouds: [number, number, number][] = [[30, 10, 1], [150, 30, 0.6], [380, 220, 1], [330, 50, 0.5], [230, 150, 0.35]];
  for (let i = 0; i < 70; i++) {
    const [cx, cy, weight] = clouds[Math.floor(rand() * clouds.length)];
    blob(cx + (rand() - 0.5) * 220, cy + (rand() - 0.5) * 120, 24 + rand() * 70, `rgba(255,255,255,${(0.03 + rand() * 0.09) * weight})`);
  }
  for (let i = 0; i < 18; i++) blob(80 + rand() * 280, 110 + rand() * 120, 30 + rand() * 60, `rgba(118,104,214,${0.05 + rand() * 0.08})`);
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(255,255,255,${rand() * 0.05})`;
    ctx.fillRect(rand() * W, rand() * H, 1, 1);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, W - 1, H - 1, RADIUS - 0.5);
  ctx.stroke();
}

// A diagonal glint, the layer that makes the card feel glossy
export function drawSheen(ctx: CanvasRenderingContext2D, tone: Tone = "light") {
  const glint = tone === "ink" ? "120,108,226" : "255,255,255";
  ctx.save();
  cardPath(ctx);
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, W, H * 0.9);
  g.addColorStop(0.18, `rgba(${glint},0)`);
  g.addColorStop(0.32, `rgba(${glint},.22)`);
  g.addColorStop(0.42, `rgba(${glint},0)`);
  g.addColorStop(0.62, `rgba(${glint},0)`);
  g.addColorStop(0.7, `rgba(${glint},.12)`);
  g.addColorStop(0.78, `rgba(${glint},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

export function drawLogo(ctx: CanvasRenderingContext2D) {
  const y = 60, r = 18.5, left = 50, right = 71.5;
  ctx.fillStyle = "#EB001B";
  ctx.beginPath();
  ctx.arc(left, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F79E1B";
  ctx.beginPath();
  ctx.arc(right, y, r, 0, Math.PI * 2);
  ctx.fill();
  // The overlap is its own orange
  ctx.save();
  ctx.beginPath();
  ctx.arc(left, y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#FF5F00";
  ctx.beginPath();
  ctx.arc(right, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// White text with a faint dark edge below it, so it reads as pressed into the card
function engrave(ctx: CanvasRenderingContext2D, tone: Tone) {
  if (tone === "ink") {
    ctx.fillStyle = "#2b2378";
    return;
  }
  ctx.fillStyle = "rgba(255,255,255,.96)";
  ctx.shadowColor = "rgba(60,44,150,.3)";
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 1.5;
}

export function drawNumber(ctx: CanvasRenderingContext2D, fonts: Fonts, tone: Tone = "light") {
  const text = "5142 - 8164 - 6526 - 2563";
  ctx.save();
  ctx.letterSpacing = "1px";
  ctx.font = `300 17px ${fonts.mono}`;
  // Fit the number to the same width it has in the Figma card
  const size = 17 * (262 / ctx.measureText(text).width);
  ctx.font = `300 ${size}px ${fonts.mono}`;
  engrave(ctx, tone);
  ctx.fillText(text, 31, 124);
  ctx.restore();
}

export function drawHolder(ctx: CanvasRenderingContext2D, fonts: Fonts, tone: Tone = "light") {
  ctx.save();
  engrave(ctx, tone);
  ctx.font = `400 12.5px ${fonts.sans}`;
  ctx.fillText("NAME", 32, 168);
  ctx.fillText("VALID TILL", 273, 168);
  ctx.font = `600 16px ${fonts.sans}`;
  ctx.fillText("OLIVIA BENNETT", 32, 190);
  ctx.fillText("05/34", 273, 190);
  ctx.restore();
}

// Bottom to top: the order the layers stack in when the card comes apart.
// Toned layers also get an ink copy that fades in as they lift.
type Draw = (ctx: CanvasRenderingContext2D, fonts: Fonts, tone?: Tone) => void;
export const LAYERS: { id: string; label: string; toned: boolean; draw: Draw }[] = [
  { id: "base", label: "Base", toned: false, draw: (ctx) => drawBase(ctx) },
  { id: "sheen", label: "Sheen", toned: true, draw: (ctx, _, tone) => drawSheen(ctx, tone) },
  { id: "holder", label: "Holder", toned: true, draw: drawHolder },
  { id: "number", label: "Number", toned: true, draw: drawNumber },
  { id: "logo", label: "Logo", toned: false, draw: (ctx) => drawLogo(ctx) },
];

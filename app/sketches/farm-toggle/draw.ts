// The whole farm is drawn on a tiny canvas from these functions and scaled up with crisp pixels.
// Units are scene pixels.
export const W = 184;
export const H = 80;

type Ctx = CanvasRenderingContext2D;
type RGB = [number, number, number];
type Disc = [number, number, number];

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const smooth = (a: number, b: number, v: number) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const css = (c: RGB) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;

// A colour that changes over the day: t is 0 in the morning, .5 at sunset, 1 at night
export function key3(day: string, sunset: string, night: string) {
  const D = hex(day), S = hex(sunset), N = hex(night);
  return (t: number) => (t < 0.5 ? mix(D, S, t * 2) : mix(S, N, (t - 0.5) * 2));
}

// Small seeded random, so the meadow is the same on every load
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function px(g: Ctx, x: number, y: number, w: number, h: number, c: string) {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
}

function disc(g: Ctx, cx: number, cy: number, r: number, c: string) {
  g.fillStyle = c;
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.floor(Math.sqrt(r * r - dy * dy));
    g.fillRect(cx - w, cy + dy, 2 * w + 1, 1);
  }
}

function sprite(g: Ctx, x: number, y: number, rows: string[], pal: Record<string, string>, flip: boolean) {
  for (let j = 0; j < rows.length; j++) {
    for (let i = 0; i < rows[j].length; i++) {
      const ch = rows[j][i];
      if (ch !== ".") px(g, x + (flip ? rows[j].length - 1 - i : i), y + j, 1, 1, pal[ch]);
    }
  }
}

const skyTop = key3("#3f93e0", "#4a4e9a", "#080b26");
const skyMid = key3("#7fc4f0", "#e8785a", "#121845");
const skyBot = key3("#d4f0fa", "#ffc85a", "#27336e");
const tintK = key3("#ffffff", "#f7b184", "#34428f"); // multiplied over the land, the way the light changes
const cloudK = key3("#ffffff", "#ffd3b0", "#2c3870");
const cloudShadeK = key3("#cfe6f5", "#e8958a", "#1d2752");
const sunCore = key3("#fff7b8", "#ffd98a", "#ff9a5a");
const sunRing = key3("#ffe066", "#ff9f43", "#e86a4a");

const WINDOWS = [18, 45];

// Everything that never moves, painted once in daylight colours
function paintLand(g: Ctx) {
  const R = seeded(11);
  // far hills
  for (let x = 0; x < W; x++) {
    const h1 = Math.round(43 + 3 * Math.sin(x / 19 + 0.5) + 2 * Math.sin(x / 8 + 2));
    px(g, x, h1, 1, 56 - h1, "#93cbb4");
    const h2 = Math.round(47 + 2.5 * Math.sin(x / 13 + 2) + 1.5 * Math.sin(x / 6));
    px(g, x, h2, 1, 56 - h2, "#5fae78");
  }
  // meadow
  px(g, 0, 52, W, H - 52, "#67b84a");
  px(g, 0, 52, W, 1, "#84d35e");
  for (let i = 0; i < 300; i++) px(g, (R() * W) | 0, (53 + R() * 27) | 0, 1 + ((R() * 2) | 0), 1, ["#7fcf5a", "#56a23f", "#74c452"][(R() * 3) | 0]);
  for (let i = 0; i < 30; i++) {
    const x = (R() * W) | 0, y = (54 + R() * 24) | 0;
    px(g, x, y, 1, 2, "#4c9638"); px(g, x + 2, y, 1, 2, "#4c9638"); px(g, x + 1, y + 1, 1, 1, "#4c9638");
  }
  for (let i = 0; i < 22; i++) {
    const x = (R() * W) | 0, y = (55 + R() * 22) | 0;
    px(g, x, y, 1, 1, ["#ffe066", "#ff8fb0", "#ffffff", "#c9a0ff"][(R() * 4) | 0]); px(g, x, y + 1, 1, 1, "#3f8f3a");
  }

  // dirt path
  for (let x = 0; x < W; x++) {
    const y0 = Math.round(73 + 1.2 * Math.sin(x / 9));
    px(g, x, y0, 1, 5, "#dcb072"); px(g, x, y0, 1, 1, "#c4955a"); px(g, x, y0 + 4, 1, 1, "#b98548");
  }
  px(g, 32, 64, 9, 10, "#dcb072"); px(g, 32, 64, 1, 9, "#c4955a"); px(g, 40, 64, 1, 9, "#c4955a");
  for (let i = 0; i < 40; i++) px(g, (R() * W) | 0, (74 + R() * 3) | 0, 1, 1, R() < 0.5 ? "#eecb93" : "#c4955a");

  // fence
  px(g, 66, 50, 64, 1, "#c4955a"); px(g, 66, 53, 64, 1, "#c4955a");
  for (let x = 66; x <= 129; x += 7) { px(g, x, 48, 2, 8, "#dba96a"); px(g, x + 1, 48, 1, 8, "#b07a40"); px(g, x, 48, 2, 1, "#f3cf98"); }

  // farmhouse
  px(g, 13, 63, 48, 3, "#4f9a3b"); // ground shadow
  px(g, 44, 17, 7, 12, "#9a9aa8"); px(g, 43, 16, 9, 2, "#77778a"); // chimney
  px(g, 44, 21, 3, 1, "#77778a"); px(g, 48, 24, 3, 1, "#77778a"); px(g, 50, 17, 1, 12, "#77778a");
  px(g, 16, 40, 42, 24, "#d39a5c"); // plank walls
  for (let y = 44; y < 62; y += 4) px(g, 16, y, 42, 1, "#b47a42");
  px(g, 16, 40, 1, 24, "#8c5a2b"); px(g, 57, 40, 1, 24, "#8c5a2b");
  px(g, 16, 62, 42, 2, "#8d8d9c"); px(g, 16, 62, 42, 1, "#a9a9b6");
  for (let y = 24; y <= 40; y++) { // shingle roof
    const inset = Math.round((40 - y) * 0.5), x0 = 12 + inset, x1 = 61 - inset, band = (y - 24) >> 2;
    const line = (y - 24) % 4 === 3;
    px(g, x0, y, x1 - x0 + 1, 1, line ? "#7e2f24" : "#b5483a");
    if (!line) for (let x = x0 + 2 + (band % 2) * 3; x < x1; x += 6) px(g, x, y, 1, 1, "#963a2e");
    px(g, x0, y, 1, 1, "#7e2f24"); px(g, x1, y, 1, 1, "#7e2f24");
  }
  px(g, 20, 24, 34, 1, "#dc6a52");
  px(g, 12, 41, 50, 1, "#6b3d1c"); px(g, 16, 42, 42, 1, "#b47a42");
  px(g, 31, 48, 10, 16, "#f0d9a0"); px(g, 32, 49, 8, 15, "#8a5230"); // door
  px(g, 33, 51, 6, 5, "#74421f"); px(g, 33, 58, 6, 5, "#74421f"); px(g, 38, 57, 1, 1, "#ffd84a");
  px(g, 30, 64, 12, 1, "#b9b9c6");
  for (const x of WINDOWS) {
    px(g, x, 45, 11, 11, "#f0d9a0"); px(g, x + 1, 46, 9, 9, "#8fd0ee"); px(g, x + 2, 47, 2, 3, "#d6f2ff");
    px(g, x + 5, 46, 1, 9, "#f0d9a0"); px(g, x + 1, 50, 9, 1, "#f0d9a0");
    px(g, x - 1, 56, 13, 2, "#8c5a2b");
    px(g, x + 1, 55, 1, 1, "#ff6f91"); px(g, x + 4, 55, 1, 1, "#ffe066"); px(g, x + 7, 55, 1, 1, "#ff6f91"); px(g, x + 9, 55, 1, 1, "#ffffff");
  }
  // shipping bin
  px(g, 61, 58, 9, 7, "#b47a42"); px(g, 61, 57, 9, 2, "#d9a868"); px(g, 61, 61, 9, 1, "#8c5a2b"); px(g, 61, 58, 1, 7, "#8c5a2b"); px(g, 69, 58, 1, 7, "#8c5a2b");

  // tilled plot
  px(g, 73, 57, 55, 15, "#7d4f2c");
  for (let y = 61; y < 72; y += 5) px(g, 73, y, 55, 1, "#643c20");
  for (let i = 0; i < 50; i++) px(g, (73 + R() * 55) | 0, (57 + R() * 15) | 0, 1, 1, "#93633b");
  for (let x = 76; x < 118; x += 6) { // corn
    px(g, x + 1, 51, 1, 9, "#3f8f3a"); px(g, x, 54, 1, 1, "#58b04a"); px(g, x + 2, 56, 1, 1, "#58b04a"); px(g, x, 58, 1, 1, "#58b04a");
    px(g, x + 2, 53, 1, 2, "#ffd84a"); px(g, x + 1, 50, 1, 1, "#eedb8a");
  }
  for (let x = 76; x < 124; x += 8) { // pumpkins
    px(g, x - 1, 64, 2, 1, "#3f8f3a"); px(g, x, 63, 5, 3, "#f08a24"); px(g, x + 1, 62, 3, 1, "#f08a24");
    px(g, x + 1, 63, 1, 2, "#ffb04a"); px(g, x + 2, 61, 1, 1, "#3f8f3a"); px(g, x, 65, 5, 1, "#c96a14");
  }
  for (let x = 75, i = 0; x < 124; x += 7, i++) { // cauliflower and tomatoes
    if (i % 2) { px(g, x, 67, 4, 4, "#3f8f3a"); px(g, x + 1, 66, 2, 1, "#58b04a"); px(g, x + 1, 68, 1, 1, "#e8443a"); px(g, x + 3, 69, 1, 1, "#e8443a"); px(g, x, 70, 1, 1, "#e8443a"); }
    else { px(g, x, 69, 5, 2, "#4aa23f"); px(g, x + 1, 68, 3, 2, "#f4f1e0"); px(g, x + 2, 67, 1, 1, "#ffffff"); }
  }
  // scarecrow
  px(g, 124, 49, 1, 13, "#8c5a2b"); px(g, 120, 52, 9, 1, "#8c5a2b");
  px(g, 122, 52, 5, 5, "#4f79c9"); px(g, 122, 57, 5, 1, "#3b5ea3"); px(g, 124, 53, 1, 1, "#e8443a");
  px(g, 123, 47, 3, 4, "#f1d9a4"); px(g, 123, 48, 1, 1, "#3b2a1a"); px(g, 125, 48, 1, 1, "#3b2a1a");
  px(g, 122, 45, 5, 2, "#e3b23c"); px(g, 121, 47, 7, 1, "#c9952a");
  px(g, 119, 52, 1, 2, "#f0d060"); px(g, 129, 52, 1, 2, "#f0d060");

  // lamp post
  px(g, 133, 58, 1, 13, "#5e3a1e"); px(g, 131, 53, 5, 1, "#3b2a1a"); px(g, 132, 54, 3, 4, "#3b2a1a"); px(g, 133, 55, 1, 2, "#fff2b0");

  // fruit tree
  for (let i = 0; i < 3; i++) px(g, 139 + i * 2, 66 + i, 28 - i * 4, 1, "#4f9a3b");
  px(g, 148, 42, 7, 25, "#8a5a34"); px(g, 153, 42, 2, 25, "#64401f"); px(g, 149, 44, 1, 21, "#a87444");
  px(g, 146, 65, 2, 2, "#8a5a34"); px(g, 155, 65, 2, 2, "#64401f");
  const dark: Disc[] = [[151, 31, 15], [138, 37, 9], [164, 37, 9], [151, 21, 10]];
  const mid: Disc[] = [[150, 29, 13], [138, 35, 7], [163, 35, 7], [150, 20, 8]];
  const light: Disc[] = [[146, 25, 7], [137, 33, 4], [160, 31, 4], [149, 17, 4]];
  dark.forEach((d) => disc(g, ...d, "#2f7d3a"));
  mid.forEach((d) => disc(g, ...d, "#44a045"));
  light.forEach((d) => disc(g, ...d, "#66c456"));
  for (let i = 0; i < 160; i++) {
    const x = (128 + R() * 46) | 0, y = (10 + R() * 38) | 0;
    if (mid.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 < (r - 1) ** 2)) px(g, x, y, 1 + ((R() * 2) | 0), 1, R() < 0.5 ? "#7fd868" : "#37893c");
  }
  const apples = [[142, 30], [156, 25], [160, 38], [146, 39], [152, 17], [135, 37], [165, 32]];
  apples.forEach(([x, y]) => { px(g, x, y, 2, 2, "#e8443a"); px(g, x, y, 1, 1, "#ff9a86"); });

  // bushes
  const bush = (x: number, y: number) => {
    disc(g, x, y, 4, "#3f9a3f"); disc(g, x + 5, y + 1, 3, "#3f9a3f");
    px(g, x - 2, y - 2, 3, 1, "#66c456"); px(g, x + 4, y - 1, 2, 1, "#66c456"); px(g, x, y + 1, 1, 1, "#ff6f91"); px(g, x + 5, y + 2, 1, 1, "#ff6f91");
  };
  bush(6, 66); bush(175, 63);
}

const HEN = ["...r..", "..wwo.", "w.wwk.", "wwwww.", ".wwww."];
const HENS = [
  { x: 52, y: 67, range: 7, speed: 0.23, pal: { r: "#e8443a", w: "#ffffff", o: "#f08a24", k: "#ffffff" } },
  { x: 96, y: 74, range: 10, speed: 0.17, pal: { r: "#e8443a", w: "#c98a4b", o: "#f0c040", k: "#c98a4b" } },
];
const CLOUDS = [
  { x: 20, y: 7, v: 1.3, r: [[4, 0, 6, 2], [2, 2, 12, 3], [0, 4, 17, 2]], base: 2 },
  { x: 96, y: 17, v: 0.8, r: [[3, 0, 5, 2], [0, 2, 12, 2]], base: 1 },
  { x: 150, y: 5, v: 1.7, r: [[5, 0, 8, 2], [2, 2, 15, 3], [0, 4, 21, 2], [10, -2, 4, 2]], base: 2 },
];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const SKY_H = 56;
const BANDS = 9;

function glow(ctx: Ctx, x: number, y: number, r: number, rgb: string, a: number) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, `rgba(${rgb},${a})`);
  gradient.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// Returns a function that draws one frame: t is the time of day (0 morning, 1 night),
// time is seconds since load and only drives the small loops (clouds, hens, smoke, fireflies).
export function createScene() {
  const layer = () => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    return canvas;
  };
  const landC = layer(), compC = layer(), tintC = layer();
  const comp = compC.getContext("2d")!, tint = tintC.getContext("2d")!;
  paintLand(landC.getContext("2d")!);

  const R = seeded(3);
  const stars = Array.from({ length: 46 }, () => ({ x: (R() * W) | 0, y: (R() * 44) | 0, p: R() * 6.28, big: R() < 0.14 }));
  const flies = Array.from({ length: 9 }, () => ({ x: 70 + R() * 100, y: 50 + R() * 22, p: R() * 6.28, s: 0.4 + R() * 0.5 }));
  const sky = new ImageData(W, SKY_H);

  return function draw(ctx: Ctx, t: number, time: number) {
    const night = smooth(0.5, 0.88, t);

    // sky, in dithered bands
    const top = skyTop(t), middle = skyMid(t), bottom = skyBot(t), ramp: RGB[] = [];
    for (let i = 0; i <= BANDS; i++) {
      const v = i / BANDS;
      ramp.push(v < 0.55 ? mix(top, middle, v / 0.55) : mix(middle, bottom, (v - 0.55) / 0.45));
    }
    const d = sky.data;
    for (let y = 0, o = 0; y < SKY_H; y++) {
      const f = (y / (SKY_H - 1)) * BANDS, b = Math.floor(f), fr = f - b;
      for (let x = 0; x < W; x++, o += 4) {
        const c = ramp[Math.min(BANDS, b + (fr > BAYER[(y & 3) * 4 + (x & 3)] ? 1 : 0))];
        d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
      }
    }
    ctx.putImageData(sky, 0, 0);

    // stars
    if (night > 0) {
      for (const s of stars) {
        ctx.globalAlpha = night * (0.55 + 0.45 * Math.sin(time * 2 + s.p));
        px(ctx, s.x, s.y, 1, 1, "#fff8d8");
        if (s.big) { px(ctx, s.x - 1, s.y, 3, 1, "#fff8d8"); px(ctx, s.x, s.y - 1, 1, 3, "#fff8d8"); }
      }
    }
    ctx.globalAlpha = 1;

    // sun, sinking behind the hills
    const sx = Math.round(112 + 8 * t), sy = Math.round(13 + 62 * Math.pow(t, 1.5));
    ctx.globalCompositeOperation = "lighter";
    glow(ctx, sx, sy, 20, "255,220,140", 0.45 * (1 - night));
    ctx.globalCompositeOperation = "source-over";
    disc(ctx, sx, sy, 6, css(sunRing(t)));
    disc(ctx, sx, sy, 4, css(sunCore(t)));
    ctx.globalAlpha = clamp(1 - t * 2.5);
    const ray = Math.floor(time * 1.5) % 2;
    [[9, 0], [-9, 0], [0, 9], [0, -9], [7, 7], [-7, 7], [7, -7], [-7, -7]].forEach(([dx, dy], i) => {
      if ((i + ray) % 2 === 0 || i < 4) px(ctx, sx + dx, sy + dy, 1, 1, "#fff3a0");
    });
    ctx.globalAlpha = 1;

    // moon, rising from behind them
    const my = Math.round(62 - 48 * smooth(0.45, 1, t));
    if (my < 58) {
      ctx.globalCompositeOperation = "lighter";
      glow(ctx, 60, my, 18, "150,170,255", 0.35 * night);
      ctx.globalCompositeOperation = "source-over";
      disc(ctx, 60, my, 6, "#f6f2d4"); disc(ctx, 61, my + 1, 5, "#ebe6c2"); disc(ctx, 59, my - 1, 4, "#f6f2d4");
      px(ctx, 57, my - 2, 2, 2, "#d5cfa6"); px(ctx, 62, my + 2, 2, 1, "#d5cfa6"); px(ctx, 61, my - 3, 1, 1, "#d5cfa6");
    }

    // clouds
    const cloud = css(cloudK(t)), shade = css(cloudShadeK(t));
    ctx.globalAlpha = 1 - 0.35 * night;
    for (const c of CLOUDS) {
      const x = Math.round(((c.x + time * c.v) % (W + 40)) - 24);
      c.r.forEach(([dx, dy, w, h]) => px(ctx, x + dx, c.y + dy, w, h, cloud));
      const [bx, by, bw, bh] = c.r[c.base];
      px(ctx, x + bx + 1, c.y + by + bh, bw - 2, 1, shade);
    }
    ctx.globalAlpha = 1;

    // land and the things that move on it, tinted together for the time of day
    comp.clearRect(0, 0, W, H);
    comp.drawImage(landC, 0, 0);
    for (let i = 0; i < 3; i++) { // chimney smoke
      const p = (time * 0.22 + i / 3) % 1, s = 2 + ((p * 3) | 0);
      comp.globalAlpha = (1 - p) * 0.75;
      px(comp, Math.round(46 + p * 5 + Math.sin(p * 6 + i) * 1.5), Math.round(14 - p * 13), s, s - 1, "#f4f4f4");
    }
    comp.globalAlpha = 1 - night; // the hens go to bed
    if (night < 1) {
      for (const h of HENS) {
        const phase = time * h.speed, x = Math.round(h.x + Math.sin(phase) * h.range), step = Math.floor(time * 5) % 2;
        const peck = Math.sin(time * 1.3 + h.x) > 0.8 ? 1 : 0;
        sprite(comp, x, h.y + peck, HEN, h.pal, Math.cos(phase) < 0);
        px(comp, x + (step ? 1 : 2), h.y + 5 + peck, 1, 1, "#f0c040"); px(comp, x + (step ? 4 : 3), h.y + 5 + peck, 1, 1, "#f0c040");
      }
    }
    comp.globalAlpha = 1;
    tint.globalCompositeOperation = "source-over";
    tint.clearRect(0, 0, W, H);
    tint.drawImage(compC, 0, 0);
    tint.globalCompositeOperation = "multiply";
    px(tint, 0, 0, W, H, css(tintK(t)));
    tint.globalCompositeOperation = "destination-in";
    tint.drawImage(compC, 0, 0);
    ctx.drawImage(tintC, 0, 0);

    // the lights come on
    if (night > 0) {
      const flicker = 0.92 + 0.08 * Math.sin(time * 9);
      ctx.globalAlpha = night;
      for (const x of WINDOWS) {
        px(ctx, x + 1, 46, 4, 4, "#ffd35c"); px(ctx, x + 6, 46, 4, 4, "#ffd35c"); px(ctx, x + 1, 51, 4, 4, "#ffc23e"); px(ctx, x + 6, 51, 4, 4, "#ffc23e");
        px(ctx, x + 2, 47, 2, 2, "#fff3b8");
      }
      px(ctx, 133, 55, 1, 2, "#fff6c8");
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "lighter";
      for (const x of WINDOWS) glow(ctx, x + 5.5, 51, 17, "255,180,80", 0.5 * night * flicker);
      glow(ctx, 36, 66, 14, "255,170,70", 0.16 * night);
      glow(ctx, 133.5, 56, 15, "255,200,110", 0.6 * night * flicker);
      for (const f of flies) {
        const fx = Math.round(f.x + Math.sin(time * f.s + f.p) * 9), fy = Math.round(f.y + Math.cos(time * f.s * 1.3 + f.p) * 5);
        const a = night * clamp(Math.sin(time * 1.6 + f.p * 3) * 0.8 + 0.4);
        glow(ctx, fx + 0.5, fy + 0.5, 3.5, "200,255,120", 0.5 * a);
        ctx.globalAlpha = a;
        px(ctx, fx, fy, 1, 1, "#eaff9a");
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = "source-over";
    }
  };
}

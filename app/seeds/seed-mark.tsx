// A leafy branch: pointed leaves set alternately up a thin stem, young and yellow-green at the
// tip, deeper and olive toward the base. Each leaf is lit from one side, with darker veins and a
// fine pigment grain, so it reads like a painted botanical study rather than a flat icon.

type Pt = [number, number];

// The stem is a gentle curve from the base (bottom) to the tip (top).
const STEM: [Pt, Pt, Pt] = [[20, 63], [27, 36], [22, 6]];
const at = (t: number): Pt => {
  const [a, b, c] = STEM, u = 1 - t;
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
};
const angleAt = (t: number) => {
  const [a, b, c] = STEM;
  const dx = 2 * (1 - t) * (b[0] - a[0]) + 2 * t * (c[0] - b[0]);
  const dy = 2 * (1 - t) * (b[1] - a[1]) + 2 * t * (c[1] - b[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

// Where each leaf sits on the stem, which side it points to, its length, and how mature its green is (0 young, 2 old).
const LEAVES: { t: number; side: -1 | 0 | 1; len: number; age: 0 | 1 | 2 }[] = [
  { t: 0.14, side: 1, len: 18, age: 2 },
  { t: 0.28, side: -1, len: 18, age: 2 },
  { t: 0.43, side: 1, len: 17, age: 1 },
  { t: 0.57, side: -1, len: 16, age: 1 },
  { t: 0.7, side: 1, len: 14, age: 0 },
  { t: 0.81, side: -1, len: 13, age: 0 },
  { t: 1, side: 0, len: 12, age: 0 },
];
// Light side, shaded side, and vein color for each age.
const GREENS = [
  ["#a9c072", "#869f52", "#4f6a2e"],
  ["#869f56", "#647e3c", "#3d5526"],
  ["#6f8a46", "#4f6a30", "#30461d"],
];

// A pointed oval from its base at (0,0) to its tip at (len,0); w is the half-width.
const leafPath = (len: number, w: number) =>
  `M0 0C${len * 0.22} ${-w * 1.05} ${len * 0.62} ${-w * 1.08} ${len} 0C${len * 0.62} ${w * 1.02} ${len * 0.22} ${w} 0 0Z`;
// Side veins leave the midrib and sweep toward the tip.
const veins = (len: number, w: number) => {
  let d = "";
  for (const s of [0.22, 0.38, 0.54, 0.7]) {
    const x = len * s, reach = w * (1 - Math.abs(s - 0.45) * 0.9) * 0.82;
    d += `M${x} 0q${len * 0.08} ${-reach * 0.5} ${len * 0.16} ${-reach}M${x} 0q${len * 0.08} ${reach * 0.5} ${len * 0.16} ${reach}`;
  }
  return d;
};

export function SeedMark({ className }: { className?: string }) {
  const [a, b, c] = STEM;
  return (
    <svg className={className} viewBox="6 -9 36 73" aria-hidden="true">
      <defs>
        {GREENS.map(([light, shade], i) => (
          <linearGradient key={i} id={`sc-branch-g${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={light} />
            <stop offset=".55" stopColor={shade} />
            <stop offset="1" stopColor={shade} />
          </linearGradient>
        ))}
        {/* Pigment grain inside the shapes, and a slightly soft, uneven edge */}
        <filter id="sc-branch-paint" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="6" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale=".22" xChannelSelector="R" yChannelSelector="G" result="soft" />
          <feColorMatrix in="noise" values="0 0 0 0 .15 0 0 0 0 .2 0 0 0 0 .08 0 0 0 .55 -.24" result="grain" />
          <feComposite in="grain" in2="soft" operator="in" result="grainIn" />
          <feMerge><feMergeNode in="soft" /><feMergeNode in="grainIn" /></feMerge>
        </filter>
      </defs>

      <g filter="url(#sc-branch-paint)">
        {/* Stem */}
        <path d={`M${a[0]} ${a[1]}Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`} fill="none" stroke="#56713a" strokeWidth="1" strokeLinecap="round" />

        {LEAVES.map(({ t, side, len, age }, i) => {
          const [x, y] = at(t);
          const rot = angleAt(t) + side * 42;
          const w = len * 0.4;
          const [, , vein] = GREENS[age];
          // Mirror right-hand leaves so their lit side stays on the same side of the light
          const flip = side === 1 ? " scale(1 -1)" : "";
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})${flip}`}>
              <path d={`M0 0L1.6 0`} stroke="#5a7536" strokeWidth=".6" strokeLinecap="round" />
              <g transform="translate(1.4 0)">
                <clipPath id={`sc-branch-leaf${i}`}><path d={leafPath(len, w)} /></clipPath>
                <path d={leafPath(len, w)} fill={`url(#sc-branch-g${age})`} />
                <path d={`M0 0Q${len * 0.5} ${w * 0.06} ${len * 0.94} 0`} fill="none" stroke={vein} strokeWidth=".5" strokeOpacity=".75" strokeLinecap="round" />
                <path d={veins(len, w)} clipPath={`url(#sc-branch-leaf${i})`} fill="none" stroke={vein} strokeWidth=".3" strokeOpacity=".55" strokeLinecap="round" />
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

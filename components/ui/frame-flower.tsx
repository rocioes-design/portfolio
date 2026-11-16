// One flower from the About page's floral frame, drawn on its own as a small icon.
// Same petal shape, inking and orange wash as the frame.
const R = 11;
const PETAL = `M0 ${-R * 0.1}C${R * 0.46} ${-R * 0.28} ${R * 0.5} ${-R * 0.92} ${R * 0.12} ${-R}Q0 ${-R * 0.9} ${-R * 0.12} ${-R}C${-R * 0.5} ${-R * 0.92} ${-R * 0.46} ${-R * 0.28} 0 ${-R * 0.1}Z`;

export function FrameFlower({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-12 -12 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="frame-flower-petal" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FFF1D6" />
          <stop offset=".55" stopColor="#FCC56E" />
          <stop offset="1" stopColor="#FAA532" />
        </linearGradient>
      </defs>
      {[0, 72, 144, 216, 288].map((t) => (
        <path key={t} d={PETAL} fill="url(#frame-flower-petal)" stroke="#A0612A" strokeWidth=".6" strokeLinejoin="round" transform={`rotate(${t})`} />
      ))}
      <circle r={R * 0.26} fill="#A6B068" stroke="#6B5A3A" strokeWidth=".5" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return <circle key={i} cx={(Math.cos(a) * R * 0.36).toFixed(2)} cy={(Math.sin(a) * R * 0.36).toFixed(2)} r={R * 0.055} fill="#B4661B" />;
      })}
    </svg>
  );
}

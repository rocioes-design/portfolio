// Weather animations for the full-width panels. Pure CSS (see whether.css, .fx-*), so they render on the server.
// Positions come from a seeded random, so server and client markup always match.

type Kind = "rain" | "sun" | "night" | "snow" | "wind";

function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function WeatherFx({ kind, seed = 7, dense = 1 }: { kind: Kind; seed?: number; dense?: number }) {
  const rnd = seeded(seed);
  const r = (a: number, b: number) => a + (b - a) * rnd();
  const n = (count: number) => Array.from({ length: Math.round(count * dense) }, (_, i) => i);

  if (kind === "rain") {
    return <div className="fx" aria-hidden="true">
      {n(70).map((i) => {
        const far = i < 45 * dense;
        const dur = far ? r(1.1, 1.5) : r(0.7, 0.95);
        return <span key={i} className={`fx-drop${far ? " far" : ""}`} style={{ left: `${r(-5, 115).toFixed(1)}%`, height: `${Math.round(far ? r(14, 22) : r(26, 40))}px`, animationDuration: `${dur.toFixed(2)}s`, animationDelay: `-${r(0, dur).toFixed(2)}s` }} />;
      })}
    </div>;
  }
  if (kind === "night") {
    return <div className="fx" aria-hidden="true">
      {n(60).map((i) => {
        const d = r(1.6, 3.6); const s = r(1.6, 3.4);
        return <span key={i} className="fx-star" style={{ left: `${r(1, 99).toFixed(1)}%`, top: `${r(2, 96).toFixed(1)}%`, width: `${s.toFixed(1)}px`, height: `${s.toFixed(1)}px`, animationDuration: `${d.toFixed(2)}s`, animationDelay: `-${r(0, d).toFixed(2)}s` }} />;
      })}
      {[[82, 6, 0], [58, -4, 3.1], [96, 26, 5.4]].map(([x, y, d]) => <span key={x} className="fx-shoot" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />)}
    </div>;
  }
  if (kind === "snow") {
    return <div className="fx" aria-hidden="true">
      {n(60).map((i) => {
        const near = rnd() > 0.6; const d = near ? r(6, 9) : r(10, 15); const s = near ? r(7, 11) : r(3, 6);
        return <span key={i} className="fx-flake-fall" style={{ left: `${r(-2, 100).toFixed(1)}%`, animationDuration: `${d.toFixed(2)}s`, animationDelay: `-${r(0, d).toFixed(2)}s` }}><span className="fx-flake" style={{ width: `${s.toFixed(1)}px`, height: `${s.toFixed(1)}px`, opacity: near ? 0.95 : 0.7, animationDuration: `${r(1.8, 3.2).toFixed(2)}s` }} /></span>;
      })}
    </div>;
  }
  if (kind === "wind") {
    return <div className="fx" aria-hidden="true">
      {n(22).map((i) => {
        const d = r(1.6, 3);
        return <span key={i} className="fx-gust" style={{ top: `${r(5, 95).toFixed(1)}%`, width: `${Math.round(r(90, 220))}px`, animationDuration: `${d.toFixed(2)}s`, animationDelay: `-${r(0, d).toFixed(2)}s` }} />;
      })}
    </div>;
  }
  // Sun: beams swing down from the top-right corner, sparkles drift up.
  return <div className="fx" aria-hidden="true">
    <span className="fx-glow" />
    {[[180, 0], [120, 1.6], [240, 3.1], [90, 0.8]].map(([w, d]) => <span key={d} className="fx-beam" style={{ width: `${w}px`, animationDelay: `-${d}s` }} />)}
    {n(16).map((i) => {
      const d = r(4, 7); const z = r(9, 15);
      return <svg key={i} className="fx-mote" viewBox="0 0 20 20" style={{ left: `${r(4, 96).toFixed(1)}%`, top: `${r(20, 90).toFixed(1)}%`, width: `${z.toFixed(1)}px`, height: `${z.toFixed(1)}px`, animationDuration: `${d.toFixed(2)}s`, animationDelay: `-${r(0, d).toFixed(2)}s` }}><path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" /></svg>;
    })}
  </div>;
}

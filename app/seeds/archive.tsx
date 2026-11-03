"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SeedMark } from "./seed-mark";

export type Catalog = {
  id: string;
  title: string;
  company: string;
  /** null when the catalog is undated */
  year: number | null;
  place: string;
  state: string | null;
  plants: string[];
  palette: { hex: string; share: number }[];
  /** height / width of the cover */
  ratio: number;
  /** Full-resolution scan and source page, for catalogs that aren't on the Internet Archive */
  scan?: string;
  link?: string;
};

const FIRST = 1880;
const LAST = 1930;
const YEARS = Array.from({ length: LAST - FIRST + 1 }, (_, i) => FIRST + i);

// Covers are saved in the site at two widths; the full scan loads from where the catalog lives.
const cover = (id: string, width: 320 | 720) => `/media/seeds/${width}/${id}.jpg`;
// "cover" points at the scan's cover page; page n0 is usually the library's archive notice.
const fullScan = (c: Catalog) => c.scan ?? `https://archive.org/download/${c.id}/page/cover.jpg`;
const source = (c: Catalog) => c.link ?? `https://archive.org/details/${c.id}`;
const sourceName = (c: Catalog) => (c.link?.includes("nal.usda.gov") ? "National Agricultural Library" : "Internet Archive");
const dateOf = (c: Catalog) => (c.year ? String(c.year) : "Undated");
// Landscape covers keep their shape; everything else is cropped to a 3:4 stamp.
const shape = (c: Catalog) => (c.ratio < 1 ? { aspectRatio: `1 / ${c.ratio}` } : undefined);

export function SeedArchive({ catalogs }: { catalogs: Catalog[] }) {
  const [range, setRange] = useState<[number, number]>([FIRST, LAST]);
  const [state, setState] = useState("");
  const [plant, setPlant] = useState("");
  const [selected, setSelected] = useState<Catalog | null>(null);

  const states = useMemo(() => [...new Set(catalogs.map((c) => c.state).filter(Boolean) as string[])].sort(), [catalogs]);
  const plants = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of catalogs) for (const p of c.plants) counts.set(p, (counts.get(p) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([p]) => p);
  }, [catalogs]);

  // Undated catalogs drop out as soon as the year range is narrowed.
  const fullRange = range[0] === FIRST && range[1] === LAST;
  const inRangeAndRegion = (c: Catalog) => (c.year === null ? fullRange : c.year >= range[0] && c.year <= range[1]) && (!state || c.state === state);
  const matches = (c: Catalog) => inRangeAndRegion(c) && (!plant || c.plants.includes(plant));
  const visible = catalogs.filter(matches);
  const shown = visible.length;
  const clearFilters = () => { setRange([FIRST, LAST]); setState(""); setPlant(""); };
  // Each contents line counts what the years and region leave, whichever plant is picked.
  const plantCount = (p: string) => catalogs.filter((c) => inRangeAndRegion(c) && c.plants.includes(p)).length;
  const filtered = shown !== catalogs.length;

  return (
    <div className="sc-shell">
      <header className="sc-header">
        <h1><SeedMark className="sc-mark" /><span>Seed catalogs, <span className="sc-nowrap">1880–1930</span></span></h1>
        <p>{filtered ? `${shown} of ${catalogs.length} catalogs` : `${catalogs.length} catalogs`}</p>
      </header>

      <Timeline catalogs={catalogs} range={range} onChange={setRange} />

      {/* Filters, set like a catalog's contents page: plant types with dotted leaders and counts */}
      <div className="sc-filters">
        <div className="sc-contents__head">
          <h2>Contents</h2>
          <label className="sc-region">
            <span>Shipped from</span>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">all regions</option>
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          {filtered && <button type="button" className="sc-reset" onClick={clearFilters}>Clear filters</button>}
        </div>
        <ul className="sc-contents" aria-label="Plant">
          {plants.map((p) => (
            <li key={p}>
              <button type="button" className="sc-entry" aria-pressed={plant === p} data-empty={!plantCount(p) || undefined} onClick={() => setPlant(plant === p ? "" : p)}>
                <span className="sc-entry__name">{p}<InkCircle /></span>
                <span className="sc-entry__leader" aria-hidden="true" />
                <span className="sc-entry__count">{plantCount(p)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {visible.length === 0 && (
        <p className="sc-empty">
          No catalogs match these filters. <button type="button" className="sc-reset" onClick={clearFilters}>Clear filters</button>
        </p>
      )}
      <ul className="sc-wall">
        {visible.map((c) => (
          <li key={c.id} className="sc-wall__item">
            <button type="button" className="sc-cover" aria-pressed={selected?.id === c.id} aria-label={`${c.title}, ${dateOf(c)}`} onClick={() => setSelected(c)}>
              <Stamp src={cover(c.id, 320)} alt="" style={shape(c)} />
            </button>
          </li>
        ))}
      </ul>

      <footer className="sc-footer">
        <p>Built with <a href="https://claude.com" target="_blank" rel="noreferrer">Claude</a> · Designed by <a href="/">Rocío Espinosa</a></p>
        <p className="sc-footer__credit">
          Covers from the USDA <a href="https://www.nal.usda.gov/exhibits/speccoll/exhibits/show/nursery-and-seed-trade-catalog" target="_blank" rel="noreferrer">National Agricultural Library</a>, by way of the <a href="https://archive.org/details/usda-nurseryandseedcatalog" target="_blank" rel="noreferrer">Internet Archive</a>. All in the public domain.
        </p>
      </footer>

      <Detail catalog={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// A loose hand-drawn ring that inks itself around the picked contents line, drawn the same way as
// the site's scribble underline (a path with pathLength 1, revealed through its dash offset).
function InkCircle() {
  return (
    <svg className="sc-ink-circle" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M14 6C40-1 92 2 97 18 101 33 62 39 32 37 9 35 1 27 4 16 6 10 14 7 24 5" pathLength="1" />
    </svg>
  );
}

function Stamp({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <span className="sc-stamp">
      <span className="about-stamp__paper"><img src={src} alt={alt} style={style} loading="lazy" decoding="async" /></span>
    </span>
  );
}

// Bars show how many catalogs each year has; two overlaid sliders pick the range.
function Timeline({ catalogs, range, onChange }: { catalogs: Catalog[]; range: [number, number]; onChange: (r: [number, number]) => void }) {
  const counts = YEARS.map((y) => catalogs.filter((c) => c.year === y).length);
  const max = Math.max(1, ...counts);
  const [from, to] = range;
  return (
    <div className="sc-timeline">
      <div className="sc-timeline__bars" aria-hidden="true">
        {YEARS.map((y, i) => (
          <span key={y} data-out={y < from || y > to || undefined} style={{ height: `${Math.max(4, (counts[i] / max) * 100)}%` }} />
        ))}
      </div>
      <div className="sc-timeline__range">
        <input type="range" min={FIRST} max={LAST} value={from} aria-label="From year" onChange={(e) => onChange([Math.min(+e.target.value, to), to])} />
        <input type="range" min={FIRST} max={LAST} value={to} aria-label="To year" onChange={(e) => onChange([from, Math.max(+e.target.value, from)])} />
      </div>
      <div className="sc-timeline__labels">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}

function Detail({ catalog, onClose }: { catalog: Catalog | null; onClose: () => void }) {
  const viewer = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // Keep the last catalog on screen while the panel slides out.
  const [shown, setShown] = useState(catalog);
  useEffect(() => { if (catalog) setShown(catalog); }, [catalog]);

  useEffect(() => {
    if (!catalog) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !viewer.current?.open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [catalog, onClose]);

  const c = shown;
  return (
    <>
      <aside className="sc-detail" data-open={!!catalog || undefined} aria-hidden={!catalog} inert={!catalog}>
        {c && <>
          <button type="button" className="sc-detail__close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <div className="sc-detail__cover" data-landscape={c.ratio < 1 || undefined}><Stamp src={cover(c.id, 720)} alt={`Cover of ${c.title}, ${dateOf(c)}`} style={shape(c)} /></div>
          <h2>{c.title}</h2>
          <p className="sc-detail__meta">{c.company}<br />{c.place} · {dateOf(c)}</p>
          {c.palette.length > 0 && (
            <div className="sc-palette" aria-label="Cover colors">
              {c.palette.map((p) => <span key={p.hex} title={p.hex} style={{ background: p.hex, flexGrow: p.share }} />)}
            </div>
          )}
          {c.plants.length > 0 && <p className="sc-detail__plants">{c.plants.join(", ")}</p>}
          <div className="sc-detail__actions">
            <button type="button" className="sc-scan-link" onClick={() => { viewer.current?.showModal(); setOpen(true); }}>
              View full scan
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
            <a href={source(c)} target="_blank" rel="noreferrer">{sourceName(c)} ↗</a>
          </div>
        </>}
      </aside>

      <dialog ref={viewer} className="sc-viewer" style={c ? ({ "--ratio": c.ratio } as React.CSSProperties) : undefined} aria-label={c ? `${c.title}, ${dateOf(c)}` : "Full scan"} onClose={() => setOpen(false)} onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        {c && <>
          {/* The 720px cover shows at once; the full scan draws over it once it arrives. */}
          <div className="sc-viewer__frame">
            <img src={cover(c.id, 720)} alt="" aria-hidden="true" />
            {open && <img key={c.id} src={fullScan(c)} alt={`Cover of ${c.title}, ${dateOf(c)}`} onLoad={(e) => e.currentTarget.setAttribute("data-loaded", "")} />}
          </div>
          <button type="button" className="sc-viewer__close" aria-label="Close" onClick={() => viewer.current?.close()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </>}
      </dialog>
    </>
  );
}

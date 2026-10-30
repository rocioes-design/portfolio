import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer, Header, MailIcon } from "../components";
import { BloomLogo, BLOOM_PATH } from "../../components/ui/bloom-logo";
import { ScribbleText } from "../../components/ui/scribble-text";
import { MarkerDemo, SendDemo, Swatch, WindowDemo } from "./demos";
import { RailToc, type TocItem } from "./rail-toc";
import "../../components/ui/media-carousel.css";
import "../../components/ui/project-window.css";
import "../../components/ui/interactive-folder-gallery.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "Design System — Rocío Espinosa",
  description: "The colors, type, spacing, motion and components behind Rocío Espinosa's portfolio.",
};

type Tag = "core" | "one-off" | "proposed";
const TAG_LABEL: Record<Tag, string> = { core: "Core", "one-off": "One-off", proposed: "Proposed" };

// The sidebar and the page are built from this one outline
const toc: TocItem[] = [
  { id: "color", label: "Color" },
  { id: "primary", label: "Primary", depth: 1 },
  { id: "accent", label: "Accent", depth: 1 },
  { id: "status", label: "Status", depth: 1 },
  { id: "components", label: "Components" },
  { id: "buttons", label: "Buttons", depth: 1 },
  { id: "cards", label: "Cards", depth: 1 },
  { id: "dividers", label: "Dividers", depth: 1 },
  { id: "inputs", label: "Inputs", depth: 1 },
  { id: "loaders", label: "Loaders", depth: 1 },
  { id: "navigation", label: "Navigation", depth: 1 },
  { id: "pills", label: "Pills", depth: 1 },
  { id: "iconography", label: "Iconography" },
  { id: "borders", label: "Borders" },
  { id: "radius", label: "Radius", depth: 1 },
  { id: "focus", label: "Focus states", depth: 1 },
  { id: "border-styles", label: "Styles", depth: 1 },
  { id: "motion", label: "Motion" },
  { id: "animations", label: "Animations", depth: 1 },
  { id: "durations", label: "Duration scale", depth: 1 },
  { id: "shadows", label: "Shadows" },
  { id: "spacing", label: "Spacing" },
  { id: "gaps", label: "Gap scale", depth: 1 },
  { id: "widths", label: "Layout widths", depth: 1 },
  { id: "typography", label: "Typography" },
  { id: "families", label: "Families", depth: 1 },
  { id: "type-properties", label: "Properties", depth: 1 },
  { id: "materials", label: "Materials" },
];

function TagChip({ tag }: { tag: Tag }) {
  return <span className={`ds-tag ds-tag--${tag}`}>{TAG_LABEL[tag]}</span>;
}

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="ds-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {intro && <p className="ds-intro">{intro}</p>}
      {children}
    </section>
  );
}

function Sub({ id, title, tag, note, children }: { id: string; title: string; tag?: Tag; note?: string; children: ReactNode }) {
  return (
    <div className="ds-sub">
      <div className="ds-sub__head">
        <h3 id={id}>{title}</h3>
        {tag && <TagChip tag={tag} />}
      </div>
      {note && <p className="ds-note">{note}</p>}
      {children}
    </div>
  );
}

function Specimen({ label, tag, children, wide }: { label: string; tag?: Tag; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={`ds-specimen${wide ? " ds-specimen--wide" : ""}`}>
      <div className="ds-specimen__stage">{children}</div>
      <figcaption>{label}{tag && <TagChip tag={tag} />}</figcaption>
    </figure>
  );
}

function Bloom({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" aria-hidden="true"><path fillRule="evenodd" d={BLOOM_PATH} /></svg>;
}

const neutrals = [
  { name: "Ink", token: "ink", hex: "#181818", usage: "Headings, nav, the signature" },
  { name: "Text", token: "text", hex: "#2b2b2b", usage: "Body copy, captions, button labels" },
  { name: "Muted", token: "muted", hex: "#6b6b6b", usage: "Secondary text, project links, footer" },
  { name: "Subtle", token: "subtle", hex: "#767676", usage: "Small labels, fact titles" },
  { name: "Line strong", token: "line-strong", hex: "#d6d4ce", usage: "Dots, window lights, selected outlines" },
  { name: "Line", token: "line", hex: "#dfdeda", usage: "Header and window borders" },
  { name: "Line soft", token: "line-soft", hex: "#e8e7e3", usage: "Dividers inside windows, clip borders" },
  { name: "Soft strong", token: "soft-strong", hex: "#eae9e4", usage: "Hover on soft surfaces" },
  { name: "Soft", token: "soft", hex: "#f1f1ee", usage: "FAQ questions, media and stage backgrounds" },
  { name: "Paper", token: "paper", hex: "#fcfcfb", usage: "Page background" },
  { name: "Surface", token: "surface", hex: "#ffffff", usage: "Buttons, windows, open bubbles" },
];
const accents = [
  { name: "Pink", token: "pink", hex: "#DF517A", usage: "The Bloom, focus rings, active dots, scribbles" },
  { name: "Pink deep", token: "pink-deep", hex: "#CF3563", usage: "Footer links, FAQ answers (white text passes AA)" },
  { name: "Pink soft", token: "pink-soft", hex: "#F8C8D6", usage: "Marker highlight on the home title" },
  { name: "Cream", token: "cream", hex: "#f6eedb", usage: "Paper labels" },
  { name: "Cream ink", token: "cream-ink", hex: "#4a3826", usage: "Handwriting on paper" },
];
const statuses = [
  { name: "Success", token: "success", hex: "#26784a", usage: "Saved, sent, available" },
  { name: "Warning", token: "warning", hex: "#9e5c0b", usage: "Needs attention, not blocking" },
  { name: "Error", token: "error", hex: "#c8402c", usage: "Failed actions, invalid fields" },
];

const radii = [
  { value: "2px", usage: "Book spines on About" },
  { value: "4px", usage: "Focus outlines on text links" },
  { value: "6px", usage: "Small icon buttons, the tail of a chat bubble" },
  { value: "10px", usage: "Sketch windows, clips, videos" },
  { value: "14px", usage: "Carousels, the ASCII card" },
  { value: "16px", usage: "Project window" },
  { value: "18px", usage: "Chat bubbles, the folder" },
  { value: "999px", usage: "Pills, dots, avatars" },
];

const durations = [
  { ms: 120, name: "Instant", usage: "Window close icon" },
  { ms: 150, name: "Micro", usage: "Hover colors, pill lift, underlines" },
  { ms: 200, name: "Standard", usage: "Carousel dots and hints, FAQ question" },
  { ms: 250, name: "Expand", usage: "Project window opening, clip progress" },
  { ms: 350, name: "Playful", usage: "Photo cards lifting on About" },
  { ms: 420, name: "Spring", usage: "FAQ answer popping in (Rare UI timing)" },
  { ms: 500, name: "Delight", usage: "Bloom spin" },
  { ms: 700, name: "Draw", usage: "Marker sweep, scribble underline" },
];

const shadows = [
  { name: "Hairline", value: "0 1px 2px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.03)", usage: "Open FAQ question" },
  { name: "Raised", value: "0 6px 18px rgba(30,40,50,.08), 0 1px 3px rgba(30,40,50,.06)", usage: "Pill buttons" },
  { name: "Floating", value: "0 4px 14px rgba(30,40,50,.12), 0 1px 3px rgba(30,40,50,.08)", usage: "Carousel arrows" },
  { name: "Window", value: "0 1px 2px rgba(0,0,0,.04), 0 16px 40px -20px rgba(0,0,0,.2)", usage: "Sketch windows" },
  { name: "Modal", value: "0 40px 90px rgba(20,20,30,.28), 0 8px 24px rgba(20,20,30,.12)", usage: "Project window" },
  { name: "Paper", value: "drop-shadow", filter: "drop-shadow(0 1px 1px rgba(60,40,20,.2)) drop-shadow(0 6px 10px rgba(60,40,20,.14))", usage: "Labels, stamps, stickers" },
];

const gaps = [4, 6, 8, 12, 16, 24, 32, 48, 72, 88];
const widths = [
  { px: 760, usage: "Text column: intros, the FAQ" },
  { px: 880, usage: "Work projects" },
  { px: 1024, usage: "Home" },
  { px: 1100, usage: "About collage" },
  { px: 1180, usage: "Project window" },
  { px: 1240, usage: "Page shell (30px sides, 18px on phones)" },
];

const typeScale = [
  { name: "Display", sample: "Design System", css: "400 44px/1.12 Averia Serif Libre", className: "ds-type--display", usage: "Page titles · 30px on phones" },
  { name: "Title", sample: "Daywell", css: "400 32px/1.1 Averia Serif Libre", className: "ds-type--title", usage: "Project window, footer links" },
  { name: "Heading", sample: "Whether", css: "600 22px/1.3 Segoe UI", className: "ds-type--heading", usage: "Work project names" },
  { name: "Lead", sample: "I’m focused on practical, user-centered interfaces.", css: "400 18px/1.65 Segoe UI", className: "ds-type--lead", usage: "Page intros" },
  { name: "Body", sample: "A time-off tool for small teams.", css: "400 16px/1.6 Segoe UI", className: "ds-type--body", usage: "Descriptions" },
  { name: "UI", sample: "What tools do you use?", css: "400 15px/1.4 Segoe UI, −0.01em", className: "ds-type--ui", usage: "Bubbles, links, captions" },
  { name: "Label", sample: "HOME   ABOUT   WORK", css: "600 13px Segoe UI, 0.06em, uppercase", className: "ds-type--label", usage: "Header nav" },
  { name: "Code", sample: "roles-permissions.tsx", css: "400 11px monospace, 0.02em", className: "ds-type--code", usage: "File names, domains" },
];

export default function DesignSystem() {
  return <main><div className="page-shell"><Header />
    <div className="ds-layout">
      <aside className="ds-aside"><RailToc items={toc} /></aside>

      <article className="ds-content">
        <header className="ds-hero" id="overview">
          <h1>Design System</h1>
          <p className="ds-hero__sub">Rocío Espinosa’s portfolio</p>
          <p className="ds-intro">The colors, type, spacing, motion and components behind this site. Every specimen here uses the site’s own styles, so it changes when they do.</p>
          <dl className="ds-legend">
            <div><dt><TagChip tag="core" /></dt><dd>Used across the site</dd></div>
            <div><dt><TagChip tag="one-off" /></dt><dd>Used once, on purpose</dd></div>
            <div><dt><TagChip tag="proposed" /></dt><dd>Designed to fit, not live yet</dd></div>
          </dl>
        </header>

        <Section id="color" title="Color" intro="Warm neutrals carry the site; one pink does all the pointing. Click a swatch to copy it.">
          <Sub id="primary" title="Primary" tag="core" note="Slightly warm grays, so the page reads like paper rather than a screen.">
            <ul className="ds-swatches">{neutrals.map((c) => <Swatch key={c.token} {...c} />)}</ul>
          </Sub>
          <Sub id="accent" title="Accent" tag="core" note="Pink marks what you can act on or where you are. Cream belongs to paper.">
            <ul className="ds-swatches">{accents.map((c) => <Swatch key={c.token} {...c} />)}</ul>
          </Sub>
          <Sub id="status" title="Status" tag="proposed" note="The site doesn’t need them yet. Each passes AA on white, and red leans orange so it never reads as the brand pink.">
            <ul className="ds-swatches">{statuses.map((c) => <Swatch key={c.token} {...c} />)}</ul>
            <div className="ds-row">
              <span className="ds-status ds-status--success"><i />Message sent</span>
              <span className="ds-status ds-status--warning"><i />Link expires soon</span>
              <span className="ds-status ds-status--error"><i />Couldn’t send</span>
            </div>
          </Sub>
        </Section>

        <Section id="components" title="Components" intro="Small set, used everywhere.">
          <Sub id="buttons" title="Buttons" tag="core">
            <div className="ds-grid">
              <Specimen label="Pill · white, raised"><a className="pill-button" href="#buttons"><MailIcon gradientId="ds-mail" />E-mail</a></Specimen>
              <Specimen label="Pill · dark"><a className="pw__link" href="#buttons">Try the prototype <span aria-hidden="true">↗</span></a></Specimen>
              <Specimen label="Text link · scribble on hover"><a className="ds-text-link" href="#buttons"><ScribbleText>Read the case study</ScribbleText> <span aria-hidden="true">↗</span></a></Specimen>
              <Specimen label="Icon · round, floating">
                <button type="button" className="media-carousel__arrow ds-static" aria-label="Next"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg></button>
              </Specimen>
              <Specimen label="Icon · small, quiet">
                <a className="sketch-window__open" href="#buttons" aria-label="Open full screen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg></a>
              </Specimen>
              <Specimen label="Chat question" tag="one-off"><button type="button" className="about-faq__question">What tools do you use?</button></Specimen>
            </div>
          </Sub>

          <Sub id="cards" title="Cards" tag="core">
            <div className="ds-grid">
              <Specimen label="Stamp photo">
                <figure className="about-card ds-card-stamp"><div className="about-stamp__paper"><img src="/media/about/leia.jpg" alt="Leia, a tabby and white cat" /><figcaption>My cat Leia</figcaption></div></figure>
              </Specimen>
              <Specimen label="Book" tag="one-off">
                <figure className="about-card ds-card-book"><div className="about-book"><img src="/media/about/the-aleph.jpg" alt="Cover of The Aleph by Jorge Luis Borges" /></div></figure>
              </Specimen>
              <Specimen label="Sketch window" wide>
                <div className="sketch-window ds-window">
                  <div className="sketch-window__bar"><span className="sketch-window__dots" aria-hidden="true"><i /><i /><i /></span><span className="sketch-window__file">ascii-card.tsx</span><span /></div>
                  <div className="sketch-window__body ds-window__body"><Bloom className="ds-window__bloom" /></div>
                </div>
              </Specimen>
            </div>
          </Sub>

          <Sub id="dividers" title="Dividers" tag="proposed" note="Borders already split the header and windows. These name them so new pages reuse them.">
            <div className="ds-dividers">
              <div><span>Hairline · 1px line</span><hr className="ds-hr" /></div>
              <div><span>Soft · 1px line soft, inside windows</span><hr className="ds-hr ds-hr--soft" /></div>
              <div><span>Dashed · upcoming, like the rail</span><hr className="ds-hr ds-hr--dashed" /></div>
              <div><span>Bloom · between big sections</span><div className="ds-hr-bloom"><Bloom /></div></div>
            </div>
          </Sub>

          <Sub id="inputs" title="Inputs" tag="proposed" note="Soft field like the chat bubbles, pink ring on focus.">
            <div className="ds-inputs">
              <label className="ds-field"><span>Default</span><input placeholder="Your email" /></label>
              <label className="ds-field"><span>Focus</span><input className="is-focus" placeholder="Your email" /></label>
              <label className="ds-field"><span>Filled</span><input defaultValue="hello@studio.com" /></label>
              <label className="ds-field"><span>Disabled</span><input disabled placeholder="Your email" /></label>
              <label className="ds-field ds-field--error"><span>Error</span><input defaultValue="hello@studio" aria-invalid="true" aria-describedby="ds-error" /><small id="ds-error">Add the end of the address, like .com</small></label>
              <label className="ds-field ds-field--area"><span>Message</span><textarea rows={3} placeholder="Tell me about the project" /></label>
            </div>
          </Sub>

          <Sub id="loaders" title="Loaders" tag="proposed" note="Brand-first: the Bloom turns, just like it does in the header.">
            <div className="ds-grid">
              <Specimen label="Bloom spinner"><span className="ds-loader-bloom" role="status" aria-label="Loading"><Bloom /></span></Specimen>
              <Specimen label="Dots"><span className="ds-loader-dots" role="status" aria-label="Loading"><i /><i /><i /></span></Specimen>
              <Specimen label="Skeleton"><span className="ds-skeleton" aria-hidden="true"><i /><i /><i /></span></Specimen>
            </div>
          </Sub>

          <Sub id="navigation" title="Navigation" tag="core">
            <div className="ds-grid">
              <Specimen label="Header tabs" wide>
                <div className="ds-nav-demo"><span>Home</span><span>About</span><span className="is-current">Work</span><span>Sketches</span></div>
              </Specimen>
              <Specimen label="Footer links · scribble">
                <nav className="ds-footer-links" aria-label="Example"><a href="#navigation"><ScribbleText>About</ScribbleText></a><a href="#navigation"><ScribbleText>Work</ScribbleText></a></nav>
              </Specimen>
              <Specimen label="Carousel dots">
                <div className="media-carousel__dots"><span className="media-carousel__dot" /><span className="media-carousel__dot" aria-current="true" /><span className="media-carousel__dot" /></div>
              </Specimen>
              <Specimen label="Rail · this sidebar" tag="one-off"><span className="ds-mini-rail"><i className="is-reached" /><b /><i /><i /></span></Specimen>
            </div>
          </Sub>

          <Sub id="pills" title="Pills" tag="core">
            <div className="ds-row">
              <span className="media-carousel__hint ds-static-hint">Expand</span>
              <span className="ds-pill">Product Designer</span>
              <span className="ds-pill ds-pill--pink">New</span>
              <TagChip tag="core" /><TagChip tag="one-off" /><TagChip tag="proposed" />
            </div>
          </Sub>
        </Section>

        <Section id="iconography" title="Iconography" intro="Three kinds, each with one job.">
          <div className="ds-grid">
            <Specimen label="Fluent Emoji · page titles, 44px">
              <span className="ds-icons"><img src="/media/work/pen.svg" alt="" /><img src="/media/work/hot-beverage.svg" alt="" /><img src="/media/sketches/pencil.svg" alt="" /><img src="/media/sketches/artist-palette.svg" alt="" /></span>
            </Specimen>
            <Specimen label="Gradient glyphs · in pill buttons, 24px">
              <span className="ds-icons ds-icons--glyph"><MailIcon gradientId="ds-mail-2" /><Bloom className="ds-icon-bloom" /></span>
            </Specimen>
            <Specimen label="Line · 16px, 1.8 stroke, round caps">
              <span className="ds-icons ds-icons--line">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h8M2 12h10" /></svg>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
              </span>
            </Specimen>
          </div>
        </Section>

        <Section id="borders" title="Borders">
          <Sub id="radius" title="Radius" tag="core" note="Small for tools, round for anything you tap, 18px when it should feel friendly.">
            <ul className="ds-radii">{radii.map((r) => <li key={r.value}><span style={{ borderRadius: r.value }} /><strong>{r.value}</strong><small>{r.usage}</small></li>)}</ul>
          </Sub>
          <Sub id="focus" title="Focus states" tag="core" note="2px pink outline, 2px away from the edge. Media gets it inset so it isn’t clipped.">
            <div className="ds-row">
              <a className="pill-button ds-focus" href="#focus" tabIndex={-1}><MailIcon gradientId="ds-mail-3" />E-mail</a>
              <span className="ds-focus-link">Read the case study</span>
              <span className="ds-focus-inset">Media</span>
            </div>
          </Sub>
          <Sub id="border-styles" title="Styles" tag="core">
            <ul className="ds-border-styles">
              <li><span className="ds-bs ds-bs--line" /><strong>1px line</strong><small>Header, sketch windows</small></li>
              <li><span className="ds-bs ds-bs--soft" /><strong>1px line soft</strong><small>Inside windows, clips</small></li>
              <li><span className="ds-bs ds-bs--edge" /><strong>1px black 8%</strong><small>Project window edge</small></li>
              <li><span className="ds-bs ds-bs--paper" /><strong>Torn paper</strong><small>Labels, masked edge</small></li>
            </ul>
          </Sub>
        </Section>

        <Section id="motion" title="Motion" intro="UI moves fast and stays under 300ms. The more often you see something, the less it moves. Delight is saved for rare moments.">
          <Sub id="animations" title="Animations" tag="core">
            <div className="ds-grid">
              <Specimen label="Bloom spin · hover it"><span className="ds-bloom-hover"><BloomLogo /></span></Specimen>
              <Specimen label="Scribble underline · hover it"><a className="ds-text-link" href="#animations"><ScribbleText>Hover me</ScribbleText></a></Specimen>
              <Specimen label="Marker sweep"><MarkerDemo /></Specimen>
              <Specimen label="Chat send · spring"><SendDemo /></Specimen>
              <Specimen label="Window open"><WindowDemo /></Specimen>
              <Specimen label="Breeze · ambient loop"><span className="ifg-label ds-breeze"><span>Some of my work</span></span></Specimen>
            </div>
          </Sub>
          <Sub id="durations" title="Duration scale" tag="core">
            <ul className="ds-durations">
              {durations.map((d) => (
                <li key={d.ms}>
                  <span className="ds-durations__name">{d.name}<small>{d.usage}</small></span>
                  <span className="ds-durations__bar"><i style={{ width: `${(d.ms / 700) * 100}%` }} /></span>
                  <code>{d.ms}ms</code>
                </li>
              ))}
            </ul>
            <ul className="ds-easings">
              <li><code>cubic-bezier(.2,.8,.2,1)</code><span>Standard: quick out, soft landing</span></li>
              <li><code>cubic-bezier(.34,1.4,.64,1)</code><span>Overshoot: the Bloom spin</span></li>
              <li><code>cubic-bezier(.65,0,.25,1)</code><span>Draw: marker and scribble</span></li>
              <li><code>spring 0.42s, bounce 0.28</code><span>Send: chat answers</span></li>
            </ul>
          </Sub>
        </Section>

        <Section id="shadows" title="Shadows" intro="Soft and a little cool, so white surfaces lift off the warm page.">
          <ul className="ds-shadows">
            {shadows.map((s) => (
              <li key={s.name}>
                <span className="ds-shadows__tile" style={s.filter ? { filter: s.filter } : { boxShadow: s.value }} />
                <strong>{s.name}</strong>
                <small>{s.usage}</small>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="spacing" title="Spacing">
          <Sub id="gaps" title="Gap scale" tag="core" note="Mostly multiples of 4, with 6 and 14 for tight UI.">
            <ul className="ds-gaps">{gaps.map((g) => <li key={g}><span style={{ width: g }} /><code>{g}</code></li>)}</ul>
          </Sub>
          <Sub id="widths" title="Layout widths" tag="core" note="Phones switch to one column at 700px.">
            <ul className="ds-widths">{widths.map((w) => <li key={w.px}><span style={{ width: `${(w.px / 1240) * 100}%` }}><code>{w.px}</code></span><small>{w.usage}</small></li>)}</ul>
          </Sub>
        </Section>

        <Section id="typography" title="Typography">
          <Sub id="families" title="Families" tag="core">
            <div className="ds-families">
              <div><span className="ds-families__aa ds-type--display">Aa</span><strong>Averia Serif Libre</strong><small>Titles. Soft, a little handmade.</small></div>
              <div><span className="ds-families__aa ds-type--sans">Aa</span><strong>Segoe UI · system</strong><small>Everything you read and tap.</small></div>
              <div><span className="ds-families__aa ds-type--hand">Aa</span><strong>Playwrite IT Trad</strong><small>Only on paper labels.</small></div>
              <div><span className="ds-families__aa ds-type--mono">Aa</span><strong>Monospace</strong><small>File names and domains.</small></div>
            </div>
          </Sub>
          <Sub id="type-properties" title="Properties" tag="core">
            <ul className="ds-typescale">
              {typeScale.map((t) => (
                <li key={t.name}>
                  <span className={`ds-typescale__sample ${t.className}`}>{t.sample}</span>
                  <span className="ds-typescale__meta"><strong>{t.name}</strong><code>{t.css}</code><small>{t.usage}</small></span>
                </li>
              ))}
            </ul>
          </Sub>
        </Section>

        <Section id="materials" title="Materials" intro="Surfaces that feel like things: paper you could peel off, glass you could tap.">
          <div className="ds-grid">
            <Specimen label="Cream paper · grain, fibers, torn edge"><span className="paper-note ds-paper"><span>Under construction</span></span></Specimen>
            <Specimen label="Stamp paper · scalloped edge"><span className="ds-stamp"><span className="about-stamp__paper"><span>Me</span></span></span></Specimen>
            <Specimen label="Frosted glass · blur 18px"><span className="ds-glass"><i /><i /><b>Glass</b></span></Specimen>
            <Specimen label="Glass avatar"><span className="about-faq__avatar"><Bloom /></span></Specimen>
            <Specimen label="Window chrome"><span className="ds-chrome"><i /><i /><i /></span></Specimen>
            <Specimen label="Marker highlight"><span className="framer-bio-title ds-marker-static"><mark className="marker">highlight</mark></span></Specimen>
          </div>
        </Section>
      </article>
    </div>
    <Footer />
  </div></main>;
}

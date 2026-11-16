import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer, Header } from "../components";
import { FlowerLogo } from "../../components/ui/bloom-logo";
import { FrameFlower } from "../../components/ui/frame-flower";
import { FloralCorner, FloralDivider, FloralFrame } from "../../components/ui/floral-frame";
import { LaceCloth } from "../../components/ui/lace-cloth";
import { VineNav } from "../../components/ui/vine-nav";
import { SendDemo, Swatch, WindowDemo } from "./demos";
import { MobileToc, RailToc, type TocItem } from "./rail-toc";
import "../../components/ui/media-carousel.css";
import "../../components/ui/project-window.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "Design System — Rocío Espinosa",
  description: "The colors, type, illustration, spacing, motion and components behind Rocío Espinosa's portfolio.",
};

type Tag = "core" | "one-off" | "proposed";
const TAG_LABEL: Record<Tag, string> = { core: "Core", "one-off": "One-off", proposed: "Proposed" };

// The sidebar and the page are built from this one outline
const toc: TocItem[] = [
  { id: "color", label: "Color" },
  { id: "primary", label: "Primary", depth: 1 },
  { id: "accent", label: "Accent", depth: 1 },
  { id: "status", label: "Status", depth: 1 },
  { id: "illustration", label: "Illustration" },
  { id: "palette", label: "Palette", depth: 1 },
  { id: "hand-drawn", label: "Hand-drawn style", depth: 1 },
  { id: "ornaments", label: "Ornaments", depth: 1 },
  { id: "frames", label: "Frames", depth: 1 },
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

const neutrals = [
  { name: "Ink", token: "ink", hex: "#181818", usage: "Headings, the signature" },
  { name: "Text", token: "text", hex: "#2b2b2b", usage: "Body copy, captions, button labels" },
  { name: "Muted", token: "muted", hex: "#6b6b6b", usage: "Secondary text, labels, footer (4.7:1 on paper)" },
  { name: "Line strong", token: "line-strong", hex: "#d6cab5", usage: "Dots, window lights, selected outlines" },
  { name: "Line", token: "line", hex: "#e2d9c8", usage: "Window borders" },
  { name: "Line soft", token: "line-soft", hex: "#eae2d3", usage: "Dividers inside windows, clip borders" },
  { name: "Soft strong", token: "soft-strong", hex: "#e6dcc8", usage: "Hover on soft surfaces" },
  { name: "Soft", token: "soft", hex: "#eee6d6", usage: "FAQ questions, media and stage backgrounds" },
  { name: "Paper", token: "paper", hex: "#F6F0E4", usage: "Page background, the cream of the About frame" },
  { name: "Surface", token: "surface", hex: "#ffffff", usage: "Windows, open bubbles" },
];
const accents = [
  { name: "Accent", token: "accent", hex: "#BF6806", usage: "Focus rings, active dots (3:1 on paper, soft and white)" },
  { name: "Accent deep", token: "accent-deep", hex: "#A35408", usage: "Fills behind white text (passes AA)" },
  { name: "Accent bright", token: "accent-bright", hex: "#FAA532", usage: "Flowers, cursor sprinkles, FAQ answers (dark text, 7.9:1)" },
  { name: "Accent soft", token: "accent-soft", hex: "#FDE3BC", usage: "Soft highlights" },
  { name: "Cloth ink", hex: "#4a3f35", usage: "Titles and text on the cloth and the About frame" },
  { name: "Linen", hex: "#EFE8DB", usage: "The home cloth" },
];
const statuses = [
  { name: "Success", token: "success", hex: "#26784a", usage: "Saved, sent, available" },
  { name: "Warning", token: "warning", hex: "#9e5c0b", usage: "Needs attention, not blocking" },
  { name: "Error", token: "error", hex: "#c8402c", usage: "Failed actions, invalid fields" },
];
// The inks and washes every illustration is painted with
const illustration = [
  { name: "Sepia ink", hex: "#5E4A2E", usage: "Outlines, veins, hatching, stems" },
  { name: "Leaf wash", hex: "#93A36E", usage: "Leaves, from #CBD6A4 into #879A5C" },
  { name: "Leaf shade", hex: "#64774A", usage: "Darker leaves, from #AEBC83" },
  { name: "Petal", hex: "#FAA532", usage: "Petal tips and roses, washing in from #FFF1D6" },
  { name: "Stamen", hex: "#8E4E14", usage: "Flower centres, berries" },
  { name: "Vine brown", hex: "#6F5339", usage: "The header vine" },
  { name: "Thread", hex: "#FFFDF8", usage: "Lace, with a soft brown shadow" },
];

const radii = [
  { value: "2px", usage: "Book spines, the floral frame" },
  { value: "4px", usage: "Focus outlines on text links, index rows" },
  { value: "6px", usage: "Small icon buttons, the tail of a chat bubble" },
  { value: "10px", usage: "Sketch windows, clips, videos" },
  { value: "14px", usage: "Carousels, the ASCII card" },
  { value: "16px", usage: "Project window" },
  { value: "18px", usage: "Chat bubbles" },
  { value: "999px", usage: "Pills, dots, avatars" },
];

// Three tiers carry all UI motion (--dur-* in CSS, spring.* in motion.ts); the rest are named one-offs
const durations = [
  { ms: 125, exit: 90, name: "Fast", token: "--dur-fast", usage: "Hover, focus, color changes, the gliding highlight" },
  { ms: 200, exit: 150, name: "Moderate", token: "--dur-moderate", usage: "Short travel: index arrows, vine links fading in" },
  { ms: 275, exit: 200, name: "Slow", token: "--dur-slow", usage: "Large surfaces and the vine's leaves swinging aside" },
  { ms: 420, name: "Send", usage: "FAQ answer popping in (Rare UI timing)" },
  { ms: 500, name: "Flower", usage: "The logo spin" },
];

const shadows = [
  { name: "Hairline", value: "0 1px 2px rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.03)", usage: "Open FAQ question" },
  { name: "Floating", value: "0 4px 14px rgba(30,40,50,.12), 0 1px 3px rgba(30,40,50,.08)", usage: "Carousel arrows" },
  { name: "Window", value: "0 1px 2px rgba(0,0,0,.04), 0 16px 40px -20px rgba(0,0,0,.2)", usage: "Sketch windows" },
  { name: "Modal", value: "0 40px 90px rgba(20,20,30,.28), 0 8px 24px rgba(20,20,30,.12)", usage: "Project window" },
  { name: "Cloth", value: "drop-shadow", filter: "drop-shadow(0 1px 1px rgba(90,70,45,.16)) drop-shadow(0 10px 22px rgba(90,70,45,.1))", usage: "Lace cloth" },
  { name: "Paper", value: "drop-shadow", filter: "drop-shadow(0 1px 1px rgba(60,40,20,.2)) drop-shadow(0 6px 10px rgba(60,40,20,.14))", usage: "Stamps, stickers" },
];

const gaps = [4, 6, 8, 12, 16, 24, 32, 48, 72, 88];
const widths = [
  { px: 580, usage: "The home cloth" },
  { px: 760, usage: "Text column: intros, the FAQ" },
  { px: 820, usage: "The About frame" },
  { px: 880, usage: "Work projects" },
  { px: 1100, usage: "About collage" },
  { px: 1180, usage: "Project window" },
  { px: 1240, usage: "Page shell (30px sides, 18px on phones)" },
];

const typeScale = [
  { name: "Page title", sample: "Welcome to my portfolio", css: "italic 40–48px/1.1 EB Garamond", className: "ds-type--cloth-title", usage: "Every page title: Home, About, Work, Sketches · scales down on phones" },
  { name: "Title", sample: "Bits and pieces", css: "--text-title · 32px/1.1 Averia Serif Libre", className: "ds-type--title", usage: "Section titles, project window · 26px on phones" },
  { name: "Heading", sample: "Whether", css: "--text-heading · 600 22px/1.3 Segoe UI", className: "ds-type--heading", usage: "Work project names" },
  { name: "Cloth text", sample: "A designer, maker and curious mind.", css: "19px/1.6 EB Garamond", className: "ds-type--cloth", usage: "Text on the cloth and in the About frame · 17px on phones" },
  { name: "Lead", sample: "Here are some sketches.", css: "--text-lead · 18px/1.65 Segoe UI", className: "ds-type--lead", usage: "Page intros on Work and Sketches" },
  { name: "Body", sample: "A time-off tool for small teams.", css: "--text-body · 16px/1.6 Segoe UI", className: "ds-type--body", usage: "Descriptions" },
  { name: "UI", sample: "What tools do you use?", css: "--text-ui · 15px/1.4 Segoe UI, −0.01em", className: "ds-type--ui", usage: "Bubbles, links, captions" },
  { name: "Small caps", sample: "LINKEDIN   RESUME   E-MAIL", css: "13px EB Garamond, 0.16em, uppercase", className: "ds-type--smallcaps", usage: "Contact links, index heads, the location line" },
  { name: "Small", sample: "Role  Product Designer", css: "--text-small · 14px/1.4 Segoe UI", className: "ds-type--small", usage: "Sidebars, facts, footer" },
  { name: "Caption", sample: "Core", css: "--text-caption · 500 12px Segoe UI", className: "ds-type--caption", usage: "Tags, small buttons, code values" },
  { name: "Code", sample: "roles-permissions.tsx", css: "--text-micro · 11px monospace, 0.02em", className: "ds-type--code", usage: "File names, domains" },
];

const handDrawn = [
  { rule: "Ink", detail: "Sepia lines, 0.4–0.65px, nudged by a soft noise field so they waver like a pen" },
  { rule: "Wash", detail: "Gradient fills with uneven pigment and a darker rim where watercolour pools" },
  { rule: "Hatching", detail: "Short parallel strokes on the shaded half of every leaf and under each rose" },
  { rule: "Irregular", detail: "Toothed and lobed leaf edges, tilted petals; the same every load (seeded by position)" },
  { rule: "In code", detail: "Drawn as SVG to the real size, so it stays sharp and frames fit any text" },
];

export default function DesignSystem() {
  return <div className="page-shell"><Header />
    <main>
    <div className="ds-layout">
      <aside className="ds-aside"><RailToc items={toc} /></aside>

      <article className="ds-content">
        <MobileToc items={toc} />
        <header className="ds-hero" id="overview">
          <h1>Design System</h1>
          <p className="ds-hero__sub">Rocío Espinosa’s portfolio</p>
          <p className="ds-intro">The colors, type, illustration, spacing, motion and components behind this site. Every specimen here uses the site’s own styles, so it changes when they do.</p>
          <dl className="ds-legend">
            <div><dt><TagChip tag="core" /></dt><dd>Used across the site</dd></div>
            <div><dt><TagChip tag="one-off" /></dt><dd>Used once, on purpose</dd></div>
            <div><dt><TagChip tag="proposed" /></dt><dd>Designed to fit, not live yet</dd></div>
          </dl>
        </header>

        <Section id="color" title="Color" intro="Warm cream carries the site, like an old printed page; one orange does all the pointing. Click a swatch to copy it.">
          <Sub id="primary" title="Primary" tag="core" note="Warm neutrals, so the page reads like paper rather than a screen.">
            <ul className="ds-swatches">{neutrals.map((c) => <Swatch key={c.token} {...c} />)}</ul>
          </Sub>
          <Sub id="accent" title="Accent" tag="core" note="Orange marks what you can act on or where you are. The bright orange is for flowers and fills; text and rings use the deeper ones so they stay readable.">
            <ul className="ds-swatches">{accents.map((c) => <Swatch key={c.name} {...c} />)}</ul>
          </Sub>
          <Sub id="status" title="Status" tag="proposed" note="The site doesn’t need them yet. Each passes AA on white.">
            <ul className="ds-swatches">{statuses.map((c) => <Swatch key={c.token} {...c} />)}</ul>
            <div className="ds-row">
              <span className="ds-status ds-status--success"><i />Message sent</span>
              <span className="ds-status ds-status--warning"><i />Link expires soon</span>
              <span className="ds-status ds-status--error"><i />Couldn’t send</span>
            </div>
          </Sub>
        </Section>

        <Section id="illustration" title="Illustration" intro="Botanical ornaments in the style of hand-coloured Victorian engravings: sepia ink over watercolour, in sage and orange. They frame content and never carry meaning on their own, so they’re hidden from screen readers.">
          <Sub id="palette" title="Palette" tag="core">
            <ul className="ds-swatches">{illustration.map((c) => <Swatch key={c.name} {...c} />)}</ul>
          </Sub>
          <Sub id="hand-drawn" title="Hand-drawn style" tag="core" note="Shared by every illustration (components/ui/hand-drawn.tsx): colour goes down first as a wash, then the ink on top, layer by layer.">
            <ul className="ds-easings">{handDrawn.map((h) => <li key={h.rule}><code>{h.rule}</code><span>{h.detail}</span></li>)}</ul>
          </Sub>
          <Sub id="ornaments" title="Ornaments" tag="core">
            <div className="ds-grid">
              <Specimen label="Floral divider · above the home title" wide><span className="ds-ornament ds-ornament--divider"><FloralDivider /></span></Specimen>
              <Specimen label="Corner spray · Work and Sketches"><span className="ds-ornament ds-ornament--corner"><FloralCorner /></span></Specimen>
              <Specimen label="Flower · the site mark"><span className="ds-ornament ds-ornament--flower"><FrameFlower /></span></Specimen>
              <Specimen label="Drop cap · made with INITIĀLIS" tag="one-off"><img className="ds-ornament--initial" src="/media/about/initial-i.png" alt="An illuminated letter I with vines and flowers" /></Specimen>
            </div>
          </Sub>
          <Sub id="frames" title="Frames" tag="core" note="Both are measured and drawn to their real size, so the scallops and vines always fit the text inside.">
            <div className="ds-grid ds-grid--frames">
              <Specimen label="Lace cloth · needle lace on linen, home">
                <LaceCloth className="ds-lace-demo"><p className="ds-frame-text">Welcome</p></LaceCloth>
              </Specimen>
              <Specimen label="Floral frame · About">
                <FloralFrame className="ds-frame-demo"><p className="ds-frame-text">About me</p></FloralFrame>
              </Specimen>
            </div>
          </Sub>
        </Section>

        <Section id="components" title="Components" intro="Small set, used everywhere.">
          <Sub id="buttons" title="Buttons" tag="core">
            <div className="ds-grid">
              <Specimen label="Pill · dark"><a className="pw__link" href="#buttons">Try the prototype <span aria-hidden="true">↗</span></a></Specimen>
              <Specimen label="Text link"><a className="ds-text-link" href="#buttons">Read the case study <span aria-hidden="true">↗</span></a></Specimen>
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
                  <div className="sketch-window__body ds-window__body"><FrameFlower className="ds-window__flower" /></div>
                </div>
              </Specimen>
            </div>
          </Sub>

          <Sub id="dividers" title="Dividers" tag="core" note="The floral divider opens a page; quiet lines split things inside it.">
            <div className="ds-dividers">
              <div><span>Floral · opens a page, under its frame</span><span className="ds-ornament ds-ornament--divider ds-ornament--small"><FloralDivider /></span></div>
              <div><span>Dashed · between index rows</span><hr className="ds-hr ds-hr--dashed" /></div>
              <div><span>Hairline · 1px line</span><hr className="ds-hr" /></div>
              <div><span>Soft · 1px line soft, inside windows</span><hr className="ds-hr ds-hr--soft" /></div>
            </div>
          </Sub>

          <Sub id="inputs" title="Inputs" tag="proposed" note="Soft field like the chat bubbles, orange ring on focus.">
            <div className="ds-inputs">
              <label className="ds-field"><span>Default</span><input placeholder="Your email" /></label>
              <label className="ds-field"><span>Focus</span><input className="is-focus" placeholder="Your email" /></label>
              <label className="ds-field"><span>Filled</span><input defaultValue="hello@studio.com" /></label>
              <label className="ds-field"><span>Disabled</span><input disabled placeholder="Your email" /></label>
              <label className="ds-field ds-field--error"><span>Error</span><input defaultValue="hello@studio" aria-invalid="true" aria-describedby="ds-error" /><small id="ds-error">Add the end of the address, like .com</small></label>
              <label className="ds-field ds-field--area"><span>Message</span><textarea rows={3} placeholder="Tell me about the project" /></label>
            </div>
          </Sub>

          <Sub id="loaders" title="Loaders" tag="proposed" note="Brand-first: the flower turns, just like it does in the header.">
            <div className="ds-grid">
              <Specimen label="Flower spinner"><span className="ds-loader-bloom" role="status" aria-label="Loading"><FrameFlower /></span></Specimen>
              <Specimen label="Dots"><span className="ds-loader-dots" role="status" aria-label="Loading"><i /><i /><i /></span></Specimen>
              <Specimen label="Skeleton"><span className="ds-skeleton" aria-hidden="true"><i /><i /><i /></span></Specimen>
            </div>
          </Sub>

          <Sub id="navigation" title="Navigation" tag="core" note="Home has no header nav: the cloth’s index lists the pages. Every other page has the vine in the header (top right): hover it and the leaves swing aside to show the links; on phones a tap opens a small linen card.">
            <div className="ds-grid">
              <Specimen label="Page index · on the home cloth" wide>
                <nav className="home-cloth__index ds-index" aria-label="Example">
                  <div className="home-cloth__head" aria-hidden="true"><span>N°</span><span>Page</span></div>
                  <ol>
                    <li><a href="#navigation" className="home-cloth__row"><span className="home-cloth__num">01</span><span className="home-cloth__label">About me</span><span className="home-cloth__arrow" aria-hidden="true">→</span></a></li>
                    <li><a href="#navigation" className="home-cloth__row"><span className="home-cloth__num">02</span><span className="home-cloth__label">My work</span><span className="home-cloth__arrow" aria-hidden="true">→</span></a></li>
                  </ol>
                </nav>
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
              <span className="ds-pill ds-pill--accent">New</span>
              <TagChip tag="core" /><TagChip tag="one-off" /><TagChip tag="proposed" />
            </div>
          </Sub>
        </Section>

        <Section id="iconography" title="Iconography" intro="Two kinds, each with one job.">
          <div className="ds-grid">
            <Specimen label="Flower · logo, FAQ avatar, loaders">
              <span className="ds-icons ds-icons--flower"><FrameFlower /><FrameFlower /><FrameFlower /></span>
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
          <Sub id="focus" title="Focus states" tag="core" note="2px orange outline (#BF6806), 2px away from the edge, at least 3:1 on every surface. On orange answer bubbles links ring in dark brown instead. Media gets it inset so it isn’t clipped.">
            <div className="ds-row">
              <span className="ds-focus-link">Read the case study</span>
              <span className="ds-focus-inset">Media</span>
            </div>
          </Sub>
          <Sub id="border-styles" title="Styles" tag="core">
            <ul className="ds-border-styles">
              <li><span className="ds-bs ds-bs--line" /><strong>1px line</strong><small>Sketch windows</small></li>
              <li><span className="ds-bs ds-bs--soft" /><strong>1px line soft</strong><small>Inside windows, clips</small></li>
              <li><span className="ds-bs ds-bs--edge" /><strong>1px black 8%</strong><small>Project window edge</small></li>
              <li><span className="ds-bs ds-bs--stitch" /><strong>Running stitch</strong><small>Dashed seam on the linen</small></li>
            </ul>
          </Sub>
        </Section>

        <Section id="motion" title="Motion" intro="Three speeds carry all UI motion, all under 300ms: the bigger the thing that moves, the slower the tier, and exits are one step quicker than entrances. The more often you see something, the less it moves; delight is saved for rare moments.">
          <Sub id="animations" title="Animations" tag="core">
            <div className="ds-grid">
              <Specimen label="Flower spin · hover it"><span className="ds-bloom-hover"><FlowerLogo /></span></Specimen>
              <Specimen label="Chat send · spring"><SendDemo /></Specimen>
              <Specimen label="Window open"><WindowDemo /></Specimen>
              <Specimen label="Vine · hover it: the leaves swing aside and the pages appear" wide><div className="vine-demo"><VineNav label="Example navigation" /></div></Specimen>
            </div>
          </Sub>
          <Sub id="durations" title="Duration scale" tag="core">
            <ul className="ds-durations">
              {durations.map((d) => (
                <li key={d.ms}>
                  <span className="ds-durations__name">{d.name}{d.token && <code className="ds-durations__token">{d.token}{d.exit && ` · exit ${d.exit}ms`}</code>}<small>{d.usage}</small></span>
                  <span className="ds-durations__bar"><i style={{ width: `${(d.ms / 500) * 100}%` }} /></span>
                  <code>{d.ms}ms</code>
                </li>
              ))}
            </ul>
            <ul className="ds-easings">
              <li><code>cubic-bezier(.2,.8,.2,1)</code><span>Standard (--ease): quick out, soft landing</span></li>
              <li><code>cubic-bezier(.4,0,1,1)</code><span>Exit (--ease-exit): speeds up as it leaves</span></li>
              <li><code>cubic-bezier(.34,1.4,.64,1)</code><span>Overshoot: the flower spin, the vine’s leaves</span></li>
              <li><code>spring 0.42s, bounce 0.28</code><span>Send: chat answers</span></li>
            </ul>
          </Sub>
        </Section>

        <Section id="shadows" title="Shadows" intro="Soft and warm, so paper and cloth lift off the cream page.">
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
              <div><span className="ds-families__aa ds-type--garamond">Aa</span><strong>EB Garamond</strong><small>Page titles in italic; text on the cloth and in the About frame.</small></div>
              <div><span className="ds-families__aa ds-type--display">Aa</span><strong>Averia Serif Libre</strong><small>Section titles: FAQ, Bits and pieces, the project window.</small></div>
              <div><span className="ds-families__aa ds-type--sans">Aa</span><strong>Segoe UI · system</strong><small>Interface text: bubbles, windows, intros.</small></div>
              <div><span className="ds-families__aa ds-type--mono">Aa</span><strong>Monospace</strong><small>File names and domains.</small></div>
            </div>
            <p className="ds-note">The footer signature is drawn with Custom-Script, a single-stroke pen font (SIL Open Font License), so it can write itself in.</p>
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

        <Section id="materials" title="Materials" intro="Surfaces that feel like things: linen and lace you could touch, paper you could peel off.">
          <div className="ds-grid">
            <Specimen label="Linen · fine weave"><span className="ds-linen" /></Specimen>
            <Specimen label="Stamp paper · scalloped edge"><span className="ds-stamp"><span className="about-stamp__paper"><span>Me</span></span></span></Specimen>
            <Specimen label="Glass avatar"><span className="about-faq__avatar"><FrameFlower /></span></Specimen>
            <Specimen label="Window chrome"><span className="ds-chrome"><i /><i /><i /></span></Specimen>
          </div>
        </Section>
      </article>
    </div>
    </main>
    <Footer />
  </div>;
}

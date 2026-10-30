import type { Metadata } from "next";
import { Footer, Header } from "../components";
import { SketchWindow, type Sketch } from "./sketch-window";

export const metadata: Metadata = {
  title: "Sketches — Rocío Espinosa",
  description: "Standalone components and concept experiments by Rocío Espinosa.",
};

// Newest first, two per row. `wide` makes a sketch span both columns.
// The card is drawn narrower so it fills its window, at the same proportions as the roles one.
const sketches: Sketch[] = [
  {
    file: "ascii-card.tsx",
    title: "ASCII card",
    href: "/sketches/card",
    embed: { src: "/sketches/card", width: 760, height: 687 },
  },
  {
    file: "roles-permissions.tsx",
    title: "Roles & permissions",
    href: "/sketches/roles-permissions",
    embed: { src: "/sketches/roles-permissions", width: 1040, height: 940 },
  },
];

export default function Sketches() {
  return <main><div className="page-shell"><Header />
    <section className="work-intro">
      <div className="paper-note"><span>Under construction</span></div>
      <h1><img src="/media/sketches/pencil.svg" alt="" /><span>Sketches</span><img src="/media/sketches/artist-palette.svg" alt="" /></h1>
      <p>Here are some sketches: standalone components and concept experiments I enjoyed creating. It’s my space for inspiration and discovery.</p>
    </section>
    <div className="sketches-grid">
      {sketches.map((sketch) => <SketchWindow key={sketch.file} sketch={sketch} />)}
    </div>
    <Footer />
  </div></main>;
}

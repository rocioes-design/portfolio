import type { Metadata } from "next";
import { Footer, Header } from "../components";
import { FloralCorner } from "../../components/ui/floral-frame";
import { SketchWindow, type Sketch } from "./sketch-window";

export const metadata: Metadata = {
  title: "Sketches — Rocío Espinosa",
  description: "Standalone components and concept experiments by Rocío Espinosa.",
};

// Newest first, two per row. `wide` makes a sketch span both columns.
// The card is drawn narrower so it fills its window, at the same proportions as the roles one.
const sketches: Sketch[] = [
  {
    file: "farm-toggle.tsx",
    title: "Farm toggle",
    href: "/sketches/farm-toggle",
    embed: { src: "/sketches/farm-toggle", width: 760, height: 687 },
  },
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
  return <div className="page-shell"><Header />
    <main className="has-corners">
    {/* Flowering sprays in the top corners, from the About page frame */}
    <FloralCorner className="page-corner page-corner--left" />
    <FloralCorner className="page-corner page-corner--right" />
    <section className="work-intro">
      <h1>Sketches</h1>
      <p>Here are some sketches: standalone components and concept experiments I enjoyed creating. It’s my space for inspiration and discovery.</p>
    </section>
    <div className="sketches-grid">
      {sketches.map((sketch) => <SketchWindow key={sketch.file} sketch={sketch} />)}
    </div>
    </main>
    <Footer />
  </div>;
}

import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import { SeedArchive, type Catalog } from "./archive";
import catalogs from "./catalogs.json";
import "./seeds.css";

// A wall of old seed catalog covers from the USDA's Henry G. Gilbert collection, via the Internet Archive.
// catalogs.json is a starter set: the most colorful covers from the big seed houses, 1880–1930,
// plus the Yokohama Nursery catalogs from the National Agricultural Library's Japanese exhibit.
export const metadata: Metadata = {
  title: "Seed catalogs, 1880–1930 — Rocío Espinosa",
  description: "A browsable wall of American seed catalog covers from 1880 to 1930.",
};

// Crimson Text throughout: italic for titles, regular for everything else.
const crimson = Crimson_Text({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-crimson" });

export default function SeedsPage() {
  return (
    <main className={`sc-page ${crimson.variable}`} data-no-magic-cursor>
      <SeedArchive catalogs={catalogs as Catalog[]} />
    </main>
  );
}

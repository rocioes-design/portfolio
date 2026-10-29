import type { Metadata } from "next";
import { Azeret_Mono, Montserrat } from "next/font/google";
import { AsciiCard } from "./card";
import "./card.css";

// A payment card that builds itself out of characters, then comes apart into its layers.
export const metadata: Metadata = {
  title: "ASCII card sketch — Rocío Espinosa",
  robots: { index: false, follow: false },
};

const mono = Azeret_Mono({ subsets: ["latin"], variable: "--font-card-mono" });
const sans = Montserrat({ subsets: ["latin"] });

export default function CardSketchPage() {
  return (
    <main className={`ca-page ${mono.variable}`} data-no-magic-cursor>
      <AsciiCard fonts={{ mono: mono.style.fontFamily, sans: sans.style.fontFamily }} />
    </main>
  );
}

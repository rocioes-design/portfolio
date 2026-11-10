import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import { FarmToggle } from "./toggle";
import "./farm.css";

// A day/night toggle with a pixel-art farm inside: slide the glass knob and the sun sets.
export const metadata: Metadata = {
  title: "Farm toggle sketch — Rocío Espinosa",
  robots: { index: false, follow: false },
};

const pixel = Pixelify_Sans({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-farm" });

export default function FarmToggleSketchPage() {
  return (
    <main className={pixel.variable} data-no-magic-cursor>
      <FarmToggle />
    </main>
  );
}

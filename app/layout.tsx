import type { Metadata } from "next";
import { Averia_Serif_Libre, Playwrite_IT_Trad } from "next/font/google";
import { MagicCursor } from "../components/ui/magic-cursor";
import "./globals.css";
import "./framer-home.css";

export const metadata: Metadata = {
  title: "Rocío Espinosa — Product Designer",
  description: "Portfolio of Rocío Espinosa, a designer building interfaces, experiences and systems in Buenos Aires.",
};

const averiaSerif = Averia_Serif_Libre({ weight: "400", subsets: ["latin"], variable: "--font-averia-serif" });
// Handwriting for the paper labels. The font has no subsets to pick, so it isn't preloaded.
const playwrite = Playwrite_IT_Trad({ variable: "--font-label", preload: false });
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${averiaSerif.variable} ${playwrite.variable}`}><body>{children}<MagicCursor /></body></html>;
}

import type { Metadata } from "next";
import { Averia_Serif_Libre, Caveat } from "next/font/google";
import "./globals.css";
import "./framer-home.css";

export const metadata: Metadata = {
  title: "Rocío Espinosa — Experience & Interface Designer",
  description: "Portfolio of Rocío Espinosa, a designer building interfaces, experiences and systems in Buenos Aires.",
};

const averiaSerif = Averia_Serif_Libre({ weight: "400", subsets: ["latin"], variable: "--font-averia-serif" });
const caveat = Caveat({ weight: "500", subsets: ["latin"], variable: "--font-caveat" });
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${averiaSerif.variable} ${caveat.variable}`}><body>{children}</body></html>;
}

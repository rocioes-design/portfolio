import type { Metadata } from "next";
import { Averia_Serif_Libre, EB_Garamond } from "next/font/google";
import { MagicCursor } from "../components/ui/magic-cursor";
import { MotionProvider } from "../components/ui/motion-provider";
import "./globals.css";
import "./framer-home.css";

export const metadata: Metadata = {
  title: "Rocío Espinosa — Product Designer",
  description: "Portfolio of Rocío Espinosa, a designer building interfaces, experiences and systems in Buenos Aires.",
};

const averiaSerif = Averia_Serif_Libre({ weight: "400", subsets: ["latin"], variable: "--font-averia-serif" });
// Classic serif for the lace cloth and the About frame (italic titles, regular text).
const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond" });
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${averiaSerif.variable} ${garamond.variable}`}><body><MotionProvider>{children}</MotionProvider><MagicCursor /></body></html>;
}

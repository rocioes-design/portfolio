import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DaywellPrototype } from "./prototype";
import "./daywell.css";

// Clickable prototype of Daywell, the time-off concept. Not linked from the nav yet,
// so it stays out of search results until the case study is live.
export const metadata: Metadata = {
  title: "Daywell prototype — Rocío Espinosa",
  robots: { index: false, follow: false },
};

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });

export default function DaywellPrototypePage() {
  return <div className={inter.variable}><DaywellPrototype /></div>;
}

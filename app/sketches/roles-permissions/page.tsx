import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RolesPrototype } from "./prototype";
import "./roles.css";

// Clickable sketch of the roles & permissions modal. Not linked from the nav yet,
// so it stays out of search results until the Sketches page is live.
export const metadata: Metadata = {
  title: "Roles & permissions sketch — Rocío Espinosa",
  robots: { index: false, follow: false },
};

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

export default function RolesPermissionsPage() {
  return <div className={inter.variable}><RolesPrototype /></div>;
}

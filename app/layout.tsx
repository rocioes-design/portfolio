import type { Metadata } from "next";
import "./globals.css";
import "./framer-home.css";

export const metadata: Metadata = {
  title: "Rocío Espinosa — Experience & Interface Designer",
  description: "Portfolio of Rocío Espinosa, a designer building interfaces, experiences and systems in Buenos Aires.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

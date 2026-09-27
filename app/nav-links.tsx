"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScribbleText } from "../components/ui/scribble-text";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/lab", label: "Work" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}><ScribbleText>{label}</ScribbleText></Link>
      ))}
    </nav>
  );
}

"use client";
import Link from "next/link";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ScribbleText } from "../components/ui/scribble-text";
import { FluidHoverHighlight, useFluidHover } from "../components/ui/fluid-hover";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/sketches", label: "Sketches" },
];

// One highlight glides between the tabs under the pointer, instead of each tab lighting up on its own
export function NavLinks() {
  const pathname = usePathname();
  const nav = useRef<HTMLElement>(null);
  const hover = useFluidHover(nav, { axis: "x" });
  return (
    <nav aria-label="Main navigation" ref={nav} {...hover.handlers}>
      <FluidHoverHighlight hover={hover} className="site-header__hover" />
      {links.map(({ href, label }, i) => (
        <Link key={href} href={href} ref={hover.register(i)} data-hovered={hover.active === i || undefined} aria-current={pathname === href ? "page" : undefined}><ScribbleText>{label}</ScribbleText></Link>
      ))}
    </nav>
  );
}

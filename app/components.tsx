import Link from "next/link";
import { NavLinks } from "./nav-links";
import { ScribbleText } from "../components/ui/scribble-text";

export function Header() {
  return (
    <header className="site-header">
      <Link className="identity" href="/">
        <span>Rocío Espinosa</span>
        <small>Product Designer</small>
      </Link>
      <NavLinks />
    </header>
  );
}

export function MailIcon({ gradientId }: { gradientId: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd84a" /><stop offset="1" stopColor="#f0a800" /></linearGradient></defs><rect x="2" y="5" width="20" height="15" rx="2" fill={`url(#${gradientId})`} /><path d="m2.8 6.2 9.2 7 9.2-7" fill="none" stroke="#fff6cc" strokeWidth="1.4" strokeLinejoin="round" /></svg>;
}

export function Footer() {
  return (
    <footer className="framer-footer">
      <div className="footer-contact"><img src="/media/illustration.png" alt="Rocío's signature" /><p>Have any ideas? Let’s get in touch. I’d love to hear from you.</p><a className="pill-button" href="mailto:rocio.anahi.esp@gmail.com?subject=Portfolio%20Inquiry"><MailIcon gradientId="footer-mail-icon-fill" />E-mail</a></div>
      <div className="footer-links"><b>Links</b><a href="https://www.linkedin.com/in/rocioanahiespinosa" target="_blank"><ScribbleText>LinkedIn</ScribbleText></a><a href="https://www.behance.net/respinosa" target="_blank"><ScribbleText>Behance</ScribbleText></a><a href="mailto:rocio.anahi.esp@gmail.com"><ScribbleText>rocio.anahi.esp@gmail.com</ScribbleText></a><small>© {new Date().getFullYear()} Rocio Espinosa</small><small>Site set in Averia Serif Libre and Segoe UI</small></div>
      <img className="tree-sprite" src="/media/signature.png" alt="Four pixel-art trees" />
    </footer>
  );
}

export function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

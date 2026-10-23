import Link from "next/link";
import { NavLinks } from "./nav-links";
import { BloomLogo } from "../components/ui/bloom-logo";
import { ScribbleText } from "../components/ui/scribble-text";
import { SignatureReveal } from "../components/ui/signature-reveal";

export function Header() {
  return (
    <header className="site-header">
      <Link className="identity" href="/">
        <BloomLogo />
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

// Month/year of the build, e.g. "10/26", so "Last updated" follows each deploy.
const built = new Date();
const lastUpdated = `${built.getMonth() + 1}/${String(built.getFullYear()).slice(2)}`;

export function Footer() {
  return (
    <footer className="framer-footer">
      <div className="footer-contact">
        <SignatureReveal />
        <p>Have any ideas? <span>Let’s get in touch.</span><br />I’d love to hear from you.</p>
        <a className="pill-button" href="mailto:rocio.anahi.esp@gmail.com?subject=Portfolio%20Inquiry"><MailIcon gradientId="footer-mail-icon-fill" />E-mail</a>
      </div>
      <div className="footer-links">
        <nav aria-label="Footer">
          <Link href="/"><ScribbleText>Home</ScribbleText></Link>
          <Link href="/about"><ScribbleText>About</ScribbleText></Link>
          <Link href="/work"><ScribbleText>Work</ScribbleText></Link>
          <a href="https://www.linkedin.com/in/rocioanahiespinosa" target="_blank" rel="noreferrer"><ScribbleText>LinkedIn</ScribbleText></a>
        </nav>
        <small>Site set in Averia Serif Libre and Segoe UI</small>
        <small>Last updated {lastUpdated}</small>
      </div>
    </footer>
  );
}

export function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

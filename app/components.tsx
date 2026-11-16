import Link from "next/link";
import { FlowerLogo } from "../components/ui/bloom-logo";
import { SignatureReveal } from "../components/ui/signature-reveal";
import { VineNav } from "../components/ui/vine-nav";

// The home page has no nav (the lace cloth lists the pages); inner pages get the vine.
export function Header({ nav = true }: { nav?: boolean }) {
  return (<>
    <header className="site-header">
      <a className="skip-link" href="#content">Skip to content</a>
      {/* The flower opens the design system; the name goes home */}
      <div className="identity">
        <Link className="identity__logo" href="/design-system" aria-label="Design system" title="Design system">
          <FlowerLogo />
        </Link>
        <Link className="identity__name" href="/">
          <span>Rocío Espinosa</span>
          <small>Product Designer</small>
        </Link>
      </div>
      {nav && <VineNav />}
    </header>
    <div id="content" tabIndex={-1} />
  </>);
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
      </div>
      <div className="footer-links">
        <small>Site set in EB Garamond, Averia Serif Libre and Segoe UI</small>
        <small>Last updated {lastUpdated}</small>
      </div>
    </footer>
  );
}

export function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

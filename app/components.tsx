import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <Link className="identity" href="/">
        <span>Rocío Espinosa</span>
        <small>Experience &amp; Interface Designer</small>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/lab">Design Lab</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <p>Have any ideas? Let’s get in touch.<br />I’d love to hear from you.</p>
      <a className="contact-link" href="mailto:rocio.anahi.esp@gmail.com?subject=Portfolio%20Inquiry">rocio.anahi.esp@gmail.com <span>↗</span></a>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rocío Espinosa</span>
        <span><a href="https://www.linkedin.com/in/rocioanahiespinosa" target="_blank">LinkedIn</a><a href="https://www.behance.net/respinosa" target="_blank">Behance</a></span>
      </div>
    </footer>
  );
}

export function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

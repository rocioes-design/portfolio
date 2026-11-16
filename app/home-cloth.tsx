import Link from "next/link";
import { LaceCloth } from "../components/ui/lace-cloth";
import { FloralDivider } from "../components/ui/floral-frame";
import { ScribbleText } from "../components/ui/scribble-text";

// The home page hero: a welcome note written on a lace-edged linen cloth,
// with the main pages listed as a numbered index.
const PAGES = [
  { href: "/about", label: "About me" },
  { href: "/work", label: "My work" },
  { href: "/sketches", label: "Sketches" },
];

export function HomeCloth() {
  return (
    <LaceCloth className="home-cloth">
      <FloralDivider className="home-cloth__crest" />
      <h1 className="home-cloth__title">Welcome to my portfolio</h1>
      <p className="home-cloth__intro">A designer, maker and curious mind. I turn ideas into digital experiences, and occasionally get carried away with little experiments.</p>
      <nav className="home-cloth__index" aria-label="Explore">
        <div className="home-cloth__head" aria-hidden="true"><span>N°</span><span>Page</span></div>
        <ol>
          {PAGES.map((page, i) => (
            <li key={page.href}>
              <Link href={page.href} className="home-cloth__row">
                <span className="home-cloth__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="home-cloth__label"><ScribbleText>{page.label}</ScribbleText></span>
                <span className="home-cloth__arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <div className="home-cloth__social">
        <a href="https://www.linkedin.com/in/rocioanahiespinosa" target="_blank" rel="noreferrer"><ScribbleText>LinkedIn</ScribbleText></a>
        <a href="/media/rocio-espinosa-product-designer-resume.pdf" download="Rocio Espinosa - Product Designer - Resume.pdf"><ScribbleText>Resume</ScribbleText></a>
        <a href="mailto:rocio.anahi.esp@gmail.com?subject=Portfolio%20Inquiry"><ScribbleText>E-mail</ScribbleText></a>
      </div>
    </LaceCloth>
  );
}

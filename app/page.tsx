import { Footer, Header, MailIcon } from "./components";
import { InteractiveFolderGallery } from "../components/ui/interactive-folder-gallery";
import { IntroTitle } from "./intro-title";

export default function Home() {
  return <>
  <div className="page-shell"><Header /></div>
  <main className="framer-home">
    <section className="framer-bio">
      <IntroTitle>
        <p>Hi! I’m Rocío, an argentinian <mark className="marker">Product Designer</mark> building interfaces, experiences and systems in Buenos Aires, AR. This is my portfolio.</p>
      </IntroTitle>
      <div className="bio-actions"><a className="pill-button" href="mailto:rocio.anahi.esp@gmail.com?subject=Portfolio%20Inquiry&amp;body=Hi%20Roc%C3%ADo%2C%0A%0AI%27m%20reaching%20out..."><MailIcon gradientId="mail-icon-fill" />E-mail</a><a className="pill-button" href="/media/rocio-espinosa-product-designer-resume.pdf" download="Rocio Espinosa - Product Designer - Resume.pdf"><svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="resume-icon-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f59ae8" /><stop offset="1" stopColor="#c62fc0" /></linearGradient></defs><path d="M5 2h9.5L20 7.5V21a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" fill="url(#resume-icon-fill)" /><path d="M14.5 2v4.5a1 1 0 0 0 1 1H20Z" fill="#fbd3f5" /><path d="M7.5 11.5h9M7.5 14.5h9M7.5 17.5h9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>Resume</a></div>
    </section>
    <section className="folder-gallery-section"><InteractiveFolderGallery /></section>
    <Footer />
  </main>
  </>;
}

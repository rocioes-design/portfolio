import Link from "next/link";

const indexGroups = [
  { label: "01  CONTEXT", items: [["1.1 Overview", "01"], ["1.2 Define the problem", "02"]] },
  { label: "02  RESEARCH", items: [["2.1 Research approach", "03"], ["2.2 User research", "04"], ["2.3 Key findings", "05"], ["2.4 Design implications", "06"], ["2.5 User persona", "07"], ["2.6 User needs", "08"], ["2.7 User journey mapping", "09"], ["2.8 Benchmarking", "10"]] },
  { label: "03  RESULT", items: [["3.1 User Flow", "11"], ["3.2 Low & high fidelity wireframes", "12"], ["3.3 Takeaway", "13"]] },
];

function SubsureMark() {
  return <svg className="subsure-mark" viewBox="0 0 94 149" aria-hidden="true"><path d="M1.75 33.47H0V61.7h34.45c3.21 0 4.38 4.36 1.46 5.82l-6.71 3.2A64.2 64.2 0 0 1 1.75 77.4H0v28.23h33.57c3.21 0 4.38 4.37 1.46 5.83l-7 3.2a63.3 63.3 0 0 1-26.28 6.11H0V149h33.57l3.8-4.66c16.34-18.92 35.32-28.81 55.17-28.81H94V87.3H60.43c-3.21 0-4.38-4.36-1.46-5.82l7-3.2a63.3 63.3 0 0 1 26.27-6.11h1.46V43.94H59.55c-3.21 0-4.38-4.37-1.46-5.82l6.72-3.2A64.2 64.2 0 0 1 92.25 28.23h1.46V0H60.14l-3.8 4.66C40.58 23.57 21.31 33.47 1.75 33.47Z" /></svg>;
}

function CaseIndex() {
  return <div className="case-index">{indexGroups.map((group) => <div className="index-group" key={group.label}><span>{group.label}</span><div>{group.items.map(([label, number]) => <p key={number}><b>{label}</b><i>{number}</i></p>)}</div></div>)}</div>;
}

export default function Home() {
  return <main className="framer-home">
    <header className="framer-header">
      <Link href="/" className="framer-name"><strong>Rocío Espinosa</strong><span> - Experience &amp; Interface Designer</span></Link>
      <nav><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/lab">Design Lab</Link></nav>
      <button className="menu-button" aria-label="Open navigation"><span /><span /><span /></button>
    </header>
    <section className="framer-bio">
      <p>Hi! I’m Rocío, an argentinian Designer building interfaces, experiences and systems in Buenos Aires, AR. This is my portfolio.</p>
      <div className="bio-actions"><a href="mailto:rocio.anahi.esp@gmail.com?subject=Portfolio%20Inquiry&amp;body=Hi%20Roc%C3%ADo%2C%0A%0AI%27m%20reaching%20out..."><span>✉</span> Mail</a><a href="https://framerusercontent.com/assets/R7E4C6GoYcnn7wU21OzS8gonQ.pdf" target="_blank"><span>↧</span> Resume</a></div>
    </section>
    <section className="subsure-section">
      <Link className="home-project-title" href="/casestudy">Subsure Case Study</Link>
      <div className="subsure-content"><div className="subsure-welcome"><SubsureMark /><div><span>Welcome to</span><strong>Subsure</strong><small>All your subscriptions, in one view</small></div></div><CaseIndex /></div>
    </section>
    <section className="home-carousel-section">
      <a className="home-project-title" href="https://www.behance.net/gallery/236629161/Design-System-Foundations-components" target="_blank">Design System <span className="link-icon">↗</span></a>
      <div className="design-carousel"><div className="design-slide"><img src="/media/design-system-controls.png" alt="Design system controls and patterns" /></div><div className="design-slide next-slide"><img src="/media/design-system-components.png" alt="Design system components" /></div><button className="carousel-next" aria-label="Next design-system slide">›</button></div>
    </section>
    <section className="ai-section"><h2>AI Assistant Researcher</h2><div className="ai-carousel"><video src="/media/ai-1.mp4" muted loop playsInline preload="none" aria-label="AI assistant researcher project preview" /><button className="carousel-next" aria-label="Next AI project slide">›</button></div></section>
    <footer className="framer-footer">
      <div className="footer-contact"><img src="/media/illustration.png" alt="Rocío's signature" /><p>Have any ideas? Let’s get in touch. I’d love to hear from you.</p><a href="mailto:rocio.anahi.esp@gmail.com?subject=Portfolio%20Inquiry"><span>✉</span> Mail</a></div>
      <div className="footer-links"><b>Links</b><a href="https://www.linkedin.com/in/rocioanahiespinosa" target="_blank">LinkedIn</a><a href="https://www.behance.net/respinosa" target="_blank">Behance</a><a href="mailto:rocio.anahi.esp@gmail.com">rocio.anahi.esp@gmail.com</a><small>© 2026 Rocio Espinosa</small><small>Site set in <u>Louize</u> and Open Sans</small></div>
      <img className="tree-sprite" src="/media/signature.png" alt="Four pixel-art trees" />
    </footer>
  </main>;
}

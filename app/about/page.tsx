import { Footer, Header } from "../components";

export default function About() {
  return <main><div className="page-shell"><Header />
    <section className="about-hero"><span className="eyebrow">About me</span><h1>A curious designer with a soft spot for <em>details and systems.</em></h1></section>
    <section className="about-copy"><div><span>01</span><h2>A little about Rocío</h2></div><p>Hi! I’m Rocío, a designer based in Buenos Aires, Argentina. I have a deep passion for design and creativity. I love detail, self-learning and auto-layout. I strive for effective, user-centered design.</p><p>My design journey began in 2020 when I started studying and immersing myself in front-end development. I learned about HTML, CSS and a bit of Javascript. I found coding frustrating at times, so I switched to Figma — everything felt easier, simpler, and, most importantly, fun.</p><p>I have over 4 years of experience in UX/UI design across different fields, including freelance design, marketing, hospitality and HR. I’m excited to learn more about other industries.</p></section>
    <section className="facts"><article><span>01</span><h3>My workspace</h3><p>Where sketches turn into systems.</p></article><article><span>02</span><h3>My cat Leia</h3><p>My most committed design critic.</p></article><article><span>03</span><h3>My favorite game</h3><p>A source of tiny interaction details.</p></article></section>
    <Footer />
  </div></main>;
}

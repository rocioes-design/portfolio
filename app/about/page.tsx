import { Footer, Header } from "../components";

const photos = [
  { src: "/media/about/stardew-valley.png", alt: "Stardew Valley title art with a farm and a barn", caption: "My favorite game", shape: "landscape" },
  { src: "/media/about/me.webp", alt: "Rocío standing in front of a bookshelf", caption: "Me", shape: "portrait" },
  { src: "/media/about/leia.jpg", alt: "Leia, a tabby and white cat, sitting in the sun", caption: "My cat Leia", shape: "portrait" },
  { src: "/media/about/workspace.jpg", alt: "A desk with a monitor and an office chair by a window", caption: "My workspace", shape: "portrait" },
];

export default function About() {
  return <main><div className="page-shell"><Header />
    <section className="about-intro">
      <h1>Some things about me.</h1>
      <p>Hi! I’m Rocío, a designer based in Buenos Aires, Argentina.</p>
      <p>I’m focused on practical, user-centered interfaces. I started learning front-end (HTML, CSS and a bit of JavaScript), which helps me design with implementation and handoff in mind. Over time I moved into product design and Figma, where I can iterate fast and solve interaction problems clearly—auto-layout and components are my favorite tools for that.</p>
      <p>I completed several UX/UI certifications to learn as much as possible and find my place in design. I have 4+ years of experience working across freelance projects and teams in marketing, hospitality and HR. I’m excited to learn more about other industries.</p>
    </section>
    <section className="about-stamps" aria-label="Photos">
      {photos.map(({ src, alt, caption, shape }) => (
        <figure className={`about-stamp about-stamp--${shape}`} key={caption}>
          <div className="about-stamp__paper">
            <img src={src} alt={alt} />
            <figcaption>{caption}</figcaption>
          </div>
        </figure>
      ))}
    </section>
    <Footer />
  </div></main>;
}

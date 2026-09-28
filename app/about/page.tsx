import type { CSSProperties } from "react";
import { Footer, Header } from "../components";
import { CatDoodle, CoffeeSticker, MateSticker } from "./stickers";
import { AboutFaq } from "./about-faq";

// x, y and w are measured on a 1100×640 canvas; the collage scales with the page.
// Below 900px wide the items fall back to a wrapping row in array order.
type Layout = { x: number; y: number; w: number; tilt: number; z: number };

type CollageItem = Layout & (
  | { kind: "stamp"; src: string; alt: string; caption?: string; shape: "landscape" | "portrait" }
  | { kind: "book"; src: string; alt: string }
  | { kind: "sticker"; sticker: "mate" | "coffee" }
  | { kind: "doodle" }
);

const items: CollageItem[] = [
  { kind: "stamp", src: "/media/about/stardew-valley.png", alt: "Stardew Valley title art with a farm and a barn", caption: "My favorite game", shape: "landscape", x: 20, y: 250, w: 270, tilt: -7, z: 3 },
  { kind: "book", src: "/media/about/the-aleph.jpg", alt: "Cover of The Aleph and Other Stories by Jorge Luis Borges", x: 150, y: 20, w: 168, tilt: -4, z: 2 },
  { kind: "stamp", src: "/media/about/me.webp", alt: "Rocío standing in front of a bookshelf", caption: "Me", shape: "portrait", x: 300, y: 120, w: 220, tilt: 3, z: 4 },
  { kind: "sticker", sticker: "mate", x: 248, y: 418, w: 150, tilt: -8, z: 8 },
  { kind: "book", src: "/media/about/infinite-jest.png", alt: "Cover of Infinite Jest by David Foster Wallace", x: 520, y: 20, w: 150, tilt: 5, z: 2 },
  { kind: "stamp", src: "/media/about/leia.jpg", alt: "Leia, a tabby and white cat, sitting in the sun", caption: "My cat Leia", shape: "portrait", x: 540, y: 250, w: 220, tilt: -3, z: 5 },
  { kind: "stamp", src: "/media/about/balcony-cat.png", alt: "A man holding a tabby and white cat on a sunny balcony", shape: "portrait", x: 720, y: 60, w: 200, tilt: 4, z: 3 },
  { kind: "sticker", sticker: "coffee", x: 966, y: 118, w: 130, tilt: 8, z: 8 },
  { kind: "stamp", src: "/media/about/workspace.jpg", alt: "A desk with a monitor and an office chair by a window", caption: "My workspace", shape: "portrait", x: 880, y: 200, w: 220, tilt: -5, z: 4 },
  { kind: "stamp", src: "/media/about/cactus.png", alt: "A tall cactus under a blue sky with clouds", shape: "portrait", x: 760, y: 330, w: 190, tilt: 6, z: 6 },
  { kind: "doodle", x: 612, y: 566, w: 120, tilt: -4, z: 9 },
];

function layoutStyle({ x, y, w, tilt, z }: Layout) {
  return { "--x": x, "--y": y, "--w": w, "--tilt": `${tilt}deg`, "--z": z } as CSSProperties;
}

export default function About() {
  return <main><div className="page-shell"><Header />
    <section className="about-intro">
      <h1>Some things about me.</h1>
      <p>Hi! I’m Rocío, a designer based in Buenos Aires, Argentina.</p>
      <p>I’m focused on practical, user-centered interfaces. I started learning front-end (HTML, CSS and a bit of JavaScript), which helps me design with implementation and handoff in mind. Over time I moved into product design and Figma, where I can iterate fast and solve interaction problems clearly—auto-layout and components are my favorite tools for that.</p>
      <p>I completed several UX/UI certifications to learn as much as possible and find my place in design. I have 4+ years of experience working across freelance projects and teams in marketing, hospitality and HR. I’m excited to learn more about other industries.</p>
    </section>
    <section className="about-faq-section" aria-label="Questions about me"><AboutFaq /></section>
    <section className="about-collage" aria-label="Photos">
      {items.map((item, i) => {
        const style = layoutStyle(item);
        if (item.kind === "sticker") {
          const Sticker = { mate: MateSticker, coffee: CoffeeSticker }[item.sticker];
          return <div className="about-card about-card--sticker" style={style} key={i}><Sticker /></div>;
        }
        if (item.kind === "doodle") {
          return <div className="about-card about-card--doodle" style={style} key={i}><CatDoodle /></div>;
        }
        if (item.kind === "book") {
          return <figure className="about-card about-card--book" style={style} key={i}><div className="about-book"><img src={item.src} alt={item.alt} /></div></figure>;
        }
        return (
          <figure className={`about-card about-card--stamp about-card--${item.shape}`} style={style} key={i}>
            <div className="about-stamp__paper"><img src={item.src} alt={item.alt} />{item.caption && <figcaption>{item.caption}</figcaption>}</div>
          </figure>
        );
      })}
    </section>
    <Footer />
  </div></main>;
}

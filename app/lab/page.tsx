import { Footer, Header } from "../components";

const experiments = [
  ["Design System", "Foundations & components", "/images/design-system-components.png"],
  ["Design System", "Controls & patterns", "/images/design-system-controls.png"],
  ["UI exploration", "Cryptocurrency prices table", "https://framerusercontent.com/images/eBhKILJFdlUtcnWcQwEYl2UEj9A.png?width=1440&height=980"],
  ["Product redesign", "Deel redesign", "https://framerusercontent.com/images/vkF0OQQpMq7lzEqSeu2nkCJyN0.png?width=1484&height=887"],
];

export default function Lab() {
  return <main><div className="page-shell"><Header />
    <section className="lab-hero"><span className="eyebrow">Design Lab</span><h1>Ideas, experiments and <em>small details.</em></h1><p>A place for work that is playful, unfinished, and worth exploring.</p></section>
    <section className="lab-grid">{experiments.map(([category, title, image]) => <article className="lab-card" key={title}><div className="lab-image"><img src={image} alt={title} /></div><p>{category}</p><h2>{title}</h2></article>)}</section>
    <Footer />
  </div></main>;
}

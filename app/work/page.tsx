import { Footer, Header } from "../components";
import { MediaCarousel, type CarouselMedia } from "../../components/ui/media-carousel";
import { ScribbleText } from "../../components/ui/scribble-text";

// Set `hidden: true` to take a project off the page without deleting it.
type Project = { title: string; link?: { href: string; label: string; external?: boolean }; media: CarouselMedia[]; aspectRatio?: string; hidden?: boolean };

// Projects and media carried over from the old Framer site's Design Lab page, newest first.
const projects: Project[] = [
  {
    title: "Daywell",
    link: { href: "/daywell/prototype", label: "Try the prototype" },
    media: [
      { type: "video", src: "/media/daywell/signin.mp4", alt: "Daywell prototype: signing in with an email and a 6-digit code" },
      { type: "video", src: "/media/daywell/request.mp4", alt: "Daywell prototype: requesting Dec 22–26 off, with the balance and the Christmas holiday worked out" },
      { type: "video", src: "/media/daywell/approve.mp4", alt: "Daywell prototype: a manager approving a request after checking who else on the team is off" },
      { type: "video", src: "/media/daywell/bulk.mp4", alt: "Daywell prototype: a manager approving three requests at once" },
    ],
  },
  {
    title: "Whether",
    link: { href: "/whether", label: "Read the case study" },
    media: [
      { type: "image", src: "/media/work/whether-1.webp", alt: "Whether Today screens for rain, sun and a cold night, with Drip the raindrop mascot" },
      { type: "image", src: "/media/work/whether-2.webp", alt: "Whether onboarding: how you feel the cold, the welcome screen and all set" },
      { type: "image", src: "/media/work/whether-3.webp", alt: "Whether heading out sheet and the Today screen while you’re out" },
      { type: "image", src: "/media/work/whether-4.webp", alt: "Whether trip to Madrid: typical weather, an early forecast and the real forecast" },
      { type: "image", src: "/media/work/whether-5.webp", alt: "Whether home-screen widgets and the app icon in light and dark" },
    ],
  },
  {
    title: "Loopline",
    link: { href: "/loopline", label: "Read the case study" },
    media: [
      { type: "image", src: "/media/loopline/overview.webp", alt: "Loopline operations overview with downtime, empty belt time and a facility timeline" },
      { type: "video", src: "/media/loopline/prototype-holiday.mp4", alt: "Prototype: adding a holiday exception and previewing the shifts it removes" },
      { type: "image", src: "/media/loopline/schedule.webp", alt: "Loopline plant schedule with shifts, breaks and a late start exception" },
      { type: "video", src: "/media/loopline/prototype-late-start.mp4", alt: "Prototype: moving tomorrow's first shift an hour later" },
    ],
  },
  {
    title: "The Game Shelf",
    link: { href: "https://thegameshelf.vercel.app/", label: "Visit the site", external: true },
    media: [{ type: "video", src: "/media/work/the-game-shelf.mp4", alt: "Screen recording of The Game Shelf website" }],
    aspectRatio: "1918 / 910",
    hidden: true, // Rocío is still working on it; remove this line to publish again.
  },
  {
    title: "Subsure",
    link: { href: "/casestudy", label: "Read the case study" },
    media: [{ type: "image", src: "/media/folder/subsure.png", alt: "Subsure welcome screen: all your subscriptions, in one view" }],
  },
  {
    title: "My digital library",
    link: { href: "https://my-digital-library.framer.website/", label: "Visit the site", external: true },
    media: [{ type: "image", src: "/media/work/my-digital-library.webp", alt: "My digital library: a personal library with a genre filter and a grid of book covers" }],
  },
  {
    title: "Design System",
    link: { href: "https://www.behance.net/gallery/236629161/Design-System-Foundations-components", label: "See it on Behance", external: true },
    media: [
      { type: "image", src: "/media/work/design-system-1.png", alt: "Design system pages for toggles and button groups" },
      { type: "image", src: "/media/work/design-system-2.png", alt: "Design system pages for buttons and badges" },
    ],
  },
  {
    title: "Deel redesign",
    link: { href: "https://www.behance.net/gallery/236255871/Deel-Redesign", label: "See it on Behance", external: true },
    media: [
      { type: "image", src: "/media/work/deel-1.png", alt: "Deel dashboard redesign with balance, withdrawals and contracts" },
      { type: "image", src: "/media/work/deel-2.png", alt: "Another screen from the Deel redesign" },
    ],
  },
];

const slug = (title: string) => `work-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default function Work() {
  return <main><div className="page-shell"><Header />
    <section className="work-intro">
      <h1><img src="/media/work/pen.svg" alt="" /><span>Work</span><img src="/media/work/hot-beverage.svg" alt="" /></h1>
      <p>This page features my work: completed projects or just standalone components and concept experiments I enjoyed creating. It’s my space for inspiration and discovery.</p>
    </section>
    <div className="work-projects">
      {projects.filter((project) => !project.hidden).map((project) => (
        <section className="work-project" key={project.title} aria-labelledby={slug(project.title)}>
          <header className="work-project__header">
            <h2 id={slug(project.title)}>{project.title}</h2>
            {project.link && (
              <a href={project.link.href} {...(project.link.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                <ScribbleText>{project.link.label}</ScribbleText> <span aria-hidden="true">↗</span>
              </a>
            )}
          </header>
          <MediaCarousel media={project.media} label={`${project.title} gallery`} aspectRatio={project.aspectRatio} />
        </section>
      ))}
    </div>
    <Footer />
  </div></main>;
}

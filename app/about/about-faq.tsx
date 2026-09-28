"use client";
import { Accordion } from "@base-ui/react/accordion";
import { ScribbleText } from "../../components/ui/scribble-text";

// Adapted from Watermelon's accordion-1 (shadcn + Base UI), restyled with plain CSS in globals.css.
const items = [
  {
    value: "main-thing",
    title: "What is your skill set / what is your “main thing”?",
    content: <p>I’d say my main thing is Product/interaction design. But I also enjoy illustrating and Motion Design.</p>,
  },
  {
    value: "tools",
    title: "What tools do you use?",
    content: <p>Figma for almost everything that I do. For advanced prototyping, Framer, Claude (rarely After Effects), Procreate (rarely Adobe Illustrator or Photoshop). This website was created in Figma and Claude. For design inspiration, X/Twitter, Pinterest, Cosmos.</p>,
  },
  {
    value: "learning",
    title: "How did you learn how to design?",
    content: <p>I completed various Design courses/certifications, but what best worked for me was trial and error, YouTube and google search. Design is what I’m most excited about, so that helped a lot too.</p>,
  },
  {
    value: "future",
    title: "Where do you see yourself in the future?",
    content: <p>I wish I knew! Hopefully, still designing and learning. I’m always thinking about side projects and freelancing, but I also enjoy the steadiness of a full time job.</p>,
  },
  {
    value: "freelance",
    title: "Are you taking freelance/contract work?",
    content: <p>For any freelance inquiries, or if you’d like to find a time to chat, please email me at <a href="mailto:rocio.anahi.esp@gmail.com"><ScribbleText>rocio.anahi.esp@gmail.com</ScribbleText></a>. Please include context on the project or why you want to talk.</p>,
  },
];

export function AboutFaq() {
  return (
    <Accordion.Root className="about-faq" multiple defaultValue={[items[0].value]}>
      {items.map((item) => (
        <Accordion.Item className="about-faq__item" key={item.value} value={item.value}>
          <Accordion.Header className="about-faq__header">
            <Accordion.Trigger className="about-faq__trigger">
              {item.title}
              <svg className="about-faq__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" /></svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="about-faq__panel">
            <div className="about-faq__content">{item.content}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

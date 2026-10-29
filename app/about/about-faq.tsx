"use client";
import { Fragment, useId, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { BLOOM_PATH } from "../../components/ui/bloom-logo";
import { ScribbleText } from "../../components/ui/scribble-text";

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

// Motion matches Rare UI's FAQ: the answer pops out of the Bloom mark with a little bounce,
// the bubbles below slide down to make room, and a closing answer fades out quickly.
const SEND: Transition = { type: "spring", visualDuration: 0.42, bounce: 0.28 };
const SHIFT: Transition = { type: "spring", visualDuration: 0.4, bounce: 0.1 };
const LEAVE: Transition = { duration: 0.16, ease: [0.4, 0, 1, 1] };
const INSTANT: Transition = { duration: 0 };

// Arrow keys, Home and End move between questions.
const KEY_STEPS: Record<string, (index: number, last: number) => number> = {
  ArrowDown: (index) => index + 1,
  ArrowUp: (index) => index - 1,
  Home: () => 0,
  End: (_, last) => last,
};

// Laid out as a chat: each question is a bubble you tap, and the answer comes back from me
// on the right, next to the Bloom mark. One answer is open at a time.
export function AboutFaq() {
  const reduced = useReducedMotion() ?? false;
  const uid = useId();
  const [openId, setOpenId] = useState<string | null>(items[0].value);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = KEY_STEPS[event.key];
    const target = event.target as HTMLElement;
    if (!step || !target.matches(".about-faq__question")) return;
    const questions = [...event.currentTarget.querySelectorAll<HTMLElement>(".about-faq__question")];
    const next = step(questions.indexOf(target), questions.length - 1);
    event.preventDefault();
    questions[(next + questions.length) % questions.length]?.focus();
  };

  return (
    <div className="about-faq" onKeyDown={onKeyDown}>
      {items.map((item) => {
        const open = openId === item.value;
        const questionId = `${uid}-${item.value}-question`;
        const answerId = `${uid}-${item.value}-answer`;
        return (
          <Fragment key={item.value}>
            <motion.button
              id={questionId}
              type="button"
              className="about-faq__question"
              aria-expanded={open}
              aria-controls={open ? answerId : undefined}
              onClick={() => setOpenId(open ? null : item.value)}
              // Every bubble re-measures when an answer opens, so the ones below slide
              layout="position"
              layoutDependency={openId}
              transition={reduced ? INSTANT : SHIFT}
              whileTap={reduced ? undefined : { scale: 0.97 }}
            >
              {item.title}
            </motion.button>
            <AnimatePresence mode="popLayout" initial={false}>
              {open && (
                <motion.div
                  key="answer"
                  className="about-faq__reply"
                  layout="position"
                  layoutDependency={openId}
                  initial={{ opacity: 0, scale: 0.6, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: reduced ? INSTANT : LEAVE }}
                  transition={reduced ? INSTANT : SEND}
                  style={{ originX: 1, originY: 1 }}
                >
                  <div id={answerId} className="about-faq__answer" role="region" aria-labelledby={questionId}>{item.content}</div>
                  <span className="about-faq__avatar" aria-hidden="true"><svg viewBox="0 0 100 100"><path fillRule="evenodd" d={BLOOM_PATH} /></svg></span>
                </motion.div>
              )}
            </AnimatePresence>
          </Fragment>
        );
      })}
    </div>
  );
}

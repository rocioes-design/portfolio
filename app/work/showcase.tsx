"use client";
import { useState } from "react";
import { MediaCarousel, type CarouselMedia } from "../../components/ui/media-carousel";
import { ProjectWindow, type ProjectWindowData } from "../../components/ui/project-window";
import { ScribbleText } from "../../components/ui/scribble-text";

// A Work page project that opens in a window ("View project" or a click on any slide).
export function Showcase({ id, title, media, project }: { id: string; title: string; media: CarouselMedia[]; project: ProjectWindowData }) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(0);
  const openAt = (i: number) => { setStart(i); setOpen(true); };
  return (
    <>
      <header className="work-project__header">
        <h2 id={id}>{title}</h2>
        <button type="button" className="work-project__open" onClick={() => openAt(0)} aria-haspopup="dialog">
          <ScribbleText>View project</ScribbleText> <span aria-hidden="true">↗</span>
        </button>
      </header>
      <MediaCarousel media={media} label={`${title} gallery`} onSelect={openAt} />
      <ProjectWindow project={project} open={open} start={start} onClose={() => setOpen(false)} />
    </>
  );
}

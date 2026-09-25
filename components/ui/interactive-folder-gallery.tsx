"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./interactive-folder-gallery.css";

export interface GalleryPhoto {
  id: string | number;
  image: string;
  alt?: string;
}

const defaultPhotos: GalleryPhoto[] = [
  { id: 1, image: "/media/folder/subsure.png", alt: "Subsure app welcome screen" },
  { id: 2, image: "/media/folder/ai-researcher.png", alt: "AI assistant researcher interface on a laptop" },
  { id: 3, image: "/media/folder/design-system-colors.png", alt: "Design system color foundations" },
  { id: 4, image: "/media/folder/personal-library.png", alt: "Personal library app with book covers" },
];

export interface InteractiveFolderGalleryProps {
  photos?: GalleryPhoto[];
  folderName?: string;
  dragHintText?: string;
  className?: string;
}

// Open layout: one row on wide screens, a 2-column grid on phones.
// Card sizes live in the CSS; keep these in sync with it.
const ROW = { cardWidth: 232, gap: 16, y: -150 };
const GRID = { cardWidth: 160, cardHeight: 118, gap: 12, y: -110 };

function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setIsCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isCompact;
}

function openPosition(i: number, count: number, isCompact: boolean) {
  if (!isCompact) {
    return { x: (i - (count - 1) / 2) * (ROW.cardWidth + ROW.gap), y: ROW.y };
  }
  const row = Math.floor(i / 2);
  const rows = Math.ceil(count / 2);
  const isLoneLast = i === count - 1 && count % 2 === 1;
  const col = i % 2;
  return {
    x: isLoneLast ? 0 : (col - 0.5) * (GRID.cardWidth + GRID.gap),
    y: GRID.y - (rows - 1 - row) * (GRID.cardHeight + GRID.gap),
  };
}

export function InteractiveFolderGallery({
  photos = defaultPhotos,
  folderName = "Some of my work",
  dragHintText = "Drag any photo down to close",
  className
}: InteractiveFolderGalleryProps) {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [hoverFolder, setHoverFolder] = useState(false);
  const isCompact = useCompactLayout();

  return (
    <div className={`ifg ${className || ""}`}>
      <div className="ifg-stage">

        <div className="ifg-frame">

          <motion.div
            className="ifg-back"
            initial={false}
            animate={{ opacity: isFolderOpen ? 0 : 1, scale: isFolderOpen ? 0.9 : 1 }}
          >
            <div className="ifg-back-tab" />
            <div className="ifg-back-body" />
            <div className="ifg-back-inner" />
          </motion.div>

          <div className="ifg-photos">
            {photos.map((photo, i) => {
              const offset = i - (photos.length - 1) / 2;

              const stackY = hoverFolder ? offset * -10 - 40 : offset * -5;
              const stackX = hoverFolder ? offset * 30 : offset * 3;
              const stackRotate = hoverFolder ? offset * 8 : offset * 3;
              const stackScale = 1 - Math.abs(offset) * 0.03;

              const { x: openX, y: openY } = openPosition(i, photos.length, isCompact);
              const openRotate = 0;
              const openScale = 1;

              return (
                <motion.div
                  key={photo.id}
                  drag={isFolderOpen}
                  dragSnapToOrigin={true}
                  onDragEnd={(e, info) => {
                    if (info.offset.y > 100 && isFolderOpen) {
                      setIsFolderOpen(false);
                      setHoverFolder(false);
                    }
                  }}
                  className={`ifg-photo ${isFolderOpen ? "is-open" : ""}`}
                  initial={false}
                  animate={!isFolderOpen ? {
                    y: stackY,
                    x: stackX,
                    rotate: stackRotate,
                    scale: stackScale,
                    zIndex: i + 10
                  } : {
                    y: openY,
                    x: openX,
                    rotate: openRotate,
                    scale: openScale,
                    zIndex: 50
                  }}
                  whileHover={isFolderOpen ? { scale: openScale + 0.05, zIndex: 100 } : {}}
                  whileDrag={isFolderOpen ? { scale: openScale + 0.1, rotate: 5, zIndex: 150 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  <img src={photo.image} alt={photo.alt || "Gallery item"} />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="ifg-front"
            style={{ transformOrigin: "bottom" }}
            initial={false}
            animate={{
              opacity: isFolderOpen ? 0 : 1,
              rotateX: hoverFolder ? -25 : 0,
              y: hoverFolder ? 10 : 0,
              pointerEvents: isFolderOpen ? "none" : "auto"
            }}
            onMouseEnter={() => setHoverFolder(true)}
            onMouseLeave={() => setHoverFolder(false)}
            onClick={() => setIsFolderOpen(true)}
          >
            <div className="ifg-front-body">
              <div className="ifg-front-shine" />
              <div className="ifg-label">
                <span>{folderName}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="ifg-hint"
          initial={false}
          animate={{ opacity: isFolderOpen ? 1 : 0, y: isFolderOpen ? 0 : 50 }}
        >
          {dragHintText}
        </motion.div>

      </div>
    </div>
  );
}

export { InteractiveFolderGallery as Component };

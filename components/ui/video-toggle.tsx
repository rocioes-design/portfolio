// Pause or resume a video that plays on its own. Sits in the corner of the video it controls.
export function VideoToggle({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="video-toggle" onClick={onToggle} aria-label={paused ? "Play video" : "Pause video"}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        {paused ? <path d="M5 3l8 5-8 5z" /> : <path d="M5.5 3v10M10.5 3v10" />}
      </svg>
    </button>
  );
}

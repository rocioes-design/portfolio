// Illustrations for the About page collage. Stickers draw their silhouette first
// with a thick white stroke, which reads as the die-cut sticker border.

export function MateSticker() {
  // The mate illustration Rocío provided, cut out with a white die-cut border (public/media/about/mate-sticker.png).
  return <img className="about-sticker" src="/media/about/mate-sticker.png" alt="" />;
}

export function CoffeeSticker() {
  return (
    <svg className="about-sticker" viewBox="0 0 200 160" aria-hidden="true">
      <g fill="#fff" stroke="#fff" strokeWidth="16" strokeLinejoin="round" strokeLinecap="round">
        <path d="M152 78c30-6 34 34 4 40" fill="none" strokeWidth="30" />
        <path d="M20 70c2 50 30 80 75 80s73-30 75-80Z" />
        <ellipse cx="95" cy="70" rx="75" ry="40" />
      </g>
      <path d="M152 78c30-6 34 34 4 40" fill="none" stroke="#5A2416" strokeWidth="12" strokeLinecap="round" />
      <path d="M155 82c20-2 22 26 3 31" fill="none" stroke="#7E3824" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 70c2 50 30 80 75 80s73-30 75-80Z" fill="#5A2416" />
      <path d="M30 90c6 26 24 44 52 50-30-2-50-22-52-50Z" fill="#7A3522" />
      <ellipse cx="52" cy="112" rx="10" ry="4" transform="rotate(35 52 112)" fill="#fff" opacity=".35" />
      <ellipse cx="95" cy="70" rx="75" ry="40" fill="#F3E9DA" />
      <ellipse cx="95" cy="71" rx="68" ry="34" fill="#C8894E" />
      <g transform="translate(95 72) scale(1.22 1.15) translate(-95 -72)">
        <g fill="#FBF4E8">
          <path d="M60 70q35 30 70 0-35 18-70 0Z" />
          <path d="M66 80q29 24 58 0-29 14-58 0Z" />
          <path d="M70 60q25 22 50 0-25 12-50 0Z" />
          <path d="M95 64c-7-10-19-8-19-1 0 6 9 10 19 16 10-6 19-10 19-16 0-7-12-9-19 1Z" />
        </g>
        <path d="M95 54v44" stroke="#C8894E" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 70a45 26 0 0 0 90 0" fill="none" stroke="#FBF4E8" strokeWidth="3" opacity=".6" />
      </g>
    </svg>
  );
}


export function CatDoodle() {
  return (
    <svg className="about-doodle" viewBox="0 0 160 90" aria-hidden="true">
      <g fill="none" stroke="#DF517A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 70c-6-18-2-32 4-40l-2-20 18 14c10-4 26-4 36 0l18-14-2 22c8 10 10 26 2 38-12 12-62 12-74 0Z" />
        <path d="M52 44q3-4 6 0M80 44q3-4 6 0" />
        <path d="M67 54h6l-3 3Z" />
        <path d="M64 61q3 4 6 0 3 4 6 0" />
        <path d="M40 54 14 49M40 60l-28 3M98 54l26-5M98 60l28 3" />
        <path d="M106 68c24 6 44-4 40-22-4-14-18-4-10 6" />
      </g>
    </svg>
  );
}

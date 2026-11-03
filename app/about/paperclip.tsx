// A gold paperclip holding the portrait on the About page.
// The wire's gradient runs across it, so each leg catches the light differently, like bent metal.
const WIRE = "M27 46V96a6 6 0 0 1-12 0V27a10 10 0 0 1 20 0v73a13 13 0 0 1-26 0V40";

export function GoldPaperclip() {
  return (
    <svg className="paperclip" viewBox="5 13 34 106" aria-hidden="true">
      <defs>
        <linearGradient id="clip-gold" gradientUnits="userSpaceOnUse" x1="6" y1="0" x2="38" y2="0">
          <stop offset="0" stopColor="#8f5f10" />
          <stop offset=".22" stopColor="#e7bd52" />
          <stop offset=".42" stopColor="#fff4c7" />
          <stop offset=".58" stopColor="#e0ae3c" />
          <stop offset=".8" stopColor="#a9771b" />
          <stop offset="1" stopColor="#f2d273" />
        </linearGradient>
      </defs>
      <path d={WIRE} fill="none" stroke="url(#clip-gold)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={WIRE} fill="none" stroke="#fffbe6" strokeOpacity=".65" strokeWidth=".9" strokeLinecap="round" transform="translate(-.7 0)" />
    </svg>
  );
}

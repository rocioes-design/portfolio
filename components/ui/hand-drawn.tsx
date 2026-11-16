// SVG filters that make crisp vector drawings read as hand-coloured engravings.
// Put <HandDrawnFilters id="x" /> inside an <svg>'s <defs>, then use
// filter="url(#x-ink)" on line work and filter="url(#x-wash)" on colour fills.
//
// - ink: nudges every line by a smooth noise field, so strokes waver like a pen.
// - wash: the same wobble, a little stronger, plus uneven pigment (mottling) and a darker rim
//   where watercolour pools at the edge of a shape.

export function HandDrawnFilters({ id, wobble = 1, rim = "#5a3a12" }: { id: string; wobble?: number; rim?: string }) {
  return (
    <>
      <filter id={`${id}-ink`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={(1.8 * wobble).toFixed(2)} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id={`${id}-wash`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="9" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale={(3 * wobble).toFixed(2)} xChannelSelector="R" yChannelSelector="G" result="shape" />
        <feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="3" seed="2" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.9 0 0 0 1.32" result="mottle" />
        <feComposite in="shape" in2="mottle" operator="in" result="washed" />
        <feMorphology in="shape" operator="erode" radius=".9" result="inner" />
        <feComposite in="shape" in2="inner" operator="out" result="edge" />
        <feFlood floodColor={rim} floodOpacity=".3" />
        <feComposite in2="edge" operator="in" result="pooled" />
        <feMerge>
          <feMergeNode in="washed" />
          <feMergeNode in="pooled" />
        </feMerge>
      </filter>
    </>
  );
}

'use client';

import { devProps } from '@/lib/utils/dev-props';

const CORNERS: Array<{ x: number; y: number }> = [
  { x: 12, y: 12 },
  { x: 128, y: 12 },
  { x: 12, y: 98 },
  { x: 128, y: 98 },
];

export function ProductDemoVisual() {
  return (
    <svg
      {...devProps('ProductDemoVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      <defs>
        <pattern id="product-demo-dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.5" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="140" height="110" fill="url(#product-demo-dots)" />

      {CORNERS.map((c, i) => (
        <g key={i}>
          <line x1={c.x - 4} y1={c.y} x2={c.x + 4} y2={c.y} stroke="currentColor" strokeWidth="0.75" />
          <line x1={c.x} y1={c.y - 4} x2={c.x} y2={c.y + 4} stroke="currentColor" strokeWidth="0.75" />
        </g>
      ))}
      <line x1="22" y1="55" x2="42" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="98" y1="55" x2="118" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

      <circle cx="70" cy="55" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="70" cy="55" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <circle cx="70" cy="55" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M64 43 L82 55 L64 67 Z" fill="currentColor" />
    </svg>
  );
}

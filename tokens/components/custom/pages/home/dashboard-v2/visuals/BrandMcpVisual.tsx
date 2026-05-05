'use client';

import { devProps } from '@/lib/utils/dev-props';

const NODES: Array<{ x: number; y: number }> = [
  { x: 18, y: 18 },
  { x: 122, y: 18 },
  { x: 18, y: 92 },
  { x: 122, y: 92 },
];

export function BrandMcpVisual() {
  return (
    <svg
      {...devProps('BrandMcpVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      {NODES.map((n) => (
        <line
          key={`l-${n.x}-${n.y}`}
          x1="70"
          y1="55"
          x2={n.x}
          y2={n.y}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          opacity="0.6"
        />
      ))}
      {NODES.map((n) => (
        <g key={`n-${n.x}-${n.y}`}>
          <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx={n.x} cy={n.y} r="2" fill="currentColor" />
        </g>
      ))}
      <circle cx="70" cy="55" r="16" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="70" cy="55" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="66" y="51" width="8" height="8" fill="currentColor" />
    </svg>
  );
}

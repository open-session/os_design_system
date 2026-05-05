'use client';

import { devProps } from '@/lib/utils/dev-props';

const NODES: Array<{ x: number; y: number }> = [
  { x: 12, y: 16 },
  { x: 12, y: 66 },
  { x: 108, y: 16 },
  { x: 108, y: 66 },
];

const BOX_W = 20;
const BOX_H = 28;

export function WorkflowsVisual() {
  return (
    <svg
      {...devProps('WorkflowsVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      <line x1="32" y1="30" x2="60" y2="55" stroke="currentColor" strokeWidth="0.5" />
      <line x1="32" y1="80" x2="60" y2="55" stroke="currentColor" strokeWidth="0.5" />
      <line x1="80" y1="55" x2="108" y2="30" stroke="currentColor" strokeWidth="0.5" />
      <line x1="80" y1="55" x2="108" y2="80" stroke="currentColor" strokeWidth="0.5" />

      <path d="M108 30 L102 28 L102 32 Z" fill="currentColor" />
      <path d="M108 80 L102 78 L102 82 Z" fill="currentColor" />
      <path d="M60 55 L66 53 L66 57 Z" fill="currentColor" />

      {NODES.map((n) => (
        <g key={`${n.x}-${n.y}`}>
          <rect
            x={n.x}
            y={n.y}
            width={BOX_W}
            height={BOX_H}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1={n.x + 4}
            y1={n.y + 6}
            x2={n.x + BOX_W - 4}
            y2={n.y + 6}
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <line
            x1={n.x + 4}
            y1={n.y + 12}
            x2={n.x + BOX_W - 4}
            y2={n.y + 12}
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <line
            x1={n.x + 4}
            y1={n.y + 18}
            x2={n.x + BOX_W - 8}
            y2={n.y + 18}
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle cx={n.x + BOX_W - 5} cy={n.y + 23} r="1.25" fill="currentColor" />
        </g>
      ))}

      <rect x="60" y="43" width="20" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="70" cy="55" r="3.5" fill="currentColor" />
      <line x1="66" y1="62" x2="74" y2="62" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

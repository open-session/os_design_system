'use client';

import { devProps } from '@/lib/utils/dev-props';

const SQUARES = [16, 28, 40, 52];

export function WorkspaceConnectVisual() {
  return (
    <svg
      {...devProps('WorkspaceConnectVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      {SQUARES.map((s, i) => (
        <rect
          key={s}
          x={70 - s}
          y={55 - s}
          width={s * 2}
          height={s * 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray={i === SQUARES.length - 1 ? undefined : '1.5 2.5'}
          opacity={0.9 - i * 0.15}
        />
      ))}
      {[
        { x: 70, y: 5 },
        { x: 128, y: 55 },
        { x: 70, y: 105 },
        { x: 12, y: 55 },
      ].map((p, i) => (
        <g key={i}>
          <rect x={p.x - 4} y={p.y - 4} width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x={p.x - 1.5} y={p.y - 1.5} width="3" height="3" fill="currentColor" />
        </g>
      ))}
      <rect x="64" y="49" width="12" height="12" fill="currentColor" />
    </svg>
  );
}

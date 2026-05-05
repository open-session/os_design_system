'use client';

import { devProps } from '@/lib/utils/dev-props';

const ROOMS: Array<{ x: number; y: number; opacity: number }> = [
  { x: 12, y: 12, opacity: 0.4 },
  { x: 36, y: 24, opacity: 0.65 },
  { x: 62, y: 36, opacity: 1 },
];

const ROOM_W = 66;
const ROOM_H = 52;

export function SharedSpacesVisual() {
  return (
    <svg
      {...devProps('SharedSpacesVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      {ROOMS.map((r, i) => (
        <g key={i} opacity={r.opacity}>
          <rect
            x={r.x}
            y={r.y}
            width={ROOM_W}
            height={ROOM_H}
            fill="none"
            stroke="currentColor"
            strokeWidth={i === ROOMS.length - 1 ? 1 : 0.75}
          />
          <line
            x1={r.x}
            y1={r.y + 10}
            x2={r.x + ROOM_W}
            y2={r.y + 10}
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle cx={r.x + 5} cy={r.y + 5} r="1.2" fill="currentColor" />
          <circle cx={r.x + 10} cy={r.y + 5} r="1.2" fill="currentColor" />
          <circle cx={r.x + 15} cy={r.y + 5} r="1.2" fill="currentColor" />
        </g>
      ))}
      {[12, 25, 38, 51].map((cx, i) => (
        <circle
          key={i}
          cx={cx}
          cy="98"
          r="3.5"
          fill={i === 3 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
      <line x1="60" y1="98" x2="128" y2="98" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

'use client';

import { devProps } from '@/lib/utils/dev-props';

const RINGS = [16, 28, 40, 52];

export function SocialConnectVisual() {
  return (
    <svg
      {...devProps('SocialConnectVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      {RINGS.map((r, i) => (
        <circle
          key={r}
          cx="70"
          cy="55"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray={i === RINGS.length - 1 ? undefined : '1.5 2.5'}
          opacity={0.9 - i * 0.15}
        />
      ))}
      {[
        { dx: 0, dy: -50 },
        { dx: 58, dy: 0 },
        { dx: 0, dy: 50 },
        { dx: -58, dy: 0 },
      ].map((p, i) => {
        const x = 70 + p.dx;
        const y = 55 + p.dy;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx={x} cy={y} r="1.75" fill="currentColor" />
          </g>
        );
      })}
      <circle cx="70" cy="55" r="5" fill="currentColor" />
    </svg>
  );
}

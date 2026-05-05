'use client';

import { devProps } from '@/lib/utils/dev-props';

const BARS: number[] = [
  10, 18, 28, 46, 36, 60, 72, 54, 68, 82, 58, 44, 52, 38, 26, 20, 14,
];

export function BrandVoiceVisual() {
  return (
    <svg
      {...devProps('BrandVoiceVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      <line x1="12" y1="55" x2="128" y2="55" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 12 + i * 29;
        return (
          <line
            key={`tick-${i}`}
            x1={x}
            y1="52"
            x2={x}
            y2="58"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
        );
      })}
      {BARS.map((h, i) => {
        const x = 16 + i * 6.5;
        return (
          <line
            key={i}
            x1={x}
            y1={55 - h / 2}
            x2={x}
            y2={55 + h / 2}
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

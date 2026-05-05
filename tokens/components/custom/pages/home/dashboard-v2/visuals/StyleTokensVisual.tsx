'use client';

import { devProps } from '@/lib/utils/dev-props';

const COLS = 5;
const ROWS = 3;
const TILE = 20;
const GAP = 4;

const FILL_PATTERN: Array<'solid' | 'dot' | 'half' | 'empty'> = [
  'solid', 'dot', 'empty', 'half', 'solid',
  'half', 'empty', 'solid', 'dot', 'empty',
  'dot', 'solid', 'half', 'empty', 'solid',
];

export function StyleTokensVisual() {
  const totalW = COLS * TILE + (COLS - 1) * GAP;
  const totalH = ROWS * TILE + (ROWS - 1) * GAP;
  const originX = (140 - totalW) / 2;
  const originY = (110 - totalH) / 2;

  return (
    <svg
      {...devProps('StyleTokensVisual')}
      width="140"
      height="110"
      viewBox="0 0 140 110"
      aria-hidden
    >
      {FILL_PATTERN.map((fill, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        const x = originX + c * (TILE + GAP);
        const y = originY + r * (TILE + GAP);
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={TILE}
              height={TILE}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
            />
            {fill === 'solid' && (
              <rect x={x + 4} y={y + 4} width={TILE - 8} height={TILE - 8} fill="currentColor" />
            )}
            {fill === 'half' && (
              <rect x={x + 4} y={y + TILE / 2} width={TILE - 8} height={TILE / 2 - 4} fill="currentColor" />
            )}
            {fill === 'dot' && (
              <circle cx={x + TILE / 2} cy={y + TILE / 2} r="2.5" fill="currentColor" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

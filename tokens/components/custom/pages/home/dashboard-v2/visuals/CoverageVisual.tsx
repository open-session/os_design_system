'use client';

import { devProps } from '@/lib/utils/dev-props';

export function CoverageVisual() {
  return (
    <svg
      {...devProps('CoverageVisual')}
      width="140"
      height="120"
      viewBox="0 0 140 120"
      aria-hidden
    >
      <defs>
        <pattern id="coverage-hatch" patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="4" x2="4" y2="0" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <circle cx="55" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="85" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="70" cy="78" r="32" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M 70 58 Q 80 62 78 72 Q 70 70 66 68 Q 63 62 70 58 Z"
        fill="url(#coverage-hatch)"
      />
    </svg>
  );
}

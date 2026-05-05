'use client';

import { devProps } from '@/lib/utils/dev-props';

const RAY_X = [10, 22, 34, 46, 58, 70, 82, 94, 106, 118, 130];

export function ColorAuditVisual() {
  return (
    <svg
      {...devProps('ColorAuditVisual')}
      width="140"
      height="120"
      viewBox="0 0 140 120"
      aria-hidden
    >
      <polygon points="70,10 130,105 10,105" fill="none" stroke="currentColor" strokeWidth="1" />
      {RAY_X.map((x) => (
        <line key={x} x1="70" y1="10" x2={x} y2="105" stroke="currentColor" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

'use client';

import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

interface BracketFrameProps {
  className?: string;
  inset?: number;
  size?: number;
}

export function BracketFrame({ className, inset = 10, size = 10 }: BracketFrameProps) {
  const positions = [
    { id: 'tl', top: inset, left: inset, borderTop: true, borderLeft: true },
    { id: 'tr', top: inset, right: inset, borderTop: true, borderRight: true },
    { id: 'bl', bottom: inset, left: inset, borderBottom: true, borderLeft: true },
    { id: 'br', bottom: inset, right: inset, borderBottom: true, borderRight: true },
  ];

  return (
    <div
      {...devProps('BracketFrame')}
      aria-hidden
      className={cx('pointer-events-none absolute inset-0 z-20', className)}
    >
      {positions.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            borderTop: p.borderTop ? '1px solid currentColor' : undefined,
            borderRight: p.borderRight ? '1px solid currentColor' : undefined,
            borderBottom: p.borderBottom ? '1px solid currentColor' : undefined,
            borderLeft: p.borderLeft ? '1px solid currentColor' : undefined,
          }}
        />
      ))}
    </div>
  );
}

'use client';

import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

interface OrbProps {
  size?: number;
  className?: string;
}

export function Orb({ size = 14, className }: OrbProps) {
  return (
    <span
      {...devProps('Orb')}
      aria-hidden
      className={cx('inline-block rounded-full align-middle', className)}
      style={{
        width: size,
        height: size,
        background:
          'conic-gradient(from 0deg, var(--color-brand-500), var(--color-vanilla), var(--color-brand-500))',
      }}
    />
  );
}

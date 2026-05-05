'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

interface PillProps {
  variant?: 'default' | 'on';
  children: ReactNode;
  className?: string;
}

export function Pill({ variant = 'default', children, className }: PillProps) {
  return (
    <span
      {...devProps('Pill')}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-[2px] border px-2.5 py-1 text-[11px] font-medium',
        variant === 'on'
          ? 'border-brand_alt bg-utility-brand-50 text-fg-brand-secondary'
          : 'border-border-secondary text-fg-tertiary',
        className,
      )}
    >
      {children}
    </span>
  );
}

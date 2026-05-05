'use client';

import type { ElementType, ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

export type EyebrowTone = 'primary' | 'tertiary' | 'quaternary';
export type EyebrowSize = 'xs' | 'sm';

interface EyebrowProps {
  children: ReactNode;
  tone?: EyebrowTone;
  size?: EyebrowSize;
  as?: ElementType;
  className?: string;
}

const toneClass: Record<EyebrowTone, string> = {
  primary: 'text-fg-primary',
  tertiary: 'text-fg-tertiary',
  quaternary: 'text-fg-quaternary',
};

const sizeClass: Record<EyebrowSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-[11px]',
};

export function Eyebrow({
  children,
  tone = 'tertiary',
  size = 'xs',
  as,
  className,
}: EyebrowProps) {
  const Component = (as ?? 'span') as ElementType;
  return (
    <Component
      {...devProps('Eyebrow')}
      className={cx(
        'font-sans font-medium uppercase tracking-[0.08em]',
        sizeClass[size],
        toneClass[tone],
        className,
      )}
    >
      {children}
    </Component>
  );
}

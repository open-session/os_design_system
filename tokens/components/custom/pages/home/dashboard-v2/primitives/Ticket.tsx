'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

export type TicketVariant = 'dark' | 'vanilla' | 'aperol';

interface TicketProps {
  variant?: TicketVariant;
  clipSize?: number;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

const surfaceByVariant: Record<TicketVariant, string> = {
  dark: 'bg-bg-secondary text-fg-primary',
  vanilla: 'bg-fg-primary text-bg-primary',
  aperol: 'text-[var(--color-charcoal)]',
};

export function Ticket({
  variant = 'dark',
  clipSize = 12,
  className,
  innerClassName,
  children,
}: TicketProps) {
  const clipPath = `polygon(${clipSize}px 0, calc(100% - ${clipSize}px) 0, 100% ${clipSize}px, 100% calc(100% - ${clipSize}px), calc(100% - ${clipSize}px) 100%, ${clipSize}px 100%, 0 calc(100% - ${clipSize}px), 0 ${clipSize}px)`;

  const aperolStyle =
    variant === 'aperol' ? { backgroundColor: 'var(--color-brand-500)' } : undefined;

  return (
    <div
      {...devProps('Ticket')}
      style={{ clipPath, ...aperolStyle }}
      className={cx('relative overflow-hidden', surfaceByVariant[variant], className)}
    >
      <div className={cx('relative z-10 h-full', innerClassName)}>{children}</div>
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { BracketFrame } from './BracketFrame';
import { DottedTexture } from './DottedTexture';
import type { TicketVariant } from './Ticket';

interface FramedPanelProps {
  children: ReactNode;
  variant?: TicketVariant;
  withDots?: boolean;
  bracketInset?: number;
  bracketSize?: number;
  bracketClassName?: string;
  className?: string;
  innerClassName?: string;
}

const bracketToneByVariant: Record<TicketVariant, string> = {
  dark: 'text-fg-quaternary',
  vanilla: 'text-current opacity-30',
  aperol: 'text-current opacity-30',
};

export function FramedPanel({
  children,
  variant = 'dark',
  withDots = true,
  bracketInset = 10,
  bracketSize = 10,
  bracketClassName,
  className,
  innerClassName,
}: FramedPanelProps) {
  return (
    <div
      {...devProps('FramedPanel')}
      className={cx('relative isolate overflow-hidden', className)}
    >
      {withDots && <DottedTexture variant={variant} />}
      <BracketFrame
        inset={bracketInset}
        size={bracketSize}
        className={cx(bracketToneByVariant[variant], bracketClassName)}
      />
      <div className={cx('relative z-10 flex h-full w-full items-center justify-center', innerClassName)}>
        {children}
      </div>
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from './Eyebrow';

interface SectionDividerProps {
  label: string;
  right?: ReactNode;
  marker?: 'outline' | 'filled';
  className?: string;
}

export function SectionDivider({ label, right, marker = 'outline', className }: SectionDividerProps) {
  return (
    <div
      {...devProps('SectionDivider')}
      className={cx('relative my-5 py-3', className)}
    >
      <div className="absolute inset-x-0 top-1.5 h-px bg-border-secondary" />
      <div className="absolute inset-x-0 bottom-1 h-px bg-border-secondary" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-b border-dotted border-border-secondary"
      />

      <div className="relative flex w-fit items-center gap-2.5 bg-bg-primary px-1">
        <span
          aria-hidden
          className={cx(
            'h-1.5 w-1.5 rotate-45',
            marker === 'filled' ? 'bg-[var(--color-brand-500)]' : 'border border-[var(--color-brand-500)]',
          )}
        />
        <Eyebrow size="sm" tone="primary">
          {label}
        </Eyebrow>
      </div>

      {right && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-bg-primary pl-2.5">
          <Eyebrow size="sm" tone="tertiary" as="div">
            {right}
          </Eyebrow>
        </div>
      )}
    </div>
  );
}

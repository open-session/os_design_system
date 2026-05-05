'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from './Eyebrow';

interface ActivityRowProps {
  text: ReactNode;
  timestamp: string;
  muted?: boolean;
}

export function ActivityRow({ text, timestamp, muted = false }: ActivityRowProps) {
  return (
    <div {...devProps('ActivityRow')} className="flex items-start gap-2.5 text-xs">
      <span
        className={cx(
          'mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full',
          muted ? 'bg-border-primary' : 'bg-[var(--color-brand-500)]',
        )}
      />
      <div className="flex-1">
        <div className={muted ? 'text-fg-tertiary' : 'text-fg-primary'}>{text}</div>
        <Eyebrow tone="quaternary" as="div" className="mt-0.5">
          {timestamp}
        </Eyebrow>
      </div>
    </div>
  );
}

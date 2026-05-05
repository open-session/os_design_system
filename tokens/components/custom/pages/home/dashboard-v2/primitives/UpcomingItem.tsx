'use client';

import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from './Eyebrow';

interface UpcomingItemProps {
  title: string;
  date: string;
  meta: string;
  muted?: boolean;
}

export function UpcomingItem({ title, date, meta, muted = false }: UpcomingItemProps) {
  return (
    <div {...devProps('UpcomingItem')} className="text-xs">
      <div className="flex items-baseline justify-between">
        <span className={muted ? 'text-fg-tertiary' : 'text-fg-primary'}>{title}</span>
        <Eyebrow tone={muted ? 'quaternary' : 'tertiary'}>{date}</Eyebrow>
      </div>
      <div className={cx('mt-0.5 text-[11px]', muted ? 'text-fg-quaternary' : 'text-fg-tertiary')}>
        {meta}
      </div>
    </div>
  );
}

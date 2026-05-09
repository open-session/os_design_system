'use client';

import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from './Eyebrow';

export type DayState = 'default' | 'active' | 'today';

export interface CalendarDay {
  date: number;
  state?: DayState;
}

interface MiniCalendarProps {
  days: CalendarDay[];
  className?: string;
}

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MiniCalendar({ days, className }: MiniCalendarProps) {
  return (
    <div {...devProps('MiniCalendar')} className={cx('w-full', className)}>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {DOW.map((d) => (
          <Eyebrow key={d} tone="quaternary" as="div" className="text-center">
            {d.slice(0, 1)}
          </Eyebrow>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day.date}
            className={cx(
              'relative rounded-[2px] px-1 py-1.5 text-center text-[11px]',
              day.state === 'today' && 'bg-bg-brand-solid font-medium text-fg-primary',
              day.state === 'active' && 'bg-utility-brand-50 text-fg-brand-secondary',
              (!day.state || day.state === 'default') && 'text-fg-tertiary',
            )}
          >
            {day.date}
            {day.state === 'active' && (
              <span className="absolute bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-bg-brand-solid" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

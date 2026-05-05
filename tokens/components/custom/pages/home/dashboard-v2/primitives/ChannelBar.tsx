'use client';

import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

interface ChannelBarProps {
  label: string;
  value: string | number;
  fillPercent: number;
  className?: string;
}

export function ChannelBar({ label, value, fillPercent, className }: ChannelBarProps) {
  return (
    <div {...devProps('ChannelBar')} className={cx('w-full', className)}>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-fg-primary">{label}</span>
        <span className="text-fg-tertiary">{value}</span>
      </div>
      <div className="h-1 w-full overflow-hidden bg-border-secondary">
        <div
          className="h-full bg-[var(--color-brand-500)]"
          style={{ width: `${Math.min(100, Math.max(0, fillPercent))}%` }}
        />
      </div>
    </div>
  );
}

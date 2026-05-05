'use client';

import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

interface SparklineProps {
  bars: number[];
  highlightThreshold?: number;
  height?: number;
  className?: string;
}

export function Sparkline({ bars, highlightThreshold = 60, height = 32, className }: SparklineProps) {
  return (
    <div
      {...devProps('Sparkline')}
      className={cx('flex w-full items-end gap-[2px]', className)}
      style={{ height }}
    >
      {bars.map((value, i) => (
        <span
          // eslint-disable-next-line @eslint-react/no-array-index-key
          key={`bar-${i}`}
          className="flex-1 bg-[var(--color-brand-500)]"
          style={{
            height: `${Math.max(value, 4)}%`,
            opacity: value >= highlightThreshold ? 1 : 0.5,
            minHeight: 2,
          }}
        />
      ))}
    </div>
  );
}

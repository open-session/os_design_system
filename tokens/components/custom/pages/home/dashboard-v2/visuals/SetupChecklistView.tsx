'use client';

import { Check } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from '../primitives/Eyebrow';
import { FramedPanel } from '../primitives/FramedPanel';

interface ChecklistItem {
  label: string;
  category: string;
  done: boolean;
}

const ITEMS: ChecklistItem[] = [
  { label: 'Define primary & secondary colors', category: 'Colors', done: true },
  { label: 'Upload primary logo (SVG)', category: 'Logos', done: true },
  { label: 'Set display & body typefaces', category: 'Type', done: true },
  { label: 'Define brand voice tone', category: 'Voice', done: false },
  { label: 'Upload brand guidelines', category: 'Guidelines', done: false },
  { label: 'Add brand imagery', category: 'Imagery', done: false },
  { label: 'Set up design tokens', category: 'Tokens', done: false },
];

export function SetupChecklistView() {
  const completed = ITEMS.filter((i) => i.done).length;
  const total = ITEMS.length + 1;
  const percent = Math.round((completed / total) * 100);

  return (
    <div {...devProps('SetupChecklistView')} className="flex h-full flex-col">
      <div className="flex items-start justify-between px-6 pb-4 pt-6">
        <div>
          <h3 className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-fg-primary">
            Setup Checklist
          </h3>
          <Eyebrow tone="tertiary" as="div" className="mt-1">
            Finish these to reach 100%
          </Eyebrow>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-xl font-medium text-fg-brand-secondary">{completed}</span>
          <span className="text-xs text-fg-quaternary">/ {total}</span>
        </div>
      </div>

      <FramedPanel variant="dark" className="mx-5" innerClassName="px-6 py-6">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <Eyebrow tone="tertiary">Progress</Eyebrow>
            <span className="font-display text-[26px] font-medium leading-none tracking-[-0.02em] text-fg-primary">
              {percent}
              <span className="ml-0.5 text-sm font-normal text-fg-quaternary">%</span>
            </span>
          </div>
          <div className="h-[3px] w-full overflow-hidden bg-border-secondary">
            <div
              className="h-full bg-bg-brand-solid transition-[width] duration-page"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </FramedPanel>

      <div className="px-6 pb-5 pt-4 text-[13px]">
        {ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={cx(
              'flex items-center gap-3 py-2.5',
              i > 0 && 'border-t border-border-secondary/60',
            )}
          >
            <span
              className={cx(
                'flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full',
                item.done
                  ? 'bg-bg-brand-solid text-fg-primary'
                  : 'border border-border-primary',
              )}
            >
              {item.done && <Check className="h-2 w-2" strokeWidth={4} />}
            </span>
            <span className={item.done ? 'text-fg-tertiary line-through' : 'text-fg-primary'}>
              {item.label}
            </span>
            <span className="mx-2 flex-1 border-b border-dotted border-border-secondary" />
            <Eyebrow tone="quaternary">{item.category}</Eyebrow>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { Eyebrow } from './Eyebrow';

interface KpiTicketProps {
  label: string;
  index: string;
  value: string;
  unit?: string;
  delta?: ReactNode;
  deltaTone?: 'brand' | 'muted';
}

export function KpiTicket({ label, index, value, unit, delta, deltaTone = 'brand' }: KpiTicketProps) {
  return (
    <div
      {...devProps('KpiTicket')}
      className="rounded-md border border-border-secondary bg-bg-secondary px-5 py-4"
    >
      <div className="mb-2.5 flex items-start justify-between">
        <Eyebrow tone="tertiary">{label}</Eyebrow>
        <Eyebrow tone="quaternary">{index}</Eyebrow>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[22px] font-medium leading-none tracking-[-0.02em] text-fg-primary">
          {value}
          {unit && <span className="text-sm font-normal text-fg-quaternary">{unit}</span>}
        </span>
        {delta && (
          <span
            className={
              deltaTone === 'brand'
                ? 'text-[11px] font-medium text-fg-brand-secondary'
                : 'text-[11px] text-fg-tertiary'
            }
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

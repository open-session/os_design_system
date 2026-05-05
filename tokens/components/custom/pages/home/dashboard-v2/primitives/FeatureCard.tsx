'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { Eyebrow } from './Eyebrow';
import { FramedPanel } from './FramedPanel';
import { Ticket, type TicketVariant } from './Ticket';

interface FeatureCardProps {
  variant: TicketVariant;
  title: string;
  index: string;
  caption: string;
  visual: ReactNode;
}

export function FeatureCard({ variant, title, index, caption, visual }: FeatureCardProps) {
  return (
    <Ticket variant={variant} className="h-full w-full">
      <div {...devProps('FeatureCard')} className="flex h-full flex-col">
        <div className="flex items-start justify-between px-4 pb-3 pt-4">
          <h3 className="font-display text-[20px] font-bold leading-none tracking-[-0.02em]">
            {title}
          </h3>
          <Eyebrow tone="tertiary" className="opacity-70">
            {index}
          </Eyebrow>
        </div>

        <FramedPanel
          variant={variant}
          className="mx-4 h-[140px]"
          innerClassName="py-6"
        >
          {visual}
        </FramedPanel>

        <div className="mt-auto">
          <div className="relative mt-4 h-px bg-current opacity-20">
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-bg-primary"
            />
            <span
              aria-hidden
              className="absolute right-0 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rotate-45 bg-bg-primary"
            />
          </div>
          <div className="px-4 pb-4 pt-3">
            <div className="flex items-start justify-between gap-2.5">
              <p className="m-0 line-clamp-2 h-[2.75em] text-[12px] font-normal leading-snug">
                {caption}
              </p>
              <div className="flex flex-shrink-0 flex-col gap-0.5 opacity-50">
                <span className="h-[2px] w-[2px] rounded-full bg-current" />
                <span className="h-[2px] w-[2px] rounded-full bg-current" />
                <span className="h-[2px] w-[2px] rounded-full bg-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Ticket>
  );
}

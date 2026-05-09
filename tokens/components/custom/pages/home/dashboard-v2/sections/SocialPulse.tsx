'use client';

import { useState, type ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from '../primitives/Eyebrow';
import { FramedPanel } from '../primitives/FramedPanel';
import { SortableGroup } from '../primitives/SortableGroup';
import { SortableItem } from '../primitives/SortableItem';
import { Ticket } from '../primitives/Ticket';
import { Sparkline } from '../primitives/Sparkline';
import { ChannelBar } from '../primitives/ChannelBar';
import { SentimentGauge } from '../primitives/SentimentGauge';
import { useHomeLayoutStore } from '@/stores/home-layout-store';
import { HOME_SECTION_IDS, SOCIAL_PULSE_ITEM_IDS } from '../layout-config';

type SocialRange = '30d' | '60d' | '90d' | 'ytd';

const RANGE_OPTIONS: Array<{ value: SocialRange; label: string }> = [
  { value: '30d', label: 'Last 30d' },
  { value: '60d', label: 'Last 60d' },
  { value: '90d', label: 'Last 90d' },
  { value: 'ytd', label: 'YTD' },
];

const SPARK = [20, 35, 28, 48, 42, 65, 58, 72, 80, 68, 88, 95, 82, 100];

interface PulseWidgetProps {
  title: string;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  panelClassName?: string;
  panelInnerClassName?: string;
}

function PulseWidget({
  title,
  header,
  children,
  footer,
  panelClassName,
  panelInnerClassName,
}: PulseWidgetProps) {
  return (
    <Ticket variant="dark">
      <div {...devProps('PulseWidget')} className="flex h-full flex-col">
        <div className="flex items-start justify-between px-5 pb-3 pt-5">
          <h4 className="font-display text-base font-medium text-fg-primary">{title}</h4>
          {header}
        </div>
        <FramedPanel
          variant="dark"
          className={`mx-5 ${panelClassName ?? ''}`.trim()}
          innerClassName={panelInnerClassName ?? 'px-5 py-5'}
        >
          {children}
        </FramedPanel>
        {footer ? <div className="px-5 pb-5 pt-4">{footer}</div> : <div className="pb-5" />}
      </div>
    </Ticket>
  );
}

const WIDGETS: Record<string, { label: string; element: ReactNode }> = {
  [SOCIAL_PULSE_ITEM_IDS.TOTAL_REACH]: {
    label: 'Total Reach',
    element: (
      <PulseWidget
        title="Total Reach"
        header={<Eyebrow tone="tertiary">7d</Eyebrow>}
        panelInnerClassName="px-5 py-5"
        footer={
          <div className="flex items-center justify-between">
            <Eyebrow tone="quaternary">Apr 13</Eyebrow>
            <Eyebrow tone="quaternary">Apr 19</Eyebrow>
          </div>
        }
      >
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[32px] font-medium leading-none tracking-[-0.03em] text-fg-primary">
              127.4K
            </span>
            <span className="text-xs font-medium text-fg-brand-secondary">▲ 38.2%</span>
          </div>
          <Sparkline bars={SPARK} />
        </div>
      </PulseWidget>
    ),
  },
  [SOCIAL_PULSE_ITEM_IDS.BY_CHANNEL]: {
    label: 'By Channel',
    element: (
      <PulseWidget
        title="By Channel"
        header={<Eyebrow tone="tertiary">Reach</Eyebrow>}
        panelInnerClassName="px-5 py-5"
      >
        <div className="flex w-full flex-col gap-2.5">
          <ChannelBar label="Instagram" value="62.1K" fillPercent={88} />
          <ChannelBar label="LinkedIn" value="41.8K" fillPercent={58} />
          <ChannelBar label="Twitter / X" value="18.3K" fillPercent={26} />
          <ChannelBar label="Threads" value="5.2K" fillPercent={8} />
        </div>
      </PulseWidget>
    ),
  },
  [SOCIAL_PULSE_ITEM_IDS.SENTIMENT]: {
    label: 'Sentiment',
    element: (
      <PulseWidget
        title="Sentiment"
        header={<Eyebrow tone="tertiary">7d</Eyebrow>}
        panelInnerClassName="px-5 py-4"
        footer={
          <div className="flex items-center justify-between text-xs">
            <span className="text-fg-tertiary">Positive</span>
            <span className="text-fg-primary">+0.72</span>
          </div>
        }
      >
        <SentimentGauge value={0.72} />
      </PulseWidget>
    ),
  },
  [SOCIAL_PULSE_ITEM_IDS.TOP_POST]: {
    label: 'Top Post',
    element: (
      <PulseWidget
        title="Top Post"
        header={<Eyebrow tone="tertiary">IG · carousel</Eyebrow>}
        panelInnerClassName="px-5 py-5"
      >
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-bg-brand-solid" />
            <Eyebrow tone="tertiary">Apr 17</Eyebrow>
          </div>
          <p className="m-0 text-xs font-normal leading-snug text-fg-primary">
            &quot;Orb study 03 — letting the gradient tell the story.&quot;
          </p>
          <div className="flex gap-3 text-[11px] text-fg-tertiary">
            <span>♥ 2.4K</span>
            <span>↻ 186</span>
            <span>💬 42</span>
          </div>
        </div>
      </PulseWidget>
    ),
  },
};

export function SocialPulse() {
  const order = useHomeLayoutStore((s) => s.itemOrders[HOME_SECTION_IDS.SOCIAL_PULSE] ?? []);
  const isEditing = useHomeLayoutStore((s) => s.isEditing);
  const reorder = useHomeLayoutStore((s) => s.reorderItems);
  const [range, setRange] = useState<SocialRange>('30d');

  return (
    <section {...devProps('SocialPulse')}>
      <div
        role="group"
        aria-label="Date range"
        className="mb-3 inline-flex items-center gap-0.5 rounded-sm border border-border-secondary bg-bg-secondary p-0.5"
      >
        {RANGE_OPTIONS.map((opt) => {
          const active = range === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRange(opt.value)}
              aria-pressed={active}
              className={cx(
                'rounded-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors',
                active
                  ? 'bg-bg-primary text-fg-primary shadow-sm'
                  : 'text-fg-tertiary hover:text-fg-primary',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <SortableGroup
        ids={order}
        strategy="horizontal"
        disabled={!isEditing}
        onReorder={(fromId, toId) => reorder(HOME_SECTION_IDS.SOCIAL_PULSE, fromId, toId)}
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {order.map((id, i) => {
            const entry = WIDGETS[id];
            if (!entry) return null;
            return (
              <SortableItem
                key={id}
                id={id}
                index={i}
                isEditing={isEditing}
                handleLabel={`Drag to reorder ${entry.label}`}
              >
                {entry.element}
              </SortableItem>
            );
          })}
        </div>
      </SortableGroup>
    </section>
  );
}

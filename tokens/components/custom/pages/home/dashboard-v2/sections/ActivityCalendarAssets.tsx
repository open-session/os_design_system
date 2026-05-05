'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { Eyebrow } from '../primitives/Eyebrow';
import { FramedPanel } from '../primitives/FramedPanel';
import { SortableGroup } from '../primitives/SortableGroup';
import { SortableItem } from '../primitives/SortableItem';
import { Ticket } from '../primitives/Ticket';
import { Pill } from '../primitives/Pill';
import { ActivityRow } from '../primitives/ActivityRow';
import { MiniCalendar, type CalendarDay } from '../primitives/MiniCalendar';
import { UpcomingItem } from '../primitives/UpcomingItem';
import { ChannelBar } from '../primitives/ChannelBar';
import { useHomeLayoutStore } from '@/stores/home-layout-store';
import { HOME_SECTION_IDS, WORKSPACE_PULSE_ITEM_IDS } from '../layout-config';

const DAYS: CalendarDay[] = [
  { date: 14 },
  { date: 15 },
  { date: 16, state: 'active' },
  { date: 17 },
  { date: 18 },
  { date: 19, state: 'today' },
  { date: 20, state: 'active' },
];

const PANEL_HEADING = 'text-base font-medium text-fg-primary';

const PANELS: Record<string, { label: string; element: ReactNode }> = {
  [WORKSPACE_PULSE_ITEM_IDS.ACTIVITY]: {
    label: 'Activity',
    element: (
      <Ticket variant="dark">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 pb-3 pt-5">
            <h4 className={PANEL_HEADING}>Activity</h4>
            <Pill variant="on">Live</Pill>
          </div>
          <FramedPanel variant="dark" className="mx-5" innerClassName="px-5 py-5">
            <div className="flex w-full flex-col gap-3 text-xs">
              <ActivityRow
                text={
                  <>
                    <span className="text-fg-brand-secondary">Tone drift</span> flagged on LinkedIn draft
                  </>
                }
                timestamp="2m ago"
              />
              <ActivityRow text="Ghali uploaded 4 product shots" timestamp="24m ago" />
              <ActivityRow
                text={
                  <>
                    Tokens synced to Figma · <span className="text-fg-quaternary">v2.14</span>
                  </>
                }
                timestamp="1h ago"
                muted
              />
              <ActivityRow text="Newsletter #12 scheduled for Tue" timestamp="3h ago" muted />
              <ActivityRow text="Morgan commented on “Orb v3”" timestamp="Yesterday" muted />
            </div>
          </FramedPanel>
          <div className="pb-5" />
        </div>
      </Ticket>
    ),
  },
  [WORKSPACE_PULSE_ITEM_IDS.NEXT_7_DAYS]: {
    label: 'Next 7 days',
    element: (
      <Ticket variant="dark">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 pb-3 pt-5">
            <h4 className={PANEL_HEADING}>Next 7 days</h4>
            <Eyebrow size="sm" tone="tertiary">
              Apr
            </Eyebrow>
          </div>
          <FramedPanel variant="dark" className="mx-5" innerClassName="px-5 py-5">
            <MiniCalendar days={DAYS} />
          </FramedPanel>
          <div className="flex flex-col gap-3 px-6 pb-5 pt-4">
            <UpcomingItem title="Newsletter #12" date="Tue 21" meta="Email · Ready to ship" />
            <UpcomingItem title="Orb study 04" date="Wed 22" meta="Instagram · Draft" />
            <UpcomingItem
              title="BOS launch teaser"
              date="Fri 24"
              meta="LinkedIn · Needs copy"
              muted
            />
          </div>
        </div>
      </Ticket>
    ),
  },
  [WORKSPACE_PULSE_ITEM_IDS.ASSET_USAGE]: {
    label: 'Asset usage',
    element: (
      <Ticket variant="dark">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 pb-3 pt-5">
            <h4 className={PANEL_HEADING}>Asset usage</h4>
            <Eyebrow size="sm" tone="tertiary">
              30d
            </Eyebrow>
          </div>
          <FramedPanel variant="dark" className="mx-5" innerClassName="px-5 py-5">
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[26px] font-medium leading-none tracking-[-0.02em] text-fg-primary">
                  1,284
                </span>
                <span className="text-xs text-fg-tertiary">downloads</span>
              </div>
              <Eyebrow tone="quaternary">Last 30 days</Eyebrow>
            </div>
          </FramedPanel>
          <div className="px-6 pb-5 pt-4">
            <Eyebrow tone="tertiary" as="div" className="mb-3">
              Top assets
            </Eyebrow>
            <div className="flex flex-col gap-2.5">
              <ChannelBar label="Logo / horizontal / dark" value={312} fillPercent={92} />
              <ChannelBar label="Aperol swatch" value={248} fillPercent={74} />
              <ChannelBar label="Orb loop .mp4" value={186} fillPercent={55} />
              <ChannelBar label="Offbit · WOFF2" value={124} fillPercent={38} />
              <ChannelBar label="Texture / grain / warm" value={96} fillPercent={28} />
            </div>
          </div>
        </div>
      </Ticket>
    ),
  },
};

export function ActivityCalendarAssets() {
  const order = useHomeLayoutStore(
    (s) => s.itemOrders[HOME_SECTION_IDS.WORKSPACE_PULSE] ?? [],
  );
  const isEditing = useHomeLayoutStore((s) => s.isEditing);
  const reorder = useHomeLayoutStore((s) => s.reorderItems);

  return (
    <SortableGroup
      ids={order}
      strategy="horizontal"
      disabled={!isEditing}
      onReorder={(fromId, toId) => reorder(HOME_SECTION_IDS.WORKSPACE_PULSE, fromId, toId)}
    >
      <section
        {...devProps('ActivityCalendarAssets')}
        className="grid grid-cols-1 gap-2.5 lg:grid-cols-3"
      >
        {order.map((id, i) => {
          const entry = PANELS[id];
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
      </section>
    </SortableGroup>
  );
}

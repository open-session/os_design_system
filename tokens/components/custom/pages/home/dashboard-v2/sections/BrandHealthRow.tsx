'use client';

import type { ReactNode } from 'react';
import { devProps } from '@/lib/utils/dev-props';
import { SortableGroup } from '../primitives/SortableGroup';
import { SortableItem } from '../primitives/SortableItem';
import { Ticket } from '../primitives/Ticket';
import { SetupChecklistView } from '../visuals/SetupChecklistView';
import { ContextRadarView } from '../visuals/ContextRadarView';
import { useHomeLayoutStore } from '@/stores/home-layout-store';
import { BRAND_HEALTH_ITEM_IDS, HOME_SECTION_IDS } from '../layout-config';

const BRAND_HEALTH_BY_ID: Record<string, { label: string; element: ReactNode }> = {
  [BRAND_HEALTH_ITEM_IDS.SETUP_CHECKLIST]: {
    label: 'Setup Checklist',
    element: (
      <Ticket variant="dark">
        <SetupChecklistView />
      </Ticket>
    ),
  },
  [BRAND_HEALTH_ITEM_IDS.CONTEXT_RADAR]: {
    label: 'Context Radar',
    element: (
      <Ticket variant="dark">
        <ContextRadarView />
      </Ticket>
    ),
  },
};

export function BrandHealthRow() {
  const order = useHomeLayoutStore((s) => s.itemOrders[HOME_SECTION_IDS.BRAND_HEALTH] ?? []);
  const isEditing = useHomeLayoutStore((s) => s.isEditing);
  const reorder = useHomeLayoutStore((s) => s.reorderItems);

  return (
    <section {...devProps('BrandHealthRow')}>
      <SortableGroup
        ids={order}
        strategy="horizontal"
        disabled={!isEditing}
        onReorder={(fromId, toId) => reorder(HOME_SECTION_IDS.BRAND_HEALTH, fromId, toId)}
      >
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
          {order.map((id, i) => {
            const entry = BRAND_HEALTH_BY_ID[id];
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

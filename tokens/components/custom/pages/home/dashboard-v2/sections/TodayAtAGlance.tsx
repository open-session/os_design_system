'use client';

import { devProps } from '@/lib/utils/dev-props';
import { KpiTicket } from '../primitives/KpiTicket';
import { SortableGroup } from '../primitives/SortableGroup';
import { SortableItem } from '../primitives/SortableItem';
import { useHomeLayoutStore } from '@/stores/home-layout-store';
import { HOME_SECTION_IDS, TODAY_ITEM_IDS } from '../layout-config';

const KPI_BY_ID = {
  [TODAY_ITEM_IDS.BRAND_HUB]: {
    label: 'Brand Hub',
    index: '001',
    value: '72',
    unit: '%',
    delta: '+4',
  },
  [TODAY_ITEM_IDS.BRAND_BRAIN]: {
    label: 'Brand Brain',
    index: '002',
    value: '58',
    unit: '%',
    delta: '142 entries',
    deltaTone: 'muted' as const,
  },
  [TODAY_ITEM_IDS.CONSISTENCY]: {
    label: 'Consistency',
    index: '003',
    value: '94',
    unit: '%',
    delta: '▲ 2.1',
  },
  [TODAY_ITEM_IDS.ASSETS_LIVE]: {
    label: 'Assets live',
    index: '004',
    value: '847',
    delta: '+23 wk',
    deltaTone: 'muted' as const,
  },
} as const;

export function TodayAtAGlance() {
  const order = useHomeLayoutStore((s) => s.itemOrders[HOME_SECTION_IDS.TODAY] ?? []);
  const isEditing = useHomeLayoutStore((s) => s.isEditing);
  const reorder = useHomeLayoutStore((s) => s.reorderItems);

  return (
    <section {...devProps('TodayAtAGlance')}>
      <SortableGroup
        ids={order}
        strategy="horizontal"
        disabled={!isEditing}
        onReorder={(fromId, toId) => reorder(HOME_SECTION_IDS.TODAY, fromId, toId)}
      >
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {order.map((id, i) => {
            const kpi = KPI_BY_ID[id as keyof typeof KPI_BY_ID];
            if (!kpi) return null;
            return (
              <SortableItem
                key={id}
                id={id}
                index={i}
                isEditing={isEditing}
                handleLabel={`Drag to reorder ${kpi.label}`}
                ghostShape="rounded"
              >
                <KpiTicket {...kpi} />
              </SortableItem>
            );
          })}
        </div>
      </SortableGroup>
    </section>
  );
}

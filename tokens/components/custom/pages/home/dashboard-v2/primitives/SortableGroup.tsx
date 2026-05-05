'use client';

import type { ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { devProps } from '@/lib/utils/dev-props';

export type SortableStrategy = 'horizontal' | 'vertical' | 'rect';

interface SortableGroupProps {
  ids: string[];
  strategy?: SortableStrategy;
  onReorder: (fromId: string, toId: string) => void;
  children: ReactNode;
  disabled?: boolean;
}

const strategyMap = {
  horizontal: horizontalListSortingStrategy,
  vertical: verticalListSortingStrategy,
  rect: rectSortingStrategy,
};

export function SortableGroup({
  ids,
  strategy = 'horizontal',
  onReorder,
  children,
  disabled = false,
}: SortableGroupProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder(String(active.id), String(over.id));
  }

  if (disabled) {
    return (
      <div {...devProps('SortableGroup')} className="contents">
        {children}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={strategyMap[strategy]}>
        <div {...devProps('SortableGroup')} className="contents">
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
}

'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsGrid } from '@untitledui-pro/icons/line';
import { useReducedMotion } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

export type GhostShape = 'chamfer' | 'rounded' | 'none';
export type HandlePosition = 'top-right' | 'left-gutter';

interface SortableItemProps {
  id: string;
  index?: number;
  isEditing: boolean;
  handleLabel?: string;
  ghostShape?: GhostShape;
  handlePosition?: HandlePosition;
  children: ReactNode;
  className?: string;
}

const CHAMFER_CLIP = (() => {
  const s = 12;
  return `polygon(${s}px 0, calc(100% - ${s}px) 0, 100% ${s}px, 100% calc(100% - ${s}px), calc(100% - ${s}px) 100%, ${s}px 100%, 0 calc(100% - ${s}px), 0 ${s}px)`;
})();

export function SortableItem({
  id,
  index = 0,
  isEditing,
  handleLabel,
  ghostShape = 'chamfer',
  handlePosition = 'top-right',
  children,
  className,
}: SortableItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !isEditing,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: isEditing && !prefersReducedMotion ? `${index * 50}ms` : undefined,
  };

  const ghostStyle: CSSProperties =
    ghostShape === 'chamfer' ? { clipPath: CHAMFER_CLIP } : {};

  return (
    <div
      {...devProps('SortableItem')}
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging ? 'true' : undefined}
      className={cx(
        'relative',
        isDragging && 'z-30 cursor-grabbing opacity-90 shadow-lg',
        className,
      )}
    >
      {/* Inner wrapper carries the wiggle animation. Its key swaps when
          edit mode toggles, forcing a remount so the finite animation
          replays on entry. The key lives here (not on the dnd-kit root)
          because the root holds the sortable ref and a non-unique key on
          the root would collide across mapped siblings. */}
      <div
        key={isEditing ? 'editing' : 'idle'}
        className={cx(
          'relative h-full w-full',
          isEditing && !prefersReducedMotion && !isDragging && 'animate-edit-wiggle',
        )}
      >
        {isEditing && ghostShape !== 'none' && (
          <div
            aria-hidden
            style={ghostStyle}
            className={cx(
              'pointer-events-none absolute inset-0 -z-10 bg-bg-secondary transition-opacity duration-standard',
              ghostShape === 'rounded' && 'rounded-md',
              isDragging ? 'opacity-70' : 'opacity-40',
            )}
          />
        )}
        {isEditing && (
          <button
            type="button"
            aria-label={handleLabel ?? 'Drag to reorder'}
            {...attributes}
            {...listeners}
            className={cx(
              'absolute z-40 flex h-6 w-6 cursor-grab items-center justify-center rounded-sm bg-bg-primary/70 text-fg-tertiary backdrop-blur-sm hover:text-fg-primary active:cursor-grabbing focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring-brand',
              handlePosition === 'top-right' && 'right-2 top-2',
              handlePosition === 'left-gutter' && '-left-8 top-2.5',
            )}
          >
            <DotsGrid className="h-3.5 w-3.5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

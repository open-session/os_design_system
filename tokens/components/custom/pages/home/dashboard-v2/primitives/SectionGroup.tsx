'use client';

import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';
import { Eyebrow } from './Eyebrow';

interface SectionGroupProps {
  label: string;
  right?: ReactNode;
  headerExtra?: ReactNode;
  isHidden?: boolean;
  defaultOpen?: boolean;
  marker?: 'outline' | 'filled';
  className?: string;
  children: ReactNode;
}

export function SectionGroup({
  label,
  right,
  headerExtra,
  isHidden = false,
  defaultOpen = true,
  marker = 'outline',
  className,
  children,
}: SectionGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      {...devProps('SectionGroup')}
      className={cx('relative', isHidden && 'opacity-40', className)}
    >
      <div className="relative flex items-center py-3">
        <span className="pointer-events-none absolute inset-x-0 top-1.5 h-px bg-border-secondary" />
        <span className="pointer-events-none absolute inset-x-0 bottom-1 h-px bg-border-secondary" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-b border-dotted border-border-secondary"
        />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          className="group relative flex flex-1 items-center text-left outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
        >
          <span className="relative flex items-center gap-2.5 bg-bg-primary px-1">
            <span
              aria-hidden
              className={cx(
                'h-1.5 w-1.5 rotate-45',
                marker === 'filled'
                  ? 'bg-[var(--color-brand-500)]'
                  : 'border border-[var(--color-brand-500)]',
              )}
            />
            <Eyebrow size="sm" tone="primary">
              {label}
            </Eyebrow>
            {isHidden && (
              <Eyebrow size="sm" tone="tertiary" as="span">
                · Hidden
              </Eyebrow>
            )}
          </span>

          <span className="relative ml-auto flex items-center gap-2.5 bg-bg-primary pl-2.5">
            {right && (
              <Eyebrow size="sm" tone="tertiary" as="span">
                {right}
              </Eyebrow>
            )}
            <ChevronDown
              className={cx(
                'h-3.5 w-3.5 text-fg-tertiary transition-transform duration-200',
                open ? 'rotate-0' : '-rotate-90',
              )}
              aria-hidden
            />
          </span>
        </button>

        {headerExtra && (
          <span className="relative ml-1 flex items-center bg-bg-primary">
            {headerExtra}
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && !isHidden && (
          <motion.div
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

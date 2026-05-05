'use client';

import { AnimatePresence, motion } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { cx } from '@/utils/cx';

interface EditGridOverlayProps {
  visible: boolean;
  className?: string;
}

/**
 * Blueprint-style grid that appears behind the home dashboard only while
 * the user is editing the layout. Uses CSS linear-gradients (cheap, crisp)
 * and the `--border-secondary` token so the grid lines stay visible on
 * both the warm Charcoal and Vanilla surfaces.
 */
export function EditGridOverlay({ visible, className }: EditGridOverlayProps) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key="edit-grid"
          {...devProps('EditGridOverlay')}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className={cx(
            'pointer-events-none absolute inset-x-[-1rem] inset-y-0 -z-10',
            className,
          )}
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--border-secondary) 1px, transparent 1px), linear-gradient(to bottom, var(--border-secondary) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      )}
    </AnimatePresence>
  );
}

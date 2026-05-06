'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { devProps } from '@/lib/utils/dev-props';
import { Button } from '@/components/ds/buttons/button';
import { useLayoutPreferences } from '@/hooks/useLayoutPreferences';
import { useHomeLayoutStore } from '@/stores/home-layout-store';

export function GreetingHeader() {
  const { save } = useLayoutPreferences();
  const isEditing = useHomeLayoutStore((s) => s.isEditing);
  const enterEdit = useHomeLayoutStore((s) => s.enterEdit);
  const cancelEdit = useHomeLayoutStore((s) => s.cancelEdit);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      await save();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      {...devProps('GreetingHeader')}
      className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div>
        <h1 className="m-0 mb-3 font-display text-[44px] leading-[0.95] text-fg-brand-secondary sm:text-[52px]">
          Hello, Karim
        </h1>
        <p className="m-0 text-sm font-normal text-fg-tertiary">
          Your brand&apos;s looking great.{' '}
          <span className="text-fg-primary">Here&apos;s the pulse</span>.
        </p>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <AnimatePresence mode="wait" initial={false}>
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex gap-2"
            >
              <Button
                color="secondary"
                size="sm"
                onClick={cancelEdit}
                isDisabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={handleSave}
                isDisabled={isSaving}
                isLoading={isSaving}
              >
                Save layout
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <Button color="secondary" size="sm" onClick={enterEdit}>
                Edit layout
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

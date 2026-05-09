'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { staggerContainerFast, fadeInUp } from '@/lib/motion';
import { useLayoutPreferences } from '@/hooks/useLayoutPreferences';
import { useHomeLayoutStore } from '@/stores/home-layout-store';
import { EditGridOverlay } from './primitives/EditGridOverlay';
import { Eyebrow } from './primitives/Eyebrow';
import { SectionGroup } from './primitives/SectionGroup';
import { SortableGroup } from './primitives/SortableGroup';
import { SortableItem } from './primitives/SortableItem';
import { HOME_SECTION_IDS } from './layout-config';
import { GreetingHeader } from './sections/GreetingHeader';
import { TodayAtAGlance } from './sections/TodayAtAGlance';
import { FeaturesRow } from './sections/FeaturesRow';
import { BrandHealthRow } from './sections/BrandHealthRow';
import { SocialPulse } from './sections/SocialPulse';
import { ActivityCalendarAssets } from './sections/ActivityCalendarAssets';

interface SectionConfig {
  label: string;
  right?: ReactNode;
  render: () => ReactNode;
}

const SECTIONS: Record<string, SectionConfig> = {
  [HOME_SECTION_IDS.TODAY]: {
    label: 'Overview',
    right: 'Thu 19 Apr 2026',
    render: () => <TodayAtAGlance />,
  },
  [HOME_SECTION_IDS.FEATURES]: {
    label: 'Features',
    right: '8 features',
    render: () => <FeaturesRow />,
  },
  [HOME_SECTION_IDS.BRAND_HEALTH]: {
    label: 'Brand Context',
    render: () => <BrandHealthRow />,
  },
  [HOME_SECTION_IDS.SOCIAL_PULSE]: {
    label: 'Social Pulse',
    right: 'Reach · Engagement · Sentiment',
    render: () => <SocialPulse />,
  },
  [HOME_SECTION_IDS.WORKSPACE_PULSE]: {
    label: 'Workspace Pulse',
    right: 'Activity · Next 7 days · Assets',
    render: () => <ActivityCalendarAssets />,
  },
};

export function HomeDashboardV2() {
  useLayoutPreferences();
  const sectionOrder = useHomeLayoutStore((s) => s.sectionOrder);
  const hiddenSectionIds = useHomeLayoutStore((s) => s.hiddenSectionIds);
  const isEditing = useHomeLayoutStore((s) => s.isEditing);
  const reorderSections = useHomeLayoutStore((s) => s.reorderSections);
  const toggleSectionVisibility = useHomeLayoutStore((s) => s.toggleSectionVisibility);
  const cancelEdit = useHomeLayoutStore((s) => s.cancelEdit);

  const visibleSectionOrder = useMemo(
    () => (isEditing ? sectionOrder : sectionOrder.filter((id) => !hiddenSectionIds.includes(id))),
    [isEditing, sectionOrder, hiddenSectionIds],
  );

  useEffect(() => {
    if (!isEditing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isEditing, cancelEdit]);

  return (
    <motion.div
      {...devProps('HomeDashboardV2')}
      variants={staggerContainerFast}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col gap-8"
    >
      <EditGridOverlay visible={isEditing} />

      <motion.div variants={fadeInUp}>
        <GreetingHeader />
      </motion.div>

      {isEditing && (
        <div
          role="status"
          aria-live="polite"
          className="mt-2 flex items-center justify-center gap-2 rounded-sm bg-bg-secondary/60 px-3 py-2 text-xs text-fg-tertiary backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rotate-45 bg-bg-brand-solid" aria-hidden />
          <span>
            Editing layout — drag to reorder, then <span className="text-fg-primary">Save</span>{' '}
            or press <span className="text-fg-primary">Esc</span> to cancel.
          </span>
        </div>
      )}

      <SortableGroup
        ids={visibleSectionOrder}
        strategy="vertical"
        disabled={!isEditing}
        onReorder={reorderSections}
      >
        <div className={isEditing ? 'pl-8' : undefined}>
          {visibleSectionOrder.map((id, i) => {
            const section = SECTIONS[id];
            if (!section) return null;
            const isHidden = hiddenSectionIds.includes(id);
            const hideToggle = isEditing ? (
              <button
                type="button"
                onClick={() => toggleSectionVisibility(id)}
                aria-label={isHidden ? `Show ${section.label}` : `Hide ${section.label}`}
                className="flex h-6 w-6 items-center justify-center rounded-sm text-fg-tertiary hover:text-fg-primary focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring-brand"
              >
                {isHidden ? (
                  <Eye className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden />
                )}
              </button>
            ) : null;
            return (
              <motion.div key={id} variants={fadeInUp}>
                <SortableItem
                  id={id}
                  index={i}
                  isEditing={isEditing}
                  handleLabel={`Drag to reorder ${section.label}`}
                  ghostShape="none"
                  handlePosition="left-gutter"
                >
                  <SectionGroup
                    label={section.label}
                    right={section.right}
                    isHidden={isHidden}
                    headerExtra={hideToggle}
                  >
                    {section.render()}
                  </SectionGroup>
                </SortableItem>
              </motion.div>
            );
          })}
        </div>
      </SortableGroup>

      <motion.div
        variants={fadeInUp}
        className="mt-7 flex flex-col items-start justify-between gap-2 border-t border-border-secondary pt-4 sm:flex-row sm:items-center"
      >
        <Eyebrow size="sm" tone="quaternary">
          Open Session · Brand Operating System · v0.4.2
        </Eyebrow>
        <Eyebrow size="sm" tone="quaternary">
          Your brand, amplified by intelligence
        </Eyebrow>
      </motion.div>
    </motion.div>
  );
}

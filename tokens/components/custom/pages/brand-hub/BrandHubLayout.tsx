'use client';

import React, { useState, useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PageHeader } from '@/components/custom/shared/navigation/PageHeader';
import { inlineContentToggle } from '@/lib/motion';
import { devProps } from '@/lib/utils/dev-props';
import { EditablePageHeader } from '@/components/custom/pages/brand-hub/EditablePageHeader';
import { useBrandHubPages } from '@/hooks/useBrandHubPages';

/** Helpers passed to the pageMeta render-prop variant. */
export interface BrandHubLayoutPageMetaHelpers {
  /** Toggle the settings panel open/closed. */
  onSettingsClick: () => void;
  /** Current settings panel open state — use for aria-expanded / active styles. */
  isSettingsOpen: boolean;
  /** ID of the settings panel element — use for aria-controls. */
  settingsPanelId: string;
}

interface BrandHubLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  /**
   * Page slug — used to enable editable title/description when settings are open.
   * When provided and `isSettingsOpen === true`, the header title and description
   * become inline-editable inputs that auto-save to Supabase on blur.
   */
  slug?: string;
  /** Right-side toolbar content (typically PageMeta or BrandHubPageMeta) */
  headerActions?: React.ReactNode;
  /**
   * Page meta bar (edited date, avatars, dots menu).
   * When a function, receives `BrandHubLayoutPageMetaHelpers` — the layout
   * provides the handler and state so the toggle lives internally.
   */
  pageMeta?:
    | React.ReactNode
    | ((helpers: BrandHubLayoutPageMetaHelpers) => React.ReactNode);
  /**
   * The settings/table view to render in place of `children` when the
   * settings toggle is active. When undefined/null the settings button
   * is hidden or inactive.
   */
  settingsContent?: React.ReactNode;
  /** Tooltip text for the settings button. */
  settingsTooltip?: string;
  /** Show a loading indicator on the settings button. */
  settingsLoading?: boolean;
}

/**
 * BrandHubLayout — shared wrapper for all Brand Hub sub-pages.
 *
 * Manages the inline settings toggle internally. When `settingsContent` is
 * provided, the settings button in the page-meta area toggles between the
 * default `children` (content view) and `settingsContent` (table/settings
 * view) using AnimatePresence crossfade driven by `inlineContentToggle`.
 *
 * When `slug` is provided and settings are open, the page title and description
 * become editable inputs via `EditablePageHeader`. Changes auto-save on blur
 * via `useBrandHubPages.updatePage`. The layout owns the single hook instance
 * to avoid duplicate fetches.
 *
 * No auth dependency — `isSettingsOpen` is pure UI state.
 */
export function BrandHubLayout({
  children,
  title,
  description,
  slug,
  headerActions,
  pageMeta,
  settingsContent,
  settingsTooltip: _settingsTooltip,
  settingsLoading: _settingsLoading,
}: BrandHubLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const uid = useId();
  const settingsPanelId = `brand-hub-settings-panel-${uid}`;

  // Owned hook instance — passed as props to EditablePageHeader to prevent
  // duplicate fetches and stale-state issues from independent instances.
  const { getPage, updatePage } = useBrandHubPages();

  const handleSettingsClick = () => {
    setIsSettingsOpen(prev => !prev);
  };

  const resolvedPageMeta =
    typeof pageMeta === 'function'
      ? pageMeta({ onSettingsClick: handleSettingsClick, isSettingsOpen, settingsPanelId })
      : pageMeta;

  const actions = resolvedPageMeta ?? headerActions;

  // Transition override for prefers-reduced-motion
  const motionTransition = shouldReduceMotion ? { duration: 0 } : undefined;

  // When settings are open and a slug is provided, the editable header replaces
  // the static PageHeader title/description. The headerActions row is kept visible.
  const showEditableHeader = isSettingsOpen && Boolean(slug);

  return (
    <div
      {...devProps('BrandHubLayout')}
      className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar bg-bg-secondary"
    >
      {/* Header — always visible, never animated.
          When settings are open and a slug exists, EditablePageHeader replaces
          the standard PageHeader title/description area. */}
      {showEditableHeader ? (
        <div
          {...devProps('BrandHubLayoutEditableHeader')}
          className="border-b border-border-secondary bg-bg-secondary pt-6 lg:pt-6"
        >
          <div className="max-w-7xl mx-auto px-6 pt-2 pb-4 md:px-12 md:pt-1 md:pb-3 lg:pt-1.5 lg:pb-4">
            <div className="flex items-start justify-between w-full gap-4">
              <EditablePageHeader
                slug={slug!}
                fallbackTitle={title}
                fallbackDescription={description}
                isEditing={true}
                getPage={getPage}
                updatePage={updatePage}
              />
              {actions && (
                <div className="flex items-center gap-2 shrink-0 mt-1">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <PageHeader
          title={title}
          description={description}
          headerActions={actions}
        />
      )}

      {/* Animated content / settings panel */}
      <div className="bg-bg-primary flex-1">
        <AnimatePresence mode="wait">
          {isSettingsOpen && settingsContent != null ? (
            <motion.div
              key="settings"
              {...devProps('BrandHubLayoutSettingsPanel')}
              id={settingsPanelId}
              role="region"
              aria-label="Page settings"
              variants={inlineContentToggle}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={motionTransition}
              className="max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-10"
            >
              {settingsContent}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              {...devProps('BrandHubLayoutContent')}
              variants={inlineContentToggle}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={motionTransition}
              className="max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-10"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

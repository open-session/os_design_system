'use client';

import { PageToolbar } from '@/components/custom/shared/navigation/PageToolbar';
import { devProps } from '@/lib/utils/dev-props';

interface BrandHubPageMetaProps {
  /** When provided, the "Settings" menu item triggers this callback. */
  onSettingsClick?: () => void;
  /**
   * Whether the settings panel is currently open.
   * Forwarded to the toolbar so the Settings button can show an active state
   * and the correct aria-expanded attribute.
   */
  isSettingsOpen?: boolean;
  /**
   * The id of the settings panel element, used for the aria-controls attribute
   * on the Settings toggle button.
   */
  settingsPanelId?: string;
  /** ISO date string for when the page was last updated. */
  updatedAt?: string | null;
}

/**
 * BrandHub-specific wrapper around the shared PageToolbar component.
 * Passes BrandHub settings state through to the dots menu.
 */
export function BrandHubPageMeta({
  onSettingsClick,
  isSettingsOpen,
  settingsPanelId,
  updatedAt,
}: BrandHubPageMetaProps = {}) {
  return (
    <div {...devProps('BrandHubPageMeta')} className="contents">
      <PageToolbar
        onSettingsClick={onSettingsClick}
        isSettingsOpen={isSettingsOpen}
        settingsPanelId={settingsPanelId}
        updatedAt={updatedAt}
      />
    </div>
  );
}

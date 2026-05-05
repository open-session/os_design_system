'use client';

import { devProps } from '@/lib/utils/dev-props';
import { OPEN_SESSION_ORG } from '@/stores/org-store';

// ============================================
// Props
// ============================================

interface BrandSelectorProps {
  className?: string;
  /** Layout variant — accepted for caller compatibility, not used in static prototype */
  variant?: 'dropdown' | 'inline';
}

// ============================================
// BrandSelector
// ============================================

/**
 * Displays the active organization name as a static label.
 * Static prototype — org switching deferred to future multi-tenant implementation.
 * CreateOrgModal and dropdown removed in PRD 012 (auth-org-simplification).
 */
export function BrandSelector({ className = '' }: BrandSelectorProps) {
  return (
    <div
      {...devProps('BrandSelector')}
      className={`flex items-center px-2 py-1.5 ${className}`}
    >
      <span className="text-sm font-medium text-fg-primary truncate max-w-[120px]">
        {OPEN_SESSION_ORG.name}
      </span>
    </div>
  );
}

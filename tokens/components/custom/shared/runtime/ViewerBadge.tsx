'use client';

import { devProps } from '@/lib/utils/dev-props';

interface ViewerBadgeProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the badge even when loading (default: false) */
  showWhileLoading?: boolean;
}

/**
 * Badge indicating view-only access. Static prototype — always returns null.
 * Open Session has only two full-admin users; the viewer role does not exist.
 * Kept as a stub so existing call sites compile without changes.
 */
 
export function ViewerBadge({ className = '', showWhileLoading = false }: ViewerBadgeProps) {
  void devProps; // suppress unused import lint warning
  return null;
}

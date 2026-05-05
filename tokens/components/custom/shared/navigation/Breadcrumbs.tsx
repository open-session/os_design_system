'use client';

import { useState } from 'react';
import Link from 'next/link';
import { devProps } from '@/lib/utils/dev-props';
import { Link01, Zap } from '@untitledui-pro/icons/line';
import { motion, AnimatePresence } from 'motion/react';
import { useBreadcrumbs } from '@/lib/breadcrumb-context';
import { getQuickActionConfig } from '@/lib/quick-actions';
import { BrandSelector } from '@/components/custom/shared/selectors/BrandSelector';

/**
 * Quick Action Badge - Gray chip with lightning bolt for guided chat mode
 */
function QuickActionBadge({ type }: { type: string }) {
  const config = getQuickActionConfig(type as any);
  if (!config) return null;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...devProps('QuickActionBadge')}
      className="
        inline-flex items-center gap-1.5
        px-2.5 py-1
        rounded-lg
        text-xs font-medium
        bg-bg-tertiary text-fg-primary
        border border-border-secondary
      "
    >
      <Zap className="w-3 h-3" />
      {config.title}
    </motion.span>
  );
}

export function Breadcrumbs() {
  const { breadcrumbs } = useBreadcrumbs();

  // Separate breadcrumbs into path items (with href) and the final title (without href)
  // Items with href are always path items, only the last item without href is the title
  const lastItem = breadcrumbs[breadcrumbs.length - 1];
  const hasTitle = lastItem && !lastItem.href;
  const pathBreadcrumbs = hasTitle ? breadcrumbs.slice(0, -1) : breadcrumbs;
  const titleBreadcrumb = hasTitle ? lastItem : null;

  return (
    <nav {...devProps('Breadcrumbs')} className="flex items-center text-sm" aria-label="Breadcrumb">
      {/* Separator after brand icon */}
      <span className="mx-2 text-fg-quaternary">/</span>

      {/* Organization Switcher */}
      <BrandSelector />

      {/* Path breadcrumbs (everything except the final title) */}
      {pathBreadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          <span className="mx-2 text-fg-quaternary">/</span>
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="
                px-2 py-1
                rounded
                text-fg-secondary hover:text-fg-primary
                hover:bg-bg-tertiary
                transition-all duration-150
              "
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="px-2 py-1 text-fg-primary">
              {crumb.label}
            </span>
          )}
        </div>
      ))}

      {/* Title breadcrumb (final item) - animated when it appears */}
      {/* Shows lightning bolt icon for quick action chats */}
      {titleBreadcrumb && (
        <div className="flex items-center">
          <span className="mx-2 text-fg-quaternary">/</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={titleBreadcrumb.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center gap-1.5 px-2 py-1 text-fg-primary"
            >
              {titleBreadcrumb.isQuickAction && (
                <Zap className="w-3 h-3 text-fg-tertiary" />
              )}
              {titleBreadcrumb.label}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </nav>
  );
}

'use client';

import React from 'react';
import { devProps } from '@/lib/utils/dev-props';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  /** Right-side slot: PageMeta toolbar, action buttons, etc. */
  headerActions?: React.ReactNode;
  /** Inline adornment after title (e.g., InfoPopover) */
  titleAdornment?: React.ReactNode;
  className?: string;
}

/**
 * Unified page header used across all dashboard pages.
 *
 * Renders a bordered header with bg-bg-secondary background and border-bottom,
 * consistent h1 styling (font-display + tracking-display), max-width alignment,
 * and a flexible right-side actions slot (typically PageMeta).
 */
export function PageHeader({
  title,
  description,
  headerActions,
  titleAdornment,
  className,
}: PageHeaderProps) {
  return (
    <div
      {...devProps('PageHeader')}
      className={`border-b border-border-secondary bg-bg-secondary pt-6 lg:pt-6 ${className ?? ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-4 md:px-12 md:pt-1 md:pb-3 lg:pt-1.5 lg:pb-4">
        {/* Title Row */}
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-fg-primary leading-tight tracking-display">
              {title}
            </h1>
            {titleAdornment}
          </div>

          {headerActions && (
            <div className="flex items-center gap-2 shrink-0">
              {headerActions}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-base md:text-lg text-fg-tertiary max-w-2xl mt-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface ProjectStyleCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconLabel: string;
  /** Formatted timestamp string, e.g. "Updated 2 days ago" */
  lastUpdated?: string;
  /** Show a "New" badge — true if page was created very recently */
  isNew?: boolean;
}

/**
 * Compact card with icon-first hierarchy
 * - Large icon at top-left (40x40 container)
 * - Title below icon
 * - Description (1-2 lines)
 * - Hover: border changes to Aperol, text stays consistent
 */
export function ProjectStyleCard({
  href,
  title,
  description,
  icon: Icon,
  lastUpdated,
  isNew,
}: ProjectStyleCardProps) {
  return (
    <motion.div
      {...devProps('ProjectStyleCard')}
      className="h-full"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href={href}
        className="group relative h-full flex flex-col p-4 gap-3 rounded-xl bg-bg-secondary border border-border-secondary hover:bg-bg-secondary hover:border-border-brand transition-all duration-150"
      >
        {/* Row 1: Icon container (top-left) + optional New badge */}
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-tertiary border border-border-secondary transition-colors">
            <Icon className="w-5 h-5 text-fg-secondary" />
          </div>
          <div className="flex items-center gap-1.5">
            {isNew && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-bg-brand-primary text-fg-brand-primary">
                New
              </span>
            )}
            <ArrowRight className="w-4 h-4 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Row 2: Title */}
        <h3 className="text-lg font-accent font-bold text-fg-primary">
          {title}
        </h3>

        {/* Row 3: Description */}
        <p className="text-sm text-fg-tertiary line-clamp-2 flex-1">
          {description}
        </p>

        {/* Row 4: Last updated timestamp */}
        {lastUpdated && (
          <p className="text-[11px] text-fg-quaternary mt-1">{lastUpdated}</p>
        )}
      </Link>
    </motion.div>
  );
}

export default ProjectStyleCard;

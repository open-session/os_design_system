'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Pencil01 } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface TokenPreviewSectionProps {
  /** Section title */
  title: string;
  /** Badge text (e.g., "3 colors") */
  badge?: string;
  /** Optional description text below title */
  description?: string;
  /** Whether section starts expanded */
  defaultExpanded?: boolean;
  /** Section content */
  children: React.ReactNode;
  /** Optional edit callback */
  onEdit?: () => void;
}

/**
 * TokenPreviewSection
 *
 * A collapsible accordion section for displaying design token previews.
 * Features smooth Framer Motion animations and accessible ARIA attributes.
 */
export function TokenPreviewSection({
  title,
  badge,
  description,
  defaultExpanded = false,
  children,
  onEdit,
}: TokenPreviewSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const sectionId = `token-section-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <motion.div
      {...devProps('TokenPreviewSection')}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border-secondary bg-bg-secondary overflow-hidden"
    >
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        aria-controls={sectionId}
        className="w-full flex items-center justify-between px-5 py-4 min-h-[44px] hover:bg-bg-secondary-hover transition-colors group cursor-pointer"
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-fg-primary">
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-0.5 text-xs font-medium text-fg-tertiary bg-bg-tertiary rounded-full">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-fg-secondary">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Edit button - appears on hover */}
          {onEdit && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2.5 sm:p-1.5 rounded-lg text-fg-tertiary hover:text-fg-brand-primary hover:bg-bg-tertiary transition-colors opacity-0 group-hover:opacity-100 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Edit ${title}`}
            >
              <Pencil01 className="w-4 h-4" />
            </motion.button>
          )}

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-fg-tertiary" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={sectionId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2 }
            }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-border-secondary">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

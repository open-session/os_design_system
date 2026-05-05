'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy01 } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import type { BrandThemeSpacing } from '@/lib/supabase/types';

interface SpacingTokensPreviewProps {
  spacing: BrandThemeSpacing;
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      {...devProps('CopyButton')}
      onClick={handleCopy}
      className="p-1 rounded text-fg-tertiary hover:text-fg-primary transition-colors opacity-0 group-hover:opacity-100"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Copy ${text}`}
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy01 className="w-3 h-3" />
      )}
    </motion.button>
  );
}

// Convert rem to px for display
function remToPx(rem: string): number {
  const value = parseFloat(rem);
  return value * 16;
}

// Spacing bar component
function SpacingBar({
  name,
  value,
  maxValue,
  index
}: {
  name: string;
  value: string;
  maxValue: number;
  index: number;
}) {
  const pxValue = remToPx(value);
  const percentage = maxValue > 0 ? (pxValue / maxValue) * 100 : 0;

  return (
    <motion.div
      {...devProps('SpacingBar')}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-bg-tertiary transition-colors group"
    >
      {/* Token name */}
      <div className="w-10 shrink-0">
        <code className="text-sm font-mono text-fg-secondary">{name}</code>
      </div>

      {/* Visual bar */}
      <div className="flex-1 h-6 bg-bg-tertiary rounded relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(percentage, 2)}%` }}
          transition={{ duration: 0.5, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
          className="h-full bg-bg-brand-solid/20 rounded relative"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: index * 0.03 + 0.2 }}
            className="absolute inset-y-0 left-0 w-1 bg-fg-brand-primary rounded-l"
            style={{ originX: 0 }}
          />
        </motion.div>

        {pxValue > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 + 0.3 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-fg-tertiary"
          >
            {pxValue}px
          </motion.div>
        )}
      </div>

      {/* Rem value */}
      <div className="w-16 text-right shrink-0">
        <code className="text-xs font-mono text-fg-tertiary">{value}</code>
      </div>

      {/* Copy */}
      <CopyButton text={value} />
    </motion.div>
  );
}

/**
 * SpacingTokensPreview
 *
 * Displays the spacing scale with visual bars, border-radius tokens,
 * and shadow tokens.
 */
export function SpacingTokensPreview({ spacing }: SpacingTokensPreviewProps) {
  const spacingEntries = Object.entries(spacing.scale);
  const maxPxValue = Math.max(...spacingEntries.map(([, value]) => remToPx(value)));

  const radiusEntries = Object.entries(spacing.borderRadius);
  const shadowEntries = Object.entries(spacing.shadows);

  return (
    <div {...devProps('SpacingTokensPreview')} className="space-y-6">
      {/* Spacing Scale */}
      <div>
        <h4 className="text-sm font-medium text-fg-secondary mb-3">
          Spacing Scale
        </h4>
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 py-2 px-3 border-b border-border-secondary bg-bg-secondary">
            <span className="w-10 shrink-0 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Token
            </span>
            <span className="flex-1 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Scale
            </span>
            <span className="w-16 text-right shrink-0 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
              Value
            </span>
            <span className="w-6" />
          </div>

          {/* Bars */}
          <div className="divide-y divide-border-tertiary">
            {spacingEntries.map(([name, value], index) => (
              <SpacingBar
                key={name}
                name={name}
                value={value}
                maxValue={maxPxValue}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Quick reference chips */}
        <div className="mt-3">
          <h5 className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-2">
            Common Values
          </h5>
          <div className="flex flex-wrap gap-2">
            {[
              { name: '4', label: 'sm', desc: 'Tight spacing' },
              { name: '8', label: 'md', desc: 'Default gap' },
              { name: '12', label: 'lg', desc: 'Section padding' },
              { name: '16', label: 'xl', desc: 'Large sections' },
            ].map((item, index) => {
              const value = spacing.scale[item.name];
              if (!value) return null;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-secondary bg-bg-secondary group"
                >
                  <span className="text-sm font-medium text-fg-primary">
                    {item.label}
                  </span>
                  <span className="text-xs text-fg-tertiary">
                    {value} ({remToPx(value)}px)
                  </span>
                  <CopyButton text={value} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h4 className="text-sm font-medium text-fg-secondary mb-3">
          Border Radius
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {radiusEntries.map(([name, value], index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border-secondary bg-bg-tertiary group"
            >
              {/* Visual preview */}
              <div
                className="w-8 h-8 bg-bg-brand-solid/20 border border-border-brand shrink-0"
                style={{ borderRadius: value }}
              />
              <div className="flex-1 min-w-0">
                <code className="text-xs font-mono text-fg-secondary block truncate">{name}</code>
                <span className="text-[10px] text-fg-tertiary">{value}</span>
              </div>
              <CopyButton text={value} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Shadows */}
      {shadowEntries.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-fg-secondary mb-3">
            Shadows
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shadowEntries.map(([name, value], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 rounded-xl border border-border-secondary bg-bg-tertiary group"
              >
                {/* Shadow preview */}
                <div
                  className="w-full h-16 rounded-lg bg-bg-secondary mb-3"
                  style={{ boxShadow: value }}
                />
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono text-fg-secondary">{name}</code>
                  <CopyButton text={value} />
                </div>
                <p className="text-[10px] text-fg-tertiary mt-1 font-mono truncate" title={value}>
                  {value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Usage note */}
      <p className="text-xs text-fg-tertiary leading-relaxed">
        Use consistent spacing tokens for padding, margins, and gaps. The scale follows a 4px base unit
        with values doubling at key breakpoints for visual rhythm.
      </p>
    </div>
  );
}

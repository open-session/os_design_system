'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';
import { Monitor01, Moon01, Sun } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

type ThemeOption = 'dark' | 'light' | 'system';

const themeOptions: { id: ThemeOption; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dark', label: 'Dark', icon: Moon01 },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor01 },
];

/**
 * Compact theme toggle for use in dropdowns.
 * Displays three icon buttons in a row with native tooltips for accessibility.
 * Uses a sliding indicator to show the currently selected theme.
 */
export function ThemeCompactToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Loading placeholder - matches the final dimensions
    return (
      <div {...devProps('ThemeCompactToggle')} className="flex items-center gap-0.5 p-0.5 bg-bg-tertiary rounded-md h-8">
        {themeOptions.map((option) => (
          <div
            key={option.id}
            className="w-8 h-7 rounded bg-bg-quaternary animate-pulse"
          />
        ))}
      </div>
    );
  }

  const currentTheme = theme as ThemeOption;

  return (
    <div
      {...devProps('ThemeCompactToggle')}
      className="flex items-center gap-0.5 p-0.5 bg-bg-tertiary rounded-md"
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = currentTheme === option.id;
        
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            title={option.label}
            aria-label={`${option.label} theme`}
            role="radio"
            aria-checked={isSelected}
            className={`
              relative flex items-center justify-center
              w-8 h-7 rounded
              transition-colors duration-quick
              focus:outline-hidden focus-visible:ring-1 focus-visible:ring-fg-brand-primary focus-visible:ring-offset-1
              ${isSelected 
                ? 'text-fg-primary' 
                : 'text-fg-tertiary hover:text-fg-secondary'
              }
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="theme-compact-indicator"
                className="absolute inset-0 bg-bg-secondary rounded shadow-sm border border-border-secondary"
                transition={{ type: 'spring', duration: 0.25, bounce: 0.1 }}
              />
            )}
            <Icon className="relative z-10 w-3.5 h-3.5" />
          </button>
        );
      })}
    </div>
  );
}


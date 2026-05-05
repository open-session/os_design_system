'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';
import { Monitor01 as Monitor, Moon01 as Moon, Sun } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

type ThemeOption = 'dark' | 'light' | 'system';

const themeOptions: { id: ThemeOption; label: string; icon: typeof Moon }[] = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor },
];

export function ThemeSegmentedControl() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Loading placeholder - matches the final height
    return (
      <div {...devProps('ThemeSegmentedControl')} className="flex items-center gap-1 p-1 bg-bg-tertiary rounded-lg h-11">
        {themeOptions.map((option) => (
          <div
            key={option.id}
            className="flex-1 h-9 rounded-md bg-bg-quaternary animate-pulse"
          />
        ))}
      </div>
    );
  }

  const currentTheme = theme as ThemeOption;

  return (
    <div
      {...devProps('ThemeSegmentedControl')}
      className="flex items-center gap-1 p-1 bg-bg-tertiary rounded-lg"
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = currentTheme === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`
              relative flex-1 flex items-center justify-center gap-2
              h-9 px-3 rounded-md
              text-sm font-medium
              transition-colors duration-150
              min-w-[44px]
              ${isSelected 
                ? 'text-fg-primary' 
                : 'text-fg-tertiary hover:text-fg-secondary'
              }
            `}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${option.label} theme`}
          >
            {isSelected && (
              <motion.div
                layoutId="theme-segment-indicator"
                className="absolute inset-0 bg-bg-secondary rounded-md shadow-sm border border-border-secondary"
                transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}


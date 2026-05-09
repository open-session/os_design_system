'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon01, Sun } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface ThemeToggleProps {
  /** When true, shows collapsed icon-only version for desktop sidebar */
  isCollapsed?: boolean;
  /** When 'drawer', shows full-width mobile drawer style */
  variant?: 'sidebar' | 'drawer';
}

export function ThemeToggle({ isCollapsed = false, variant = 'sidebar' }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Loading placeholder
    if (variant === 'drawer') {
      return (
        <div {...devProps('ThemeToggle')} className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg">
          <div className="w-5 h-5 animate-pulse bg-bg-tertiary rounded" />
          <div className="h-4 w-20 animate-pulse bg-bg-tertiary rounded" />
        </div>
      );
    }
    return (
      <div {...devProps('ThemeToggle')} className="flex flex-col items-center justify-center py-2 px-2 min-h-[52px]">
        <div className="w-8 h-8 animate-pulse bg-bg-tertiary rounded-lg" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  // Mobile drawer variant - matches other drawer items
  if (variant === 'drawer') {
    return (
      <button
        {...devProps('ThemeToggle')}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="
          w-full flex items-center space-x-3 px-3 py-3 rounded-lg
          text-fg-tertiary
          hover:bg-bg-tertiary hover:text-fg-primary
          transition-all duration-standard
        "
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon01 className="w-5 h-5" />
        )}
        <span className="font-medium">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    );
  }

  // Desktop sidebar variant
  return (
    <button
      {...devProps('ThemeToggle')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="
        flex flex-col items-center justify-center
        py-2 px-2 min-h-[52px]
        text-fg-tertiary hover:text-fg-primary
        transition-colors duration-quick group
      "
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-lg group-hover:bg-bg-tertiary transition-colors duration-quick">
        {isDark ? (
          <Sun className="w-[18px] h-[18px]" />
        ) : (
          <Moon01 className="w-[18px] h-[18px]" />
        )}
      </div>
      <span 
        className="text-[9px] font-medium text-center mt-1 transition-all duration-standard ease-motion-out"
        style={{
          opacity: isCollapsed ? 0 : 1,
          transform: isCollapsed ? 'translateY(-2px)' : 'translateY(0)',
          transitionDelay: isCollapsed ? '0ms' : '150ms',
        }}
      >
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

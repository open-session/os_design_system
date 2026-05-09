'use client';

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Settings01 } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface Tab {
  id: string;
  label: string;
  badge?: string;
}

interface SettingsTabsProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SettingsTabs({ tabs, activeTab, onTabChange }: SettingsTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Check scroll position to show/hide navigation arrows
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  // Update sliding indicator position
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLButtonElement;
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
      // Mark as initialized after first measurement
      if (!isInitialized) {
        requestAnimationFrame(() => setIsInitialized(true));
      }
    }
  }, [activeTab, tabs, isInitialized]);

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 150;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div {...devProps('SettingsTabs')} className="relative flex items-center bg-bg-tertiary rounded-lg p-1">
      {/* Left arrow - only render when needed */}
      {showLeftArrow && (
        <motion.button
          onClick={() => scroll('left')}
          className="
            flex-shrink-0
            w-7 h-7
            flex items-center justify-center
            rounded-md
            text-fg-tertiary hover:text-fg-primary
            hover:bg-bg-quaternary
            transition-colors duration-quick
          "
          aria-label="Scroll tabs left"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
      )}

      {/* Tabs scroll container */}
      <div
        ref={scrollContainerRef}
        className="
          relative flex-1 min-w-0
          flex items-center gap-0.5
          overflow-x-auto
          scrollbar-hide
          scroll-smooth
          touch-pan-x
          overscroll-x-contain
        "
        role="tablist"
        aria-label="Settings tabs"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Sliding indicator with spring animation */}
        <motion.div
          className="absolute top-0 bottom-0 rounded-md bg-bg-primary shadow-sm"
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
            mass: 1,
          }}
          style={{
            // Hide until initialized to prevent flash
            opacity: isInitialized ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              className="
                relative z-10 
                flex items-center gap-2
                px-3 py-1.5
                rounded-md
                text-xs font-medium
                whitespace-nowrap
                cursor-pointer
                select-none
              "
              animate={{
                color: isActive ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
              }}
              whileHover={!isActive ? { 
                color: 'var(--fg-secondary)',
              } : {}}
              whileTap={{ scale: 0.98 }}
              transition={{
                color: { duration: 0.15, ease: 'easeOut' },
                scale: { type: 'spring', stiffness: 400, damping: 25 },
              }}
            >
              {tab.label}
              {tab.badge && (
                <span
                  className={`
                    inline-flex items-center justify-center
                    px-2 py-0.5
                    text-xs font-medium
                    rounded-full
                    transition-colors duration-quick
                    ${isActive
                      ? 'bg-bg-tertiary text-fg-tertiary'
                      : 'bg-bg-quaternary text-fg-quaternary'
                    }
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Right arrow - only render when needed */}
      {showRightArrow && (
        <motion.button
          onClick={() => scroll('right')}
          className="
            flex-shrink-0
            w-7 h-7
            flex items-center justify-center
            rounded-md
            text-fg-tertiary hover:text-fg-primary
            hover:bg-bg-quaternary
            transition-colors duration-quick
          "
          aria-label="Scroll tabs right"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
}

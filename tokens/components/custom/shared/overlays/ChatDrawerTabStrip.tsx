'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Plus, X as CloseIcon } from '@untitledui-pro/icons/line';
import { Tooltip } from '@/components/base';
import { useChatDrawerStore, type DrawerTab } from '@/stores/chat-drawer-store';
import { Orb } from '@/components/custom/shared/effects/Orb';
import { devProps } from '@/lib/utils/dev-props';

interface ChatDrawerTabStripProps {
  /**
   * Controls rendered to the right of the + new-tab button (lock, close, etc.).
   * Pinned — doesn't scroll with the tab list.
   */
  trailing?: ReactNode;
}

/**
 * Tab strip for the Remy drawer — Claude-Code-style.
 *
 * Layout: [scrollable tab list] [+ new tab] [trailing controls]
 * Only the tab list scrolls horizontally; the + button and `trailing` slot stay
 * pinned to the right edge so the primary drawer controls are always reachable.
 *
 * - Each tab shows the Remy Orb as its "favicon", a truncated title, and a × close.
 * - The active tab has a brand-colored stroke along its top edge.
 * - Inactive tabs with a new assistant message since last viewed show an unread
 *   dot on the orb (same brand color).
 * - ArrowLeft / ArrowRight on a focused tab moves focus through the strip.
 */
export function ChatDrawerTabStrip({ trailing }: ChatDrawerTabStripProps = {}) {
  const tabs = useChatDrawerStore((s) => s.tabs);
  const activeTabId = useChatDrawerStore((s) => s.activeTabId);
  const newTab = useChatDrawerStore((s) => s.newTab);
  const closeTab = useChatDrawerStore((s) => s.closeTab);
  const setActiveTab = useChatDrawerStore((s) => s.setActiveTab);

  const listRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Scroll the active tab into view when it changes — matters when a tab is
  // created beyond the visible edge, or when the user clicks a tab that's
  // mostly clipped.
  useEffect(() => {
    const btn = buttonRefs.current.get(activeTabId);
    if (!btn) return;
    btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [activeTabId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const dir = e.key === 'ArrowLeft' ? -1 : 1;
        const next = tabs[(index + dir + tabs.length) % tabs.length];
        if (next) {
          buttonRefs.current.get(next.id)?.focus();
          setActiveTab(next.id);
        }
      }
    },
    [tabs, setActiveTab],
  );

  return (
    <div
      {...devProps('ChatDrawerTabStrip')}
      className="flex shrink-0 items-stretch border-b border-border-secondary bg-bg-secondary_subtle"
      role="tablist"
      aria-label="Chat tabs"
    >
      {/* Scrollable tab list */}
      <div
        ref={listRef}
        className="flex min-w-0 flex-1 items-stretch overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, idx) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onActivate={() => setActiveTab(tab.id)}
            onClose={() => closeTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            registerRef={(el) => {
              if (el) buttonRefs.current.set(tab.id, el);
              else buttonRefs.current.delete(tab.id);
            }}
          />
        ))}
      </div>

      {/* New-tab button — sticks to the right edge, outside the scroll container */}
      <Tooltip title="New chat" placement="bottom">
        <button
          type="button"
          onClick={() => newTab()}
          aria-label="New chat"
          className="flex h-10 w-10 shrink-0 items-center justify-center border-l border-border-secondary text-fg-tertiary transition-colors hover:bg-bg-secondary hover:text-fg-primary focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-border-brand"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
        </button>
      </Tooltip>

      {/* Trailing slot — drawer-shell controls (lock, close) pinned to the right */}
      {trailing}
    </div>
  );
}

interface TabButtonProps {
  tab: DrawerTab;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}

function TabButton({
  tab,
  isActive,
  onActivate,
  onClose,
  onKeyDown,
  registerRef,
}: TabButtonProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle-click closes the tab — mirrors browser tab ergonomics.
    if (e.button === 1) {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <button
      {...devProps('TabButton')}
      ref={registerRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      onMouseDown={handleMouseDown}
      className={`group relative flex h-10 min-w-[9rem] max-w-[13rem] shrink-0 items-center gap-2 border-r border-border-secondary pl-2.5 pr-1.5 text-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-border-brand ${
        isActive
          ? 'bg-bg-primary text-fg-primary'
          : 'text-fg-tertiary hover:bg-bg-secondary hover:text-fg-primary'
      }`}
      title={tab.title}
    >
      {/* Active indicator — brand-colored stroke along the top edge */}
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 right-0 top-0 h-0.5 bg-bg-brand-solid"
        />
      )}

      {/* "Favicon" — Remy orb, with the unread dot stacked on top for inactive tabs */}
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <Orb size={14} />
        {tab.unread && !isActive && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-bg-brand-solid ring-1 ring-bg-secondary_subtle"
          />
        )}
      </span>

      {/* Title — truncates with ellipsis */}
      <span className="min-w-0 flex-1 truncate text-left">{tab.title}</span>

      {/* Close — always visible, brighter on active tab and on hover */}
      <span
        onClick={handleClose}
        role="button"
        tabIndex={-1}
        aria-label={`Close ${tab.title}`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-bg-secondary hover:text-fg-primary ${
          isActive ? 'text-fg-tertiary' : 'text-fg-quaternary group-hover:text-fg-tertiary'
        }`}
      >
        <CloseIcon className="h-3 w-3" aria-hidden />
      </span>
    </button>
  );
}

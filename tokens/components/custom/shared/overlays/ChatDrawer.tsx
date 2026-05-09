'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Lock01, LockUnlocked01, X as CloseIcon } from '@untitledui-pro/icons/line';
import { Tooltip } from '@/components/base';
import { useChatDrawerStore } from '@/stores/chat-drawer-store';
import { useDrawerWidth, DRAWER_MIN_WIDTH, DRAWER_MAX_VW_RATIO } from '@/hooks/useDrawerWidth';
import { DrawerChat } from './DrawerChat';
import { ChatDrawerTabStrip } from './ChatDrawerTabStrip';
import { devProps } from '@/lib/utils/dev-props';

const HIDDEN_ROUTES = ['/chat', '/chats'];
const MOBILE_BREAKPOINT = 640; // Tailwind sm

function shouldHideOnRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Global right-side chat drawer. Mounted once at the dashboard layout level so it's
 * available on every authenticated page (hidden on /chat and /chats where the full-page
 * chat already lives).
 *
 * Shell contract:
 * - Framer Motion drives the slide-in/out; backdrop uses a brand-tinted overlay that
 *   theme-swaps via `--bg-brand-overlay` (defined in theme.css).
 * - Left-edge drag grip resizes width (desktop only). Disabled while locked; the lock
 *   button in the header toggles lock state and persists it to localStorage.
 * - Tab strip + close + lock live here; per-tab content lives in DrawerChat. All tabs
 *   are mounted; inactive ones are hidden via `display:none` so their `useChat` state
 *   survives tab switches.
 * - Escape / backdrop click / explicit close all dismiss.
 */
export function ChatDrawer() {
  const pathname = usePathname();
  const isOpen = useChatDrawerStore((s) => s.isOpen);
  const closeDrawer = useChatDrawerStore((s) => s.closeDrawer);
  const tabs = useChatDrawerStore((s) => s.tabs);
  const activeTabId = useChatDrawerStore((s) => s.activeTabId);
  const locked = useChatDrawerStore((s) => s.locked);
  const toggleLocked = useChatDrawerStore((s) => s.toggleLocked);
  const { width, isResizing, startResize } = useDrawerWidth();
  const isMobile = detectMobile();

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeDrawer]);

  // Auto-dismiss on navigation. Users expect the drawer to behave like a transient
  // side panel — clicking sidebar/header links should close it, not leave it
  // hovering over the new page. Tab state is preserved so reopening restores the
  // conversations.
  const initialPathnameRef = useRef(pathname);
  useEffect(() => {
    if (pathname === initialPathnameRef.current) return;
    closeDrawer();
    initialPathnameRef.current = pathname;
  }, [pathname, closeDrawer]);

  // Lock body scroll while drawer is open so the background page doesn't drift.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (shouldHideOnRoute(pathname)) return null;
  if (typeof document === 'undefined') return null;

  const effectiveWidth = isMobile ? '100vw' : `${width}px`;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-drawer-root"
          {...devProps('ChatDrawer')}
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop — brand-tinted, theme-aware via --bg-brand-overlay */}
          <div
            aria-hidden
            onClick={closeDrawer}
            className="absolute inset-0 bg-brand-overlay backdrop-blur-[3px]"
          />

          {/* Panel — anchored below the page's TopHeader / MobileHeader (h-14, z-[160])
              so the tabs don't get clipped by the fixed nav chrome above. */}
          <motion.aside
            role="dialog"
            aria-label="Remy chat"
            aria-modal="true"
            className="absolute right-0 top-14 bottom-0 flex flex-col overflow-hidden bg-bg-primary shadow-2xl ring-1 ring-border-brand"
            style={{ width: effectiveWidth }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 34,
              mass: 0.9,
              restDelta: 0.5,
            }}
          >
            {/* Resize grip (desktop only, disabled when locked) */}
            {!isMobile && (
              <button
                type="button"
                aria-label={locked ? 'Drawer width is locked' : 'Resize chat drawer'}
                aria-disabled={locked}
                disabled={locked}
                onPointerDown={locked ? undefined : startResize}
                className={`absolute left-0 top-0 h-full w-1.5 select-none touch-none transition-colors ${
                  locked
                    ? 'cursor-not-allowed bg-transparent'
                    : isResizing
                      ? 'cursor-col-resize bg-bg-brand-solid/40'
                      : 'cursor-col-resize bg-transparent hover:bg-border-brand/40'
                } focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-border-brand`}
                style={{ zIndex: 1 }}
              />
            )}

            {/* Tab strip — hosts the scrollable tabs, the + new-tab button, and the
                drawer-shell controls (lock, close) pinned to the right edge. */}
            <ChatDrawerTabStrip
              trailing={
                <div className="flex shrink-0 items-stretch border-l border-border-secondary">
                  <Tooltip title={locked ? 'Unlock width' : 'Lock width'} placement="bottom">
                    <button
                      type="button"
                      onClick={toggleLocked}
                      aria-label={locked ? 'Unlock drawer width' : 'Lock drawer width'}
                      aria-pressed={locked}
                      className={`flex h-10 w-10 items-center justify-center transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-border-brand ${
                        locked
                          ? 'bg-bg-brand-primary text-fg-brand-primary hover:bg-bg-brand-primary_alt'
                          : 'text-fg-tertiary hover:bg-bg-secondary hover:text-fg-primary'
                      }`}
                    >
                      {locked ? (
                        <Lock01 className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <LockUnlocked01 className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip title="Close chat" placement="bottom">
                    <button
                      type="button"
                      onClick={closeDrawer}
                      aria-label="Close chat"
                      className="flex h-10 w-10 items-center justify-center border-l border-border-secondary text-fg-tertiary transition-colors hover:bg-bg-secondary hover:text-fg-primary focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-border-brand"
                    >
                      <CloseIcon className="h-4 w-4" aria-hidden />
                    </button>
                  </Tooltip>
                </div>
              }
            />

            {/* Multi-session container — all tabs stay mounted; the inactive ones
                are hidden via `display:none` so their useChat streams survive. */}
            <div className="relative min-h-0 flex-1">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <div
                    key={tab.id}
                    className="absolute inset-0"
                    style={{ display: isActive ? 'flex' : 'none' }}
                  >
                    <DrawerChat
                      tabId={tab.id}
                      isActive={isActive}
                      panelWidth={isMobile ? window.innerWidth : width}
                      isResizing={isResizing}
                    />
                  </div>
                );
              })}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export { DRAWER_MIN_WIDTH, DRAWER_MAX_VW_RATIO };

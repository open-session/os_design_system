'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useChatDrawer } from '@/lib/chat-drawer-context';
import { useChatDrawerStore } from '@/stores/chat-drawer-store';
import { Orb } from '@/components/custom/shared/effects/Orb';
import { devProps } from '@/lib/utils/dev-props';

const HIDDEN_ROUTES = ['/chat', '/chats'];

function shouldHideOnRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Floating action button that opens the global chat drawer. Hidden on the
 * full-page chat routes (/chat, /chats) and while the drawer is open, so it
 * never stacks over an identical surface.
 *
 * Shows a brand-colored unread dot when the drawer is closed and any tab has
 * received an assistant message since the user last saw it — the "input light"
 * pattern from the tab strip, surfaced globally when the drawer is hidden.
 */
export function ChatFab() {
  const pathname = usePathname();
  const { isOpen, openDrawer } = useChatDrawer();
  // Recompute only on tabs-change via selector — avoids re-renders on unrelated store mutations.
  const hasUnread = useChatDrawerStore((s) => s.tabs.some((t) => t.unread));

  if (shouldHideOnRoute(pathname)) return null;

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          {...devProps('ChatFab')}
          type="button"
          aria-label={hasUnread ? 'Open Remy chat — new response' : 'Open Remy chat'}
          onClick={openDrawer}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-bg-brand-solid text-fg-primary_on-brand shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          <Orb size={20} />
          <span className="sr-only">Ask Remy</span>
          {hasUnread && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bg-brand-solid opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-bg-brand-solid ring-2 ring-bg-primary" />
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

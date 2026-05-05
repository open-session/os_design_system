'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Expand06 } from '@untitledui-pro/icons/line';
import { useChat } from '@/hooks/useChat';
import { useChatContext } from '@/lib/chat-context';
import { useChatDrawerStore } from '@/stores/chat-drawer-store';
import { useScrollAnchor } from '@/hooks/useScrollAnchor';
import type { ModelId } from '@/lib/ai/providers';
import { ChatContent } from '@/components/custom/pages/chat/ChatContent';
import { FollowUpInput, type FollowUpAttachment } from '@/components/custom/pages/chat/FollowUpInput';
import { RemyEmptyStateArt } from '@/components/custom/pages/chat/RemyEmptyStateArt';
import type { ChatMessage as StoredChatMessage } from '@/lib/supabase/chat-service';
import { devProps } from '@/lib/utils/dev-props';

interface DrawerChatProps {
  /** Stable id for this tab; drives title renaming, unread marking, persistence dedupe. */
  tabId: string;
  /** True when this tab is the one currently visible to the user. Gates unread logic. */
  isActive: boolean;
  /** Current panel width in px. Drives the pretext scroll-anchor on resize. */
  panelWidth: number;
  /** Whether the drawer is actively being resized. Gates the scroll-anchor run. */
  isResizing: boolean;
}

/**
 * Per-tab chat renderer for the Remy drawer.
 *
 * Reuses the streaming engine (useChat), the message renderer (ChatContent), and
 * the composer (FollowUpInput) from the full-page chat. Stays deliberately narrow:
 * no URL-params, no breadcrumbs, no quick-action forms, no canvas panel, no
 * project/space assignment modals.
 *
 * Multi-session contract: one instance per tab, all kept mounted. Inactive tabs
 * stay in the tree (hidden by the parent via `display:none`) so their `useChat`
 * state survives tab switches. Each tab owns its own conversation.
 */
export function DrawerChat({ tabId, isActive, panelWidth, isResizing }: DrawerChatProps) {
  const router = useRouter();
  const closeDrawer = useChatDrawerStore((s) => s.closeDrawer);
  const renameTab = useChatDrawerStore((s) => s.renameTab);
  const markUnread = useChatDrawerStore((s) => s.markUnread);
  const {
    addToHistory,
    loadSession,
    currentWritingStyle,
    webSearchEnabled,
    brandSearchEnabled,
  } = useChatContext();

  const [selectedModel, setSelectedModel] = useState<ModelId>('auto');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const persistedRef = useRef(false);
  const persistedSessionIdRef = useRef<string | null>(null);
  const lastSeenAssistantCountRef = useRef(0);
  const titleRenamedRef = useRef(false);

  const { messages, sendMessage, isLoading, regenerateLastAssistantMessage } = useChat();

  const hasMessages = messages.length > 0;
  const hasAssistantResponse = useMemo(
    () => messages.some((m) => m.role === 'assistant' && m.content.trim().length > 0),
    [messages],
  );

  // Derive tab title from the first user prompt. Snap once and keep it — avoids the
  // tab strip flickering as streaming assistant content changes.
  useEffect(() => {
    if (titleRenamedRef.current) return;
    const firstUser = messages.find((m) => m.role === 'user' && m.content.trim().length > 0);
    if (!firstUser) return;
    const title = firstUser.content.slice(0, 60);
    renameTab(tabId, title);
    titleRenamedRef.current = true;
  }, [messages, tabId, renameTab]);

  // Unread marking — whenever the assistant appends a message while this tab is not
  // the active one (or the drawer is closed), bump the unread flag. `markUnread`
  // itself no-ops if the user is actively looking at this tab.
  const assistantCount = useMemo(
    () => messages.filter((m) => m.role === 'assistant' && m.content.trim().length > 0).length,
    [messages],
  );
  useEffect(() => {
    if (assistantCount > lastSeenAssistantCountRef.current) {
      markUnread(tabId);
    }
    // If the user is looking at this tab (active + drawer open), treat the newest
    // message as seen so we don't re-flag it next time focus shifts away.
    if (isActive) {
      lastSeenAssistantCountRef.current = assistantCount;
    }
  }, [assistantCount, isActive, tabId, markUnread]);

  // Text snapshots for pretext scroll anchoring. Feed render-order content strings
  // so the hook can measure heights at old vs new widths and preserve scrollTop.
  const anchorTexts = useMemo(() => messages.map((m) => m.content), [messages]);

  const scrollContainerRef = useScrollAnchor({
    contentWidth: Math.max(0, panelWidth - 32),
    isResizing,
    texts: anchorTexts,
  });

  const connectorSettings = useMemo(
    () => ({ web: webSearchEnabled, brand: brandSearchEnabled, brain: false, discover: false }),
    [webSearchEnabled, brandSearchEnabled],
  );

  const buildRequestBody = useCallback(
    () => ({
      model: selectedModel,
      connectors: connectorSettings,
      writingStyle: currentWritingStyle?.id ?? null,
    }),
    [selectedModel, connectorSettings, currentWritingStyle],
  );

  const handleSubmit = useCallback(
    async (query: string, attachments?: FollowUpAttachment[]) => {
      if (!query.trim() && (!attachments || attachments.length === 0)) return;
      if (isLoading) return;

      try {
        if (attachments && attachments.length > 0) {
          const files = attachments.map((att) => ({
            type: 'image' as const,
            data: att.data,
            mimeType: att.mimeType,
          }));
          await sendMessage(
            { text: query.trim() || 'What do you see in this image?', files },
            { body: buildRequestBody() },
          );
        } else {
          await sendMessage({ text: query.trim() }, { body: buildRequestBody() });
        }
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Failed to send message');
      }
    },
    [isLoading, sendMessage, buildRequestBody],
  );

  // Auto-scroll on new message (not during resize — anchor hook owns that path; not
  // when inactive — avoids unnecessary scroll churn in hidden tabs).
  useEffect(() => {
    if (isResizing || !isActive) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isResizing, isActive, scrollContainerRef]);

  const persist = useCallback(async (): Promise<string | null> => {
    if (!hasAssistantResponse) return null;
    if (persistedSessionIdRef.current) return persistedSessionIdRef.current;
    const firstUser = messages.find((m) => m.role === 'user');
    if (!firstUser) return null;
    const title = firstUser.content.slice(0, 80);
    const preview = messages.find((m) => m.role === 'assistant')?.content.slice(0, 150) ?? '';
    const storedMessages: StoredChatMessage[] = messages
      .filter((m): m is typeof m & { role: 'user' | 'assistant' } => m.role !== 'system')
      .map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: (m.createdAt ?? new Date()).toISOString(),
        sources: m.sources,
        attachments: m.attachments?.map((a) => ({
          id: a.id,
          type: a.type,
          data: a.data,
          mimeType: a.mimeType,
          name: a.name,
        })),
      }));
    const sessionId = await addToHistory(title, preview, storedMessages, null, null, 'drawer');
    persistedRef.current = true;
    persistedSessionIdRef.current = sessionId;
    return sessionId;
  }, [hasAssistantResponse, messages, addToHistory]);

  // Flush on unmount (tab closed / drawer torn down).
  // Why: `persist` is a useCallback that rebuilds on every messages change (streaming
  // tokens). Listing it in deps re-runs cleanup on every render, racing concurrent
  // persist() calls before persistedRef settles → duplicate chat history entries.
  // Solution: capture persist in a ref so cleanup reads the latest fn without re-running.
  const persistRef = useRef(persist);
  useEffect(() => {
    persistRef.current = persist;
  });
  useEffect(() => {
    return () => {
      if (persistedRef.current) return;
      void persistRef.current();
    };
  }, []);

  const openInFullPage = useCallback(async () => {
    const id = await persist();
    if (id) loadSession(id);
    closeDrawer();
    router.push('/chat');
  }, [persist, loadSession, closeDrawer, router]);

  return (
    <div
      {...devProps('DrawerChat')}
      className="flex h-full w-full flex-col bg-bg-primary"
    >
      {/* Top bar — promote-to-page lives here; global close/lock sit in the drawer shell */}
      {hasMessages && (
        <div className="flex shrink-0 items-center justify-end border-b border-border-secondary px-3 py-1.5">
          <button
            type="button"
            onClick={() => void openInFullPage()}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-tertiary transition-colors hover:bg-bg-secondary hover:text-fg-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-border-brand"
            title="Open in full page"
          >
            <Expand06 className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Open in page</span>
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarGutter: 'stable' }}
      >
        {hasMessages ? (
          <div className="px-4 py-4">
            {messages.map((message, idx) => {
              if (message.role !== 'user') return null;
              const next = messages[idx + 1];
              if (next?.role !== 'assistant') return null;
              const isLast = idx + 2 >= messages.length;
              return (
                <ChatContent
                  key={message.id}
                  query={message.content}
                  content={next.content}
                  sources={next.sources}
                  isStreaming={isLast && isLoading}
                  modelUsed={selectedModel}
                  onFollowUpClick={(q: string) => void handleSubmit(q)}
                  onRegenerate={regenerateLastAssistantMessage}
                  isLastResponse={isLast}
                  messageId={next.id}
                  attachments={message.attachments}
                  quickAction={message.quickAction}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <RemyEmptyStateArt />
            <div>
              <div className="mb-2 text-base font-medium text-fg-primary">Ask Remy anything</div>
              <p className="mx-auto max-w-xs text-sm text-fg-tertiary">
                Draft copy, audit brand work, or pull up anything from your brain — right here,
                without leaving this page.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border-secondary bg-bg-primary px-3 py-3">
        {submitError && (
          <div className="mb-2 rounded-md bg-bg-error-primary px-3 py-2 text-xs text-fg-error-primary">
            {submitError}
          </div>
        )}
        <FollowUpInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder={hasMessages ? 'Ask a follow-up' : 'What can Remy help with?'}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
    </div>
  );
}

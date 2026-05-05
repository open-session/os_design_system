'use client';

import React from 'react';
import { ArrowLeft } from '@untitledui-pro/icons/line';
import { ChatTitleDropdown } from './ChatTitleDropdown';
import { ShareButton } from './ShareModal';
import { devProps } from '@/lib/utils/dev-props';

export type ChatTab = 'answer' | 'resources';

interface ChatHeaderProps {
  activeTab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
  hasResources?: boolean;
  resourcesCount?: number;
  threadTitle?: string;
  threadCreatedAt?: Date;
  onBack?: () => void;
  onRenameThread?: (newTitle: string) => void;
  onAddToProject?: () => void;
  onAddToSpace?: () => void;
  onDeleteThread?: () => void;
  content?: string;
  /** Whether the response is still streaming - hides counts during streaming */
  isStreaming?: boolean;
  /** Hide share button (e.g., when canvas is open) */
  hideShare?: boolean;
  /** Hide title dropdown (e.g., quick action pre-submission state) */
  hideTitle?: boolean;
  /** Whether the title is being generated (shows loading animation) */
  isTitleLoading?: boolean;
}

export function ChatHeader({
  activeTab,
  onTabChange,
  hasResources = false,
  resourcesCount = 0,
  threadTitle = 'New Thread',
  threadCreatedAt,
  onBack,
  onRenameThread,
  onAddToProject,
  onAddToSpace,
  onDeleteThread,
  content = '',
  isStreaming = false,
  hideShare = false,
  hideTitle = false,
  isTitleLoading = false,
}: ChatHeaderProps) {
  const tabs = [
    {
      id: 'answer' as ChatTab,
      label: 'Chat',
      available: true,
    },
    {
      id: 'resources' as ChatTab,
      label: 'Links',
      available: hasResources,
      count: resourcesCount,
    },
  ];

  return (
    <div {...devProps('ChatHeader')} className="sticky top-0 z-30 bg-bg-primary border-b border-border-secondary">
      <div className="px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left side - Back button and tabs */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Back button */}
            {onBack && (
              <button
                onClick={onBack}
                className="p-1 -ml-1 rounded-md text-fg-tertiary hover:text-fg-primary hover:bg-bg-secondary transition-colors"
                title="Back to Recent Chats"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Tabs */}
            <div className="flex items-center">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isAvailable = tab.available;

                return (
                  <button
                    key={tab.id}
                    onClick={() => isAvailable && onTabChange(tab.id)}
                    disabled={!isAvailable}
                    className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all relative
                      ${
                        isActive
                          ? 'text-fg-primary'
                          : isAvailable
                          ? 'text-fg-tertiary hover:text-fg-primary'
                          : 'text-fg-quaternary cursor-not-allowed opacity-50 pointer-events-none'
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    {/* Count badge - only shown when NOT streaming to avoid distraction */}
                    {!isStreaming && isAvailable && tab.count !== undefined && tab.count > 0 && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-bg-tertiary text-fg-tertiary">
                        {tab.count}
                      </span>
                    )}
                    {/* Active indicator - positioned to align with container border */}
                    {isActive && (
                      <div className="absolute bottom-[-9px] left-2.5 right-2.5 h-0.5 bg-bg-brand-solid rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side - Title dropdown and Share */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            {!hideTitle && (
              <div className="min-w-0 max-w-[180px] sm:max-w-[220px] md:max-w-[260px] w-full">
                <ChatTitleDropdown
                  title={threadTitle}
                  createdAt={threadCreatedAt}
                  isLoading={isTitleLoading}
                  onRename={onRenameThread}
                  onAddToProject={onAddToProject}
                  onAddToSpace={onAddToSpace}
                  onDelete={onDeleteThread}
                  content={content}
                />
              </div>
            )}
            {!hideShare && <ShareButton />}
          </div>
        </div>
      </div>
    </div>
  );
}

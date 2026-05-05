'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  DotsHorizontal,
  LayersTwo01,
  Trash01,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { Icon } from '@/components/custom/shared/branding/Icon';
import { stripMarkdown } from '@/lib/text-utils';

// Helper to check if a string is an emoji (vs an icon name)
function isEmoji(str: string): boolean {
  // Emoji regex - detects common emoji patterns
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
  return emojiRegex.test(str) || str.length <= 2;
}

interface SpaceReferenceCardProps {
  spaceTitle: string;
  spaceSlug: string;
  spaceIcon?: string;
  discussionTitle?: string;
  onNavigate?: () => void;
}

/**
 * Reference card shown at top of space chat responses
 * Links back to the parent space
 */
export function SpaceReferenceCard({
  spaceTitle,
  spaceSlug,
  spaceIcon,
  discussionTitle,
  onNavigate,
}: SpaceReferenceCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      router.push(`/spaces/${spaceSlug}`);
    }
  };

  return (
    <button
      {...devProps('SpaceReferenceCard')}
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-3 mb-4 bg-bg-secondary rounded-xl border border-border-secondary hover:border-border-brand transition-all group text-left"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-bg-brand-primary flex items-center justify-center flex-shrink-0">
        {spaceIcon ? (
          isEmoji(spaceIcon) ? (
            <span className="text-lg">{spaceIcon}</span>
          ) : (
            <Icon name={spaceIcon} className="w-5 h-5 text-fg-brand-primary" />
          )
        ) : (
          <LayersTwo01 className="w-5 h-5 text-fg-brand-primary" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-fg-tertiary mb-0.5">
          {discussionTitle ? 'Discussion in' : 'Chat in space'}
        </p>
        <p className="text-sm font-medium text-fg-primary group-hover:text-fg-brand-primary transition-colors line-clamp-1">
          {spaceTitle}
        </p>
      </div>

      {/* Arrow */}
      <ArrowUpRight className="w-4 h-4 text-fg-tertiary group-hover:text-fg-brand-primary transition-colors flex-shrink-0" />
    </button>
  );
}

/**
 * Recent discussion card shown in the space page
 */
interface DiscussionCardProps {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  updatedAt: string;
  spaceSlug: string;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  createdBy?: string;
  currentUserId?: string | null;
  creatorAvatarUrl?: string;
  creatorName?: string;
}

export function DiscussionCard({
  id,
  title,
  preview,
  messageCount,
  updatedAt,
  spaceSlug,
  onClick,
  onDelete,
  createdBy,
  currentUserId,
  creatorAvatarUrl,
  creatorName,
}: DiscussionCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = !!(currentUserId && createdBy && currentUserId === createdBy);
  const creatorInitial = creatorName?.[0]?.toUpperCase() ?? '?';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Use scroll: false to prevent navigation flash
      router.push(`/spaces/${spaceSlug}/chat/${id}`, { scroll: false });
    }
  };
  
  // Prefetch on hover for faster navigation
  const handleMouseEnter = () => {
    router.prefetch(`/spaces/${spaceSlug}/chat/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return updatedAt;
    }
  };

  return (
    <div {...devProps('DiscussionCard')} className="relative group">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className="w-full p-4 rounded-lg bg-bg-secondary border border-border-secondary hover:border-border-brand transition-all text-left"
      >
        <div className="flex items-start gap-3">
          {/* Creator avatar */}
          {createdBy && (
            <div className="w-6 h-6 rounded-full bg-bg-tertiary border border-border-secondary overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5">
              {creatorAvatarUrl ? (
                <img src={creatorAvatarUrl} alt={creatorName ?? 'Creator'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[9px] font-medium text-fg-secondary">{creatorInitial}</span>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-fg-primary group-hover:text-fg-brand-primary transition-colors line-clamp-1 mb-1 pr-8">
              {title}
            </h3>
            {preview && (
              <p className="text-sm text-fg-tertiary line-clamp-2 mb-2">
                {stripMarkdown(preview)}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-fg-tertiary">
              <span>{messageCount} messages</span>
              <span>•</span>
              <span>{formatTime(updatedAt)}</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-fg-tertiary group-hover:text-fg-brand-primary transition-colors flex-shrink-0 mt-1" />
        </div>
      </button>

      {/* Delete menu button — owner only */}
      {onDelete && isOwner && (
        <div className="absolute top-3 right-12">
          <button
            onClick={handleMenuClick}
            className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bg-tertiary text-fg-tertiary hover:text-fg-primary"
            title="More options"
          >
            <DotsHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-bg-secondary rounded-lg border border-border-primary shadow-lg overflow-hidden min-w-[140px]">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  <Trash01 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

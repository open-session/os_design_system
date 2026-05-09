'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Lock01,
  Plus,
  Trash01,
  Users01,
} from '@untitledui-pro/icons/line';
import { Space } from '@/types';
import { DeleteConfirmModal } from '@/components/custom/pages/spaces/DeleteConfirmModal';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/custom/shared/branding/Icon';
import { devProps } from '@/lib/utils/dev-props';

// Helper to check if a string is an emoji (vs an icon name)
function isEmoji(str: string): boolean {
  // Emoji regex - detects common emoji patterns
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
  return emojiRegex.test(str) || str.length <= 2;
}

export interface SpaceMemberDisplay {
  id: string;
  name: string;
  avatar_url?: string | null;
}

interface SpaceCardProps {
  space?: Space;
  isCreate?: boolean;
  onDelete?: (spaceId: string) => void;
  onCreateClick?: () => void;
  // Member display — optional, used when loaded from Supabase
  members?: SpaceMemberDisplay[];
  memberCount?: number;
}

/**
 * SpaceCard component - Untitled UI card patterns
 * Uses semantic theme tokens for consistent styling across light/dark modes
 */
export function SpaceCard({ space, isCreate = false, onDelete, onCreateClick, members, memberCount }: SpaceCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (space && onDelete) {
      onDelete(space.id);
    }
    setShowDeleteModal(false);
  };

  // Card base styles using UUI semantic tokens
  const cardBaseStyles = cn(
    'relative flex flex-col',
    'p-6 rounded-xl',
    'border border-border-secondary',
    'bg-bg-secondary',
    'hover:bg-secondary-hover',
    'hover:border-border-brand',
    'transition-all duration-standard ease-motion-out',
    'min-h-[200px]',
    'shadow-sm',
    'hover:shadow-md',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-brand'
  );

  if (isCreate) {
    return (
      <button
        {...devProps('SpaceCard')}
        onClick={onCreateClick}
        className={cn(
          cardBaseStyles,
          'items-center justify-center',
            'border border-dashed',
            'hover:border-border-brand-solid',
          'cursor-pointer w-full text-left group'
        )}
      >
        <div className="w-14 h-14 bg-bg-brand-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-bg-brand-secondary transition-colors">
          <Plus className="w-7 h-7 text-fg-brand-primary" />
        </div>
        <h3 className="text-lg font-display font-semibold text-fg-primary mb-2">
          Create a Space
        </h3>
        <p className="text-sm text-fg-tertiary text-center">
          Set sources and invite others.
        </p>
      </button>
    );
  }

  if (!space) {
    return null;
  }

  const displayMemberCount = memberCount ?? 0;
  const displayMembers = members ?? [];

  return (
    <>
      <Link
        {...devProps('SpaceCard')}
        href={`/spaces/${space.slug}`}
        className={cn(cardBaseStyles, 'cursor-pointer group')}
      >
        {/* Delete button - appears on hover */}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className={cn(
              'absolute top-4 right-4 p-2 rounded-lg',
              'opacity-0 group-hover:opacity-100',
              'bg-bg-secondary hover:bg-bg-error-solid',
              'text-fg-secondary hover:text-fg-white',
              'border border-border-secondary hover:border-border-error-solid',
              'shadow-sm hover:shadow-md',
              'transition-all duration-standard',
              'z-10',
              'focus-visible:opacity-100 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-error'
            )}
            aria-label="Delete space"
          >
            <Trash01 className="w-4 h-4" />
          </button>
        )}

        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-bg-tertiary rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-bg-brand-primary transition-colors">
            {space.icon ? (
              isEmoji(space.icon) ? (
                <span className="text-2xl">{space.icon}</span>
              ) : (
                <Icon name={space.icon} className="w-6 h-6 text-fg-tertiary group-hover:text-fg-brand-primary transition-colors" />
              )
            ) : (
              <Users01 className="w-6 h-6 text-fg-tertiary group-hover:text-fg-brand-primary transition-colors" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-display font-semibold text-fg-primary mb-2 group-hover:text-fg-brand-primary transition-colors">
          {space.title}
        </h3>

        {/* Description */}
        {space.description && (
          <p className="text-sm text-fg-tertiary mb-4 line-clamp-2">
            {space.description}
          </p>
        )}

        {/* Metadata */}
        <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-fg-quaternary">
          {space.isPrivate && (
            <div className="flex items-center gap-1.5">
              <Lock01 className="w-3.5 h-3.5" />
              <span className="font-medium">Private</span>
            </div>
          )}

          {/* Member count */}
          {displayMemberCount > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="flex items-center gap-1">
                <Users01 className="w-3 h-3" />
                <span className="font-medium">
                  {displayMemberCount} member{displayMemberCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        spaceName={space.title}
      />
    </>
  );
}

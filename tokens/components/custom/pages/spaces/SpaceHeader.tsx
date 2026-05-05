'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Edit01,
  LayoutGrid01,
  Pin01,
  Trash01,
  UserMinus01,
  UserPlus01,
  Users01,
  XClose,
} from '@untitledui-pro/icons/line';
import { DeleteConfirmModal } from '@/components/custom/pages/spaces/DeleteConfirmModal';
import { devProps } from '@/lib/utils/dev-props';
import { DialogTrigger, Popover, Dialog, Button } from 'react-aria-components';
import type { SpaceMember } from '@/lib/supabase/spaces-service';

interface SpaceHeaderProps {
  title: string;
  icon?: string;
  spaceId?: string;
  onDelete?: (spaceId: string) => void;
  onRename?: (newTitle: string) => void;
  members?: SpaceMember[];
  currentUserId?: string | null;
  isCreator?: boolean;
  onAddMember?: (email: string) => Promise<void>;
  onRemoveMember?: (userId: string) => Promise<void>;
}

export function SpaceHeader({
  title,
  icon,
  spaceId,
  onDelete,
  onRename,
  members = [],
  currentUserId,
  isCreator,
  onAddMember,
  onRemoveMember,
}: SpaceHeaderProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Member management popover state
  const [addEmail, setAddEmail] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleConfirmDelete = () => {
    if (spaceId && onDelete) {
      onDelete(spaceId);
      router.push('/spaces');
    }
    setShowDeleteModal(false);
  };

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== title && onRename) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  const handleAddMember = async () => {
    if (!addEmail.trim() || !onAddMember) return;
    setAddError(null);
    setIsAdding(true);
    try {
      await onAddMember(addEmail.trim());
      setAddEmail('');
    } catch {
      setAddError('No user with that email');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!onRemoveMember) return;
    setRemovingUserId(userId);
    try {
      await onRemoveMember(userId);
    } finally {
      setRemovingUserId(null);
    }
  };

  const getMemberDisplayName = (member: SpaceMember): string => {
    return (
      member.user?.user_metadata?.full_name ||
      member.user?.email?.split('@')[0] ||
      'Unknown'
    );
  };

  const getMemberInitial = (member: SpaceMember): string => {
    const name = getMemberDisplayName(member);
    return name[0]?.toUpperCase() ?? '?';
  };

  return (
    <>
      <div {...devProps('SpaceHeader')} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <LayoutGrid01 className="w-6 h-6 text-fg-primary flex-shrink-0" />
          )}

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="
                text-2xl font-semibold text-fg-primary bg-transparent
                border-b border-border-brand-solid outline-hidden
                w-full max-w-md px-1
              "
            />
          ) : (
            <div className="flex items-center gap-2 group min-w-0">
              <h1 className="text-2xl font-semibold text-fg-primary truncate">
                {title}
              </h1>
              {onRename && (
                <button
                  onClick={() => {
                    setEditTitle(title);
                    setIsEditing(true);
                  }}
                  className="
                    opacity-0 group-hover:opacity-100 focus:opacity-100
                    p-1 rounded-md flex-shrink-0
                    text-fg-tertiary hover:text-fg-primary
                    transition-all
                  "
                  aria-label="Edit title"
                >
                  <Edit01 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Stacked member avatars */}
          {members.length > 0 && (
            <div className="flex items-center mr-1">
              {members.slice(0, 3).map((member, i) => (
                <div
                  key={member.user_id}
                  className="w-7 h-7 rounded-full bg-bg-tertiary border border-border-secondary overflow-hidden flex items-center justify-center"
                  style={{ marginLeft: i > 0 ? '-8px' : 0, zIndex: 3 - i }}
                  title={getMemberDisplayName(member)}
                >
                  {member.user?.user_metadata?.avatar_url ? (
                    <img
                      src={member.user.user_metadata.avatar_url}
                      alt={getMemberDisplayName(member)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-medium text-fg-secondary">
                      {getMemberInitial(member)}
                    </span>
                  )}
                </div>
              ))}
              {members.length > 3 && (
                <div
                  className="w-7 h-7 rounded-full bg-bg-tertiary border border-border-secondary flex items-center justify-center text-[10px] font-medium text-fg-secondary"
                  style={{ marginLeft: '-8px' }}
                >
                  +{members.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Manage members popover — only for creator */}
          {isCreator && spaceId && (
            <DialogTrigger>
              <Button
                aria-label="Manage members"
                className="p-2 rounded-lg text-fg-tertiary hover:bg-bg-secondary hover:text-fg-primary transition-colors"
              >
                <Users01 className="w-4 h-4" />
              </Button>
              <Popover className="bg-bg-secondary border border-border-secondary rounded-xl shadow-lg w-72 p-4 z-50 outline-hidden">
                <Dialog className="outline-hidden">
                  <div {...devProps('MembersPopover')}>
                    <p className="text-sm font-semibold text-fg-primary mb-3">Members</p>

                    {/* Member list */}
                    {members.length === 0 ? (
                      <p className="text-xs text-fg-tertiary mb-3">Just you</p>
                    ) : (
                      <ul className="space-y-2 mb-3">
                        {members.map((member) => (
                          <li key={member.user_id} className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-bg-tertiary border border-border-secondary overflow-hidden flex items-center justify-center flex-shrink-0">
                              {member.user?.user_metadata?.avatar_url ? (
                                <img
                                  src={member.user.user_metadata.avatar_url}
                                  alt={getMemberDisplayName(member)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] font-medium text-fg-secondary">
                                  {getMemberInitial(member)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-fg-primary truncate">
                                {getMemberDisplayName(member)}
                              </p>
                              {member.user?.email && (
                                <p className="text-xs text-fg-tertiary truncate">{member.user.email}</p>
                              )}
                            </div>
                            {member.user_id !== currentUserId && onRemoveMember && (
                              <button
                                onClick={() => handleRemoveMember(member.user_id)}
                                disabled={removingUserId === member.user_id}
                                className="p-1 rounded text-fg-tertiary hover:text-fg-error-primary transition-colors disabled:opacity-50"
                                aria-label={`Remove ${getMemberDisplayName(member)}`}
                              >
                                {removingUserId === member.user_id ? (
                                  <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <UserMinus01 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Add member */}
                    {onAddMember && (
                      <div className="border-t border-border-secondary pt-3">
                        <p className="text-xs text-fg-tertiary mb-2">Invite by email</p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={addEmail}
                            onChange={(e) => {
                              setAddEmail(e.target.value);
                              setAddError(null);
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                            placeholder="user@example.com"
                            className="flex-1 text-sm px-2 py-1.5 rounded-lg bg-bg-primary border border-border-secondary text-fg-primary placeholder:text-fg-quaternary outline-hidden focus:border-border-brand-solid transition-colors"
                          />
                          <button
                            onClick={handleAddMember}
                            disabled={isAdding || !addEmail.trim()}
                            className="p-1.5 rounded-lg bg-bg-brand-primary text-fg-brand-primary hover:bg-bg-brand-secondary transition-colors disabled:opacity-50"
                            aria-label="Add member"
                          >
                            {isAdding ? (
                              <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UserPlus01 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {addError && (
                          <p className="text-xs text-fg-error-primary mt-1.5 flex items-center gap-1">
                            <XClose className="w-3 h-3" />
                            {addError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Dialog>
              </Popover>
            </DialogTrigger>
          )}

          <button
            onClick={() => setIsPinned(!isPinned)}
            className="
              p-2 rounded-lg
              text-fg-tertiary
              hover:bg-bg-secondary hover:text-fg-primary
              transition-colors
            "
            aria-label={isPinned ? 'Unpin space' : 'Pin01 space'}
          >
            {isPinned ? (
              <Pin01 className="w-5 h-5 text-fg-brand-primary" />
            ) : (
              <Pin01 className="w-5 h-5" />
            )}
          </button>
          {onDelete && spaceId && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="
                p-2 rounded-lg
                text-fg-tertiary
                hover:bg-bg-error-solid hover:text-fg-white
                transition-colors
              "
              aria-label="Delete space"
            >
              <Trash01 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        spaceName={title}
      />
    </>
  );
}

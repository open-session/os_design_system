'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Award01, Check, Edit02, Eye, XClose, Award01 as Crown, Edit02 as PenLine } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

// ============================================================
// Types
// ============================================================

export type OrgRole = 'owner' | 'editor' | 'viewer';

export interface SeatTypePickerMember {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: OrgRole;
}

export interface SeatTypePickerProps {
  isOpen: boolean;
  onClose: () => void;
  member: SeatTypePickerMember | null;
  /** Organization ID — unused in static prototype, preserved for future wiring */
  orgId?: string;
  isLastOwner: boolean;
  onRoleChanged: (userId: string, newRole: OrgRole) => void;
}

// ============================================================
// Seat options config
// ============================================================

const SEAT_OPTIONS = [
  {
    role: 'owner' as OrgRole,
    icon: Crown,
    label: 'Owner',
    description: 'Full access to manage the organization and all its content',
    price: '$20 / month',
  },
  {
    role: 'editor' as OrgRole,
    icon: PenLine,
    label: 'Editor',
    description: 'Can create and edit brand content, cannot manage members',
    price: '$20 / month',
  },
  {
    role: 'viewer' as OrgRole,
    icon: Eye,
    label: 'Viewer — View and comment only',
    description: 'Read-only access to all brand content',
    price: '$5 / month',
  },
] as const;

// ============================================================
// Member Avatar (initials fallback)
// ============================================================

function PickerAvatar({ displayName, avatarUrl }: { displayName: string; avatarUrl?: string }) {
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...devProps('PickerAvatar')}
        src={avatarUrl}
        alt={displayName}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div
      {...devProps('PickerAvatar')}
      className="w-10 h-10 rounded-full bg-bg-tertiary border border-border-secondary flex items-center justify-center shrink-0"
    >
      <span className="text-sm font-medium text-fg-secondary">{initials}</span>
    </div>
  );
}

// ============================================================
// SeatTypePicker
// ============================================================

/**
 * Modal for changing a member's seat type (role) within an organization.
 * Triggered by clicking the seat type badge on a member row.
 * Includes last-owner guard to prevent demoting the final owner.
 */
export function SeatTypePicker({
  isOpen,
  onClose,
  member,
  orgId,
  isLastOwner,
  onRoleChanged,
}: SeatTypePickerProps) {
  const [error, setError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus close button when modal opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset error when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleSelect = (role: OrgRole) => {
    if (!member) return;

    // No-op if same role
    if (role === member.role) {
      onClose();
      return;
    }

    // Guard: cannot demote last owner
    if (isLastOwner && role !== 'owner') {
      setError('Cannot remove the last owner from the organization.');
      return;
    }

    // Static prototype — optimistic local update only (no API call)
    onRoleChanged(member.userId, role);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Prevent SSR portal crash
  if (typeof window === 'undefined') return null;
  if (!member) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={onClose}
          />

          {/* Centering container */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              {...devProps('SeatTypePicker')}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="
                w-full max-w-md
                max-h-[calc(100vh-64px)]
                bg-bg-secondary
                border border-border-primary
                rounded-xl
                shadow-2xl
                overflow-hidden
                flex flex-col
                pointer-events-auto
              "
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-labelledby="seat-picker-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-secondary flex-shrink-0">
                <div className="flex items-center gap-3">
                  <PickerAvatar
                    displayName={member.displayName}
                    avatarUrl={member.avatarUrl}
                  />
                  <div>
                    <h2
                      id="seat-picker-title"
                      className="text-base font-semibold text-fg-primary"
                    >
                      Choose a seat for {member.displayName}
                    </h2>
                    <p className="text-xs text-fg-tertiary">
                      Changes take effect immediately
                    </p>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}

                  aria-label="Close"
                  className="
                    p-2 rounded-lg
                    text-fg-tertiary
                    hover:text-fg-primary
                    hover:bg-bg-tertiary
                    transition-colors
                    disabled:opacity-50
                  "
                >
                  <XClose className="w-5 h-5" />
                </button>
              </div>

              {/* Seat options */}
              <div className="flex flex-col px-3 py-3 gap-1 overflow-y-auto flex-1">
                {SEAT_OPTIONS.map((option) => {
                  const isCurrentRole = option.role === member.role;
                  const isDisabled =
                    isLastOwner && option.role !== 'owner' && member.role === 'owner';
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.role}
                      onClick={() => handleSelect(option.role)}
                      disabled={isDisabled}
                      aria-pressed={isCurrentRole}
                      title={
                        isLastOwner && option.role !== 'owner' && member.role === 'owner'
                          ? 'Cannot remove last owner'
                          : undefined
                      }
                      className={`
                        w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left
                        transition-colors duration-quick
                        ${isCurrentRole
                          ? 'bg-bg-tertiary ring-1 ring-border-primary'
                          : 'hover:bg-bg-tertiary'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-lg bg-bg-primary border border-border-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-fg-secondary" aria-hidden="true" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-fg-primary">
                            {option.label}
                          </span>
                          {isCurrentRole && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-bg-brand-secondary text-fg-brand-primary">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-fg-tertiary mt-0.5 truncate">
                          {option.description}
                        </p>
                      </div>

                      {/* Price + state */}
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-xs text-fg-tertiary">{option.price}</span>
                        {isCurrentRole && (
                          <Check className="w-4 h-4 text-fg-brand-primary" aria-hidden="true" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Error state */}
              {error && (
                <div className="px-6 py-3 border-t border-border-secondary bg-bg-tertiary flex-shrink-0">
                  <p className="text-sm text-fg-error-primary" role="alert">
                    {error}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

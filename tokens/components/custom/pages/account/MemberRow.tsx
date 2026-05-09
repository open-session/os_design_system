'use client';

import Image from 'next/image';
import { ChevronRight, Edit01, Eye, ShieldTick, Shield01 as ShieldCheck, Edit01 as Pencil, Trash01 } from '@untitledui-pro/icons/line';
import { Row, Cell } from 'react-aria-components';
import { devProps } from '@/lib/utils/dev-props';

// ============================================================
// Types
// ============================================================

export interface OrgMember {
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
  profile: {
    display_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

interface MemberRowProps {
  member: OrgMember;
  isSelected: boolean;
  onSelect: (userId: string, selected: boolean) => void;
  onRowClick: (userId: string) => void;
  /** Called when the seat type badge is clicked; enables the seat picker modal. */
  onSeatClick?: (member: OrgMember) => void;
  /** Called when the remove button is clicked; parent handles the DELETE call. */
  onRemove?: (userId: string) => void;
  /** Whether this member is currently being removed (disables the remove button). */
  isRemoving?: boolean;
}

// ============================================================
// Sub-components
// ============================================================

/**
 * Renders a member's avatar. Falls back to initials when no avatar_url is set.
 */
function MemberAvatar({ profile }: { profile: OrgMember['profile'] }) {
  const name = profile.display_name ?? profile.email ?? '?';
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (profile.avatar_url) {
    return (
      <Image
        src={profile.avatar_url}
        alt={name}
        width={32}
        height={32}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      {...devProps('MemberAvatar')}
      className="w-8 h-8 rounded-full bg-bg-tertiary border border-border-secondary flex items-center justify-center shrink-0"
    >
      <span className="text-xs font-medium text-fg-secondary">{initials}</span>
    </div>
  );
}

/**
 * Renders a seat type badge with a distinct icon for each role.
 */
export function SeatTypeBadge({ role }: { role: OrgMember['role'] }) {
  const config = {
    owner: { label: 'Owner', Icon: ShieldCheck, color: 'text-fg-primary' },
    editor: { label: 'Editor', Icon: Pencil, color: 'text-fg-secondary' },
    viewer: { label: 'Viewer', Icon: Eye, color: 'text-fg-tertiary' },
  }[role];

  return (
    <span {...devProps('SeatTypeBadge')} className="flex items-center gap-1.5 text-sm">
      <config.Icon className={`w-4 h-4 shrink-0 ${config.color}`} aria-hidden="true" />
      <span className={config.color}>{config.label}</span>
    </span>
  );
}

// ============================================================
// Date formatting
// ============================================================

/**
 * Formats a date string as a human-readable relative or absolute date.
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================================
// MemberRow
// ============================================================

/**
 * A single row in the members table.
 * Displays avatar, name, email, seat type badge, billing cycle, and last active date.
 */
export function MemberRow({ member, isSelected, onSelect, onRowClick, onSeatClick, onRemove, isRemoving }: MemberRowProps) {
  const displayName = member.profile.display_name ?? member.profile.email ?? 'Unknown';
  const email = member.profile.email ?? '';

  return (
    <Row
      {...devProps('MemberRow')}
      id={member.user_id}
      className={`
        group border-b border-border-secondary last:border-b-0
        hover:bg-bg-secondary transition-colors duration-quick cursor-pointer
        ${isSelected ? 'bg-bg-secondary' : ''}
        outline-hidden focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-border-primary focus-visible:shadow-focus-ring
      `}
      onAction={() => onRowClick(member.user_id)}
    >
      {/* Checkbox cell */}
      <Cell className="pl-4 pr-3 py-3 w-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(member.user_id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${displayName}`}
          className="w-4 h-4 rounded border-border-primary bg-bg-secondary checked:bg-bg-brand-solid accent-current cursor-pointer"
        />
      </Cell>

      {/* Name + Avatar cell */}
      <Cell className="px-3 py-3">
        <div className="flex items-center gap-3">
          <MemberAvatar profile={member.profile} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-fg-primary truncate">{displayName}</p>
            {email && (
              <p className="text-xs text-fg-tertiary truncate">{email}</p>
            )}
          </div>
        </div>
      </Cell>

      {/* Seat type cell */}
      <Cell className="px-3 py-3">
        {onSeatClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSeatClick(member);
            }}
            aria-label={`Change seat type for ${displayName}`}
            className="rounded hover:bg-bg-tertiary transition-colors p-0.5 -m-0.5"
          >
            <SeatTypeBadge role={member.role} />
          </button>
        ) : (
          <SeatTypeBadge role={member.role} />
        )}
      </Cell>

      {/* Billing cycle cell */}
      <Cell className="px-3 py-3">
        <span className="text-sm text-fg-secondary">Monthly</span>
      </Cell>

      {/* Joined cell */}
      <Cell className="px-3 py-3">
        <span className="text-sm text-fg-tertiary">{formatDate(member.joined_at)}</span>
      </Cell>

      {/* Actions cell */}
      <Cell className="pl-3 pr-4 py-3 w-10">
        <div className="flex items-center gap-1">
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(member.user_id);
              }}
              disabled={isRemoving}
              aria-label={`Remove ${displayName}`}
              className="
                p-1 rounded
                text-fg-tertiary hover:text-fg-error-primary
                opacity-0 group-hover:opacity-100
                transition-all duration-quick
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <Trash01 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <ChevronRight
            className="w-4 h-4 text-fg-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-quick"
            aria-hidden="true"
          />
        </div>
      </Cell>
    </Row>
  );
}

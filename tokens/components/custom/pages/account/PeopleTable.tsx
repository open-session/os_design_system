'use client';

import { useState, useMemo, useCallback } from 'react';
import { SearchLg } from '@untitledui-pro/icons/line';
import {
  Table,
  TableHeader,
  Column,
  TableBody,
} from 'react-aria-components';
import { toast } from 'sonner';
import { devProps } from '@/lib/utils/dev-props';
import { Checkbox } from '@/components/base/base/checkbox/checkbox';
import { NativeSelect } from '@/components/base/base/select/select-native';
import { MemberRow, type OrgMember } from './MemberRow';
import { SeatTypePicker, type SeatTypePickerMember, type OrgRole } from './SeatTypePicker';

// ============================================================
// Static prototype — mock data (API routes removed in auth-org-simplification)
// ============================================================

const MOCK_MEMBERS: OrgMember[] = [
  {
    user_id: '00000000-0000-0000-0000-000000000010',
    role: 'owner',
    joined_at: new Date('2024-01-01').toISOString(),
    profile: {
      display_name: 'Karim',
      email: 'karim@opensession.co',
      avatar_url: null,
    },
  },
  {
    user_id: '00000000-0000-0000-0000-000000000020',
    role: 'owner',
    joined_at: new Date('2024-01-01').toISOString(),
    profile: {
      display_name: 'Morgan',
      email: 'morgan@opensession.co',
      avatar_url: null,
    },
  },
];

// ============================================================
// Types
// ============================================================

interface PeopleTableProps {
  orgId: string;
}

type RoleFilter = 'owner' | 'editor' | 'viewer' | '';

// ============================================================
// PeopleTable
// ============================================================

/**
 * Displays organization members.
 * Static prototype — uses mock data, no API calls (routes removed in PRD 012).
 */
export function PeopleTable({ orgId: _orgId }: PeopleTableProps) {
  const [members, setMembers] = useState<OrgMember[]>(MOCK_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMember, setPickerMember] = useState<SeatTypePickerMember | null>(null);

  const ownerCount = members.filter((m) => m.role === 'owner').length;

  // Client-side filtering
  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchTerm ||
        m.profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.profile.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, roleFilter]);

  // Selection handlers
  const handleSelect = (userId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(userId);
      } else {
        next.delete(userId);
      }
      return next;
    });
  };

  const handleSeatClick = useCallback((member: OrgMember) => {
    setPickerMember({
      userId: member.user_id,
      displayName: member.profile.display_name ?? member.profile.email ?? 'Unknown',
      avatarUrl: member.profile.avatar_url ?? undefined,
      role: member.role,
    });
    setPickerOpen(true);
  }, []);

  const handleRowClick = useCallback((userId: string) => {
    const member = members.find((m) => m.user_id === userId);
    if (member) {
      handleSeatClick(member);
    }
  }, [members, handleSeatClick]);

  const handleRoleChanged = useCallback((userId: string, newRole: OrgRole) => {
    setMembers((prev) => prev.map((m) => (m.user_id === userId ? { ...m, role: newRole } : m)));
    toast.success(`Role updated to ${newRole}`);
  }, []);

  const handleRemove = useCallback((userId: string) => {
    // Static prototype — optimistic removal only
    setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    toast.success('Member removed');
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filtered.map((m) => m.user_id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const allSelected = filtered.length > 0 && filtered.every((m) => selectedIds.has(m.user_id));
  const someSelected = filtered.some((m) => selectedIds.has(m.user_id));

  return (
    <div {...devProps('PeopleTable')} className="flex flex-col gap-4">
      {/* Search and filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <SearchLg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search members"
            className="
              w-full pl-9 pr-3 py-2
              text-sm text-fg-primary placeholder:text-fg-tertiary
              bg-bg-secondary border border-border-secondary rounded-lg
              outline-hidden focus:ring-2 focus:ring-border-primary focus:border-border-primary
              transition-colors duration-150
            "
          />
        </div>

        {/* Seat type filter */}
        <NativeSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          aria-label="Filter by seat type"
          className="w-auto"
          options={[
            { value: '', label: 'Seat type: All seat types' },
            { value: 'owner', label: 'Owner' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        />

        {/* Last active filter (placeholder for v1) */}
        <NativeSelect
          aria-label="Filter by last active"
          defaultValue=""
          disabled
          className="w-auto opacity-50"
          options={[
            { value: '', label: 'Last active: All time' },
          ]}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 border border-border-secondary rounded-lg">
          <p className="text-sm text-fg-tertiary">
            {members.length === 0
              ? 'No members yet.'
              : 'No members match your filters.'}
          </p>
        </div>
      ) : (
        <div className="border border-border-secondary rounded-lg overflow-hidden">
          <Table
            aria-label="Organization members"
            className="w-full"
            selectionMode="none"
          >
            <TableHeader className="bg-bg-secondary border-b border-border-secondary">
              {/* Checkbox column header */}
              <Column
                isRowHeader={false}
                className="pl-4 pr-3 py-3 w-10"
              >
                <Checkbox
                  isSelected={allSelected}
                  isIndeterminate={someSelected && !allSelected}
                  onChange={(checked) => handleSelectAll(checked)}
                  aria-label="Select all members"
                  size="sm"
                />
              </Column>

              {/* Name column */}
              <Column isRowHeader className="px-3 py-3 text-left">
                <span className="text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Name
                </span>
              </Column>

              {/* Seat type column */}
              <Column className="px-3 py-3 text-left">
                <span className="text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Seat type
                </span>
              </Column>

              {/* Billing cycle column */}
              <Column className="px-3 py-3 text-left">
                <span className="text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Billing cycle
                </span>
              </Column>

              {/* Joined column */}
              <Column className="px-3 py-3 text-left">
                <span className="text-xs font-medium text-fg-tertiary uppercase tracking-wider">
                  Joined
                </span>
              </Column>

              {/* Chevron column */}
              <Column className="pl-3 pr-4 py-3 w-10">
                <span className="sr-only">Actions</span>
              </Column>
            </TableHeader>

            <TableBody items={filtered}>
              {(member) => (
                <MemberRow
                  key={member.user_id}
                  member={member}
                  isSelected={selectedIds.has(member.user_id)}
                  onSelect={handleSelect}
                  onRowClick={handleRowClick}
                  onSeatClick={handleSeatClick}
                  onRemove={handleRemove}
                  isRemoving={false}
                />
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Selection summary */}
      {selectedIds.size > 0 && (
        <p className="text-xs text-fg-tertiary">
          {selectedIds.size} member{selectedIds.size !== 1 ? 's' : ''} selected
        </p>
      )}

      {/* Seat type picker modal */}
      <SeatTypePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        member={pickerMember}
        orgId=""
        isLastOwner={ownerCount === 1 && pickerMember?.role === 'owner'}
        onRoleChanged={handleRoleChanged}
      />
    </div>
  );
}

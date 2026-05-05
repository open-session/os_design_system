'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SettingsSectionHeader } from './SettingsSection';
import { Plus, DotsVertical, Mail01, Trash01, Shield01, ChevronDown, SearchLg as Search } from '@untitledui-pro/icons/line';
import { Avatar } from '@/components/base/base/avatar/avatar';
import { devProps } from '@/lib/utils/dev-props';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joinedAt: string;
}

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Olivia Rhye',
    email: 'olivia@opensession.co',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Phoenix Baker',
    email: 'phoenix@opensession.co',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Lana Steiner',
    email: 'lana@opensession.co',
    role: 'member',
    status: 'active',
    joinedAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Demi Wilkinson',
    email: 'demi@opensession.co',
    role: 'member',
    status: 'pending',
    joinedAt: '2024-12-01',
  },
];

const ROLE_LABELS = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

const ROLE_COLORS = {
  owner: 'bg-bg-brand-primary text-fg-brand-primary',
  admin: 'bg-bg-info-primary text-fg-info-primary',
  member: 'bg-bg-tertiary text-fg-secondary',
};

export function TeamForm() {
  const t = useTranslations('settings.team');
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div {...devProps('TeamForm')} className="max-w-4xl">
      <SettingsSectionHeader
        title={t('title')}
        description={t('subtitle')}
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5 border-b border-border-secondary">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-fg-quaternary" />
          </div>
          <input
            type="text"
            placeholder="Search team members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              pl-10 pr-3 py-2
              bg-bg-primary
              border border-border-primary
              rounded-lg
              text-fg-primary
              text-base
              placeholder:text-fg-placeholder
              focus:outline-hidden focus:ring-1 focus:ring-brand focus:shadow-focus-ring
              shadow-xs
            "
          />
        </div>

        {/* Invite Button */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="
            flex items-center gap-2
            px-4 py-2.5
            bg-bg-brand-solid
            border border-fg-white/12
            rounded-lg
            text-sm font-semibold text-fg-white
            shadow-xs
            hover:bg-bg-brand-solid-hover
            transition-colors
          "
        >
          <Plus className="w-5 h-5" />
          Invite member
        </button>
      </div>

      {/* Team Members Table */}
      <div className="border border-border-secondary rounded-xl overflow-hidden mt-5">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-secondary-alt border-b border-border-secondary">
              <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-fg-tertiary">
                Joined
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr
                key={member.id}
                className={`
                  border-b border-border-secondary
                  ${index === filteredMembers.length - 1 ? 'border-b-0' : ''}
                `}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      initials={member.name.split(' ').map(n => n[0]).join('')}
                      contrastBorder
                    />
                    <div>
                      <p className="text-sm font-medium text-fg-primary">
                        {member.name}
                      </p>
                      <p className="text-sm text-fg-tertiary">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative inline-block">
                    <button className={`
                      inline-flex items-center gap-1
                      px-2.5 py-1
                      rounded-full
                      text-xs font-medium
                      ${ROLE_COLORS[member.role]}
                    `}>
                      {ROLE_LABELS[member.role]}
                      {member.role !== 'owner' && (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    inline-flex items-center
                    px-2.5 py-1
                    rounded-full
                    text-xs font-medium
                    ${member.status === 'active'
                      ? 'bg-bg-success-primary text-fg-success-primary'
                      : 'bg-bg-warning-primary text-fg-warning-primary'
                    }
                  `}>
                    {member.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-fg-tertiary">
                  {new Date(member.joinedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {member.status === 'pending' && (
                      <button
                        className="p-2 text-fg-quaternary hover:text-fg-tertiary transition-colors"
                        title="Resend invite"
                      >
                        <Mail01 className="w-5 h-5" />
                      </button>
                    )}
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-2 text-fg-quaternary hover:text-fg-error-primary transition-colors"
                        title="Remove member"
                      >
                        <Trash01 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      className="p-2 text-fg-quaternary hover:text-fg-tertiary transition-colors"
                      title="More options"
                    >
                      <DotsVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMembers.length === 0 && (
        <div className="py-12 text-center border border-border-secondary rounded-xl mt-5">
          <p className="text-sm text-fg-tertiary">
            No team members found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-6 mt-5 pt-5 border-t border-border-secondary">
        <div className="flex items-center gap-2">
          <Shield01 className="w-5 h-5 text-fg-quaternary" />
          <span className="text-sm text-fg-tertiary">
            {members.filter(m => m.role === 'admin' || m.role === 'owner').length} admins
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-fg-tertiary">
            {members.length} total members
          </span>
        </div>
      </div>
    </div>
  );
}


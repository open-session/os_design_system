'use client';

import { useState, useCallback } from 'react';
import { Plus } from '@untitledui-pro/icons/line';
import { toast } from 'sonner';
import { devProps } from '@/lib/utils/dev-props';
import { Button } from '@/components/ds/buttons/button';
import { Tabs, TabList, TabPanel } from '@/components/ds/tabs/tabs';
import { OPEN_SESSION_ORG } from '@/stores/org-store';
import { PeopleTable } from './PeopleTable';
import { InviteByEmailModal } from './InviteByEmailModal';

/**
 * Organization members management tab.
 * Static prototype — all users are full admins, no permission gating needed.
 */
export function PeopleTab() {
  const activeOrg = OPEN_SESSION_ORG;
  const [showInvite, setShowInvite] = useState(false);

  const handleInviteSuccess = useCallback((emails: string[]) => {
    toast.success(`Invitation sent to ${emails.join(', ')}`);
  }, []);

  return (
    <div {...devProps('PeopleTab')} className="flex flex-col gap-6 max-w-5xl">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-fg-primary">People</h2>
        <Button
          color="primary"
          size="sm"
          iconLeading={Plus}
          onClick={() => setShowInvite(true)}
          aria-label="Invite users to this organization"
        >
          Invite users
        </Button>
      </div>

      {/* Sub-tabs: People | User groups */}
      <Tabs defaultSelectedKey="people">
        <TabList
          type="underline"
          size="sm"
          aria-label="People section tabs"
          items={[
            { id: 'people', children: 'People' },
            { id: 'user-groups', children: 'User groups', isDisabled: true },
          ]}
        />

        <TabPanel id="people" className="pt-6">
          <PeopleTable orgId={activeOrg.id} />
        </TabPanel>

        <TabPanel id="user-groups" className="pt-6">
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-fg-tertiary">User groups are not available yet.</p>
          </div>
        </TabPanel>
      </Tabs>

      {showInvite && (
        <InviteByEmailModal
          isOpen={showInvite}
          onClose={() => setShowInvite(false)}
          orgId={activeOrg.id}
          onSuccess={handleInviteSuccess}
        />
      )}
    </div>
  );
}

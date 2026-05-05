import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabSelector } from './TabSelector';

const meta: Meta<typeof TabSelector> = {
  title: 'Custom/Shared/Navigation/TabSelector',
  component: TabSelector,
  tags: ['autodocs'],
  parameters: { appShell: true },
};

export default meta;
type Story = StoryObj<typeof TabSelector>;

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

function TabSelectorStory() {
  const [active, setActive] = useState('overview');
  return <TabSelector tabs={tabs} activeTab={active} onChange={setActive} />;
}

export const Default: Story = {
  render: () => <TabSelectorStory />,
};

export const Locked: Story = {
  render: () => (
    <TabSelector
      tabs={tabs}
      activeTab="overview"
      onChange={() => {}}
      locked
      lockedMessage="Save changes to switch tabs."
    />
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Tab, TabList, TabPanel, Tabs } from './tabs';

void Tab;
void TabList;
void TabPanel;

/**
 * Vendor-pristine UUI Pro Tabs — what `bun run uui:add tabs` produces.
 * Use for vendor-swap auditing only. Product code uses `@/components/base` Tabs
 * (which re-exports `components/ds/tabs/tabs.tsx` — Layer 4 wrapper, Shape C fork).
 */
const meta: Meta = {
  title: 'Base (Upstream UUI)/Application/Tabs',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const items = [
  { id: 'overview', children: 'Overview' },
  { id: 'analytics', children: 'Analytics' },
  { id: 'settings', children: 'Settings' },
];

export const Default: Story = {
  render: () => (
    <Tabs defaultSelectedKey="overview">
      <Tabs.List items={items} />
      <Tabs.Panel id="overview" className="pt-4 text-sm text-tertiary">
        Overview panel content.
      </Tabs.Panel>
      <Tabs.Panel id="analytics" className="pt-4 text-sm text-tertiary">
        Analytics panel content.
      </Tabs.Panel>
      <Tabs.Panel id="settings" className="pt-4 text-sm text-tertiary">
        Settings panel content.
      </Tabs.Panel>
    </Tabs>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs defaultSelectedKey="overview">
      <Tabs.List items={items} type="underline" />
      <Tabs.Panel id="overview" className="pt-4 text-sm text-tertiary">
        Overview panel content.
      </Tabs.Panel>
      <Tabs.Panel id="analytics" className="pt-4 text-sm text-tertiary">
        Analytics panel content.
      </Tabs.Panel>
      <Tabs.Panel id="settings" className="pt-4 text-sm text-tertiary">
        Settings panel content.
      </Tabs.Panel>
    </Tabs>
  ),
};

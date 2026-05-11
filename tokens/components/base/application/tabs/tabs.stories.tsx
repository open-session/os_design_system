import type { Meta, StoryObj } from '@storybook/react';
import { Tab, TabList, TabPanel, Tabs } from './tabs';

void Tab;
void TabList;
void TabPanel;

/**
 * BOS Tabs — the vendor primitive (UUI Pro v8) with the 5-axis BOS transforms
 * applied at vendor-pull time. The Shape C wrapper at `components/ds/tabs/`
 * was removed in the DS framework simplification pass once codemod Axis 1b
 * (ease-linear → ease-motion-out) closed the only remaining manual delta.
 *
 * Consumer entry point: `import { Tabs } from '@/components/base'`.
 */
const meta: Meta = {
  title: 'Base/Application/Tabs',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const items = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

export const ButtonBrand: Story = {
  render: () => (
    <Tabs>
      <TabList type="button-brand" items={items} size="sm" />
      <TabPanel id="overview" className="p-4">Overview content</TabPanel>
      <TabPanel id="analytics" className="p-4">Analytics content</TabPanel>
      <TabPanel id="settings" className="p-4">Settings content</TabPanel>
    </Tabs>
  ),
};

export const ButtonGray: Story = {
  render: () => (
    <Tabs>
      <TabList type="button-gray" items={items} size="sm" />
      <TabPanel id="overview" className="p-4">Overview content</TabPanel>
      <TabPanel id="analytics" className="p-4">Analytics content</TabPanel>
      <TabPanel id="settings" className="p-4">Settings content</TabPanel>
    </Tabs>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs>
      <TabList type="underline" items={items} size="md" />
      <TabPanel id="overview" className="p-4">Overview content</TabPanel>
      <TabPanel id="analytics" className="p-4">Analytics content</TabPanel>
      <TabPanel id="settings" className="p-4">Settings content</TabPanel>
    </Tabs>
  ),
};

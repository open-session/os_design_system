import type { Meta, StoryObj } from '@storybook/react';
import { Tab, TabList, TabPanel, Tabs } from './tabs';

void Tab;
void TabList;
void TabPanel;

/**
 * BOS Tabs — Layer 4 wrapper (Shape C fork). The canonical Tabs entry point.
 * Imports through `@/components/base` resolve here, NOT to the upstream UUI vendor file.
 */
const meta: Meta = {
  title: 'Design System/Application/Tabs',
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

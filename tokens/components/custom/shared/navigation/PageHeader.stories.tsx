import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Custom/Shared/Navigation/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  // Wrap in the production app shell so the page header reads in context.
  parameters: { appShell: true },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: { title: 'Settings' },
};

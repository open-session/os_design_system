import type { Meta, StoryObj } from '@storybook/react';
import { InfoPopover } from './InfoPopover';

const meta: Meta<typeof InfoPopover> = {
  title: 'Custom/Shared/Feedback/InfoPopover',
  component: InfoPopover,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof InfoPopover>;

export const Default: Story = {
  render: () => (
    <div className="flex h-64 items-center justify-center">
      <InfoPopover
        title="What is this?"
        description="A short bit of help text. Click outside to dismiss."
      />
    </div>
  ),
};

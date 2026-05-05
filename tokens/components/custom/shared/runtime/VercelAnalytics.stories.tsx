import type { Meta, StoryObj } from '@storybook/react';
import { VercelAnalytics } from './VercelAnalytics';



const meta: Meta = {
  title: 'Custom/Shared/Runtime/VercelAnalytics',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-secondary bg-bg-secondary px-4 text-sm text-tertiary">
      <code>VercelAnalytics</code> is a runtime-only helper — no rendered UI.
    </div>
  ),
};

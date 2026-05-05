import type { Meta, StoryObj } from '@storybook/react';
import { SearchModal } from './SearchModal';



const meta: Meta = {
  title: 'Custom/Shared/Overlays/SearchModal',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-secondary bg-bg-secondary px-4 text-center text-sm text-tertiary">
      <span><code>SearchModal</code> — opens via UI state</span>
    </div>
  ),
};

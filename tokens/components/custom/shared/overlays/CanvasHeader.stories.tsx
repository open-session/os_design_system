import type { Meta, StoryObj } from '@storybook/react';
import { CanvasHeader } from './CanvasHeader';



const meta: Meta = {
  title: 'Custom/Shared/Overlays/CanvasHeader',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-secondary bg-bg-secondary px-4 text-center text-sm text-tertiary">
      <span><code>CanvasHeader</code> — opens via CanvasProvider state</span>
    </div>
  ),
};

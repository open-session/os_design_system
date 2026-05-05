import type { Meta, StoryObj } from '@storybook/react';
import { CanvasContent } from './CanvasContent';



const meta: Meta = {
  title: 'Custom/Shared/Overlays/CanvasContent',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-secondary bg-bg-secondary px-4 text-center text-sm text-tertiary">
      <span><code>CanvasContent</code> — opens via CanvasProvider state</span>
    </div>
  ),
};

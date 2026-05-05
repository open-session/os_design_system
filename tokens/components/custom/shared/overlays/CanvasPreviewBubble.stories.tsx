import type { Meta, StoryObj } from '@storybook/react';
import { CanvasPreviewBubble, CanvasPreviewCompact } from './CanvasPreviewBubble';

void CanvasPreviewCompact;

const meta: Meta = {
  title: 'Custom/Shared/Overlays/CanvasPreviewBubble',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-secondary bg-bg-secondary px-4 text-center text-sm text-tertiary">
      <span><code>CanvasPreviewBubble</code> — opens via CanvasProvider state</span>
    </div>
  ),
};

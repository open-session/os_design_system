import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ResizableDivider } from './ResizableDivider';

const meta: Meta<typeof ResizableDivider> = {
  title: 'Custom/Shared/Overlays/ResizableDivider',
  component: ResizableDivider,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof ResizableDivider>;

function ResizableDividerStory() {
  const [width, setWidth] = useState(50);
  return (
    <div className="relative flex h-screen w-full">
      <div style={{ width: `${width}%` }} className="bg-bg-secondary p-6 text-sm text-tertiary">
        Left panel ({Math.round(width)}%)
      </div>
      <ResizableDivider leftWidth={width} onWidthChange={setWidth} isActive />
      <div style={{ width: `${100 - width}%` }} className="bg-bg-tertiary p-6 text-sm text-tertiary">
        Right panel
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <ResizableDividerStory />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { WritingStyleSelector, WRITING_STYLES, type WritingStyle } from './writing-style-selector';

void WRITING_STYLES;

const meta: Meta<typeof WritingStyleSelector> = {
  title: 'Custom/Shared/Chat/WritingStyleSelector',
  component: WritingStyleSelector,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WritingStyleSelector>;

function WritingStyleSelectorStory() {
  const [style, setStyle] = useState<WritingStyle | null>(null);
  return <WritingStyleSelector currentStyle={style} onSelect={setStyle} />;
}

export const Default: Story = {
  render: () => <WritingStyleSelectorStory />,
};

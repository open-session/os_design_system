import type { Meta, StoryObj } from '@storybook/react';
import { ThinkingDotFlow, DotLoaderOnly, DotFlow } from './dot-flow';

void DotLoaderOnly;
void DotFlow;

const meta: Meta = {
  title: 'Custom/Shared/Loaders/DotFlow',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ThinkingDotFlow />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { DotLoader } from './dot-loader';

const meta: Meta<typeof DotLoader> = {
  title: 'Custom/Shared/Loaders/DotLoader',
  component: DotLoader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DotLoader>;

const frames = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

export const Default: Story = {
  args: { frames, dotClassName: 'bg-fg-brand-primary' },
};

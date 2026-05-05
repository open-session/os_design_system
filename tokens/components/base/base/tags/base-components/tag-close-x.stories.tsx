import type { Meta, StoryObj } from '@storybook/react';
import { TagCloseX } from './tag-close-x';

const meta: Meta<typeof TagCloseX> = {
  title: 'Base/TagCloseX',
  component: TagCloseX,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TagCloseX>;

export const Default: Story = {
  args: {
    size: 'md',
    'aria-label': 'Remove tag',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    'aria-label': 'Remove tag',
  },
};

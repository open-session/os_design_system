import type { Meta, StoryObj } from '@storybook/react';
import { AvatarAddButton } from './avatar-add-button';

const meta: Meta<typeof AvatarAddButton> = {
  title: 'Base/AvatarAddButton',
  component: AvatarAddButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarAddButton>;

export const Default: Story = {
  args: {
    size: 'md',
    title: 'Add team member',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Add member',
  },
};

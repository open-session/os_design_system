import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Base/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    size: 'md',
    alt: 'User avatar',
  },
};

export const WithImage: Story = {
  args: {
    size: 'md',
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'User avatar',
  },
};

export const Online: Story = {
  args: {
    size: 'md',
    src: 'https://i.pravatar.cc/150?img=5',
    alt: 'Online user',
    status: 'online',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar size="xxs" alt="xxs" />
      <Avatar size="xs" alt="xs" />
      <Avatar size="sm" alt="sm" />
      <Avatar size="md" alt="md" />
      <Avatar size="lg" alt="lg" />
      <Avatar size="xl" alt="xl" />
      <Avatar size="2xl" alt="2xl" />
    </div>
  ),
};

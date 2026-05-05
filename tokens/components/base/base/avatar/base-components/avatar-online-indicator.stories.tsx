import type { Meta, StoryObj } from '@storybook/react';
import { AvatarOnlineIndicator } from './avatar-online-indicator';

const meta: Meta<typeof AvatarOnlineIndicator> = {
  title: 'Base/Avatar/OnlineIndicator',
  component: AvatarOnlineIndicator,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarOnlineIndicator>;

export const Online: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'var(--bg-tertiary, #ccc)',
          }}
        />
        <Story />
      </div>
    ),
  ],
  args: { size: 'md', status: 'online' },
};

export const Offline: Story = {
  ...Online,
  args: { size: 'md', status: 'offline' },
};

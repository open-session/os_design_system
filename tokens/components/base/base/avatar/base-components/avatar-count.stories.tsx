import type { Meta, StoryObj } from '@storybook/react';
import { AvatarCount } from './avatar-count';

const meta: Meta<typeof AvatarCount> = {
  title: 'Base/Base/Avatar/Base-Components/AvatarCount',
  component: AvatarCount,
};

export default meta;
type Story = StoryObj<typeof AvatarCount>;

export const Default: Story = {
  args: {
    count: 5,
  },
  render: (args) => (
    <div style={{ position: 'relative', display: 'inline-flex', width: 40, height: 40, background: '#e5e7eb', borderRadius: '50%' }}>
      <AvatarCount {...args} />
    </div>
  ),
};

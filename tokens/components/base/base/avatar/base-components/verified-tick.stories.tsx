import type { Meta, StoryObj } from '@storybook/react';
import { VerifiedTick } from './verified-tick';

const meta: Meta<typeof VerifiedTick> = {
  title: 'Base/Avatar/VerifiedTick',
  component: VerifiedTick,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VerifiedTick>;

export const Default: Story = {
  args: { size: 'md' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <VerifiedTick size="xs" />
      <VerifiedTick size="sm" />
      <VerifiedTick size="md" />
      <VerifiedTick size="lg" />
      <VerifiedTick size="xl" />
      <VerifiedTick size="2xl" />
    </div>
  ),
};

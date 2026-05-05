import type { Meta, StoryObj } from '@storybook/react';
import { Dot } from './dot-icon';

const meta: Meta<typeof Dot> = {
  title: 'Base/Foundations/Dot',
  component: Dot,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dot>;

export const Default: Story = {
  args: { size: 'md' },
  render: (args) => (
    <span style={{ color: 'var(--fg-success-secondary, #16a34a)' }}>
      <Dot {...args} />
    </span>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
  render: Default.render,
};

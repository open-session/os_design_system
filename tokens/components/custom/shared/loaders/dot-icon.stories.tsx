import type { Meta, StoryObj } from '@storybook/react';
import { DotIcon } from './dot-icon';

const meta: Meta<typeof DotIcon> = {
  title: 'Custom/Shared/Loaders/DotIcon',
  component: DotIcon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DotIcon>;

export const Default: Story = {
  args: { animationKey: 'default', isHovered: false },
};

export const Hovered: Story = {
  args: { animationKey: 'default', isHovered: true },
};

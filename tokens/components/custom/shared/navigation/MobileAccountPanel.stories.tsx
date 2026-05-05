import type { Meta, StoryObj } from '@storybook/react';
import { MobileAccountPanel } from './MobileAccountPanel';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/MobileAccountPanel',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <MobileAccountPanel />,
};

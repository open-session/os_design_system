import type { Meta, StoryObj } from '@storybook/react';
import { MobileHeader } from './MobileHeader';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/MobileHeader',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <MobileHeader />,
};

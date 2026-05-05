import type { Meta, StoryObj } from '@storybook/react';
import { MobileFullScreenMenu } from './MobileFullScreenMenu';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/MobileFullScreenMenu',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <MobileFullScreenMenu />,
};

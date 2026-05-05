import type { Meta, StoryObj } from '@storybook/react';
import { TopHeader } from './TopHeader';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/TopHeader',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <TopHeader />,
};

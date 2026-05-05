import type { Meta, StoryObj } from '@storybook/react';
import { BackgroundGradient } from './BackgroundGradient';



const meta: Meta = {
  title: 'Custom/Shared/Effects/BackgroundGradient',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <BackgroundGradient />,
};

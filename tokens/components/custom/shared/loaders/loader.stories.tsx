import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './loader';



const meta: Meta = {
  title: 'Custom/Shared/Loaders/Loader',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Loader />,
};

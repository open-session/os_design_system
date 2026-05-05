import type { Meta, StoryObj } from '@storybook/react';
import { Orb } from './Orb';



const meta: Meta = {
  title: 'Custom/Shared/Effects/Orb',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Orb />,
};

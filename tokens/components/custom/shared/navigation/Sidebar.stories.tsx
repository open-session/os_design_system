import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/Sidebar',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Sidebar />,
};

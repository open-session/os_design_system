import type { Meta, StoryObj } from '@storybook/react';
import { PageToolbar } from './PageToolbar';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/PageToolbar',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <PageToolbar />,
};

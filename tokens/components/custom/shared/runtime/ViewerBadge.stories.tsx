import type { Meta, StoryObj } from '@storybook/react';
import { ViewerBadge } from './ViewerBadge';



const meta: Meta = {
  title: 'Custom/Shared/Runtime/ViewerBadge',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ViewerBadge />,
};

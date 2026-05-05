import type { Meta, StoryObj } from '@storybook/react';
import { ChatFab } from './ChatFab';



const meta: Meta = {
  title: 'Custom/Shared/Overlays/ChatFab',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ChatFab />,
};

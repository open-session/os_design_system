import type { Meta, StoryObj } from '@storybook/react';
import { MobileNotificationsPanel } from './MobileNotificationsPanel';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/MobileNotificationsPanel',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <MobileNotificationsPanel />,
};

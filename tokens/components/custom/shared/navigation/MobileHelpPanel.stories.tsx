import type { Meta, StoryObj } from '@storybook/react';
import { MobileHelpPanel } from './MobileHelpPanel';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/MobileHelpPanel',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <MobileHelpPanel />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';



const meta: Meta = {
  title: 'Custom/Shared/Branding/ThemeToggle',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ThemeToggle />,
};

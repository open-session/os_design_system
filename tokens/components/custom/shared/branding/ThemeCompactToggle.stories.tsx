import type { Meta, StoryObj } from '@storybook/react';
import { ThemeCompactToggle } from './ThemeCompactToggle';



const meta: Meta = {
  title: 'Custom/Shared/Branding/ThemeCompactToggle',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ThemeCompactToggle />,
};

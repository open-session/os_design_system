import type { Meta, StoryObj } from '@storybook/react';
import { ThemeSegmentedControl } from './ThemeSegmentedControl';



const meta: Meta = {
  title: 'Custom/Shared/Navigation/ThemeSegmentedControl',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ThemeSegmentedControl />,
};

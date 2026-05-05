import type { Meta, StoryObj } from '@storybook/react';
import { BrandSelector } from './BrandSelector';



const meta: Meta = {
  title: 'Custom/Shared/Selectors/BrandSelector',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <BrandSelector />,
};

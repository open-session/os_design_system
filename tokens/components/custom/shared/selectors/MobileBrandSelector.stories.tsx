import type { Meta, StoryObj } from '@storybook/react';
import { MobileBrandSelector } from './MobileBrandSelector';



const meta: Meta = {
  title: 'Custom/Shared/Selectors/MobileBrandSelector',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <MobileBrandSelector />,
};

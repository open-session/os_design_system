import type { Meta, StoryObj } from '@storybook/react';
import { Brandmark } from './Brandmark';



const meta: Meta = {
  title: 'Custom/Shared/Branding/Brandmark',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Brandmark />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { PlusesTexture } from './PlusesTexture';



const meta: Meta = {
  title: 'Custom/Shared/Effects/PlusesTexture',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <PlusesTexture />,
};

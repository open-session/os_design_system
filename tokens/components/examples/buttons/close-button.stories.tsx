import type { Meta, StoryObj } from '@storybook/react';
import { CloseButton } from './close-button';

const meta: Meta<typeof CloseButton> = {
  title: 'Base/CloseButton',
  component: CloseButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {
  args: {
    label: 'Close',
  },
};

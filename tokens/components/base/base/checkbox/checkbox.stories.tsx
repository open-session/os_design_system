import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Base/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Remember me',
    hint: 'Stay signed in for 30 days',
  },
};

export const Checked: Story = {
  args: {
    label: 'Notifications enabled',
    isSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    isDisabled: true,
  },
};

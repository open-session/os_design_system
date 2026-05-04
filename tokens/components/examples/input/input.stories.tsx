import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Base/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    hint: 'Must be at least 8 characters',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read-only field',
    value: 'Locked value',
    isDisabled: true,
  },
};

export const Invalid: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    isInvalid: true,
    hint: 'Invalid email format',
  },
};

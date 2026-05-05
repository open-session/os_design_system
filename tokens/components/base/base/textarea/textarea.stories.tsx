import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './textarea';

const meta: Meta<typeof TextArea> = {
  title: 'Base/TextArea',
  component: TextArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter a description...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Add internal notes',
    hint: 'Not visible to clients',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read-only',
    value: 'This field is locked.',
    isDisabled: true,
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Base/Toggle',
  component: Toggle,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Dark mode',
    hint: 'Applies to all views',
  },
};

export const Selected: Story = {
  args: {
    label: 'Auto-save',
    isSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled toggle',
    isDisabled: true,
  },
};

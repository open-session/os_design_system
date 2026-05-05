import type { Meta, StoryObj } from '@storybook/react';
import { NativeSelect } from './select-native';

const meta: Meta<typeof NativeSelect> = {
  title: 'Base/SelectNative',
  component: NativeSelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  args: {
    label: 'Country',
    options: [
      { value: '', label: 'Select a country' },
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'gb', label: 'United Kingdom' },
    ],
  },
};

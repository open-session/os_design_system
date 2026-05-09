import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton, RadioGroup } from './radio-buttons';

const meta: Meta<typeof RadioGroup> = {
  title: 'Base/RadioButtons',
  component: RadioGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioButton value="email" label="Email" />
      <RadioButton value="sms" label="SMS" />
      <RadioButton value="push" label="Push notification" />
    </RadioGroup>
  ),
  args: {
    'aria-label': 'Notification channel',
    defaultValue: 'email',
  },
};

export const WithHints: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioButton value="standard" label="Standard" hint="3–5 business days" />
      <RadioButton value="express" label="Express" hint="1–2 business days" />
      <RadioButton value="overnight" label="Overnight" hint="Next business day" />
    </RadioGroup>
  ),
  args: {
    'aria-label': 'Shipping speed',
    defaultValue: 'standard',
  },
};

export const SizeMd: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioButton value="card" label="Card" hint="Visa, Mastercard, Amex" />
      <RadioButton value="bank" label="Bank transfer" hint="ACH or wire" />
    </RadioGroup>
  ),
  args: {
    'aria-label': 'Payment method',
    size: 'md',
    defaultValue: 'card',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioButton value="a" label="Option A" />
      <RadioButton value="b" label="Option B" />
    </RadioGroup>
  ),
  args: {
    'aria-label': 'Disabled radio group',
    defaultValue: 'a',
    isDisabled: true,
  },
};

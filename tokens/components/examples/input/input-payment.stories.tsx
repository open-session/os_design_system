import type { Meta, StoryObj } from '@storybook/react';
import { PaymentInput } from './input-payment';

const meta: Meta<typeof PaymentInput> = {
  title: 'Base/Input/Payment',
  component: PaymentInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PaymentInput>;

export const Default: Story = {
  args: {
    label: 'Card number',
    placeholder: '1234 5678 9012 3456',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Card number',
    hint: 'Visa, Mastercard, AmEx, Discover, UnionPay supported',
    placeholder: '1234 5678 9012 3456',
  },
};

export const PrefilledVisa: Story = {
  args: {
    label: 'Card number',
    defaultValue: '4111111111111111',
  },
};

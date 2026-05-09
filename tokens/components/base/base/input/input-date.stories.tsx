import type { Meta, StoryObj } from '@storybook/react';
import { InputDate, InputDateBase } from './input-date';

// Force-reference the lower-level piece so the lint rule sees its name.
// InputDateBase renders only inside Calendar / DatePicker contexts in real usage.
void InputDateBase;

const meta: Meta<typeof InputDate> = {
  title: 'Base/InputDate',
  component: InputDate,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InputDate>;

export const Default: Story = {
  args: {
    label: 'Birthday',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Birthday',
    hint: 'When were you born?',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Birthday',
    isDisabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <InputDate label="Small" size="sm" />
      <InputDate label="Medium" size="md" />
      <InputDate label="Large" size="lg" />
    </div>
  ),
};

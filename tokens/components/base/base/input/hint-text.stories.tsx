import type { Meta, StoryObj } from '@storybook/react';
import { HintText } from './hint-text';
import { Input } from './input';

const meta: Meta<typeof HintText> = {
  title: 'Base/HintText',
  component: HintText,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HintText>;

// Bare-component stories — fast reference, but visually misleading. HintText
// is a description fragment; production never renders it alone.
export const Default: Story = {
  render: () => <HintText>Must be at least 8 characters</HintText>,
};

export const Invalid: Story = {
  render: () => <HintText isInvalid>This field is required</HintText>,
};

// Composition stories — how HintText actually appears in production. The
// Input primitive uses HintText internally for its `hint` prop, with proper
// invalid-state styling driven by the parent TextField context.
export const WithInput: Story = {
  render: () => (
    <Input
      label="Password"
      placeholder="Choose a strong password"
      hint="Must be at least 8 characters"
      type="password"
    />
  ),
};

export const WithInputInvalid: Story = {
  render: () => (
    <Input
      label="Email"
      placeholder="you@company.com"
      hint="Please enter a valid email address"
      isInvalid
      defaultValue="not-an-email"
    />
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';

const meta: Meta<typeof Label> = {
  title: 'Base/Label',
  component: Label,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => <Label>Email address</Label>,
};

export const Required: Story = {
  render: () => <Label isRequired>Full name</Label>,
};

// Composition story — Label is meant to live above an Input. Production
// uses Input's `label` prop, which renders a Label and wires aria-labelledby.
export const WithInput: Story = {
  render: () => (
    <Input
      label="Full name"
      placeholder="Olivia Rhye"
      isRequired
    />
  ),
};

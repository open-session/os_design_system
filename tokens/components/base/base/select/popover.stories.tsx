import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';
import { SelectItem } from './select-item';
import { Popover } from './popover';

// `Popover` is an internal helper used by `Select` and `Combobox` to position
// their listbox. It relies on `--trigger-width` / `--trigger-anchor-point` CSS
// variables set by a parent trigger, so it has no useful standalone preview —
// the canonical demo is a Select, which uses it.

const meta: Meta<typeof Popover> = {
  title: 'Base/Select/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

const items = [
  { id: '1', label: 'Option one' },
  { id: '2', label: 'Option two' },
  { id: '3', label: 'Option three' },
];

export const InsideSelect: Story = {
  render: () => (
    <Select label="Choose" items={items} placeholder="Pick an option">
      {(item) => <SelectItem id={item.id} label={item.label} />}
    </Select>
  ),
};

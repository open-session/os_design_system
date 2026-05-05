import type { Meta } from '@storybook/react';
import { Select } from './select';
import { SelectItem } from './select-item';

const meta: Meta = {
  title: 'Base/Select',
  tags: ['autodocs'],
};

export default meta;

const items = [
  { id: '1', label: 'Design' },
  { id: '2', label: 'Engineering' },
  { id: '3', label: 'Marketing' },
];

export const Default = {
  render: () => (
    <Select label="Department" items={items} placeholder="Select a department">
      {(item) => <SelectItem id={item.id} label={item.label} />}
    </Select>
  ),
};

export const WithHint = {
  render: () => (
    <Select label="Role" hint="Select your primary role" items={items} placeholder="Choose role">
      {(item) => <SelectItem id={item.id} label={item.label} />}
    </Select>
  ),
};

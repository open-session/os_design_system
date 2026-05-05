import type { Meta } from '@storybook/react';
import { ComboBox } from './combobox';
import { SelectItem } from './select-item';

const meta: Meta = {
  title: 'Base/ComboBox',
  tags: ['autodocs'],
};

export default meta;

const items = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'angular', label: 'Angular' },
];

export const Default = {
  render: () => (
    <ComboBox placeholder="Search frameworks..." items={items}>
      {(item) => <SelectItem id={item.id} label={item.label} />}
    </ComboBox>
  ),
};

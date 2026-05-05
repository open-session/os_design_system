import type { Meta } from '@storybook/react';
import { useListData } from 'react-stately';
import type { SelectItemType } from './select';
import { TagSelect } from './tag-select';
import { SelectItem } from './select-item';

const meta: Meta = {
  title: 'Base/TagSelect',
  tags: ['autodocs'],
};

export default meta;

const allItems: SelectItemType[] = [
  { id: 'design', label: 'Design' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'product', label: 'Product' },
];

function TagSelectStory() {
  const selectedItems = useListData<SelectItemType>({ initialItems: [] });
  return (
    <TagSelect
      label="Teams"
      placeholder="Select teams..."
      items={allItems}
      selectedItems={selectedItems}
    >
      {(item) => <SelectItem id={item.id} label={item.label} />}
    </TagSelect>
  );
}

export const Default = {
  render: () => <TagSelectStory />,
};

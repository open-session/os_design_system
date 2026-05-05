import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CategoryInput } from './CategoryInput';

const meta: Meta<typeof CategoryInput> = {
  title: 'Custom/Shared/Forms/CategoryInput',
  component: CategoryInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategoryInput>;

function CategoryInputStory() {
  const [value, setValue] = useState('');
  return (
    <CategoryInput
      id="story-category"
      value={value}
      onChange={setValue}
      existingCategories={['Documentation', 'Marketing', 'Engineering']}
    />
  );
}

export const Default: Story = {
  render: () => <CategoryInputStory />,
};

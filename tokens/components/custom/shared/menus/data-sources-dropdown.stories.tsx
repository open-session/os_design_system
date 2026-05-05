import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DataSourcesDropdown } from './data-sources-dropdown';

const meta: Meta<typeof DataSourcesDropdown> = {
  title: 'Custom/Shared/Menus/DataSourcesDropdown',
  component: DataSourcesDropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataSourcesDropdown>;

function DataSourcesDropdownStory() {
  const [web, setWeb] = useState(true);
  const [brand, setBrand] = useState(false);
  return (
    <DataSourcesDropdown
      webEnabled={web}
      brandEnabled={brand}
      onWebToggle={setWeb}
      onBrandToggle={setBrand}
    />
  );
}

export const Default: Story = {
  render: () => <DataSourcesDropdownStory />,
};

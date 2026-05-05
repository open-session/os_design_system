import type { Meta, StoryObj } from '@storybook/react';
import { SearchResearchToggle, SearchResearchSuggestions } from './search-research-toggle';

void SearchResearchSuggestions;

const meta: Meta = {
  title: 'Custom/Shared/Chat/SearchResearchToggle',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <SearchResearchToggle />,
};

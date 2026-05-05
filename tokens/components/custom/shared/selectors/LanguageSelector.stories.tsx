import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSelector } from './LanguageSelector';



const meta: Meta = {
  title: 'Custom/Shared/Selectors/LanguageSelector',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <LanguageSelector />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { ClaudeLogo, PerplexityLogo } from './provider-icons';

void PerplexityLogo;

const meta: Meta = {
  title: 'Custom/Shared/Branding/ProviderIcons',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ClaudeLogo />,
};

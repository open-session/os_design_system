import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconPreview } from './Icon';

void IconPreview;

const meta: Meta<typeof Icon> = {
  title: 'Custom/Shared/Branding/Icon',
  component: Icon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { name: 'Globe', className: 'w-5 h-5' },
};

export const FontAwesome: Story = {
  args: { name: 'fa-anthropic', className: 'w-5 h-5' },
};

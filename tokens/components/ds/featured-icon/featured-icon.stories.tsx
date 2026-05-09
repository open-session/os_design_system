import type { Meta, StoryObj } from '@storybook/react';
import { Star01 } from '@untitledui/icons';
import { FeaturedIcon } from './featured-icon';

/**
 * BOS FeaturedIcon — Layer 4 wrapper (Shape C fork). The canonical FeaturedIcon entry point.
 * Imports through `@/components/base` resolve here, NOT to the upstream UUI vendor file.
 */
const meta: Meta<typeof FeaturedIcon> = {
  title: 'Base/Foundations/FeaturedIcon',
  component: FeaturedIcon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeaturedIcon>;

export const Default: Story = {
  args: { size: 'md', color: 'brand', theme: 'light', icon: Star01 },
};

export const Gray: Story = {
  args: { size: 'md', color: 'gray', theme: 'light', icon: Star01 },
};

export const Outline: Story = {
  args: { size: 'md', color: 'gray', theme: 'outline', icon: Star01 },
};

export const Modern: Story = {
  args: { size: 'md', color: 'brand', theme: 'modern', icon: Star01 },
};

import type { Meta, StoryObj } from '@storybook/react';
import { Star01 } from '@untitledui/icons';
import { FeaturedIcon } from './featured-icon';

/**
 * BOS FeaturedIcon — the vendor primitive (UUI Pro v8) with the 5-axis BOS
 * transforms applied at vendor-pull time. The Shape C wrapper at
 * components/ds/featured-icon/ was removed in the DS framework simplification
 * pass; UUI defaults accepted as the new resting state.
 *
 * Consumer entry point: `import { FeaturedIcon } from '@/components/base'`.
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

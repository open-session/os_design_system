import type { Meta, StoryObj } from '@storybook/react';
import { Star01 } from '@untitledui/icons';
import { FeaturedIcon } from './featured-icon';

/**
 * Vendor-pristine UUI Pro FeaturedIcon — what `bun run uui:add featured-icon` produces.
 * Use for vendor-swap auditing only. Product code uses `@/components/base` FeaturedIcon
 * (which re-exports `components/ds/featured-icon/featured-icon.tsx` — Shape C fork).
 */
const meta: Meta<typeof FeaturedIcon> = {
  title: 'Base (Upstream UUI)/Foundations/FeaturedIcon',
  component: FeaturedIcon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeaturedIcon>;

export const Default: Story = {
  args: { size: 'md', color: 'brand', theme: 'light', icon: Star01 },
};

export const Themes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['light', 'gradient', 'dark', 'modern', 'modern-neue', 'outline'] as const).map((theme) => (
        <FeaturedIcon key={theme} size="md" color="brand" theme={theme} icon={Star01} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['brand', 'gray', 'success', 'warning', 'error'] as const).map((color) => (
        <FeaturedIcon key={color} size="md" color={color} theme="light" icon={Star01} />
      ))}
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

/**
 * Vendor-pristine UUI Pro Button — what `bun run uui:add button` produces after
 * mechanical transforms. Renders the upstream orange CTA primary, NOT the BOS
 * neutral-secondary primary.
 *
 * Use this for vendor-swap audits / before-after comparison only. Product code
 * imports the BOS Button from `@/components/base` (which re-exports
 * `components/ds/buttons/button.tsx` — Layer 4 wrapper, Shape C fork).
 *
 * See `Design System/Button` for the canonical BOS rendering.
 */
const meta: Meta<typeof Button> = {
  title: 'Base (Upstream UUI)/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
};

export const Primary: Story = {
  args: {
    children: 'Save changes',
    color: 'primary',
    size: 'md',
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving...',
    isLoading: true,
  },
};

export const ExtraSmall: Story = {
  args: {
    children: 'Compact action',
    size: 'xs',
  },
};

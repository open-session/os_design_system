import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

/**
 * BOS Button — the canonical product Button. Imports through the barrel
 * (`@/components/base`) resolve here, NOT to the upstream UUI vendor file at
 * `components/base/base/buttons/button.tsx` (which is preserved as the
 * pristine vendor-survival baseline).
 *
 * The vendor-pristine Button is rendered separately at `Base (Upstream UUI)/Button`
 * for visual comparison / vendor-swap auditing.
 */
const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
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

export const Secondary: Story = {
  args: {
    children: 'Cancel',
    color: 'secondary',
    size: 'md',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Less emphasis',
    color: 'tertiary',
    size: 'md',
  },
};

export const PrimaryDestructive: Story = {
  args: {
    children: 'Delete',
    color: 'primary-destructive',
    size: 'md',
  },
};

export const LinkColor: Story = {
  args: {
    children: 'Learn more',
    color: 'link-color',
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

export const Disabled: Story = {
  args: {
    children: 'Save changes',
    color: 'primary',
    isDisabled: true,
  },
};

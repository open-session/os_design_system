import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

/**
 * BOS Button — the vendor primitive (UUI Pro v8) with the 5-axis BOS transforms
 * applied at vendor-pull time. The Shape C wrapper at components/ds/buttons/
 * was removed in the DS framework simplification pass; UUI's primary/secondary
 * variants accepted as the new resting state.
 *
 * Consumer entry point: `import { Button } from '@/components/base'`.
 */
const meta: Meta<typeof Button> = {
  title: 'Base/Base/Button',
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

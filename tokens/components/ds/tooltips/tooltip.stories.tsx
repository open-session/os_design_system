import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/base';
import { Tooltip } from './tooltip';

/**
 * BOS Tooltip — 5th canonical ds/ wrapper (PRD 020, Wave 2).
 *
 * Consumer entry point: `import { Tooltip } from '@/components/base'`
 *
 * This story lives at Base/Base/Tooltip because the wrapper ships as the canonical
 * Tooltip primitive after Wave 2c barrel reroute.
 *
 * Tooltip usage: pass the trigger element as `children` and provide `title` (and
 * optionally `description`) for the popup content. The TooltipTrigger wrapper is
 * internal to the Tooltip component (it wraps AriaTooltipTrigger).
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Base/Base/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/**
 * Default tooltip with BOS behavioral defaults applied:
 * delay=300ms, closeDelay=0ms, placement="top", offset=6, arrow=false
 */
export const Default: Story = {
  render: () => (
    <Tooltip title="Tooltip content">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

/**
 * Tooltip with a description — demonstrates title + description layout.
 */
export const WithDescription: Story = {
  render: () => (
    <Tooltip
      title="Action label"
      description="Additional context about this action."
    >
      <Button>Hover for details</Button>
    </Tooltip>
  ),
};

/**
 * Tooltip with arrow visible.
 */
export const WithArrow: Story = {
  render: () => (
    <Tooltip title="With arrow" arrow>
      <Button>Hover (arrow visible)</Button>
    </Tooltip>
  ),
};

/**
 * Consumer override: delay set to 0 (immediate show).
 * Demonstrates that BOS defaults can be overridden by consumer props.
 */
export const ImmediateDelay: Story = {
  render: () => (
    <Tooltip title="Immediate tooltip" delay={0}>
      <Button>Hover (instant)</Button>
    </Tooltip>
  ),
};

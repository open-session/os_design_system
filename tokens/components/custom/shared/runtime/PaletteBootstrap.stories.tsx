import type { Meta, StoryObj } from '@storybook/react';
import { PaletteBootstrap } from './PaletteBootstrap';



const meta: Meta = {
  title: 'Custom/Shared/Runtime/PaletteBootstrap',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-secondary bg-bg-secondary px-4 text-sm text-tertiary">
      <code>PaletteBootstrap</code> is a runtime-only helper — no rendered UI.
    </div>
  ),
};

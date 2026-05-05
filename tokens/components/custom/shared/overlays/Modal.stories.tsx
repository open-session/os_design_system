import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ConfirmModal } from './Modal';

void ConfirmModal;

const meta: Meta = {
  title: 'Custom/Shared/Overlays/Modal',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-secondary bg-bg-secondary px-4 text-center text-sm text-tertiary">
      <span><code>Modal</code> — see custom/shared/overlays/Modal — needs a DialogTrigger context</span>
    </div>
  ),
};

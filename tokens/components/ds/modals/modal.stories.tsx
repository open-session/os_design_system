import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ds/buttons/button';
import { Dialog, DialogTrigger, Modal, ModalOverlay } from './modal';

/**
 * BOS Modal — the canonical product Modal/Dialog/ModalOverlay. Imports through
 * the barrel (`@/components/base`) resolve here, NOT to the upstream UUI v8
 * vendor files at `components/base/application/modals/modal.tsx`
 * (which are preserved as the pristine vendor-survival baseline).
 *
 * Type 3 brand decisions retained:
 *   1. Dialog owns surface treatment (rounded, bg, shadow).
 *   2. Slower modal motion: duration-moderate enter, duration-standard exit.
 */
const meta: Meta<typeof Modal> = {
  title: 'Design System/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => (
    <DialogTrigger>
      <Button>Open modal</Button>
      <ModalOverlay>
        <Modal className="max-w-md">
          <Dialog>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-fg-primary">BOS-styled Dialog</h2>
              <p className="mt-2 text-sm text-fg-secondary">
                The Dialog wrapper owns rounded corners, background, and shadow — no
                manual surface styling needed in consumers.
              </p>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ds/buttons/button';
import { Dialog, DialogTrigger, Modal, ModalOverlay } from './modal';

/**
 * BOS Modal — the vendor primitive (UUI Pro v8) with the 5-axis BOS transforms
 * applied at vendor-pull time. The Shape C wrapper at components/ds/modals/
 * was removed in the DS framework simplification pass; vendor Dialog surface
 * treatment accepted as the new resting state.
 *
 * Consumer entry point: `import { Modal, ModalOverlay, Dialog, DialogTrigger }
 * from '@/components/base'`.
 */
const meta: Meta<typeof Modal> = {
  title: 'Base/Application/Modal',
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

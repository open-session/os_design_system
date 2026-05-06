import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ds/buttons/button';
import { Dialog, DialogTrigger, Modal, ModalOverlay } from './modal';

const meta: Meta = {
  title: 'Base/Application/Modal',
  tags: ['autodocs'],
  // Modal renders a full-viewport overlay; padded canvas would clip it.
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DialogTrigger>
      <Button color="secondary">Open modal</Button>
      <ModalOverlay>
        <Modal>
          <Dialog>
            <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-primary p-6 ring-1 ring-secondary_alt">
              <h2 className="text-lg font-semibold text-primary">Stub modal</h2>
              <p className="text-sm text-tertiary">
                A minimal Modal stub for storybook coverage. Real product modals live
                under <code>components/custom/</code>.
              </p>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  ),
};

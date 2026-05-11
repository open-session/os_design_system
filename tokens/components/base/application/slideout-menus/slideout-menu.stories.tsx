import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/base/base/buttons/button';
import { Dialog, Modal, ModalOverlay, SlideoutMenu } from './slideout-menu';

void Dialog;
void Modal;
void ModalOverlay;

const meta: Meta = {
  title: 'Base/Application/SlideoutMenu',
  tags: ['autodocs'],
  // Slideout pins to viewport edge — padded canvas would clip it.
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <SlideoutMenu.Trigger>
      <Button color="secondary">Open slideout</Button>
      <SlideoutMenu>
        <SlideoutMenu.Header>
          <h2 className="text-lg font-semibold text-primary">Slideout title</h2>
        </SlideoutMenu.Header>
        <SlideoutMenu.Content>
          <p className="text-sm text-tertiary">Stub content for storybook coverage.</p>
        </SlideoutMenu.Content>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  ),
};

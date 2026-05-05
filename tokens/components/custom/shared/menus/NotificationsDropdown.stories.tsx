import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { NotificationsDropdown } from './NotificationsDropdown';

const meta: Meta<typeof NotificationsDropdown> = {
  title: 'Custom/Shared/Menus/NotificationsDropdown',
  component: NotificationsDropdown,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof NotificationsDropdown>;

function NotificationsDropdownStory() {
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative h-96 p-6">
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-md bg-bg-secondary px-3 py-1.5 text-sm text-secondary ring-1 ring-border-secondary"
      >
        Notifications
      </button>
      <NotificationsDropdown isOpen={open} onClose={() => setOpen(false)} triggerRef={ref} />
    </div>
  );
}

export const Open: Story = {
  render: () => <NotificationsDropdownStory />,
};

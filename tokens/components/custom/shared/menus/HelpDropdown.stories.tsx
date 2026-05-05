import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { HelpDropdown } from './HelpDropdown';

const meta: Meta<typeof HelpDropdown> = {
  title: 'Custom/Shared/Menus/HelpDropdown',
  component: HelpDropdown,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof HelpDropdown>;

function HelpDropdownStory() {
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
        Help
      </button>
      <HelpDropdown isOpen={open} onClose={() => setOpen(false)} triggerRef={ref} />
    </div>
  );
}

export const Open: Story = {
  render: () => <HelpDropdownStory />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { NavigationDrawer } from './NavigationDrawer';

const meta: Meta<typeof NavigationDrawer> = {
  title: 'Custom/Shared/Navigation/NavigationDrawer',
  component: NavigationDrawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof NavigationDrawer>;

function NavigationDrawerStory() {
  const [open, setOpen] = useState(true);
  const railRef = useRef<HTMLElement>(null);
  return (
    <div className="relative h-screen">
      <aside ref={railRef} className="absolute inset-y-0 left-0 w-14 bg-bg-secondary" />
      <NavigationDrawer
        isOpen={open}
        item="brand-hub"
        onClose={() => setOpen(false)}
        railRef={railRef}
      />
    </div>
  );
}

export const BrandHub: Story = {
  render: () => <NavigationDrawerStory />,
};

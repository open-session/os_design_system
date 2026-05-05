import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FlipCard, FlipCardPersistent } from './FlipCard';

void FlipCardPersistent;

const meta: Meta<typeof FlipCard> = {
  title: 'Custom/Shared/Effects/FlipCard',
  component: FlipCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FlipCard>;

function FlipCardStory() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <FlipCard
        isFlipped={flipped}
        front={
          <div className="w-64 rounded-xl bg-bg-secondary p-6 text-center text-sm text-secondary ring-1 ring-border-secondary">
            Front face
          </div>
        }
        back={
          <div className="w-64 rounded-xl bg-bg-brand-primary p-6 text-center text-sm text-fg-brand-primary ring-1 ring-border-primary">
            Back face
          </div>
        }
      />
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="rounded-md bg-bg-brand-solid px-3 py-1.5 text-sm text-fg-white"
      >
        Flip
      </button>
    </div>
  );
}

export const Toggle: Story = {
  render: () => <FlipCardStory />,
};

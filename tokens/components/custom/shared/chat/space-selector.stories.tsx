import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SpaceSelector } from './space-selector';
import type { SpaceOption } from '@/lib/chat-context';

const meta: Meta<typeof SpaceSelector> = {
  title: 'Custom/Shared/Chat/SpaceSelector',
  component: SpaceSelector,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SpaceSelector>;

const sampleSpaces: SpaceOption[] = [
  { id: '1', slug: 'design', title: 'Design' },
  { id: '2', slug: 'engineering', title: 'Engineering' },
];

function SpaceSelectorStory() {
  const [space, setSpace] = useState<SpaceOption | null>(null);
  return (
    <SpaceSelector
      spaces={sampleSpaces}
      currentSpace={space}
      onSelect={setSpace}
      onCreateSpace={async () => {}}
    />
  );
}

export const Default: Story = {
  render: () => <SpaceSelectorStory />,
};

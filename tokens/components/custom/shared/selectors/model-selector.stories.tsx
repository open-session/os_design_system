import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ModelSelector } from './model-selector';

const meta: Meta<typeof ModelSelector> = {
  title: 'Custom/Shared/Selectors/ModelSelector',
  component: ModelSelector,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModelSelector>;

function ModelSelectorStory() {
  const [model, setModel] = useState<'auto' | 'claude' | 'perplexity'>('auto');
  return <ModelSelector selectedModel={model as never} onModelChange={setModel as never} />;
}

export const Default: Story = {
  render: () => <ModelSelectorStory />,
};

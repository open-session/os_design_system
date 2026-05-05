import type { Meta, StoryObj } from '@storybook/react';
import { TypewriterText } from './TypewriterText';

const meta: Meta<typeof TypewriterText> = {
  title: 'Custom/Shared/Effects/TypewriterText',
  component: TypewriterText,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TypewriterText>;

export const Default: Story = {
  render: () => <TypewriterText />,
};

import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownCodeViewer } from './MarkdownCodeViewer';

const meta: Meta<typeof MarkdownCodeViewer> = {
  title: 'Custom/Shared/Feedback/MarkdownCodeViewer',
  component: MarkdownCodeViewer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MarkdownCodeViewer>;

const sample = `# Heading

A short markdown sample with a code block:

\`\`\`ts
export const greet = (name: string) => \`hi, \${name}\`;
\`\`\`
`;

export const Default: Story = {
  args: {
    filename: 'example.md',
    content: sample,
  },
};

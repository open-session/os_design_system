import type { Meta, StoryObj } from '@storybook/react';
import { MainContent } from './MainContent';

const meta: Meta<typeof MainContent> = {
  title: 'Custom/Shared/Navigation/MainContent',
  component: MainContent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof MainContent>;

export const Default: Story = {
  render: () => (
    <MainContent>
      <div className="flex min-h-64 items-center justify-center text-sm text-tertiary">
        Page content goes here. Sidebar padding adjusts via SidebarProvider state.
      </div>
    </MainContent>
  ),
};

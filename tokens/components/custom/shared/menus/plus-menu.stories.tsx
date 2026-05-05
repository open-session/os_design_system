import type { Meta, StoryObj } from '@storybook/react';
import { PlusMenu, ProjectIndicator } from './plus-menu';

void ProjectIndicator;

const meta: Meta<typeof PlusMenu> = {
  title: 'Custom/Shared/Menus/PlusMenu',
  component: PlusMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof PlusMenu>;

export const Default: Story = {
  render: () => (
    <div className="flex h-96 items-end p-6">
      <PlusMenu
        onAddFiles={() => {}}
        onProjectSelect={() => {}}
        onStyleSelect={() => {}}
        onSpaceSelect={() => {}}
        currentProject={null}
        currentStyle={null}
        currentSpace={null}
        projects={[]}
        spaces={[]}
        onCreateProject={async () => {}}
        onCreateSpace={async () => {}}
      />
    </div>
  ),
};

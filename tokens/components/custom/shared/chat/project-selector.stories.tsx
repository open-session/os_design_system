import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ProjectSelector } from './project-selector';

const meta: Meta<typeof ProjectSelector> = {
  title: 'Custom/Shared/Chat/ProjectSelector',
  component: ProjectSelector,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectSelector>;

const sampleProjects = [
  { id: '1', name: 'Brand refresh', userId: 'u', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '2', name: 'Q2 launch', userId: 'u', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
];

function ProjectSelectorStory() {
  const [project, setProject] = useState<(typeof sampleProjects)[0] | null>(null);
  return (
    <ProjectSelector
      projects={sampleProjects as never}
      currentProject={project as never}
      onSelect={setProject as never}
      onCreateProject={async () => {}}
    />
  );
}

export const Default: Story = {
  render: () => <ProjectSelectorStory />,
};

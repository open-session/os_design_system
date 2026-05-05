import type { Meta, StoryObj } from '@storybook/react';
import { Folder } from '@untitledui-pro/icons/line';
import { ProjectStyleCard } from './ProjectStyleCard';

const meta: Meta<typeof ProjectStyleCard> = {
  title: 'Custom/Shared/Navigation/ProjectStyleCard',
  component: ProjectStyleCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectStyleCard>;

export const Default: Story = {
  args: {
    href: '#',
    title: 'Brand refresh',
    description: 'Q2 design system rollout',
    icon: Folder,
    iconLabel: 'Project',
    lastUpdated: 'Updated 2 days ago',
  },
};

export const NewBadge: Story = {
  args: {
    href: '#',
    title: 'Q2 launch',
    description: 'Marketing site refresh',
    icon: Folder,
    iconLabel: 'Project',
    lastUpdated: 'Updated just now',
    isNew: true,
  },
};

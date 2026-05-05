import type { Meta, StoryObj } from '@storybook/react';
import { AvatarLabelGroup } from './avatar-label-group';

const meta: Meta<typeof AvatarLabelGroup> = {
  title: 'Base/AvatarLabelGroup',
  component: AvatarLabelGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarLabelGroup>;

export const Default: Story = {
  args: {
    size: 'md',
    title: 'Karim Bouhdary',
    subtitle: 'karim@opensession.co',
  },
};

export const WithImage: Story = {
  args: {
    size: 'md',
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'Karim Bouhdary',
    title: 'Karim Bouhdary',
    subtitle: 'karim@opensession.co',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Karim Smith',
    subtitle: 'Product Designer',
  },
};

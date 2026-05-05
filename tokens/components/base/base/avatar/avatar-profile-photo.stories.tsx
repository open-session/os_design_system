import type { Meta, StoryObj } from '@storybook/react';
import { AvatarProfilePhoto } from './avatar-profile-photo';

const meta: Meta<typeof AvatarProfilePhoto> = {
  title: 'Base/AvatarProfilePhoto',
  component: AvatarProfilePhoto,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarProfilePhoto>;

export const Default: Story = {
  args: {
    size: 'md',
    alt: 'Profile photo',
  },
};

export const WithImage: Story = {
  args: {
    size: 'md',
    src: 'https://i.pravatar.cc/150?img=7',
    alt: 'Profile photo',
  },
};

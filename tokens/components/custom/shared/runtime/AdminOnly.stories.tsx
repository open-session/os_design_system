import type { Meta, StoryObj } from '@storybook/react';
import { AdminOnly } from './AdminOnly';

const meta: Meta<typeof AdminOnly> = {
  title: 'Custom/Shared/Runtime/AdminOnly',
  component: AdminOnly,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AdminOnly>;

export const SignedIn: Story = {
  render: () => (
    <AdminOnly fallback={<span className="text-tertiary">Hidden from non-admins.</span>}>
      <span className="text-sm text-secondary">
        Admin-only content (visible — mock auth user is signed in).
      </span>
    </AdminOnly>
  ),
};

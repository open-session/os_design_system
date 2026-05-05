import type { Meta, StoryObj } from '@storybook/react';
import { AvatarCompanyIcon } from './avatar-company-icon';

const meta: Meta<typeof AvatarCompanyIcon> = {
  title: 'Base/Avatar/CompanyIcon',
  component: AvatarCompanyIcon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarCompanyIcon>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'var(--bg-tertiary, #ccc)',
          }}
        />
        <Story />
      </div>
    ),
  ],
  args: {
    size: 'md',
    src: 'https://i.pravatar.cc/40?img=12',
    alt: 'Company',
  },
};

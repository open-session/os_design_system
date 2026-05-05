import type { Meta, StoryObj } from '@storybook/react';
import { ActiveSettingsIndicators } from './active-settings-indicators';

const meta: Meta<typeof ActiveSettingsIndicators> = {
  title: 'Custom/Shared/Chat/ActiveSettingsIndicators',
  component: ActiveSettingsIndicators,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActiveSettingsIndicators>;

export const Empty: Story = {
  args: {
    currentProject: null,
    currentWritingStyle: null,
    onRemoveProject: () => {},
    onRemoveWritingStyle: () => {},
  },
};

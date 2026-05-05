import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup, ButtonGroupItem } from './button-group';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Base/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupItem>Option A</ButtonGroupItem>
      <ButtonGroupItem>Option B</ButtonGroupItem>
      <ButtonGroupItem>Option C</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const TwoButton: Story = {
  render: () => (
    <ButtonGroup size="sm">
      <ButtonGroupItem>Yes</ButtonGroupItem>
      <ButtonGroupItem>No</ButtonGroupItem>
    </ButtonGroup>
  ),
};

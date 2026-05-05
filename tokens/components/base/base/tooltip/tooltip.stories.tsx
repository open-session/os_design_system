import type { Meta } from '@storybook/react';
import { Button } from '../buttons/button';
import { Tooltip, TooltipTrigger } from './tooltip';

const meta: Meta = {
  title: 'Base/Tooltip',
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => (
    <Tooltip title="This is a tooltip">
      <TooltipTrigger>
        <Button>Hover me</Button>
      </TooltipTrigger>
    </Tooltip>
  ),
};

export const WithDescription = {
  render: () => (
    <Tooltip title="Keyboard shortcut" description="Press Cmd+K to open">
      <TooltipTrigger>
        <Button>Search</Button>
      </TooltipTrigger>
    </Tooltip>
  ),
};

export const WithArrow = {
  render: () => (
    <Tooltip title="Tooltip with arrow" arrow>
      <TooltipTrigger>
        <Button>With arrow</Button>
      </TooltipTrigger>
    </Tooltip>
  ),
};

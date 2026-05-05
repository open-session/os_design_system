import type { Meta } from '@storybook/react';
import { Button } from '../buttons/button';
import { Dropdown } from './dropdown';

const meta: Meta = {
  title: 'Base/Dropdown',
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => (
    <Dropdown.Root>
      <Button>Open menu</Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item id="edit" label="Edit" />
          <Dropdown.Item id="duplicate" label="Duplicate" />
          <Dropdown.Separator />
          <Dropdown.Item id="delete" label="Delete" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
};

export const WithDots = {
  render: () => (
    <Dropdown.Root>
      <Dropdown.DotsButton aria-label="More options" />
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item id="view" label="View" />
          <Dropdown.Item id="edit" label="Edit" />
          <Dropdown.Item id="archive" label="Archive" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
};

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

export const SelectionCheckmark = {
  render: () => (
    <Dropdown.Root>
      <Button>Sort by</Button>
      <Dropdown.Popover>
        <Dropdown.Menu selectionMode="single" defaultSelectedKeys={['recent']}>
          <Dropdown.Item id="recent" label="Most recent" />
          <Dropdown.Item id="oldest" label="Oldest" />
          <Dropdown.Item id="alpha" label="Alphabetical" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
};

export const SelectionCheckbox = {
  render: () => (
    <Dropdown.Root>
      <Button>Filters</Button>
      <Dropdown.Popover>
        <Dropdown.Menu selectionMode="multiple" defaultSelectedKeys={['drafts', 'published']}>
          <Dropdown.Item id="drafts" label="Drafts" selectionIndicator="checkbox" />
          <Dropdown.Item id="published" label="Published" selectionIndicator="checkbox" />
          <Dropdown.Item id="archived" label="Archived" selectionIndicator="checkbox" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
};

export const SelectionRadio = {
  render: () => (
    <Dropdown.Root>
      <Button>Theme</Button>
      <Dropdown.Popover>
        <Dropdown.Menu selectionMode="single" defaultSelectedKeys={['system']}>
          <Dropdown.Item id="light" label="Light" selectionIndicator="radio" />
          <Dropdown.Item id="dark" label="Dark" selectionIndicator="radio" />
          <Dropdown.Item id="system" label="System" selectionIndicator="radio" />
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  ),
};

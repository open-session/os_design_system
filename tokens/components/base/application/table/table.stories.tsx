import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableRowActionsDropdown } from './table';

const meta: Meta = {
  title: 'Base/Application/Table',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const rows = [
  { id: '1', name: 'Olivia Rhye', email: 'olivia@untitledui.com', role: 'Admin' },
  { id: '2', name: 'Phoenix Baker', email: 'phoenix@untitledui.com', role: 'Editor' },
  { id: '3', name: 'Lana Steiner', email: 'lana@untitledui.com', role: 'Viewer' },
];

export const Default: Story = {
  render: () => (
    <Table aria-label="People">
      <Table.Header>
        <Table.Head id="name" label="Name" isRowHeader />
        <Table.Head id="email" label="Email" />
        <Table.Head id="role" label="Role" />
        <Table.Head id="actions" label="" />
      </Table.Header>
      <Table.Body items={rows}>
        {(row) => (
          <Table.Row>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
            <Table.Cell>
              <TableRowActionsDropdown />
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  ),
};

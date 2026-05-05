import type { Meta, StoryObj } from '@storybook/react';
// One shared story covers every export under pagination/*.
import { Pagination } from './pagination-base';
import { PaginationDot } from './pagination-dot';
import { PaginationLine } from './pagination-line';
import {
  PaginationButtonGroup,
  PaginationCardDefault,
  PaginationCardMinimal,
  PaginationPageDefault,
  PaginationPageMinimalCenter,
} from './pagination';

void Pagination;

const meta: Meta = {
  title: 'Base/Application/Pagination',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const PageDefault: Story = {
  render: () => <PaginationPageDefault page={3} total={10} />,
};

export const PageMinimalCenter: Story = {
  render: () => <PaginationPageMinimalCenter page={3} total={10} />,
};

export const CardDefault: Story = {
  render: () => <PaginationCardDefault page={3} total={10} />,
};

export const CardMinimal: Story = {
  render: () => <PaginationCardMinimal page={3} total={10} />,
};

export const ButtonGroup: Story = {
  render: () => <PaginationButtonGroup page={3} total={10} />,
};

export const Dots: Story = {
  render: () => <PaginationDot page={2} total={5} />,
};

export const Lines: Story = {
  render: () => <PaginationLine page={2} total={5} />,
};

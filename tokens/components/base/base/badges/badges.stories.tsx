import type { Meta } from '@storybook/react';
import { Badge, BadgeWithDot } from './badges';

const meta: Meta = {
  title: 'Base/Badge',
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => <Badge color="gray">Badge</Badge>,
};

export const Brand = {
  render: () => <Badge color="brand">Brand</Badge>,
};

export const Success = {
  render: () => <Badge color="success">Active</Badge>,
};

export const Error = {
  render: () => <Badge color="error">Error</Badge>,
};

export const WithDot = {
  render: () => <BadgeWithDot color="success">Online</BadgeWithDot>,
};

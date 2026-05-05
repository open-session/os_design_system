import type { Meta } from '@storybook/react';
import { InputGroup } from './input-group';
import { Input } from './input';

const meta: Meta<typeof InputGroup> = {
  title: 'Base/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => (
    <InputGroup label="Website" prefix="https://">
      <Input placeholder="example.com" />
    </InputGroup>
  ),
};

export const WithHint = {
  render: () => (
    <InputGroup label="Username" hint="Only letters and numbers">
      <Input placeholder="your-username" />
    </InputGroup>
  ),
};

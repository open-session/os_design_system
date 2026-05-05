import type { Meta, StoryObj } from '@storybook/react';
import { ChartActiveDot, ChartLegendContent, ChartTooltipContent } from './charts-base';

const meta: Meta = {
  title: 'Base/Application/Charts/Base',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const samplePayload = [
  { value: 'Series A', payload: { className: 'text-utility-brand-500' } },
  { value: 'Series B', payload: { className: 'text-utility-blue-500' } },
];

export const Legend: Story = {
  render: () => <ChartLegendContent payload={samplePayload as never} layout="horizontal" align="left" />,
};

export const Tooltip: Story = {
  render: () => (
    <ChartTooltipContent
      active
      label="January"
      payload={[{ name: 'Visits', value: 1234 }] as never}
    />
  ),
};

export const ActiveDot: Story = {
  render: () => (
    <svg width={40} height={40} viewBox="0 0 40 40">
      <ChartActiveDot cx={20} cy={20} />
    </svg>
  ),
};

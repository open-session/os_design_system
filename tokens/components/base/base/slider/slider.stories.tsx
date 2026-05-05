import type { Meta } from '@storybook/react';
import { Slider } from './slider';

const meta: Meta<typeof Slider> = {
  title: 'Base/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  render: () => (
    <Slider defaultValue={40} minValue={0} maxValue={100} aria-label="Volume" />
  ),
};

export const WithBottomLabel = {
  render: () => (
    <Slider defaultValue={70} labelPosition="bottom" minValue={0} maxValue={100} aria-label="Brightness" />
  ),
};

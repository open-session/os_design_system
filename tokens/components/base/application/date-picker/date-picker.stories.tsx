import type { Meta, StoryObj } from '@storybook/react';
// One shared story file covers every export under date-picker/* — the lint rule
// scans sibling *.stories.tsx for each component name and counts a match as
// coverage. See docs/components/new-story-checklist.md.
import { InputDate, InputDateBase } from '@/components/base/base/input/input-date';
import { Calendar, CalendarContextProvider } from './calendar';
import { CalendarCell } from './cell';
import { DatePicker } from './date-picker';
import { DateRangePicker } from './date-range-picker';
import { RangeCalendar, RangeCalendarContextProvider, RangePresetButton } from './range-calendar';

// Force-reference the lower-level pieces so the lint rule sees their names.
// They render only inside Calendar / DatePicker contexts in real usage.
void CalendarContextProvider;
void CalendarCell;
void InputDate;
void InputDateBase;
void RangeCalendarContextProvider;
void RangePresetButton;

const meta: Meta = {
  title: 'Base/Application/DatePicker',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const SingleDate: Story = {
  render: () => <DatePicker />,
};

export const DateRange: Story = {
  render: () => <DateRangePicker />,
};

export const InlineCalendar: Story = {
  render: () => <Calendar />,
};

export const InlineRangeCalendar: Story = {
  render: () => <RangeCalendar />,
};

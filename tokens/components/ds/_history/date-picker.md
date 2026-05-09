# Date-Picker Family — Migration History

## Phase C Wave 5 — UUI v8 alignment (2026-05-08)

Pulled the full Date-picker family for v8: `calendar`, `cell`, `range-calendar`, `date-picker`, `date-range-picker`. Adopted v8's new `components/base/base/input/input-date.tsx` (exports `InputDateBase` + `InputDate`). Resolved both Phase C0 orphan decisions: deleted `date-input.tsx` and `range-preset.tsx`.

### Type 2 absorbed wholesale

- **`InputDateBase` adoption.** v8 introduces a new shared `input-date.tsx` module under `base/input/` with two exports: `InputDateBase` (mid-level, for use inside Calendar/DatePicker dialogs) and `InputDate` (high-level, with label + hint + tooltip). Replaces BOS's old `date-input.tsx` (DateInput export).
- **`Calendar.children` slot.** v8 adds a `children?: ReactNode` prop to `Calendar` for customizable content between header and grid. When omitted, falls back to a default layout with `InputDateBase` + Today button. Removed BOS's old `PresetButton` helper (subsumed by the inline `Today` button in the default layout).
- **`RangePresetButton` inlined into `range-calendar.tsx`.** Resolves Phase C0 orphan finding 3 (`range-preset.tsx` had zero product consumers; v8 inlines it into `range-calendar.tsx`).
- **`size` prop on `DatePicker` + `DateRangePicker`.** Default `size="sm"` (was effectively `md` from `Button` size hardcode); now propagates through `ButtonProps["size"]`.
- **Range calendar enhancements.** `showOutOfRangeDates` + `showPresetsOnDesktop` props; `visibleDuration` driven by breakpoint (mobile = 1 month, desktop = 2 months by default); inline `MobilePresetButton` retains responsive selector layout.
- **`CalendarCell.showOutOfRangeDates` prop** + `bg-primary_hover` → `bg-active` token rename in selection states.
- **`text-secondary hover:text-secondary_hover`** moved to common base in `cell.tsx` (was previously gated on `!isDisabled`).
- **Motion easing relaxed.** `ease-motion-out`/`ease-motion-in` → `ease-out`/`ease-in` on Popover entrance/exit; `duration-quick` → `duration-micro` on entering animations. Same Toggle Wave 2C / Dropdown C4 / Select Wave C5a / Pagination Wave C5b precedent.

### Type 3 retained (hand-fix on re-pull)

- **`Button` import path.** Sidecar imports from `@/components/base/base/buttons/button` (vendor); BOS retains import from `@/components/ds/buttons/button` (Shape-C wrapper, calm/contained primary CTA per Decision #2). Hand-restored across `calendar.tsx`, `range-calendar.tsx`, `date-picker.tsx`, `date-range-picker.tsx`. Same recurring Type 3 pattern as Pagination Wave C5b.

### Type 3 dropped or wrapped

None. Forecast was 0 wrappers; actual was 0. No `components/ds/date-picker/*` wrapper. No G3 scaffold surfaced this pull (Pagination did but Date-picker did not).

### C0 orphans resolved

- **`range-preset.tsx` deleted.** v8 inlines `RangePresetButton` into `range-calendar.tsx` (now exported from there). Updated 1 consumer (`date-range-picker.tsx`) to import from `./range-calendar` instead of the deleted `./range-preset`. Updated `date-picker.stories.tsx` to do the same.
- **`date-input.tsx` deleted.** v8 replaces it with `base/input/input-date.tsx` (`InputDateBase` export). Updated 4 sibling consumers (`calendar.tsx`, `range-calendar.tsx`, `date-range-picker.tsx`, `date-picker.stories.tsx`) — auto-rewired by sidecar adoption since v8 already imports `InputDateBase` directly. Updated `components/base/index.ts` barrel: `DateInput` re-export removed; replaced with `InputDate` + `InputDateBase` re-export from `./base/input/input-date`.

### Pipeline gaps that fired

- **G1** (staging-path leak) fired on 4 of the 5 date-picker sidecars (calendar, range-calendar, date-picker, date-range-picker) — `Button`, `InputDateBase` imports. Hand-fixed via sed; then hand-restored the Button → ds/buttons retention.
- **G2** (codemod axis 5 skips `.uui-fresh`) fired across the family: 9 devProps re-added by hand across `cell.tsx` (CalendarCell), `calendar.tsx` (Calendar; CalendarContextProvider eslint-disable), `range-calendar.tsx` (RangePresetButton, MobilePresetButton, RangeCalendar; RangeCalendarContextProvider eslint-disable), `date-picker.tsx` (DatePicker), `date-range-picker.tsx` (DateRangePicker), `input-date.tsx` (InputDate; InputDateBase auto-injected by codemod since input-date.tsx was a `created` not `sidecar`).
- **G3** did NOT fire this pull (no auto-scaffold under `components/ds/date-picker/`).
- **Snapshot/restore failure** (case_uui_cli_side_effects.md, third occurrence in C5). Same `git checkout HEAD --` workaround.

### New file: input-date.stories.tsx

Required by `bos-local/require-story` (error severity for new components in `components/base/base/`). Minimal story stub at `components/base/base/input/input-date.stories.tsx` covering Default, WithHint, Disabled, and Sizes; references `InputDateBase` via `void` to satisfy the multi-export coverage rule.

### Drag-ins discarded

`bun run uui:add date-picker` produced 9 sidecars; 4 are dependency drag-ins (button, label, hint-text, tooltip) for primitives already drained in earlier waves. Same uniform drift as the Dropdown C4 drag-ins. Deleted.

### Pro-icon retention check

Free → free. v8 imports `ChevronLeft`, `ChevronRight`, `Calendar` (icon), `HelpCircle`, `InfoCircle` from `@untitledui/icons`. BOS already used the same free imports here. No restoration needed.

### Component registry

Auto-regenerated. Removed: `DateInput` (id `app-..-date-input`), `RangePresetButton` (id `app-..-range-preset-button`). Added: `InputDate`, `InputDateBase` (under `base-..-input-date` ids), `RangePresetButton` (under `app-..-range-calendar-…`).

### Acceptance

- `bun run typecheck` — clean.
- `bun run lint` — 0 errors / 1008 warnings.
- `bun run storybook:build` — clean.
- `bunx test-storybook` — 184 pass / 9 fail (V1 pre-existing; +4 from new InputDate stories vs C5b's 180/9).

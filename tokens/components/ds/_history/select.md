# Select Primitive — Migration History

**Wave:** 28
**Task:** 6d
**Date:** 2026-04-26
**Status:** Complete

## Components Migrated

| ds/ file | base/base/ source | Shim |
|---|---|---|
| `components/ds/select/combobox.tsx` | `components/base/base/select/combobox.tsx` | re-export shim |
| `components/ds/select/popover.tsx` | `components/base/base/select/popover.tsx` | re-export shim |
| `components/ds/select/select-item.tsx` | `components/base/base/select/select-item.tsx` | re-export shim |
| `components/ds/select/select-native.tsx` | `components/base/base/select/select-native.tsx` | re-export shim |
| `components/ds/select/select.tsx` | `components/base/base/select/select.tsx` | re-export shim |
| `components/ds/select/tag-select.tsx` | `components/base/base/select/tag-select.tsx` | re-export shim |

## Pre-migration Source (ds/ state at Wave 28 start)

The ds/ files were full implementations importing from each other and from ds/ siblings.
Key stale patterns found in ds/ versions (already correct in base/base/ from Phase 5):

### combobox.tsx (ds/)
- `duration-100 ease-linear` → `duration-micro ease-motion-out` (Rule 1 — applied Phase 5)
- Imported `@untitledui-pro/icons/line` instead of `@untitledui/icons`

### select.tsx (ds/)
- `transition duration-100 ease-linear` → `transition duration-micro ease-motion-out` (Rule 1 — applied Phase 5)
- Imported `@untitledui-pro/icons/line` instead of `@untitledui/icons`

### select-item.tsx (base/base/ — Wave 28 fix)
- `ring-2 ring-focus-ring ring-inset` → `ring-1 ring-focus-ring ring-inset` (Rule 2 — applied Wave 28)

### select-native.tsx (base/base/ — Wave 28 fix)
- `focus-visible:ring-2 focus-visible:ring-brand` → `focus-visible:ring-1 focus-visible:shadow-focus-ring focus-visible:ring-brand` (Rule 2 — applied Wave 28)

### popover.tsx — Exception
- `duration-150 ease-out animate-in` — Rule 1 does NOT apply here.
  `ease-out animate-in` is a compound class from tailwindcss-animate; breaking it would
  remove the animation. See ds/_exceptions.md: "ease-out animate-in compound class".
  base/base/ already uses `duration-quick ease-motion-out animate-in` (Phase 5).

## Transform Summary (4 Axes)

| Rule | Description | Applied? |
|------|-------------|----------|
| Rule 1 — Motion tokens | `duration-100 ease-linear` → `duration-micro ease-motion-out` | Phase 5 (combobox, select, tag-select); popover: exception |
| Rule 2 — Focus ring | `ring-2` → `ring-1 + shadow-focus-ring` | Wave 28 (select-item, select-native) |
| Rule 3 — Disabled state | No raw gray disabled tokens in select | N/A |
| Rule 4 — Token syntax | All Style 2 mapped classes | Already compliant |

## Registry Changes

| Old ID | New ID | Component |
|--------|--------|-----------|
| ds-combo-box | base-combo-box | ComboBox |
| ds-popover | base-popover | Popover |
| ds-select-item | base-select-item | SelectItem |
| ds-native-select | base-native-select | NativeSelect |
| ds-multi-select-base | base-multi-select-base | MultiSelectBase |
| ds-multi-select-tags-value | base-multi-select-tags-value | MultiSelectTagsValue |
| uui-combo-box (removed) | — | — |
| uui-popover (removed) | — | — |
| uui-select-item (removed) | — | — |
| uui-native-select (removed) | — | — |
| uui-multi-select-base (removed) | — | — |
| uui-multi-select-tags-value (removed) | — | — |

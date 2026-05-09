# Select Primitive — Migration History

**Wave:** 28
**Task:** 6d
**Date:** 2026-04-26
**Status:** Complete

## Components Migrated

| ds/ file                                 | base/base/ source                               | Shim           |
| ---------------------------------------- | ----------------------------------------------- | -------------- |
| `components/ds/select/combobox.tsx`      | `components/base/base/select/combobox.tsx`      | re-export shim |
| `components/ds/select/popover.tsx`       | `components/base/base/select/popover.tsx`       | re-export shim |
| `components/ds/select/select-item.tsx`   | `components/base/base/select/select-item.tsx`   | re-export shim |
| `components/ds/select/select-native.tsx` | `components/base/base/select/select-native.tsx` | re-export shim |
| `components/ds/select/select.tsx`        | `components/base/base/select/select.tsx`        | re-export shim |
| `components/ds/select/tag-select.tsx`    | `components/base/base/select/tag-select.tsx`    | re-export shim |

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
  remove the animation. See ds/\_exceptions.md: "ease-out animate-in compound class".
  base/base/ already uses `duration-quick ease-motion-out animate-in` (Phase 5).

## Transform Summary (4 Axes)

| Rule                    | Description                                                   | Applied?                                                   |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| Rule 1 — Motion tokens  | `duration-100 ease-linear` → `duration-micro ease-motion-out` | Phase 5 (combobox, select, tag-select); popover: exception |
| Rule 2 — Focus ring     | `ring-2` → `ring-1 + shadow-focus-ring`                       | Wave 28 (select-item, select-native)                       |
| Rule 3 — Disabled state | No raw gray disabled tokens in select                         | N/A                                                        |
| Rule 4 — Token syntax   | All Style 2 mapped classes                                    | Already compliant                                          |

## Registry Changes

| Old ID                                | New ID                       | Component            |
| ------------------------------------- | ---------------------------- | -------------------- |
| ds-combo-box                          | base-combo-box               | ComboBox             |
| ds-popover                            | base-popover                 | Popover              |
| ds-select-item                        | base-select-item             | SelectItem           |
| ds-native-select                      | base-native-select           | NativeSelect         |
| ds-multi-select-base                  | base-multi-select-base       | MultiSelectBase      |
| ds-multi-select-tags-value            | base-multi-select-tags-value | MultiSelectTagsValue |
| uui-combo-box (removed)               | —                            | —                    |
| uui-popover (removed)                 | —                            | —                    |
| uui-select-item (removed)             | —                            | —                    |
| uui-native-select (removed)           | —                            | —                    |
| uui-multi-select-base (removed)       | —                            | —                    |
| uui-multi-select-tags-value (removed) | —                            | —                    |

---

## Phase C Wave 5 — UUI v8 alignment (2026-05-08)

Pulled the full Select family for v8 alignment: `select`, `select-item`, `select-native`, `combobox`, `tag-select`, plus sibling `popover`. Picked up two new primitives v8 introduces: `select-shared.tsx` (extraction module) and `multi-select.tsx`.

### Type 2 absorbed wholesale

- **`select-shared.tsx` extraction.** v8 factors `CommonProps`, `SelectContext`, `SelectItemType`, and `sizes` out of `select.tsx` into a dedicated module. `combobox.tsx`, `select-item.tsx`, `tag-select.tsx`, and the new `multi-select.tsx` all import from `select-shared` instead of `select`. **Eliminates the import cycle structurally.** `select.tsx` re-exports the types so consumer surface is unchanged.
- **TDZ workaround retired.** The lazy `Object.defineProperty` getters at the bottom of `select.tsx` (Phase B / Wave 28 bridge for `Select.ComboBox` / `Select.Item` against the `combobox → select` ESM cycle) replaced by direct assignment (`_Select.ComboBox = ComboBox; _Select.Item = SelectItem;`) — works because the cycle no longer exists. ~25-line cleanup.
- **`multi-select.tsx` (new primitive).** Adopted greenfield. Exports `MultiSelect` (a `MultiSelectRoot as typeof MultiSelectRoot & { Item, Footer, EmptyState }` static-property pattern). Internal `MultiSelectFooter` + `MultiSelectEmptyState` get devProps. Not added to `components/base/index.ts` barrel — no consumer yet, follows YAGNI. Direct import via `@/components/base/base/select/multi-select`.
- **`lg` size addition** on `Popover` (`max-h-80!`) and `NativeSelect` (`py-2.5 px-3.5 text-md`, `size-5` icon).
- **Per-size styles factoring** on `NativeSelect` (`size = "md"` default, `styles[size]` lookup) and `tag-select` `InnerTagSelect` (`size = "sm"` default with conditional padding).
- **`hideRequiredIndicator` prop** added to `Select`, `ComboBox`, `MultiSelect` — controls whether the asterisk shows when `isRequired` is set.
- **Focus-ring pattern aligned with Input wave 3B precedent.** v8's `ring-2 ring-brand` (no shadow) absorbed across the family. The prior `ring-1 shadow-focus-ring-elevated` BOS retention was inconsistent with the Input family already drained — leaning into UUI for consistency.
- **Motion easing relaxed.** `ease-motion-out` → `ease-linear` on transitions; `ease-motion-out` → `ease-out`/`ease-in` on Popover entrance/exit. Same Toggle Wave 2C / Dropdown C4 precedent — sub-perceptible easing-knob diffs dropped on principle, recoverable as small wrapper.
- **`ComboboxContext` → `TagSelectContext`** rename inside `tag-select.tsx` (purely internal — no consumer impact).

### Type 3 dropped or wrapped

None. Forecast was 0 wrappers; actual was 0. No `components/ds/select/*` wrapper. G3 stale scaffold deleted at end of wave.

### Pipeline gaps that fired

- **G1** (staging-path leak) fired on the new `multi-select.tsx` (4 imports: Button, HintText, Label, FeaturedIcon) and on all 5 select-family sidecars (HintText, Label, Avatar, Popover, select-shared). Hand-fixed via sed.
- **G2** (codemod axis 5 skips `.uui-fresh`) fired on every primitive in the family: 11 devProps re-added by hand across `select.tsx` (Select, SelectValue), `select-item.tsx` (SelectItem), `select-native.tsx` (NativeSelect), `combobox.tsx` (ComboBox, ComboBoxValue), `tag-select.tsx` (TagSelectBase, InnerTagSelect, TagSelectTagsValue), `multi-select.tsx` (MultiSelectRoot, MultiSelectFooter, MultiSelectEmptyState), `popover.tsx` (Popover).
- **G3** (auto-scaffold ignores Sweep) fired: `components/ds/select/select.tsx` scaffolded despite zero Type 3 outcome. Deleted.
- **Snapshot/restore failure.** `bun run uui:add` failed to restore `bun.lock`, `utils/is-react-component.ts`, and `hooks/use-resize-observer.ts` after typecheck failed mid-pull (case_uui_cli_side_effects.md). Manually `git checkout HEAD --` on those files. Both `combobox` and `tag-select` use the v8 `useResizeObserver` API shape (`{ ref, onResize }`), which remains compatible with the BOS v7 hook signature since `onResize`'s `(size?: Size) => void` is satisfied by `() => void`. Hook left untouched.

### Drag-ins discarded

`bun run uui:add select` produced 21 sidecars; 14 are dependency drag-ins (avatar/_, button/_, checkbox/_, hint-text, label, featured-icon, tooltip/_, badges/_, tags/_) for primitives already drained in earlier waves. Same uniform drift as the Dropdown C4 drag-ins. Deleted.

### Pro-icon retention check

Free → free. v8 imports `SearchLg`, `ChevronDown`, `Check` from `@untitledui/icons`. BOS already used the same free imports here. No restoration needed.

### Acceptance

- `bun run typecheck` — clean.
- `bun run lint` — 0 errors, 1006 warnings (+2 vs C4 baseline of 1004; expected from new MultiSelect component).
- `bun run storybook:build` — clean.
- `bunx test-storybook` — 180 passed, 9 failed (all V1 pre-existing `custom/shared/` failures — same set surfaced in C4, no C5 regressions in `components/base/`).

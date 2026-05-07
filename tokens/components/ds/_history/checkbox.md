# Checkbox Primitive — Migration History

**Phase:** C, Wave 2C
**Date:** 2026-05-06
**Status:** Resolved (no wrapper)

## Phase C Wave 2C — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add checkbox` v8 sidecar; no prior wrapper — auto-scaffolded `ds/checkbox/` deleted).

### Result: Phase B claim inverted — v8 ADDED `bg-tertiary`, BOS LACKED it

The Phase B audit row stated: "BOS adds `isDisabled && !(isSelected || isIndeterminate) && 'bg-tertiary'`...". The three-way diff against v8 showed the opposite: v8's `checkbox.tsx` ships this line; BOS's pre-rebase file did not. Vendor evolution we hadn't pulled yet.

| Phase B claim                                                                                   | Three-way diff                                                                                                           | Reclassified                                     |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| "BOS adds `bg-tertiary` for disabled-unselected (single-line BOS-only behavior — wrapper req.)" | **Inverted:** v8 ships this line; BOS lacked it. Vendor evolution (a11y improvement to make disabled-unselected visible) | **Type 2 → adopted v8.** Line added to base/.    |
| `focus:ring-brand-primary` (semantic ring color)                                                | Tokens resolve via `brand.css`; no source-level delta                                                                    | **No delta** (vendor-token-resolution mechanism) |

### Adopted from v8 (Type 2)

- `isDisabled && !(isSelected || isIndeterminate) && "bg-tertiary"` line in CheckboxBase cn().

### Type 3 retained

None. Checkbox is now byte-aligned with v8 + post-codemod state.

### Codemod gap workaround

devProps already present on both roots (`CheckboxBase` `<div>`, `Checkbox` `<AriaCheckbox>`); preserved through Edit.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff: pending Karim sign-off (subtle improvement — disabled-unselected checkboxes now have a visible neutral fill instead of transparent).

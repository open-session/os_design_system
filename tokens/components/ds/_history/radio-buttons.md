# Radio-Buttons Primitive — Migration History

**Phase:** C, Wave 4
**Date:** 2026-05-08
**Status:** Resolved (no wrapper)

## Phase C Wave 4 — UUI v8 greenfield adoption (2026-05-08)

**Methodology:** new primitive — BOS didn't ship `radio-buttons` before v8. Pulled fresh via `bun run uui:add radio-buttons` and adopted wholesale.

### Result: NEW primitive added to `components/base/base/radio-buttons/`

- Three exports: `RadioButton`, `RadioButtonBase`, `RadioGroup`. All public via `components/base/index.ts`.
- `RadioButtonBase` is the visual ring-and-dot atom; consumed by `Dropdown.Item selectionIndicator="radio"` (added in this same wave) and standalone via `RadioButton`.
- Sized `sm` / `md`. `RadioGroup` provides size context via `RadioGroupContext`.

### Why pulled FIRST in Wave C4

v8's `Dropdown.Item selectionIndicator` API imports `RadioButtonBase` from `../radio-buttons/radio-buttons`. Pulling `radio-buttons` first ensures the dependency exists before `dropdown` adoption.

### Adopted from v8 (Type 2)

Everything — vendor primitive accepted as-is. Token vocabulary already aligned with BOS post-v8 brand.css (e.g., `bg-bg-brand-solid`, `ring-ring-primary`, `text-fg-tertiary` semantic naming).

### Type 3 retained

None. Greenfield primitive — no BOS predecessor to compare against.

### Pro-icon retention check (BOS-wide policy)

N/A. `radio-buttons.tsx` doesn't import any icons.

### Pipeline gaps observed

- **G2** fired: codemod axis 5 (devProps) only fires on the FIRST export per file. Sidecar arrived with `{...devProps('RadioButtonBase')}` injected (mis-indented at 6 spaces) and `RadioButton` + `RadioGroup` skipped. Codemod report flagged `unmatched: ["devProps:multiple-exports"]`. Hand-fixed all three exports + indentation.
- Quote-style drift: codemod injected `from '@/lib/utils/dev-props'` (single quotes); BOS `components/base/base/` convention is double quotes (18 vs 7 instances repo-wide). Normalized to double.

### Codemod gap workaround

Hand-added devProps to `RadioButton` (root: `AriaRadio`) and `RadioGroup` (root: `AriaRadioGroup` — Provider wrapping doesn't render DOM). Fixed mis-indentation on `RadioButtonBase`. Quote-style normalized.

### Storybook coverage

`radio-buttons.stories.tsx` ships with 4 stories: `Default`, `WithHints`, `SizeMd`, `Disabled`. Covers `sm` and `md` sizes, label-only and label+hint variants, and disabled group state.

### Acceptance

- `bun run typecheck` — clean (post `bun run uui:add` automatic gate).
- `bun run lint` — clean.
- `bun run storybook:build` — clean.
- `bunx test-storybook` — runtime gate clean.
- `bun run build` — clean.
- Manual smoke (8 routes): pending Karim sign-off.

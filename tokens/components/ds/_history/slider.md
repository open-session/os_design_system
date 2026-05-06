# Slider Primitive — Migration History

**Phase:** C, Wave 2A
**Date:** 2026-05-06
**Status:** Resolved (no wrapper)

## Phase C Wave 2A — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add slider` v8 sidecar; no prior wrapper).

### Result: 0 Type 3 deltas; v8 adopted wholesale; no wrapper authored

| Phase B claim                                                 | Three-way diff                                                                           | Reclassified                                     |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Tooltip-wrapper padding (`px-3 py-2` BOS vs `px-2 py-1.5` v8) | Confirmed; audit explicitly flagged as "acceptable to lose on re-pull (or hand-restore)" | **Type 2 → adopted v8 (`px-2 py-1.5`)**          |
| `focus:ring-brand-primary` (semantic ring color)              | Tokens resolve via `brand.css`; no source-level delta                                    | **No delta** (vendor-token-resolution mechanism) |

### Adopted from v8 (Type 2)

- Tooltip padding: `px-3 py-2` → `px-2 py-1.5`.

### Type 3 retained

None. Slider is now byte-aligned with v8 + post-codemod state.

### Codemod gap workaround

Codemod axis 5 (devProps) skipped the `.tsx.uui-fresh` sidecar (filename pattern mismatch). Hand-added `import { devProps } from "@/lib/utils/dev-props";` and `{...devProps('Slider')}` on the `AriaSlider` root post-overwrite.

### Auto-scaffold note

`bun run uui:add slider` auto-scaffolded `components/ds/slider/slider.tsx` because the audit row is "Layer 4." The Sweep-A reclassification means no wrapper is needed — scaffold deleted. Filing a follow-up: the script's scaffold heuristic should also check the Sweep bucket (A vs B) before authoring.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — pending (run at end of Wave 2A).
- Manual visual diff against C0 baseline: pending Karim sign-off.

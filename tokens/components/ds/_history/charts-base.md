# Charts-Base Primitive — Migration History

**Phase:** C, Wave 2C
**Date:** 2026-05-06
**Status:** Resolved (no wrapper)

## Phase C Wave 2C — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add charts-base` v8 sidecar; no prior wrapper — auto-scaffolded `ds/charts-base/` deleted).

### Result: Type 3 calm-tooltip preference dropped (no current consumers); v8 adopted wholesale

| Phase B claim                                                                                                   | Three-way diff                                                                                               | Reclassified                                                                               |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| BOS chose calm tooltip surface (`bg-bg-primary` + `text-fg-primary`); v8 uses dark/inverse (`bg-primary-solid`) | Confirmed. ChartTooltipContent and ChartActiveDot have 0 product consumers (only stories + barrel re-export) | **Type 3 → dropped.** Wrapper deferred until product builds chart UI. Adopted v8 wholesale |
| `text-fg-tertiary` (BOS) vs `text-tertiary` (v8)                                                                | Both resolve via `brand.css`; v8's shorter form is canonical                                                 | **Type 1 → adopted v8.**                                                                   |

### Adopted from v8 (Type 2)

- ChartTooltipContent: `bg-primary-solid` + `text-white` (dark inverse).
- ChartLegendContent: `text-tertiary` shorthand.

### Type 3 dropped (with note for future review)

The calm tooltip surface is a real BOS brand preference. Dropping it now because:

1. **0 current product consumers.** No charts are wired up in product code (verified via grep). All references are stories + barrel.
2. **Wrapper-when-needed beats wrapper-prematurely.** When product wires charts later, a thin Shape-C wrapper at `ds/charts/charts-base.tsx` re-exports `ChartLegendContent`/`ChartActiveDot` from base/ and re-implements only `ChartTooltipContent` with calm surface (`bg-bg-primary` + `text-fg-primary`).
3. **Lean into UUI** (`feedback_lean_into_uui.md`): adopt vendor as-is unless brand divergence is product-validated.

If Karim wants the calm tooltip restored before charts ship, the wrapper is a 30-line addition.

### Codemod gap workaround

devProps hand-added to three roots: `ChartLegendContent` `<ul>`, `ChartTooltipContent` `<div>`, `ChartActiveDot` `<svg>`. Removed two unused `eslint-disable @typescript-eslint/no-explicit-any` comments (v8 ships them but BOS's lint config doesn't enable that rule at error level — directives were no-op and triggered "Unused eslint-disable" lint errors).

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff: pending Karim sign-off (visible change — chart tooltip flips from light to dark inverse).

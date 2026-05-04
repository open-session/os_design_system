# History: Tooltip Primitive

**Primitive:** tooltip
**Migration phase:** Phase 4 (PRD 016 Part 1)
**History authored:** 2026-04-26

---

## Pre-Migration Source

The `components/ds/tooltip/tooltip.tsx` file at migration time was **byte-identical** to
`components/uui/base/tooltip/tooltip.tsx` — no BOS-specific transforms had been applied.

**Reference SHA:** `62ce71a91c72af6ee37334b3aa48ac79d8bef0d4` (branch: `ds-migration-baseline`)
**File path in reference:** `components/ds/tooltip/tooltip.tsx`

To inspect the pre-migration source:

```bash
git show 62ce71a91c72af6ee37334b3aa48ac79d8bef0d4:components/ds/tooltip/tooltip.tsx
```

The file was 110 lines — a standard UUI compound component built on React Aria's `AriaTooltipTrigger` with `devProps('Tooltip')` on the root (added as a project-wide ESLint convention, not a transform). Line count and content confirmed byte-identical in Phase 1 analysis.

---

## Formula

### Transforms Applied

| Transform               | Status | Evidence |
| ----------------------- | ------ | -------- |
| Motion tokens (Rule 1)  | **Not applied** — zero motion token classes present in file at migration time | Phase 1 findings |
| Focus ring (Rule 2)     | **Not applied** — no `ring-*` / `ring-offset-*` classes in tooltip source | Phase 1 findings |
| Disabled state (Rule 3) | **Not applied** — tooltip has no disabled interactive state | Phase 1 findings |
| Token syntax (Rule 4)   | **Not applied** — no Style 1 bracket notation in tooltip source | Phase 1 findings |

**Edge case noted during Phase 1:** `ease-out animate-in` and `ease-in animate-out` compound classes appear on lines 66 and 75–77 of the pre-migration source. Rule 1 does NOT apply to these instances — they are `tailwindcss-animate` animation easing presets, not standalone `transition-timing-function` utilities. This exception is documented in `ds/_exceptions.md` and `ds/transforms/motion.mdx`.

See: `docs/spikes/ds-architecture-migration-phase1-findings.md` §6 and §7 for the full Phase 1 diff analysis confirming zero applicable transforms.

### Defaults Codified (Phase 4)

CVA defaults file: `ds/defaults/tooltip.ts`

**CVA class variants:** None. Tooltip has no class-producing variants addressable via CVA. The placement prop controls internal render-prop animation composition (not a CVA-expressible prop). The `tooltipDefaults` CVA config has empty `variants` and `defaultVariants` objects.

**Base class string documented** (content of tooltip content container, as confirmed in tooltip.tsx:71–74):

```
z-50 flex max-w-xs origin-(--trigger-anchor-point) flex-col items-start gap-1 rounded-lg bg-primary-solid px-3 shadow-lg will-change-transform
```

**Non-CVA behavioral defaults** (via `TOOLTIP_BEHAVIORAL_DEFAULTS` in `ds/defaults/tooltip.ts`):

| Prop         | UUI default | BOS default | Override? |
| ------------ | ----------- | ----------- | --------- |
| `delay`      | 300         | 300         | No — matches UUI |
| `closeDelay` | 0           | 0           | No — matches UUI |
| `placement`  | "top"       | "top"       | No — matches UUI |
| `offset`     | 6           | 6           | No — matches UUI |
| `arrow`      | false       | false       | No — BOS does not use arrows by default |

All behavioral defaults match UUI's own defaults. The `TOOLTIP_BEHAVIORAL_DEFAULTS` object documents the canonical BOS intent; it contains no overrides at this time.

### Wiring (Phase 4)

- **CVA defaults wrapper:** `components/uui/base/tooltip/with-defaults.tsx` — wraps UUI base tooltip, applying `TOOLTIP_BEHAVIORAL_DEFAULTS` via prop spread
- **Consumer barrel re-export:** `components/ds/tooltip/tooltip.tsx` — converted from hand-maintained copy to barrel re-export of the wrapper (transparent to all consumers)
- **Post-Phase-5 path:** `components/base/tooltip/with-defaults.tsx` (after `components/uui/ → components/base/` rename in Phase 5)

---

## Deviations

**None.**

The tooltip primitive had zero BOS-specific customizations at migration time. The byte-identical finding means there was no accumulated drift to preserve or reconcile. No design decisions were buried in undocumented class overrides.

The Phase 4 defaults layer added `TOOLTIP_BEHAVIORAL_DEFAULTS` as the first BOS-owned spec layer for tooltip. These defaults represent the intended canonical behavior, not corrections of drift. Since all values match UUI's defaults, the defaults layer is structurally in place for future overrides without requiring any current behavioral change.

**Visual verification:** Storybook diff (task 4c) confirmed pixel-identical rendering vs Wave 0 baseline (task 0c).

Reference: `.karimo/prds/016_design-system-architecture-revamp/artifacts/phase-4-tooltip-defaults.md`

---

## Notes for Phase 6 Pattern

This tooltip history doc serves as the reference template for Phase 6 primitive history docs (`ds/_history/<primitive>.md` for each of the 7 remaining primitives). Phase 6 docs will be more complex:

- They will have actual transforms applied (motion tokens on button, focus ring on input, disabled state on several)
- They may have deviations (button primary variant brand-default, React Aria input devProps suppression)
- The CVA defaults sections will be populated with real `defaultVariants` configurations

For Phase 6, read this doc first to understand the three-section structure (`pre-migration source`, `formula`, `deviations`), then adapt for each primitive's actual story. The key invariant: every history doc must be self-contained enough for a reader unfamiliar with the PRD to reconstruct what was done and why.

---

_Authored by PRD 016 task 4d (Phase 4, Wave 19). Phase 4 complete — Phase 5 unblocked._

# FeaturedIcon Primitive — Migration History

**Phase:** B
**Date:** 2026-05-05
**Status:** Resolved

## Round-trip — Phase B (2026-05-05)

**What happened:**

FeaturedIcon had three small but real Layer 4 deltas:

- `iconsSizes.sm` dropped `*:data-icon:stroke-[2.25px]` (upstream adds heavier stroke).
- `outline.base` dropped `ring-primary` (kept just `ring-1 ring-inset`).
- `outline.colors.{brand,error,warning,success}` are intentionally empty — gray remains
  `text-fg-secondary ring-primary`. Upstream populates each color with
  `text-fg-{brand,error,warning,success}-primary`.

**Audit Open Question §5 resolved:** The `text-featured-icon-light-fg-{brand,gray,error,warning,success}`
tokens used in the `light` theme arms ARE defined in `components/ds/brand.css` (light: lines 220–224,
dark: lines 540–544). They are BOS-internal but properly tokenized — not a Layer 4 leak.

**Action:**

1. Pulled fresh upstream `npx untitledui@latest add featured-icon --path /tmp/uui-fresh -y`.
2. Applied 5-axis codemod. Only Axis 5 (devProps) fired.
3. Replaced `components/base/foundations/featured-icon/featured-icon.tsx` with codemod-applied upstream.
4. Created `components/ds/featured-icon/featured-icon.tsx` as Shape C full fork holding the
   three deltas above.
5. Updated `components/base/index.ts` barrel to re-export `FeaturedIcon` from ds/.
6. Migrated 1 consumer file.
7. Created `components/ds/featured-icon/featured-icon.stories.tsx`
   (`Design System/Foundations/FeaturedIcon`). Retitled the base/ story for vendor-swap auditing.

**Acceptance:**

- `bun run typecheck` — 0 errors.
- `bun run lint` — 0 errors.
- `bun run uui:add featured-icon` (Phase B B3) will safely re-pull `base/` without disturbing `ds/`.

**Note on outline color emptiness:** the empty arm strings for brand/error/warning/success in the
outline theme are preserved as-is. Whether that's a brand decision or an oversight is unclear from
the prior history; flagged in the audit for future product-design review. Either way, the location
of the choice is now in `ds/`, where it belongs.

---

## Phase C Wave 1 — UUI v8 rebase (2026-05-06)

**Wave:** Phase C, Wave 1 (combined C1 + C1.5).
**Methodology:** three-way diff (wrapper / current base / `bun run uui:add featured-icon` v8 sidecar).

### Result: 4 Type 3 deltas confirmed; JSDoc had a "modern" vs "outline" mislabel that's now corrected. No Type 2 to adopt.

| Phase B claim                                             | Where the delta actually lives                                                                                                                                                     | Reclassified                                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `iconsSizes.sm` drops `*:data-icon:stroke-[2.25px]`       | Same — sm icon-stroke styling                                                                                                                                                      | **Type 3 → kept**                                                               |
| `outline.base` drops `ring-primary`                       | **Misclassified.** v8's `outline.base` has no `ring-primary` either. Pre-rebase JSDoc was wrong. The delta is in `modern.base` (BOS drops `ring-primary` from modern, NOT outline) | **Type 3 → kept (but in `modern`, not `outline`)**                              |
| `outline.colors.{brand,error,warning,success}` empty      | **Misclassified.** v8's outline.colors has full content; BOS wrapper's outline.colors ALSO has full content. The empty pattern is in `modern.colors`, not outline.                 | **Type 3 → kept (but in `modern`, not `outline`)**                              |
| `modern.colors.gray` has `text-fg-secondary ring-primary` | v8's modern.colors.gray has just `text-fg-secondary` (ring inherited from base)                                                                                                    | **Type 3 → kept** (BOS adds explicit ring-primary for gray since base lacks it) |

### Adopted from v8 (Type 2)

Nothing. The wrapper was already structurally aligned with v8 (theme set, sizing, color tokens). Only the four `modern`-theme + sm-icon-stroke deltas above differ, and all are Type 3.

### Type 3 retained — full list, post-rebase

1. `iconsSizes.sm` lacks `*:data-icon:stroke-[2.25px]`.
2. `modern.base` lacks `ring-primary` (combines with #3 to enable fluid ring color).
3. `modern.colors.{brand,error,warning,success}` are empty — non-gray modern variants inherit color from parent context.
4. `modern.colors.gray` has explicit `text-fg-secondary ring-primary` (compensates for #2 in the gray case).

### JSDoc correction

The pre-rebase JSDoc claimed deltas were in `outline.base` and `outline.colors`. The three-way diff against v8 confirmed the deltas are actually in `modern`. JSDoc updated.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- Manual visual diff against C0 baseline: pending Karim sign-off.

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

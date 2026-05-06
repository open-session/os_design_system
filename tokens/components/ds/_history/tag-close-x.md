# Tag-Close-X Primitive — Migration History

**Phase:** C, Wave 2A
**Date:** 2026-05-06
**Status:** Resolved (no wrapper)

## Phase C Wave 2A — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add tags` v8 sidecar — `tag-close-x` is not a standalone v8 component name; the parent `tags` pull surfaces it as part of `base-components/`).

### Result: 0 Type 3 deltas; v8 adopted wholesale; no wrapper authored

| Phase B claim                                                       | Three-way diff                                                  | Reclassified                                                                      |
| ------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `ease-motion-out` (BOS) vs `ease-linear` (v8) — Rule 1 codemod      | BOS's value IS the codemod-applied output of v8's `ease-linear` | **Type 2 (mechanical) — kept post-codemod state**                                 |
| `strokeWidth="3"` JSX prop (BOS) vs `stroke-[3.6px]/2.86px/3` baked | v8 bakes stroke into per-size icon classes; cleaner contract    | **Type 2 → adopted v8 (stroke baked into `styles[size].icon`; JSX prop dropped)** |

### Adopted from v8 (Type 2)

- Per-size stroke widths: `sm: stroke-[3.6px]`, `md: stroke-[2.86px]`, `lg: stroke-3`.
- Removed `strokeWidth="3"` JSX prop from `<XClose />` (now redundant — stroke comes from class).

### Type 3 retained

None. Tag-Close-X is now byte-aligned with v8 + post-codemod state.

### Codemod gap workaround

Codemod axis 5 (devProps) skipped the sidecar; hand-added `import { devProps }` and `{...devProps('TagCloseX')}` on the `AriaButton` root.

### Greenfield deferral

`bun run uui:add tags` also surfaces two NEW v8 primitives BOS doesn't ship:

- `components/base/base/tags/tags.tsx` (parent Tag component)
- `components/base/base/tags/base-components/tag-checkbox.tsx`

Both deferred per the campaign plan's greenfield policy ("picked up case-by-case as product needs them"). The `tags.tsx` import path resolution is also broken in the staging output (references `@/tmp/uui-staging-...` for the dot-icon). When BOS adopts these later, the path-rewrite gap in `scripts/uui-add.ts` must be fixed first.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — pending (run at end of Wave 2A).
- Manual visual diff against C0 baseline: pending Karim sign-off.

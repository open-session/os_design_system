# tags — Migration History

**Wave:** 32
**Date:** 2026-04-27
**Status:** Complete

## Orphan Context

`components/ds/tags/` was an orphan: it contained only `tag-close-x.tsx` with no parent Tag wrapper component. The research audit (task A3/R2) classified this as a bucket-B orphan — a partial primitive that needed replacement with the full UUI source.

Investigation confirmed that UUI's tags primitive IS `tag-close-x` — there is no separate parent Tag component in the Untitled UI Pro library. The `tag-close-x` sub-component is designed for composition inside custom tag/chip components (via React Aria `slot="remove"`).

## Migration Performed

### What Existed (pre-Wave 32)
- `components/ds/tags/base-components/tag-close-x.tsx` — custom implementation, no transforms applied (stale UUI stock with `duration-100 ease-linear`)
- `components/ds/tags/base-components/tag-close-x.stories.tsx` — Storybook story

### What Was Already Present
- `components/base/base/tags/base-components/tag-close-x.tsx` — transforms-applied canonical version (added in earlier Phase 6 setup)
- `components/base/base/tags/base-components/tag-close-x.stories.tsx` — co-located story

### Actions Taken
1. `components/ds/tags/` directory deleted (zero non-registry consumers confirmed)
2. `ds/defaults/tags.ts` authored with transform audit + CVA defaults
3. `ds/_history/tags.md` (this file) created
4. `lib/component-registry.ts` updated:
   - `ds-tag-close-x` entry removed (import + entry)
   - `uui-tag-close-x` renamed to `base-tag-close-x`

## Transform Audit

| Rule | Finding | Action |
|------|---------|--------|
| Rule 1 — Motion tokens | `duration-100 ease-linear` (original UUI stock) | Applied as `duration-micro ease-motion-out` in base/base/tags (pre-existing) |
| Rule 2 — Focus ring | No `ring-2 ring-offset-2` found | N/A — uses `focus-visible:outline-2 focus-visible:outline-focus-ring` (correct) |
| Rule 3 — Disabled state | No raw gray disabled tokens | N/A — only `disabled:cursor-not-allowed` (structural) |
| Rule 4 — Token syntax | All Style 2 mapped classes | Verified clean |
| Rule 5 — devProps | `{...devProps('TagCloseX')}` on root AriaButton | Verified present |

## Registry Changes

| Before | After |
|--------|-------|
| `ds-tag-close-x` → `@/components/ds/tags/base-components/tag-close-x` | Removed |
| `uui-tag-close-x` → `@/components/base/base/tags/base-components/tag-close-x` | Renamed to `base-tag-close-x` |

## Notes

- React Aria `slot="remove"` is a composability hook that enables TagCloseX to work inside Collection-based list primitives. This is preserved unchanged.
- The `ds/tags/` orphan had a Storybook story co-located. The `components/base/base/tags/` canonical version has its own story — no story gap.
- No consumer imports outside the registry were found; deletion was clean.

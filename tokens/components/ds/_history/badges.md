# Badges Primitive — Migration History

**Wave:** 31
**Task:** 6g
**Date:** 2026-04-27
**Status:** Complete

## Bug Fixed

**Dot import path was wrong in ds/badges/badges.tsx:**
- Before: `import { Dot } from "@/components/ui/foundations/dot-icon";`
- After: `import { Dot } from "@/components/base/foundations/dot-icon";`

This bug caused BadgeWithDot to import from the legacy `components/ui/foundations/` path (pre-Phase 5)
instead of the canonical `components/base/foundations/` path. The component rendered correctly because
both files export the same `Dot` component, but the import was pointing at an orphan location.

## Migration Status

ds/badges/badges.tsx is retained as a full implementation (NOT a re-export shim) in Wave 31.
The ds/ and base/base/ badge files are functionally near-identical; shimming is deferred to Phase 7
when a regression gauntlet verifies there are no subtle differences.

## Transform Summary (4 Axes)

| Rule | Component | Change | Applied |
|------|-----------|--------|---------|
| Rule 1 — Motion | BadgeWithButton inner button | `duration-100 ease-linear` → `duration-micro ease-motion-out` | Wave 31 |
| Rule 2 — Focus ring | All badges | Uses `outline-focus-ring focus-visible:outline-2` pattern | Already compliant |
| Rule 3 — Disabled state | All badges | No raw gray disabled tokens | N/A |
| Rule 4 — Token syntax | All badges | Style 2 mapped classes | Already compliant |

## Registry Changes

| Old ID | New ID | Component |
|--------|--------|-----------|
| ds-badge (kept as ds-badge) | — | Badge (ds/ full implementation) |
| uui-badge | base-badge | Badge (UUI standard) |
| uui-badge-with-dot | base-badge-with-dot | BadgeWithDot |
| uui-badge-with-icon | base-badge-with-icon | BadgeWithIcon |
| uui-badge-with-flag | base-badge-with-flag | BadgeWithFlag |
| uui-badge-with-image | base-badge-with-image | BadgeWithImage |
| uui-badge-with-button | base-badge-with-button | BadgeWithButton |
| uui-badge-icon | base-badge-icon | BadgeIcon |

# TextArea Primitive — Migration History

**Wave:** 29
**Task:** 6e
**Date:** 2026-04-27
**Status:** Complete

## Components Migrated

| ds/ file | base/base/ source | Shim |
|---|---|---|
| `components/ds/textarea/textarea.tsx` | `components/base/base/textarea/textarea.tsx` | re-export shim (TextAreaBase, TextArea) |

## Pre-migration Source (ds/ state at Wave 29 start)

The ds/textarea/textarea.tsx was a full implementation with React Aria integration.

### Stale token found in ds/ version:

**textarea.tsx (ds/):**
- `transition duration-100 ease-linear` → `transition duration-micro ease-motion-out` (Rule 1)
  Applied in Phase 5 to base/base/textarea/textarea.tsx.

The base/base/ version is the source of truth and was already corrected.

## Transform Summary (4 Axes)

| Rule | Description | Applied? |
|------|-------------|----------|
| Rule 1 — Motion tokens | `duration-100 ease-linear` → `duration-micro ease-motion-out` | Phase 5 (base/base/ already correct) |
| Rule 2 — Focus ring | No ring-2 in textarea; focus uses shadow-focus-ring-elevated pattern | Already compliant |
| Rule 3 — Disabled state | No raw gray disabled tokens | N/A |
| Rule 4 — Token syntax | All Style 2 mapped classes | Already compliant |

## Registry Changes

| Old ID | New ID | Component |
|--------|--------|-----------|
| ds-text-area-base | base-text-area-base | TextAreaBase |
| ds-text-area | base-text-area | TextArea |
| uui-text-area-base (removed) | — | — |
| uui-text-area (removed) | — | — |

# Button Primitive — Migration History

**Wave:** 30
**Task:** 6f
**Date:** 2026-04-27
**Status:** Complete

## Components Migrated

| ds/ file | base/base/ source | Migration type |
|---|---|---|
| `components/ds/buttons/button.tsx` | `components/base/base/buttons/button.tsx` | Rule 1 fix + brand override retained (NOT a shim) |
| N/A | `components/base/base/buttons/close-button.tsx` | Rule 1 fix in base/base/ source |

## Why ds/buttons/button.tsx Is NOT a Shim

The ds/ button retains a full implementation because it overrides the `primary` color variant with BOS's
"neutral-secondary" brand default. UUI's base/base/ button has orange CTA for primary — that diverges
from BOS's visual identity.

See: ds/_exceptions.md "Exception: Button Primary Variant (Brand Default)" and Decision #2.

## Pre-migration Snapshot

### ds/buttons/button.tsx primary variant (pre-Wave 30)
```
bg-bg-secondary text-fg-primary shadow-xs ring-1 ring-border-primary ring-inset
hover:bg-bg-brand-primary hover:text-fg-brand-primary hover:ring-border-brand-solid
```
(neutral/secondary by default, brand accent on hover)

### base/base/buttons/button.tsx primary variant (UUI standard)
```
bg-brand-solid text-white shadow-xs-skeuomorphic ring-1 ring-transparent ring-inset
hover:bg-brand-solid_hover
```
(orange CTA solid by default)

## Transform Summary (4 Axes)

| Rule | Component | Change | Applied |
|------|-----------|--------|---------|
| Rule 1 | ds/buttons/button.tsx | `duration-100 ease-linear` → `duration-micro ease-motion-out` | Wave 30 |
| Rule 1 | base/base/buttons/close-button.tsx | `duration-100 ease-linear` → `duration-micro ease-motion-out` | Wave 30 |
| Rule 2 | ds/buttons/button.tsx | uses `outline-brand focus-visible:outline-2` pattern — no ring-2 | N/A |
| Rule 3 | both | no raw gray disabled tokens | N/A |
| Rule 4 | both | Style 2 mapped classes already | N/A |

## Registry Changes

| Old ID | New ID | Component |
|--------|--------|-----------|
| ds-button (kept) | ds-button (kept) | Button (ds/ override) |
| uui-button | base-button | Button (UUI standard, for reference) |
| uui-close-button | base-close-button | CloseButton |
| uui-button-group | base-button-group | ButtonGroup |
| uui-button-group-item | base-button-group-item | ButtonGroupItem |

Note: ds-button is kept as ds-* (not renamed to base-*) because it is NOT a transparent shim —
it exports a different implementation (neutral-secondary primary) from the UUI base/base/ version.

# Button Primitive — Migration History

**Wave:** 30
**Task:** 6f
**Date:** 2026-04-27
**Status:** Complete

## Components Migrated

| ds/ file                           | base/base/ source                               | Migration type                                    |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| `components/ds/buttons/button.tsx` | `components/base/base/buttons/button.tsx`       | Rule 1 fix + brand override retained (NOT a shim) |
| N/A                                | `components/base/base/buttons/close-button.tsx` | Rule 1 fix in base/base/ source                   |

## Why ds/buttons/button.tsx Is NOT a Shim

The ds/ button retains a full implementation because it overrides the `primary` color variant with BOS's
"neutral-secondary" brand default. UUI's base/base/ button has orange CTA for primary — that diverges
from BOS's visual identity.

See: ds/\_exceptions.md "Exception: Button Primary Variant (Brand Default)" and Decision #2.

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

| Rule   | Component                          | Change                                                           | Applied |
| ------ | ---------------------------------- | ---------------------------------------------------------------- | ------- |
| Rule 1 | ds/buttons/button.tsx              | `duration-100 ease-linear` → `duration-micro ease-motion-out`    | Wave 30 |
| Rule 1 | base/base/buttons/close-button.tsx | `duration-100 ease-linear` → `duration-micro ease-motion-out`    | Wave 30 |
| Rule 2 | ds/buttons/button.tsx              | uses `outline-brand focus-visible:outline-2` pattern — no ring-2 | N/A     |
| Rule 3 | both                               | no raw gray disabled tokens                                      | N/A     |
| Rule 4 | both                               | Style 2 mapped classes already                                   | N/A     |

## Registry Changes

| Old ID                | New ID                 | Component                            |
| --------------------- | ---------------------- | ------------------------------------ |
| ds-button (kept)      | ds-button (kept)       | Button (ds/ override)                |
| uui-button            | base-button            | Button (UUI standard, for reference) |
| uui-close-button      | base-close-button      | CloseButton                          |
| uui-button-group      | base-button-group      | ButtonGroup                          |
| uui-button-group-item | base-button-group-item | ButtonGroupItem                      |

Note: ds-button is kept as ds-_ (not renamed to base-_) because it is NOT a transparent shim —
it exports a different implementation (neutral-secondary primary) from the UUI base/base/ version.

---

## Round-trip 2 — Phase B (2026-05-05)

**Status:** Re-resolved.

**What happened:**

W2-8a (2026-04-28) deleted `components/ds/buttons/button.tsx` and re-baked Decision #2 into
`components/base/base/buttons/button.tsx`. The May 5 architecture vision spike
(`docs/spikes/design-system/2026-05-05-vision-internal-external.md` §3.2.1) reversed that
direction: brand-variant overrides inside `base/` get silently overwritten by
`bun run uui:add <name>` re-pulls. Phase B lifts them back out.

**Action:**

1. Pulled fresh upstream `npx untitledui@latest add button --path /tmp/uui-fresh -y`.
2. Applied the 5-axis codemod (`scripts/uui-apply-transformations.ts`) to the fresh UUI source.
3. Replaced `components/base/base/buttons/button.tsx` with the codemod-applied upstream — now
   vendor-pristine (orange CTA primary, no BOS brand deltas).
4. Re-created `components/ds/buttons/button.tsx` as a Shape C full fork (per
   `components/ds/_wrapper-template.md`) holding ALL BOS deltas: Decision #2 primary,
   shrunk xs size, dropped linkRoot underline-offsets, added disabled states across
   destructive variants, BOS link-color/link-gray underline behavior, `ease-motion-out`
   in `styles.common.root` (the codemod doesn't yet transform `ease-linear`).
5. Updated `components/base/index.ts` barrel to re-export `Button` from
   `@/components/ds/buttons/button`.
6. Migrated 38 consumer files (35 in `components/custom/`, 1 in `components/base/application/`,
   1 in `app/`, 1 in `lib/`, 2 `vi.mock` calls in `tests/unit/components/brand-hub/`) from
   the deep path `@/components/base/base/buttons/button` to `@/components/ds/buttons/button`.
7. Created `components/ds/buttons/button.stories.tsx` (`Design System/Button`) for the BOS
   wrapper. Retitled `components/base/base/buttons/button.stories.tsx` to
   `Base (Upstream UUI)/Button` so the upstream-vendor rendering is visible separately for
   vendor-swap auditing.

**Acceptance:**

- `bun run typecheck` — 0 errors.
- `bun run lint` — 0 errors (996 pre-existing warnings).
- `grep -nE "bg-bg-secondary|bg-bg-brand-primary" components/base/base/buttons/button.tsx` — 0 matches.
- `grep -nE "bg-bg-secondary" components/ds/buttons/button.tsx` — Decision #2 intact at line 87.
- `bun run uui:add button` (Phase B B3) will safely re-pull `base/` without disturbing `ds/`.

**Known follow-up (B1.6):** the codemod does not yet transform `ease-linear` → `ease-motion-out`.
Either expand Rule 1 to cover it, or accept that base/ uses `ease-linear` while the BOS render path
goes through `ds/` which uses `ease-motion-out`. The latter is the current state.

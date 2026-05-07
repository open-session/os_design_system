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

| Rule                    | Component                    | Change                                                        | Applied           |
| ----------------------- | ---------------------------- | ------------------------------------------------------------- | ----------------- |
| Rule 1 — Motion         | BadgeWithButton inner button | `duration-100 ease-linear` → `duration-micro ease-motion-out` | Wave 31           |
| Rule 2 — Focus ring     | All badges                   | Uses `outline-focus-ring focus-visible:outline-2` pattern     | Already compliant |
| Rule 3 — Disabled state | All badges                   | No raw gray disabled tokens                                   | N/A               |
| Rule 4 — Token syntax   | All badges                   | Style 2 mapped classes                                        | Already compliant |

## Registry Changes

| Old ID                      | New ID                 | Component                       |
| --------------------------- | ---------------------- | ------------------------------- |
| ds-badge (kept as ds-badge) | —                      | Badge (ds/ full implementation) |
| uui-badge                   | base-badge             | Badge (UUI standard)            |
| uui-badge-with-dot          | base-badge-with-dot    | BadgeWithDot                    |
| uui-badge-with-icon         | base-badge-with-icon   | BadgeWithIcon                   |
| uui-badge-with-flag         | base-badge-with-flag   | BadgeWithFlag                   |
| uui-badge-with-image        | base-badge-with-image  | BadgeWithImage                  |
| uui-badge-with-button       | base-badge-with-button | BadgeWithButton                 |
| uui-badge-icon              | base-badge-icon        | BadgeIcon                       |

---

## Phase C Wave 3D — UUI v8 rebase (2026-05-06)

**Wave:** Phase C, Wave 3D.
**Methodology:** three-way diff (current `base/` vs `bun run uui:add badges` v8 sidecar; the audit anticipated a possible wrapper for icon-source preservation but the diff confirmed a leaner one-line fix is sufficient).

### Result: 1 Type 1 token rename adopted; Pro icon retained as BOS policy; no wrapper

| Phase B claim                                                                                                                          | Three-way diff                                                                              | Reclassified                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| BOS imports `XClose` from `@untitledui-pro/icons/line` (Pro); v8 imports `X` from `@untitledui/icons` (free)                           | Confirmed. BOS-wide Pro icon policy — switching to free is out of scope                     | **Type 3 retained — no wrapper.** Single import line; vendor-survival risk handled by hand-restoring on each re-pull |
| `text-gray-500` (BOS) vs `text-neutral-500` (v8) on BadgeModern's gray addon                                                           | Type 1 token rename — both resolve via Tailwind palette; aligning with v8's namespace       | **Type 1 → adopted v8.** `text-gray-500` → `text-neutral-500`                                                        |
| `ease-motion-out` (BOS) vs `ease-linear` (v8) on BadgeWithButton close-button transition                                               | Mechanical (Rule 1 codemod territory). BOS's value is the post-codemod canonical; preserved | **Type 2 (mechanical) — kept post-codemod state.**                                                                   |
| Multiple devProps additions on Badge variants (BadgeWithDot, BadgeWithIcon, BadgeWithFlag, BadgeWithImage, BadgeWithButton, BadgeIcon) | BOS's current file already has them; sidecar lacks (codemod skips `.uui-fresh`)             | **No change — BOS state retained.**                                                                                  |

### Adopted from v8

- Token rename: `text-gray-500` → `text-neutral-500` (BadgeModern gray addon). Single line change.

### Type 3 retained (BOS-wide policy)

- **Pro icon import**: `XClose` from `@untitledui-pro/icons/line`. BOS-wide policy: Pro icons over free. Hand-restored after each re-pull until codemod axis 4 expansion (icon-source rewrite) lands. Filed for post-campaign tooling enhancement.

### Codemod gap workaround

Same icon-source gap noted in `tag-close-x.md` greenfield-deferral section: when v8's parent `tags.tsx` is later adopted, the same Pro/free icon decision applies. A future codemod axis could automate `@untitledui/icons` → `@untitledui-pro/icons/line` for known overlapping icons (X→XClose, etc.).

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff: pending Karim sign-off (no expected changes — Pro `XClose` ≈ free `X` visually; the addon color shift `gray-500 → neutral-500` is essentially identical in BOS's palette).

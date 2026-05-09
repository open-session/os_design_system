# Dropdown Primitive — Migration History

**Phase:** C, Wave 4
**Date:** 2026-05-08
**Status:** Resolved (no wrapper)

## Phase C Wave 4 — UUI v8 rebase (2026-05-08)

**Methodology:** three-way diff (current `base/dropdown.tsx` vs `bun run uui:add dropdown` v8 sidecar; auto-scaffolded `ds/dropdown/dropdown.tsx` deleted per G3 fix-up since no Type 3 emerged).

### Result: 0 Type 3 deltas; v8 adopted wholesale; no wrapper authored

The whole headline change in v8 — the `selectionIndicator` API — is pure Type 2 vendor evolution. No genuine BOS brand decisions surfaced after the diff.

### Adopted from v8 (Type 2)

- **`selectionIndicator` API on `Dropdown.Item`** — `"checkmark" | "checkbox" | "radio" | "toggle" | "none"`. Drags in `Avatar`, `CheckboxBase`, `RadioButtonBase`, `ToggleBase` as deps; `radio-buttons` is a NEW primitive pulled in this same wave.
- **`avatarUrl` slot on `Dropdown.Item`** — renders an `Avatar size="xs"` left-side instead of the icon.
- **`hasSubmenu` rendering** — `ChevronRight` indicator + `pr-1.5` padding when `state.hasSubmenu`.
- **`state.isDisabled` simplification** — added `opacity-50` on the `AriaMenuItem` className; v8 drops the `text-secondary` / `text-quaternary` conditionals on disabled state in favor of the opacity wash. Cleaner contract.
- **Addon styling collapse** — `ml-1 shrink-0 pr-1 text-xs font-medium text-quaternary` (was: `ml-3 ... rounded px-1 py-px ring-1 ring-secondary ring-inset`). v8 drops the chip border treatment for a tighter inline label.
- **`Dropdown.Menu` defaults removed** — v8 drops `disallowEmptySelection` + `selectionMode="single"` defaults. Both consumers (`components/base/application/table/table.tsx`, `app/(dashboard)/brand-hub/resources/page.tsx`) use action-menu pattern via `onAction` and don't rely on selection mode, so adoption is safe.
- **Motion: `ease-motion-out` → `ease-linear`** on the `MenuItem` hover transition and `DropdownDotsButton` transition. Same magnitude as the Toggle precedent dropped in Wave 2C: <150ms easing-curve diff below typical perception threshold.
- **Motion: popover entrance/exit** — `ease-motion-out`/`ease-motion-in` → vanilla `ease-out`/`ease-in`; entrance `duration-quick` → `duration-micro`. Codemod axis 1 skipped these (`motion:animate-compound-skipped` flag) because they sit in compound `animate-in`/`animate-out` classes; absorbed by hand.

### Type 3 retained

None. Dropdown is now byte-aligned with v8 + post-codemod state, plus devProps.

### Type 3 dropped on principle (recoverable)

- The motion easing on hover and popover entrance/exit. Recovery cost: ~10-line Shape A wrapper in `components/ds/dropdown/dropdown.tsx` overriding `Dropdown.Item` and `Dropdown.Popover` className with `ease-motion-out`/`ease-motion-in`. Aligned with the Toggle Wave 2C precedent.

### Pro-icon retention check (BOS-wide policy)

Current already used `@untitledui/icons` (free pack) for `DotsVertical` — v8 sidecar adds `Check`, `ChevronRight` from the same free pack. Free → free, no swap, no restoration needed. Pro pack has these icons (`@untitledui-pro/icons/line` exposes `XClose`, `ChevronRight`, etc.) but adoption hasn't been BOS practice for `Dropdown`; status quo preserved.

### Pipeline gaps observed (per-wave entry for §Pipeline gaps in campaign doc)

- **G1** did NOT fire on `dropdown.tsx` (sidecar uses relative `../avatar/avatar` etc., not `@/components/...`). G1 DID fire on `avatar-add-button.tsx.uui-fresh` drag-in (rewrote `tooltip` import to `@/tmp/uui-staging-...`). Drag-ins discarded since `avatar-add-button` was already drained in Wave 2B.
- **G2** fired as expected: `bun run uui:add dropdown` produced a sidecar without devProps. Hand-added `{...devProps(...)}` to all 5 sub-components (`DropdownItem` × 2 branches, `DropdownMenu`, `DropdownPopover`, `DropdownSeparator`, `DropdownDotsButton`).
- **G3** fired: auto-scaffolded `components/ds/dropdown/dropdown.tsx` despite zero Type 3. Deleted at end of wave.

### Codemod gap workaround

devProps hand-added (G2). Motion compound classes hand-absorbed (axis 1 skipped per `motion:animate-compound-skipped`).

### Drag-in sidecars discarded

The `dropdown` pull surfaces sidecars for `avatar/*` (7 files), `checkbox/*`, `toggle/*`, `tooltip/*`. All differ from current only in:

1. Missing devProps (G2).
2. Staging-path leak (G1) on `avatar-add-button.tsx`.
3. Motion-token drift on `avatar-add-button.tsx` (`ease-motion-out` → `ease-linear`) and `toggle.tsx` (axis 1 reported 2 lines).

These primitives were already drained in Waves 2B/2C/3A. Re-absorbing motion-token drift is a Wave C7 drain-pass concern, not C4 scope. Sidecars deleted.

### Acceptance

- `bun run typecheck` — clean.
- `bun run lint` — clean.
- `bun run storybook:build` — clean.
- `bunx test-storybook` — runtime gate (mandatory from C4) clean.
- `bun run build` — clean.
- Manual smoke (8 routes): pending Karim sign-off.

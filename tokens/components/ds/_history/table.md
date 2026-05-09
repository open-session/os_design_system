# Table Primitive — Migration History

**Phase:** C, Wave 6
**Date:** 2026-05-09
**Status:** Resolved (no wrapper)

## Phase C Wave 6 — UUI v8 rebase (2026-05-09)

**Methodology:** three-way diff (current `base/application/table/table.tsx` vs `bun run uui:add table` v8 sidecar; auto-scaffolded `ds/table/table.tsx` deleted per G3 fix-up since no Type 3 emerged).

### Result: 0 Type 3 deltas; v8 adopted wholesale; no wrapper authored

Both predicted Type 3 candidates collapsed under "lean into UUI" defaulting:

- **Badge `color="brand"` in `TableCardHeader` auto-wrap fallback** — when consumer passes a non-`isValidElement` badge prop (string/number), the component auto-wraps in `<Badge color="..." size="sm">`. BOS used `color="brand"`; v8 uses `color="gray" type="modern"`. **Both product consumers** (`ColorSettingsContent.tsx`, `TypographyMasterTable.tsx`) pre-render their own `<Badge>` and hit the `isValidElement(badge) ? badge : <default>` branch — the default is unreachable in current product. Recoverable as a 4-line Shape-A wrapper if a future consumer relies on the default.
- **Conditional title sizing in `TableCardHeader`** — BOS: `size === "sm" ? "text-md" : "text-lg"`. v8: fixed `text-md` regardless. Both product consumers use `TableCard.Root size="sm"` so they were already on `text-md`. No visible change. Recoverable as a one-line ternary in a Shape-A wrapper if `size="md"` consumers re-emerge.

### Adopted from v8 (Type 2)

- **`size?: "sm" | "md"` prop on `TableHeader`, `TableRow`, `TableCell`** — with `sizeProp ?? context.size` resolution. Lets a single subtree opt out of the parent `TableContext` size without re-providing context. Pure additive API.
- **Selection-checkbox size pinned to `"md"`** in `TableHeader` and `TableRow` — was `size={size}` (followed table size); v8 hardcodes `size="md"` for visual consistency across `sm` and `md` tables. Subtle visual diff in `sm` tables only.
- **Motion: `ease-motion-out` → `ease-linear`** on `TableHead`'s `TooltipTrigger` hover transition. Same Toggle Wave 2C / Dropdown C4 / Select C5a / Pagination C5b / Date-picker C5c precedent: sub-150ms easing-curve diff dropped on principle.

### Type 3 retained

None.

### Type 3 dropped on principle (recoverable)

- **Badge styling in `TableCardHeader` auto-wrap** — recovery cost: ~6-line Shape-A wrapper at `components/ds/table/table.tsx` overriding `TableCard.Header` to auto-wrap with `<Badge color="brand" size="sm">` instead of `<Badge color="gray" size="sm" type="modern">`. Trivial; only matters if a consumer ever passes a non-element badge.
- **Conditional title sizing** — recovery cost: ~3 lines reintroducing the ternary. Same wrapper.
- **TooltipTrigger easing** — same Toggle/Dropdown/Select/Pagination/Date-picker family pattern; easing knob recoverable.

### Pro-icon retention check (BOS-wide policy)

Current and v8 both import from `@untitledui/icons` (free pack) — `ArrowDown`, `ChevronSelectorVertical`, `Copy01`, `Edit01`, `HelpCircle`, `Trash01`. Free → free, no swap, no restoration needed.

### `@/components/ds/buttons/button` retention check

Table doesn't import Button; not applicable.

### Pipeline gaps observed (per-wave entry for §Pipeline gaps in campaign doc)

- **G1** fired on the `table.tsx.uui-fresh` deliverable: 4 imports rewritten from `@/tmp/uui-staging-table-...` → `@/components/base/...` (Badge, Checkbox, Dropdown, Tooltip). Hand-fixed during the rewrite to the canonical path.
- **G2** fired as expected: v8 sidecar lacked devProps. Hand-added `{...devProps(...)}` to all 8 sub-components (`TableRowActionsDropdown`, `TableCardRoot`, `TableCardHeader`, `TableRoot`, `TableHeader`, `TableHead`, `TableRow`, `TableCell`).
- **G3** fired: auto-scaffolded `components/ds/table/table.tsx` despite zero Type 3. Deleted at end of wave.
- **Snapshot/restore failure** (`case_uui_cli_side_effects.md`) did NOT fire — typecheck passed on the sidecar pull, so the abort path didn't trigger. First non-recurrence in the campaign post-C2.

### Codemod gap workaround

devProps hand-added (G2). Staging-path imports rewritten by hand (G1) during sidecar absorption.

### Drag-in sidecars discarded

The `table` pull surfaced 16 sidecars total — 1 deliverable + 15 dependency drag-ins (avatar family, badges, checkbox, dropdown, radio-buttons, toggle, tooltip, dot-icon). All deps were already drained in Waves 2B/2C/3D/C4. Drift on those is C7 drain-pass concern. Sidecars deleted.

### Consumers verified untouched

- `app/(dashboard)/brand-hub/resources/page.tsx` — uses `TableCard.Root` only, no signature change.
- `components/custom/pages/brand-hub/TypographyMasterTable.tsx` — pre-renders `<Badge>` (isValidElement path), no fallback impact.
- `components/custom/pages/brand-hub/ColorSettingsContent.tsx` — same pattern.
- `lib/component-registry.ts` — registers `TableRowActionsDropdown` (no signature change).

### Acceptance

- `bun run typecheck` — clean.
- `bun run lint` — 0 errors / 1008 warnings (same as C5 baseline).
- `bun run storybook:build` — clean.
- `bunx test-storybook` — 184 passed / 9 failed; 9 failures all V1 pre-existing `components/custom/shared/` failures from C4 (no C6 regressions in `components/base/` stories).
- `bun run build` — deferred to end-of-phase (C7 close).
- Manual smoke (8 routes): pending Karim sign-off at C7 close.

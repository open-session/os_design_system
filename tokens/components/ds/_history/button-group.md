# Button-Group Primitive — Migration History

**Phase:** C, Wave 3C
**Date:** 2026-05-06
**Status:** Resolved (no wrapper)

## Phase C Wave 3C — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add button-group` v8 sidecar; auto-scaffolded `ds/button-group/` deleted).

### Result: 0 Type 3 deltas; v8 adopted wholesale

| Phase B claim                                                                   | Three-way diff                                                                                                                                 | Reclassified                                                               |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| BOS adds `selected:disabled:opacity-50`                                         | v8's `disabled:*:opacity-50` already dims everything when disabled. The BOS-added arm was redundant                                            | **Type 3 → dropped (subsumed).** v8's pattern covers selected-disabled too |
| BOS uses `data-icon-only:p-2` (vs upstream `px-2.5`)                            | Minor padding tweak. v8's `px-*` is per-size: sm=2.5, md=3, lg=3.5 (more refined)                                                              | **Type 2 → adopted v8.** Per-size padding scale                            |
| Disabled cva arm: BOS `disabled:bg-primary disabled:opacity-50` vs v8 different | v8 uses `disabled:text-secondary/50 disabled:*:opacity-50` (dims text + child opacity). More refined than BOS's bg-preserving + global opacity | **Type 2 → adopted v8.**                                                   |
| Icon hover: BOS `group-disabled/button-group:opacity-50`                        | v8 changed to `group-selected/button-group:text-fg-quaternary_hover` (different effect, but more meaningful in v8's selected-state model)      | **Type 2 → adopted v8.**                                                   |

### Adopted from v8 (Type 2)

- Per-size icon-only padding: `data-icon-only:px-2.5/px-3/px-3.5` (was `p-2`/etc).
- Disabled arm: `disabled:cursor-not-allowed disabled:text-secondary/50 disabled:*:opacity-50`.
- Selected arm simplified: dropped `selected:disabled:opacity-50` (now redundant).
- Icon hover: `group-selected/button-group:text-fg-quaternary_hover` (matches selected styling).
- Root transition: `ease-linear` (replaces `ease-motion-out`).

### Type 3 retained

None.

### Codemod gap workaround

devProps hand-added to `ButtonGroupItem` (`<AriaToggleButton>`) and `ButtonGroup` (`<AriaToggleButtonGroup>`) roots.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff: pending Karim sign-off (subtle change — disabled state shifts to text-secondary/50 + opacity on children, vs preserved bg + global opacity).

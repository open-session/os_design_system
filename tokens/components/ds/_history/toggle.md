# Toggle Primitive — Migration History

**Phase:** C, Wave 2C
**Date:** 2026-05-06
**Status:** Resolved (no wrapper)

## Phase C Wave 2C — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add toggle` v8 sidecar; no prior wrapper — auto-scaffolded `ds/toggle/` deleted).

### Result: 0 Type 3 deltas; v8 adopted wholesale; no wrapper authored

| Phase B claim                                                                    | Three-way diff                                                                                                       | Reclassified                                                       |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| BOS uses CSS-var transitions (`var(--duration-quick) var(--ease-in-out)`)        | Subjective brand intent. v8's literal seconds (`0.15s ease-motion-inout`) still uses BOS's `ease-motion-inout` token | **Type 3 → dropped.** Adopted v8's literal-second + token pattern. |
| BOS adds `ring-[0.5px] ring-secondary` only when `slim`; v8 always-on            | v8 evolution                                                                                                         | **Type 2 → adopted v8.** Always-on faint ring on track             |
| `styles` constant inside fn body                                                 | v8 hoisted to module scope                                                                                           | **Type 2 → adopted v8.** Module-scope styles                       |
| `slim` ring class collapsed                                                      | v8 simplified `slim && "ring-1 ring-secondary ring-inset"` to just `slim && "ring-1"` (other ring classes from base) | **Type 2 → adopted v8.** Simpler slim arm                          |
| Root `duration-quick ease-motion-out` (BOS) vs `duration-micro ease-linear` (v8) | Different timing values; both are valid. v8's `ease-linear` is mechanical (codemod can map)                          | **Type 2 → adopted v8** (`duration-micro ease-linear`)             |

### Adopted from v8 (Type 2)

- Always-on `ring-[0.5px] ring-secondary ring-inset` on the track (visible bg-tertiary edge).
- `styles` constant moved to module scope.
- `slim` ring simplified to just `ring-1` (other ring classes inherited).
- Root duration changed `duration-quick` → `duration-micro`; ease changed `ease-motion-out` → `ease-linear`.
- Inline transition uses literal seconds + `ease-motion-inout` token (no longer CSS-var-based).

### Type 3 retained

None. Toggle is now byte-aligned with v8 + post-codemod state.

### Codemod gap workaround

devProps hand-added to `ToggleBase` `<div>` root and `Toggle` `<AriaSwitch>` root.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff: pending Karim sign-off (subtle change — toggle transition cadence shifts ~50ms faster).

# History: Avatar Primitive

**Primitive:** avatar
**Migration phase:** Phase 6 (PRD 016 Part 1, Wave 27)
**History authored:** 2026-04-27

---

## Pre-Migration Source

`components/ds/avatar/avatar.tsx` at migration time differed from
`components/base/base/avatar/avatar.tsx` in one way:
- Line 121: `bg-tertiary` (ds/) vs `bg-avatar-bg` (base/base/)

`components/ds/avatar/base-components/avatar-add-button.tsx` differed:
- `duration-100 ease-linear` (stale motion tokens)
- `disabled:border-gray-200 disabled:text-gray-200` (stale disabled-state tokens)

All other base-component files were structurally equivalent (icon import paths updated by Phase 5).

**Reference SHA:** `62ce71a91c72af6ee37834b3aa48ac79d8bef0d4` (branch: `ds-migration-baseline`)

To inspect the pre-migration source:

```bash
git show 62ce71a91c72af6ee37834b3aa48ac79d8bef0d4:components/ds/avatar/avatar.tsx
git show 62ce71a91c72af6ee37834b3aa48ac79d8bef0d4:components/ds/avatar/base-components/avatar-add-button.tsx
```

---

## Formula

### Transforms Applied

**avatar.tsx:**

| Transform               | Status | Details |
| ----------------------- | ------ | ------- |
| Motion tokens (Rule 1)  | Not applicable — no duration/ease in avatar.tsx | — |
| Focus ring (Rule 2)     | Not applicable — no ring-2/ring-offset-2 | — |
| Disabled state (Rule 3) | Not applicable — no disabled: gray tokens in avatar.tsx | — |
| Token syntax (Rule 4)   | Not applicable — all Style 2 | — |

**avatar-add-button.tsx (base-components):**

| Transform               | Status | Details |
| ----------------------- | ------ | ------- |
| Motion tokens (Rule 1)  | **Applied** — `duration-100 ease-linear` → `duration-micro ease-motion-out` | Button hover/focus transition |
| Disabled state (Rule 3) | **Applied** — `disabled:border-gray-200` → `disabled:border-border-disabled`; `disabled:text-gray-200` → `disabled:text-fg-disabled` | Dark-mode fragile raw gray values replaced |

### Semantic Token Decision: bg-tertiary → bg-avatar-bg

**Pre-migration:** `bg-tertiary` (generic surface token)
**Post-migration:** `bg-avatar-bg` (component-specific semantic token)

Decision rationale: `bg-avatar-bg` is semantically correct and aligns with UUI's source. `bg-tertiary`
was an undocumented deviation in ds/avatar that diverged from UUI without a design rationale. The
visual appearance in light mode is identical; adopting the correct semantic token improves dark-mode
correctness and future maintainability.

Codified in `ds/defaults/avatar.ts` base class string. Documented in `ds/_exceptions.md` §Avatar
Background Token Swap.

### Defaults Codified (Phase 6)

CVA defaults file: `ds/defaults/avatar.ts`

**Avatar CVA config:**
- `size` variant: xxs/xs/sm (default) /md/lg/xl/2xl
- Base class: `bg-avatar-bg` (adopted from UUI)

**AvatarAddButton CVA config:**
- `size` variant: xs/sm (default) /md
- Post-transform class composition documented

### Wiring (Phase 6)

- **Source of truth:** `components/base/base/avatar/avatar.tsx` + base-components
- **Barrel re-export shims:** `components/ds/avatar/avatar.tsx` + all base-components converted to shims
- **Registry:**
  - ds-avatar → base-avatar, ds-avatar-add-button → base-avatar-add-button, etc.
  - uui-avatar, uui-avatar-add-button, uui-avatar-company-icon, uui-avatar-online-indicator, uui-verified-tick removed (now duplicates)
  - uui-avatar-label-group → base-avatar-label-group, uui-avatar-profile-photo → base-avatar-profile-photo

---

## Deviations

1. **bg-tertiary → bg-avatar-bg:** Intentional adoption of UUI's semantic token. Documented in ds/_exceptions.md.
2. **Disabled state + motion transforms on avatar-add-button:** Applied in this wave (not in Phase 5). The base/base/ source had the pre-transform values carried forward from ds/; fixed here.

---

_Authored by PRD 016 task 6c (Phase 6, Wave 27)._

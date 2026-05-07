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

| Transform               | Status                                                  | Details |
| ----------------------- | ------------------------------------------------------- | ------- |
| Motion tokens (Rule 1)  | Not applicable — no duration/ease in avatar.tsx         | —       |
| Focus ring (Rule 2)     | Not applicable — no ring-2/ring-offset-2                | —       |
| Disabled state (Rule 3) | Not applicable — no disabled: gray tokens in avatar.tsx | —       |
| Token syntax (Rule 4)   | Not applicable — all Style 2                            | —       |

**avatar-add-button.tsx (base-components):**

| Transform               | Status                                                                                                                               | Details                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Motion tokens (Rule 1)  | **Applied** — `duration-100 ease-linear` → `duration-micro ease-motion-out`                                                          | Button hover/focus transition              |
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

1. **bg-tertiary → bg-avatar-bg:** Intentional adoption of UUI's semantic token. Documented in ds/\_exceptions.md.
2. **Disabled state + motion transforms on avatar-add-button:** Applied in this wave (not in Phase 5). The base/base/ source had the pre-transform values carried forward from ds/; fixed here.

---

_Authored by PRD 016 task 6c (Phase 6, Wave 27)._

---

## Phase C Wave 2B — UUI v8 rebase (2026-05-06)

**Wave:** Phase C, Wave 2B (Avatar full family).
**Methodology:** three-way diff (current `base/` vs `bun run uui:add avatar` v8 sidecar; no prior wrappers — auto-scaffolded `ds/avatar/avatar.tsx` deleted after evaluation).

### Result: 0 Type 3 deltas survive; v8 adopted wholesale across the entire family

The pre-Phase-C audit framing assumed a Shape-C wrapper would be needed to preserve BOS's `xxs` size and the older `outline`-based contrast-border model. Three-way diff against v8 reframed both:

| Phase B claim                                                                    | Three-way diff                                                                                                                                  | Reclassified                                                                               |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| BOS retains `xxs` size; wrapper required                                         | xxs has 0 product consumers. Internal use sites: `tag-select.tsx` (rewireable to `xs`) and `avatar.stories.tsx` (story row deletable)           | **Type 3 → dropped.** xxs deleted from base/ + tag-select rewired + story row removed      |
| BOS uses `bg-avatar-bg` (Phase 6 adopted-from-UUI semantic token)                | v8 dropped `bg-avatar-bg` vocabulary in favor of `bg-tertiary` on a new inner-div masking layer                                                 | **Type 2 → adopted v8.** `ds/defaults/avatar.ts`'s adoption of `bg-avatar-bg` is now stale |
| Per-size `outline-*` on root for contrast border                                 | v8 moved to a layered model: `outline-black/16` + `before:border-white/32` masking on the inner `<div>` (3D image-edge treatment)               | **Type 2 → adopted v8** wholesale                                                          |
| AvatarProfilePhoto is BOS-authored; v8 ships nothing equivalent                  | `npx untitledui add avatar-profile-photo` (standalone) returns "No components found", but `bun run uui:add avatar` DOES surface it as a sidecar | **Type 2 → adopted v8.** v8 ships the file via the avatar bundle; new masking treatment    |
| AvatarLabelGroup retains `xl` size + per-size root gap (`gap-2`/`gap-3`/`gap-4`) | 0 product consumers of `xl`; v8 simplified to fixed `gap-2`                                                                                     | **Type 2 → adopted v8.** `xl` size dropped; gap fixed                                      |

### Adopted from v8 (Type 2)

- **Avatar core:** new `count`/`border`/`rounded`/`contentClassName` props + masked inner-div + `AvatarCount` sub-component import.
- **Avatar sizing scale:** root sizes pruned to xs/sm/md/lg/xl/2xl (BOS xxs dropped).
- **AvatarProfilePhoto:** new outline + before-pseudo masking + size-conditional content classes; preserved BOS's `onError` fallback (still in v8).
- **AvatarLabelGroup:** `rounded` + `avatarClassName` props; dropped `xl` size; simplified per-size styles.
- **AvatarOnlineIndicator:** sophisticated radial-gradient + reflection SVG (replaces BOS's flat circle).
- **VerifiedTick:** flattened sizes object (dropped broken `tick: "size-[4.38px"` key — closing bracket was missing; never rendered correctly).
- **AvatarCompanyIcon:** `bg-brand-50` (replaces non-resolving `bg-primary-25`).
- **AvatarAddButton:** `disabled:opacity-50` (replaces v7 disabled-token triplet — C0-deferred decision option (c) executed).
- **AvatarCount:** new file adopted from v8 as-is (with devProps applied by the codemod since it's a new file, not a sidecar).

### Type 3 retained

None across the family. Avatar is now byte-aligned with v8 + post-codemod state.

### Wrapper-deletion outcome

- Auto-scaffolded `components/ds/avatar/avatar.tsx` was authored as a Shape-C fork preserving xxs, then **deleted** when xxs's 0-product-consumer status was confirmed.
- Net wrapper count for Avatar family: 0 (down from the audit's predicted 1).

### Codemod gap workaround

devProps hand-added to root on all 7 modified base/ files:

- `avatar.tsx` → `<div data-avatar>`
- `avatar-profile-photo.tsx` → outer `<div>`
- `avatar-label-group.tsx` → `<figure>`
- `avatar-add-button.tsx` → `<AriaTooltipTrigger>` (first DOM element)
- `avatar-company-icon.tsx` → `<img>`
- `avatar-online-indicator.tsx` → `<span>`
- `verified-tick.tsx` → `<svg>`

The new `avatar-count.tsx` has devProps applied automatically (codemod fires on new files, not on sidecars).

### Pipeline gap surfaced

`bun run uui:add avatar-add-button` (sidecar pipeline) generates a broken tooltip import path: `from "@/tmp/uui-staging-...../base/tooltip/tooltip"`. The script's path-rewrite logic does not normalize cross-folder imports back to `@/components/base/...` paths. Worked around by hand. Filed for post-campaign cleanup (referenced in `tag-close-x.md` as well).

### Stale doc surfaced

`components/ds/defaults/avatar.ts` documents `bg-avatar-bg` as the adopted background token. v8 dropped that vocabulary. The defaults file is not currently imported anywhere (verified via grep). Leaving as-is for Wave 7 cleanup; not blocking.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff against C0 baseline: pending Karim sign-off (significant visual change expected — v8's masking treatment is more polished/3D than BOS's flat outline).

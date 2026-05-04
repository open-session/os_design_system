# History: Input Primitive

**Primitive:** input
**Migration phase:** Phase 6 (PRD 016 Part 1, Wave 26)
**History authored:** 2026-04-27

---

## Pre-Migration Source

`components/ds/input/input.tsx` at migration time had diverged from
`components/base/base/input/input.tsx` (post-Phase 5 rename) in 4 ways:

1. Icon import: `@untitledui-pro/icons/line` → `@untitledui/icons` (applied in Phase 5 rename)
2. Internal imports: updated to `@/components/base/base/input/` in base/base/ (applied in Phase 5)
3. Motion tokens:
   - Line 88: `transition-shadow duration-100 ease-linear` → `duration-micro ease-motion-out`
   - Line 140: `transition duration-200` → `duration-standard`
4. devProps for `Input` component: ds/input had `// eslint-disable-next-line bos-local/require-dev-props`;
   base/base/input applies `{...devProps('Input')}` directly to the `<TextField>` element

**Reference SHA:** `62ce71a91c72af6ee37834b3aa48ac79d8bef0d4` (branch: `ds-migration-baseline`)
**File path in reference:** `components/ds/input/input.tsx`

To inspect the pre-migration source:

```bash
git show 62ce71a91c72af6ee37834b3aa48ac79d8bef0d4:components/ds/input/input.tsx
```

---

## Formula

### Transforms Applied

| Transform               | Status | Details |
| ----------------------- | ------ | ------- |
| Motion tokens (Rule 1)  | **Applied** — 2 instances in base/base/input/input.tsx | `duration-100 ease-linear` → `duration-micro ease-motion-out` (ring transition); `duration-200` → `duration-standard` (tooltip trigger) |
| Focus ring (Rule 2)     | **Not applicable** — focus ring pattern already uses BOS semantics: `ring-1 ring-brand shadow-focus-ring-elevated` (not UUI's `ring-2 ring-offset-2`) | No change needed |
| Disabled state (Rule 3) | **Not applicable** — uses `opacity-50 cursor-not-allowed` pattern (not raw `bg-gray-100 text-gray-400`) | No change needed |
| Token syntax (Rule 4)   | **Not applicable** — all classes use Style 2 mapped classes | No change needed |

### Defaults Codified (Phase 6)

CVA defaults file: `ds/defaults/input.ts`

**InputBase CVA config:**
- `size` variant: `sm` (default) → `px-3 py-2`; `md` → `px-3.5 py-2.5`
- `defaultVariants.size: "sm"` — matches UUI default, no BOS override

**Input CVA config:** Documents the root `group flex flex-col` container class composition. No variants.

**Non-CVA behavioral defaults:**

| Prop   | UUI default | BOS default | Override? |
| ------ | ----------- | ----------- | --------- |
| `size` | "sm"        | "sm"        | No — matches UUI |

### devProps Resolution (React Aria TextField Exception)

**Pre-migration (ds/input/input.tsx):** `// eslint-disable-next-line bos-local/require-dev-props` on the `Input` component's `<TextField>` root.

**Post-migration (components/base/base/input/input.tsx):** `{...devProps('Input')}` applied directly to `<TextField>`. React Aria's `TextField` forwards unknown props to the rendered root `<div data-input-wrapper>`. The `data-component` attribute reaches the DOM. ESLint suppress comment removed.

**Exception entry updated:** `ds/_exceptions.md` §React Aria TextField devProps Suppression marked "Resolved — Wave 26".

### Wiring (Phase 6)

- **Source of truth:** `components/base/base/input/input.tsx` — motion transforms applied, devProps applied
- **Barrel re-export shim:** `components/ds/input/input.tsx` — converted to re-export of InputBase, TextField, Input, InputBaseProps
- **Registry:**
  - `ds-input-base` → `base-input-base` (imports updated to base/base/)
  - `ds-text-field` → `base-text-field` (imports updated to base/base/)
  - Added `base-input` entry (Input component, previously only in uui-input)
  - Removed duplicate `uui-input-base`, `uui-text-field`, `uui-input` entries

### Sub-components NOT migrated in this wave

- `components/ds/input/input-group.tsx` — not yet migrated (pending future wave or covers input group)
- `components/ds/input/input-payment.tsx` — not yet migrated

---

## Deviations

**devProps approach:** The ds/input/input.tsx had an `eslint-disable-next-line` suppression for the `Input` component's React Aria `TextField` root. The base/base/ version resolves this by applying `{...devProps('Input')}` directly on `<TextField>` without suppression — React Aria forwards the prop through to the DOM. This is an improvement over the suppression approach and closes the exception entry in `ds/_exceptions.md`.

**Motion transforms already applied in Phase 5:** The Phase 5 rename refreshed the UUI source file into `components/base/base/input/input.tsx`. The motion transforms (`duration-100 ease-linear` → `duration-micro ease-motion-out` and `duration-200` → `duration-standard`) were applied as part of that refresh. This wave confirms and documents them as intentional BOS transforms.

---

_Authored by PRD 016 task 6b (Phase 6, Wave 26)._

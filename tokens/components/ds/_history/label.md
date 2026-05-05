# History: Label Primitive

**Primitive:** label
**Migration phase:** Phase 6 (PRD 016 Part 1, Wave 25)
**History authored:** 2026-04-26

---

## Pre-Migration Source

`components/ds/input/label.tsx` at migration time was **equivalent in structure** to
`components/base/base/input/label.tsx` (post-Phase 5 rename from `components/uui/base/input/label.tsx`).
One difference was found:

- `components/ds/input/label.tsx` used `@untitledui-pro/icons/line` for the `HelpCircle` icon
- `components/base/base/input/label.tsx` used `@untitledui/icons` for `HelpCircle`
- `components/ds/input/label.tsx` had `transition duration-200` on the TooltipTrigger element
- `components/base/base/input/label.tsx` has `duration-standard` (motion token already applied)

The Phase 5 rename brought in the UUI source and applied the motion token transform. The ds/ shim now re-exports from base/base/.

**Reference SHA:** `62ce71a91c72af6ee37834b3aa48ac79d8bef0d4` (branch: `ds-migration-baseline`)
**File path in reference:** `components/ds/input/label.tsx`

To inspect the pre-migration source:

```bash
git show 62ce71a91c72af6ee37834b3aa48ac79d8bef0d4:components/ds/input/label.tsx
```

The file was 54 lines — a React Aria `<Label>` wrapper with optional required asterisk and tooltip, `devProps('Label')` applied to the `<AriaLabel>` root.

---

## Formula

### Transforms Applied

| Transform               | Status | Evidence |
| ----------------------- | ------ | -------- |
| Motion tokens (Rule 1)  | **Applied** on `TooltipTrigger` element: `duration-200` → `duration-standard` | Applied in Phase 5 rename; `components/base/base/input/label.tsx` confirmed |
| Focus ring (Rule 2)     | **Not applied** — no `ring-*` / `ring-offset-*` classes present | Code inspection |
| Disabled state (Rule 3) | **Not applied** — no disabled: modifier classes present | Code inspection |
| Token syntax (Rule 4)   | **Not applied** — uses `text-secondary`, `text-brand-tertiary`, `text-fg-quaternary`, `text-fg-quaternary_hover` (Style 2 mapped classes already correct) | Code inspection |

**Note:** The motion token transform (`duration-200` → `duration-standard`) was applied during the Phase 5 rename (when UUI source was refreshed into `components/base/base/input/label.tsx`). No further motion transforms needed in this wave.

### Defaults Codified (Phase 6)

CVA defaults file: `ds/defaults/label.ts`

**CVA class variants:** None. Label has no class-producing variant props. Optional features (`isRequired`, `tooltip`) are props that affect rendered children, not class variants.

**Base class string documented:**

```
flex cursor-default items-center gap-0.5 text-sm font-medium text-secondary
```

**Non-CVA behavioral defaults:**

| Prop                 | UUI default | BOS default  | Override? |
| -------------------- | ----------- | ------------ | --------- |
| `isRequired`         | `undefined` | `undefined`  | No override — consumers set this explicitly |
| `tooltip`            | `undefined` | `undefined`  | No override — consumers set this explicitly |
| `tooltipDescription` | `undefined` | `undefined`  | No override |

No behavioral prop overrides at this time.

### Wiring (Phase 6)

- **Source of truth:** `components/base/base/input/label.tsx` — motion transform already applied
- **Barrel re-export shim:** `components/ds/input/label.tsx` — converted to re-export from `@/components/base/base/input/label`
- **Registry:** `lib/component-registry.ts` entry updated from `ds-label` → `base-label`, import updated to `@/components/base/base/input/label`; duplicate `uui-label` entry removed

### devProps Verification

`{...devProps('Label')}` is applied on the `<AriaLabel>` root in `label.tsx`. React Aria's `Label` renders as a `<label>` DOM element — devProps IS applied here (not a suppression exception). Confirmed: no `eslint-disable` comment needed.

---

## Deviations

**None.**

Label had only a motion token drift (`duration-200` → `duration-standard`) which was resolved during Phase 5. No other BOS-specific customizations.

The ds/ shim provides import continuity for Part 1; consumers will be codemoded to import from `@/components/base/base/input/label` directly in Part 2.

---

_Authored by PRD 016 task 6a (Phase 6, Wave 25)._

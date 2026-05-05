# History: HintText Primitive

**Primitive:** hint-text
**Migration phase:** Phase 6 (PRD 016 Part 1, Wave 25)
**History authored:** 2026-04-26

---

## Pre-Migration Source

`components/ds/input/hint-text.tsx` at migration time was **byte-identical** to
`components/base/base/input/hint-text.tsx` (post-Phase 5 rename from `components/uui/base/input/hint-text.tsx`).
No BOS-specific transforms had been applied.

**Reference SHA:** `62ce71a91c72af6ee37334b3aa48ac79d8bef0d4` (branch: `ds-migration-baseline`)
**File path in reference:** `components/ds/input/hint-text.tsx`

To inspect the pre-migration source:

```bash
git show 62ce71a91c72af6ee37334b3aa48ac79d8bef0d4:components/ds/input/hint-text.tsx
```

The file was 35 lines — a React Aria `<Text>` wrapper with `isInvalid` prop controlling the error-message slot, plus `devProps('HintText')` applied to the `<AriaText>` root.

---

## Formula

### Transforms Applied

| Transform               | Status | Evidence |
| ----------------------- | ------ | -------- |
| Motion tokens (Rule 1)  | **Not applied** — no `duration-*` / `ease-*` classes present | Code inspection |
| Focus ring (Rule 2)     | **Not applied** — no `ring-*` / `ring-offset-*` classes present | Code inspection |
| Disabled state (Rule 3) | **Not applied** — hint-text has no disabled state | Code inspection |
| Token syntax (Rule 4)   | **Not applied** — uses `text-tertiary` and `text-error-primary` (Style 2 mapped classes already correct) | Code inspection |

**All 4 transforms: zero applicable instances.** HintText is a simple text display component with no interactive states, no motion, no focus rings.

### Defaults Codified (Phase 6)

CVA defaults file: `ds/defaults/hint-text.ts`

**CVA class variants:** None. HintText has no class-producing variant props. The `isInvalid` prop controls a React Aria slot (`slot="errorMessage"` vs `slot="description"`) — this is not a CVA-expressible class variant.

**Base class string documented:**

```
text-sm text-tertiary
```

(Error state `text-error-primary` is applied conditionally via the `isInvalid` prop and `group-invalid:text-error-primary` — not a CVA variant.)

**Non-CVA behavioral defaults:**

| Prop        | UUI default  | BOS default  | Override? |
| ----------- | ------------ | ------------ | --------- |
| `isInvalid` | `undefined`  | `undefined`  | No override — consumers set this explicitly |
| `slot`      | `"description"` | `"description"` | No override; `"errorMessage"` when `isInvalid=true` |

No behavioral prop overrides at this time.

### Wiring (Phase 6)

- **Source of truth:** `components/base/base/input/hint-text.tsx` — unchanged UUI source (no wrapper needed; no defaults to apply beyond documentation)
- **Barrel re-export shim:** `components/ds/input/hint-text.tsx` — converted to re-export from `@/components/base/base/input/hint-text`
- **Registry:** `lib/component-registry.ts` entry updated from `ds-hint-text` → `base-hint-text`, import updated to `@/components/base/base/input/hint-text`; duplicate `uui-hint-text` entry removed
- **Script fix:** `scripts/generate-component-registry.ts` SCAN_CONFIGS updated from `components/uui/base` → `components/base/base` (carry-over from Phase 5 rename, folded into this wave)

### devProps Verification

`{...devProps('HintText')}` is applied on the `<AriaText>` root in `hint-text.tsx`. React Aria's `Text` component renders as a DOM element (`<p>` or `<span>`) depending on slot context — devProps IS applied here (not a suppression exception). Confirmed: no `eslint-disable` comment needed.

---

## Deviations

**None.**

HintText had zero BOS-specific customizations at migration time. The ds/ shim provides import continuity for Part 1; consumers will be codemoded to import from `@/components/base/base/input/hint-text` directly in Part 2.

---

_Authored by PRD 016 task 6a (Phase 6, Wave 25)._

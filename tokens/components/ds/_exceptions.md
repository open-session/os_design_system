# Transform Exceptions

Component-specific deviations that cannot be expressed as universal transform rules. Each entry explains what the deviation is, why it is an exception (not a rule), and what to do when the affected primitive migrates in Phase 6.

**Source of truth:** This file is read by Phase 6 migration tasks (6a–6h) before touching each primitive.

**Convention:** Universal rules live in `ds/transforms/*.mdx`. This file covers only component-quirks, brand-defaults, and React Aria limitations that are specific to one or two primitives.

---

## Exception: Button Primary Variant (Brand Default)

**Component(s):** `components/ds/buttons/button.tsx` (NOT a shim — full brand override implementation)
**Type:** brand-default
**Description:** The `ds/button.tsx` primary variant uses a neutral-secondary style instead of UUI's default orange CTA (`bg-brand-solid text-white`). This is an intentional BOS brand decision recorded as Decision #2 (2026-04-23): BOS's primary button expresses "contained but calm" rather than the high-contrast orange that UUI ships. The deviation is NOT a result of applying any of the 4 transform rules — it predates the architecture revamp and was applied as a manual design decision.
**Why not a rule:** The change is specific to the button primary variant. No general "replace all orange CTAs with neutral-secondary" rule can be derived — other primitives may correctly use UUI's orange when semantically appropriate (e.g., accent badges). Extracting a universal rule would cause false positives on non-button surfaces.

**Status:** Resolved — Wave 30 (task 6f, 2026-04-27).

**Resolution:** `ds/buttons/button.tsx` retained as a full implementation (NOT converted to a re-export shim).
Rule 1 motion token fix applied: `duration-100 ease-linear` → `duration-micro ease-motion-out`.
The neutral-secondary primary variant is preserved as the BOS brand default.
`ds/defaults/button.ts` documents the CVA config with `buttonPrimaryDefaults` for the neutral-secondary primary.
The UUI base/base/ button (orange CTA) remains the upstream source; ds/ overrides primary for brand alignment.
See `ds/_history/button.md` for the full before/after snapshot.

---

## Exception: React Aria TextField devProps Suppression

**Component(s):** `components/ds/input/input.tsx` → `components/base/input/input.tsx` (post-Phase 5 rename)
**Type:** react-aria-limitation
**Description:** `ds/input/input.tsx` uses a React Aria `TextField` component as its JSX root. React Aria's `TextField` is a compound component — it does not render a DOM element at its immediate root; it provides a context/slot boundary. The `bos-local/require-dev-props` ESLint rule requires `{...devProps('Input')}` on the root DOM element, but `TextField` is not a DOM element. This creates an ESLint error that must be suppressed with `// eslint-disable-next-line bos-local/require-dev-props` at the `TextField` line.
**Why not a rule:** This limitation is specific to React Aria compound components that do not render a DOM element at their JSX root. It does not apply to primitives whose root is a DOM element (e.g., `<div>`, `<button>`, `<span>`). Making this a universal exception rule would incorrectly suggest that devProps should be suppressed more broadly — devProps must still be applied to the nearest visible DOM child inside the React Aria compound.
**Phase 6 guidance:** During task 6b (input migration):

1. Preserve the `// eslint-disable-next-line bos-local/require-dev-props` comment on the `TextField` line.
2. Apply `{...devProps('Input')}` to the first child DOM element inside the `TextField` (typically the wrapper `<div>` that contains the label and input). This is the correct application site — it is the visible root of the rendered input, even if it is not the JSX root of the component.
3. Document the final `devProps` placement in this exception entry (update below) once 6b confirms the approach.
4. If React Aria changes `TextField` to render a DOM element at root in a future UUI upgrade, remove the `eslint-disable` comment and move `devProps` back to the JSX root.

**Status:** Resolved — Wave 26 (task 6b, 2026-04-27).

**Resolution:** In `components/base/base/input/input.tsx`, `{...devProps('Input')}` is applied
directly to the `<TextField>` JSX element. React Aria's `TextField` forwards unknown props (including
`data-component`) to the rendered root DOM element (a `<div>` with `data-input-wrapper`). This
satisfies the intent of the devProps convention — the `data-component` attribute is present on the
visible root DOM element of the rendered output. The `eslint-disable-next-line` comment from the
original `ds/input/input.tsx` has been removed in the base/base/ source; devProps is now applied
directly without suppression.

---

## Exception: `ease-out` / `ease-in` inside `animate-in` / `animate-out` Compound Classes

**Component(s):** `components/ds/tooltip/tooltip.tsx` (confirmed); any future primitive using `tailwindcss-animate` shorthand
**Type:** known-limitation (Rule 1 — Motion Token Transform)
**Description:** When `ease-out` or `ease-in` appears as part of a `tailwindcss-animate` shorthand compound (e.g., `"ease-out animate-in fade-in zoom-in-95"` or `"ease-in animate-out fade-out zoom-out-95"`), it controls the CSS **animation easing preset** for the animate-in/animate-out plugin — not a standalone Tailwind `transition-timing-function` utility. Rule 1 (Motion Token Transform) does NOT apply to these instances. Converting `ease-out animate-in` to `ease-motion-out animate-in` would break the `tailwindcss-animate` plugin contract: `ease-motion-out` is a BOS custom alias for `transition-timing-function` that the animation plugin does not recognize.
**Why not a rule:** Rule 1 applies specifically to standalone `transition-timing-function` utilities (in `transition` property chains). The `animate-in`/`animate-out` plugin reads `ease-(out|in|in-out|linear)` as preset selectors with a different semantic scope. These two uses of `ease-out` are distinct CSS mechanisms — making a universal "do not convert `ease-out` anywhere" rule would prevent valid Rule 1 applications on the same component if it also has standalone `transition-timing-function` uses.
**Detection heuristic (Phase 1 §6.1):** A line is convertible by Rule 1 only if it contains `ease-(out|in|in-out|linear)` AND does NOT also contain `animate-(in|out)` on the same className string. See `ds/transforms/motion.mdx` "Edge Cases" section for the full heuristic and detection grep.
**Phase 6 guidance:** For any primitive that uses `tailwindcss-animate` shortshand (check for `animate-in` or `animate-out` in the file):

1. Do NOT run Rule 1 on lines that co-occur with `animate-(in|out)`.
2. DO run Rule 1 on all other `ease-(out|in|in-out|linear)` uses on standalone `transition` chains in the same file.
3. Append any new primitive-specific findings to `docs/spikes/design-system/2026-04-25-architecture-migration-phase1-findings.md` §8.

**Source:** Phase 1 empirical proof, task 1c — `docs/spikes/design-system/2026-04-25-architecture-migration-phase1-findings.md` §6.1 and §7.3.

---

## Exception: Avatar Background Token Swap (bg-tertiary → bg-avatar-bg)

**Component(s):** `components/ds/avatar/avatar.tsx` → `components/base/base/avatar/avatar.tsx` (post-Phase 5 rename)
**Type:** semantic-token-adoption
**Description:** `ds/avatar/avatar.tsx` used `bg-tertiary` for the avatar background container. UUI's
`components/base/base/avatar/avatar.tsx` uses `bg-avatar-bg` (a component-specific semantic token).
`bg-tertiary` is a generic surface-level token; `bg-avatar-bg` is the semantically correct token for avatar
backgrounds. This is not a result of any of the 4 transform rules — it was an undocumented choice in the
original ds/avatar that slightly diverged from UUI's source.

**Decision:** Adopt `bg-avatar-bg` (UUI's semantic token). Rationale:

1. `bg-avatar-bg` is semantically correct — it names the usage site rather than a generic visual level.
2. `bg-avatar-bg` resolves through the token system and adapts to dark mode correctly.
3. Visual difference is negligible in light mode; the correct token improves future maintainability.
4. Aligned with "lean into UUI primitives" principle (feedback_lean_into_uui.md).

**Why not a universal rule:** This is an avatar-specific token mapping. `bg-tertiary` is a valid general
token for other surfaces — making a universal rule would incorrectly replace `bg-tertiary` in non-avatar
contexts.

**Status:** Resolved — Wave 27 (task 6c, 2026-04-27). `bg-avatar-bg` adopted in `components/base/base/avatar/avatar.tsx`.
The pre-migration `bg-tertiary` value is documented in `ds/_history/avatar.md`.

**Codified in:** `ds/defaults/avatar.ts` (base class string uses `bg-avatar-bg`).

---

## Dot-Icon Naming Collision

Two files share similar names but serve entirely different purposes. Both are retained. No rename.

### `components/base/foundations/dot-icon.tsx`

- **Export:** `Dot`
- **Purpose:** DS primitive — a small circular dot used as a sub-component inside Badge (e.g., BadgeWithDot). Part of the UUI Pro foundations layer.
- **Consumer examples:** `components/base/base/badges/badges.tsx`

### `components/custom/shared/loaders/dot-icon.tsx`

- **Export:** `DotIcon`
- **Layer:** Custom shared (product composition — migrated from `components/ui/dot-icon.tsx` in W4-10b, verified 2026-04-28)
- **Purpose:** Animated status indicator — a dot icon with animation states for loading/online/offline. Product composition, not a DS primitive.
- **Consumer examples:** `components/custom/shared/menus/HelpDropdown.tsx` (imports `DotIcon` for menu item animation states)
- **Do not import from:** `@/components/base/foundations/dot-icon` (exports `Dot`, not `DotIcon`)

**Why not renamed?** The names reflect distinct abstraction layers: `Dot` is a DS atom living in the
vendor primitives layer; `DotIcon` is a product animation component in custom/shared/. Renaming either
would require a cross-cutting import codemod across unrelated code paths with no functional benefit.
The export name (`Dot` vs `DotIcon`) and the file path layer (base/foundations vs custom/shared) make
the distinction clear at point-of-import.

**Status:** Migration confirmed complete — W4-10b (2026-04-28). Both files co-exist with distinct paths and exports.

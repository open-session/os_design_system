# Input Family — Migration History (Phase C Wave 3B)

**Phase:** C, Wave 3B
**Date:** 2026-05-06
**Status:** Resolved (no wrappers)
**Files touched:** `components/base/base/input/{input,label,hint-text,input-payment,input-group}.tsx`

## Phase C Wave 3B — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add input` v8 sidecars; auto-scaffolded `ds/input/` deleted).

### Result: 0 Type 3 deltas; v8 adopted wholesale across the family

| Component        | Phase B claim                                                                                                                                                     | Three-way diff                                                                                                 | Reclassified                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Input**        | Wholesale refactor: extends `Omit<AriaInputProps, "size">`, adds isInvalid/isDisabled/isRequired, lg size, password toggle, restructured sizes, group/input class | Confirmed. Major Type 2 vendor evolution. Adopt wholesale.                                                     | **Type 2 → adopted v8.** Major API + style refresh                  |
| **Label**        | `duration-standard` (BOS) vs `duration-micro` (v8) on tooltip transition; `isInvalid` prop added in v8                                                            | The `duration-standard` choice was a small Type 3 BOS preference. Dropping per "lean into UUI"                 | **Type 2 → adopted v8.** Faster tooltip transition + isInvalid prop |
| **HintText**     | "No deltas" (audit) — sweep surfaced `isInvalid`/`size` prop addition                                                                                             | v8 ships `size` + `isInvalid` props with size-conditional text classes                                         | **Type 2 → adopted v8.** Both new props absorbed                    |
| **InputPayment** | (Not flagged in audit — collateral pull due to InputBase API breaking change)                                                                                     | v8's input-payment was rewritten to match the new `Omit<AriaInputProps, "size">` API + the loss of `hint` prop | **Type 2 → adopted v8.** Required to keep typecheck green           |
| **InputGroup**   | (Not flagged in audit — collateral)                                                                                                                               | v8 added new props + `lg` size context awareness                                                               | **Type 2 → adopted v8.**                                            |

### Adopted from v8 (Type 2)

- **Input**: `Omit<AriaInputProps, "size">` base interface; `isInvalid`/`isDisabled`/`isRequired` props; new `lg` size; password visibility toggle (`Eye`/`EyeOff` + `useState`); restructured sizing with stroke widths; `group/input` class on root; focus ring `ring-2 ring-brand` (replaces BOS's `ring-1 ring-brand shadow-focus-ring-elevated` — the elevated shadow is dropped); `text-fg-error-secondary` for invalid icon.
- **Label**: `isInvalid` prop with conditional asterisk error styling; tooltip transition `duration-micro`.
- **HintText**: `size?: "sm" | "md"` prop with conditional text-xs class; `in-data-[input-size=sm]:text-xs` ancestor-aware override.
- **InputPayment**: rewired to match new InputBase API (was relying on `hint` prop that no longer exists).
- **InputGroup**: passes `size` through TextField context.

### Type 3 retained

None across the family.

### Pipeline gap surfaced (and worked around)

`bun run uui:add input` again generated broken `@/tmp/uui-staging-...` import paths in input.tsx, label.tsx, input-payment.tsx, input-group.tsx for sibling primitive imports (Tooltip, Label, HintText). Hand-corrected via `sed` post-pull. Same gap as Wave 2A/2B/2C. Filed for post-campaign cleanup.

### Greenfield deferred (out of scope)

`bun run uui:add input` also pulled new v8 primitives BOS doesn't ship:

- `input-date.tsx`, `input-file.tsx`, `input-number.tsx`, `input-tags-outer.tsx`, `input-tags.tsx`, `pin-input.tsx`
- `tags.tsx`, `base-components/tag-checkbox.tsx`
- 60+ new payment-icon files (Affirm, Afterpay, Alipay, Amazon, etc.)

All deleted per the campaign plan's greenfield policy. Note: `input-date.tsx` will re-enter scope in C5 (date-picker family migration) per the C0 orphan decisions.

### Codemod gap workaround

The codemod fired during the `--allow-overwrite` re-pull but placed devProps with awkward indentation (`      ` instead of `            `). Hand-fixed for InputBase. Manual additions for TextField, Input, InputGroup roots that the codemod's heuristic didn't cover (Input + InputGroup wrap TextField rather than rendering a primitive, so devProps spreads through TextField props).

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff: pending Karim sign-off (subtle changes — focus ring is now thicker, no elevated shadow; tooltip transitions ~150ms faster; new `lg` size available).

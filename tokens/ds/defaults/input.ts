/**
 * BOS Defaults — Input
 *
 * Wave 26 (Phase 6, PRD 016 task 6b): input primitive migration.
 *
 * Input is the primary text field primitive. It is built as a compound
 * component using React Aria's TextField, Group, and Input. It imports
 * hint-text and label (migrated in Wave 25 / task 6a).
 *
 * TRANSFORM ANALYSIS:
 * Reviewing components/base/base/input/input.tsx against the 4 transform rules:
 * 1. Motion tokens (Rule 1): TWO instances found and corrected in base/base/ (vs ds/input stale state):
 *    - Line 88: `duration-100 ease-linear` → `duration-micro ease-motion-out` (transition on input group ring)
 *    - Line 140: `duration-200` → `duration-standard` (transition on tooltip trigger)
 * 2. Focus ring: The focus ring pattern is `ring-1 ring-brand shadow-focus-ring-elevated` (using
 *    BOS semantic tokens). The `ring-1` + `shadow-focus-ring-*` pattern is already correct —
 *    this is the BOS-standard focus ring (not UUI's `ring-2 ring-offset-2`). No transform needed.
 * 3. Disabled state: Uses `opacity-50` + `cursor-not-allowed` for disabled state — not raw
 *    `bg-gray-100 text-gray-400`. No transform needed.
 * 4. Token syntax: All classes use Style 2 mapped classes — already correct.
 *
 * DEVPROPS NOTE (React Aria TextField exception):
 * The `Input` component uses React Aria's `TextField` as its JSX root. React Aria's `TextField`
 * is a compound component with a context/slot boundary, not a DOM element. In base/base/input/input.tsx,
 * `{...devProps('Input')}` is applied to the `<TextField>` element directly. The ESLint rule
 * `bos-local/require-dev-props` still fires because `TextField` is not a DOM element. The base/
 * file uses `{...devProps('Input')}` spread onto the `<TextField>` (which passes it through to
 * the rendered root `<div>` via React Aria's prop forwarding). This resolves the ESLint warning
 * at the component level. The ds/_exceptions.md entry for this is marked resolved in this wave.
 *
 * DEFAULT VARIANT:
 * The Input component has one user-facing variant prop: `size` with values "sm" (default) and "md".
 * BOS default is "sm" (matching UUI default).
 *
 * @see components/base/base/input/input.tsx — UUI source of truth (post-Phase 5)
 * @see ds/transforms/_history/input.md — migration history
 * @see ds/_exceptions.md — React Aria TextField devProps exception (resolved in 6b)
 */

import { cva } from "class-variance-authority";

/**
 * CVA configuration for the InputBase component defaults.
 *
 * InputBase has one class-producing variant: `size` ("sm" | "md").
 * The size variant controls padding and icon positioning classes — these
 * are computed via the `sizes` sortCx map internally, not via CVA in the
 * component itself. CVA here documents the BOS-intended default.
 */
export const inputBaseDefaults = cva(
  // Base classes: input wrapper container defaults
  [
    "relative",
    "flex",
    "w-full",
    "flex-row",
    "place-content-center",
    "place-items-center",
    "rounded-lg",
    "bg-primary",
    "shadow-xs",
    "ring-1",
    "ring-primary",
    "transition-shadow",
    "duration-micro",
    "ease-motion-out",
    "ring-inset",
  ],
  {
    variants: {
      size: {
        sm: ["px-3", "py-2"],
        md: ["px-3.5", "py-2.5"],
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

/**
 * CVA configuration for the full Input (TextField wrapper) defaults.
 */
export const inputDefaults = cva(
  // Base classes: root flex column container
  [
    "group",
    "flex",
    "h-max",
    "w-full",
    "flex-col",
    "items-start",
    "justify-start",
    "gap-1.5",
  ],
  {
    variants: {},
    defaultVariants: {},
  }
);

/**
 * Non-CVA Defaults — props that affect behavior, not class composition.
 *
 * BOS BEHAVIORAL DEFAULTS:
 *
 * | Prop        | UUI default | BOS default | Reason for override |
 * | ----------- | ----------- | ----------- | ------------------- |
 * | `size`      | "sm"        | "sm"        | No change — UUI default matches BOS intent |
 *
 * No behavioral prop overrides needed for input at this time.
 */
export const INPUT_BEHAVIORAL_DEFAULTS = {
  size: "sm" as const,
} as const;

/**
 * TypeScript type for the input CVA function output.
 */
export type InputBaseDefaultsConfig = typeof inputBaseDefaults;
export type InputDefaultsConfig = typeof inputDefaults;

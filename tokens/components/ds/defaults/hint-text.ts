/**
 * BOS Defaults — HintText
 *
 * Wave 25 (Phase 6, PRD 016 task 6a): hint-text sub-primitive migration.
 *
 * HintText is a sub-component of the input primitive — it renders the
 * helper / error message slot below input fields. It has no class-producing
 * variants (no variant props). The CVA config here documents the base class
 * composition as the authoritative BOS default.
 *
 * TRANSFORM ANALYSIS:
 * Reviewing components/base/base/input/hint-text.tsx against the 4 transform rules:
 * 1. Motion: no duration/ease classes present — not applicable.
 * 2. Focus ring: no ring/outline classes present — not applicable.
 * 3. Disabled state: no disabled: modifier classes present — not applicable.
 * 4. Token syntax: uses `text-tertiary` and `text-error-primary` (Style 2 mapped
 *    classes) — already correct, no changes needed.
 *
 * The component uses React Aria's `<Text>` compound component. The devProps
 * is applied via `{...devProps('HintText')}` spread directly onto `<AriaText>`.
 * React Aria's `Text` is a slot-based compound that renders as a `<p>` or `<span>`
 * DOM element depending on context — devProps IS applied here (not a suppression
 * exception like TextField).
 *
 * @see components/base/base/input/hint-text.tsx — UUI source of truth (post-Phase 5)
 * @see ds/transforms/_history/hint-text.md — migration history
 * @see ds/_exceptions.md — exception ledger (no exception for hint-text)
 */

import { cva } from "class-variance-authority";

/**
 * CVA configuration for the HintText component defaults.
 *
 * HintText has no class-producing variants. The base class string documents
 * the BOS-intended default class composition for the hint text element.
 *
 * Error state is handled by the `isInvalid` prop internally (toggles
 * text-error-primary) — this is not a CVA variant because it maps to
 * a React Aria slot (`slot="errorMessage"`) rather than just a class.
 */
export const hintTextDefaults = cva(
  // Base classes: hint text default class composition (from hint-text.tsx)
  [
    "text-sm",
    "text-tertiary",
  ],
  {
    variants: {
      // No class-producing variants for hint-text.
    },
    defaultVariants: {
      // No class-producing defaultVariants.
    },
  }
);

/**
 * Non-CVA Defaults — props that affect behavior, not class composition.
 *
 * BOS BEHAVIORAL DEFAULTS:
 *
 * | Prop        | UUI default | BOS default | Reason for override |
 * | ----------- | ----------- | ----------- | ------------------- |
 * | `isInvalid` | undefined   | undefined   | No override — consumers set this explicitly |
 * | `slot`      | "description"| "description" | Default; "errorMessage" when isInvalid=true |
 *
 * No behavioral prop overrides needed for hint-text at this time.
 */
export const HINT_TEXT_BEHAVIORAL_DEFAULTS = {
  isInvalid: false,
} as const;

/**
 * TypeScript type for the hint-text CVA function output.
 */
export type HintTextDefaultsConfig = typeof hintTextDefaults;

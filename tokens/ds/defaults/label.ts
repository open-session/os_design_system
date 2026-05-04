/**
 * BOS Defaults — Label
 *
 * Wave 25 (Phase 6, PRD 016 task 6a): label sub-primitive migration.
 *
 * Label is a sub-component of the input primitive — it renders the field
 * label above input elements, with optional required asterisk and tooltip.
 * It has no class-producing variant props.
 *
 * TRANSFORM ANALYSIS:
 * Reviewing components/base/base/input/label.tsx against the 4 transform rules:
 * 1. Motion: `transition duration-standard` present at TooltipTrigger element.
 *    The original ds/input/label.tsx had `transition duration-200` (stale).
 *    Post-Phase 5 rename, components/base/base/input/label.tsx uses
 *    `duration-standard` (already transformed). Verified: no stale duration-200.
 * 2. Focus ring: no ring/outline classes present — not applicable.
 * 3. Disabled state: no disabled: modifier classes present — not applicable.
 * 4. Token syntax: uses `text-secondary`, `text-brand-tertiary`, `text-fg-quaternary`,
 *    `text-fg-quaternary_hover` (Style 2 mapped classes) — already correct.
 *
 * EXCEPTION NOTE:
 * The Label component uses React Aria's `<Label>` component as root. React Aria's
 * `Label` renders as a `<label>` DOM element — devProps IS applied here via
 * `{...devProps('Label')}` spread onto `<AriaLabel>`. This is NOT a suppression
 * exception (unlike TextField where the root is not a DOM element).
 *
 * @see components/base/base/input/label.tsx — UUI source of truth (post-Phase 5)
 * @see ds/transforms/_history/label.md — migration history
 * @see ds/_exceptions.md — exception ledger (no exception for label)
 */

import { cva } from "class-variance-authority";

/**
 * CVA configuration for the Label component defaults.
 *
 * Label has no class-producing variants. The base class string documents
 * the BOS-intended default class composition for the label element.
 */
export const labelDefaults = cva(
  // Base classes: label default class composition (from label.tsx)
  [
    "flex",
    "cursor-default",
    "items-center",
    "gap-0.5",
    "text-sm",
    "font-medium",
    "text-secondary",
  ],
  {
    variants: {
      // No class-producing variants for label.
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
 * | Prop                 | UUI default | BOS default  | Reason for override |
 * | -------------------- | ----------- | ------------ | ------------------- |
 * | `isRequired`         | undefined   | undefined    | No override — consumers set this explicitly |
 * | `tooltip`            | undefined   | undefined    | No override — consumers set this explicitly |
 * | `tooltipDescription` | undefined   | undefined    | No override |
 *
 * No behavioral prop overrides needed for label at this time.
 */
export const LABEL_BEHAVIORAL_DEFAULTS = {} as const;

/**
 * TypeScript type for the label CVA function output.
 */
export type LabelDefaultsConfig = typeof labelDefaults;

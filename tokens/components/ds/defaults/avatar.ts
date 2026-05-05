/**
 * BOS Defaults — Avatar
 *
 * Wave 27 (Phase 6, PRD 016 task 6c): avatar primitive migration.
 *
 * TRANSFORM ANALYSIS:
 * 1. Motion tokens (Rule 1): No duration/ease classes in avatar.tsx itself — not applicable.
 *    avatar-add-button.tsx had `duration-100 ease-linear` → `duration-micro ease-motion-out` (fixed in this wave).
 * 2. Focus ring (Rule 2): Not applicable — no ring-2/ring-offset-2 in avatar files.
 * 3. Disabled state (Rule 3): avatar-add-button.tsx had `disabled:border-gray-200 disabled:text-gray-200`
 *    → `disabled:border-border-disabled disabled:text-fg-disabled` (fixed in this wave).
 * 4. Token syntax (Rule 4): Not applicable — no Style 1 bracket notation.
 *
 * SEMANTIC TOKEN DECISION (bg-tertiary vs bg-avatar-bg):
 * `components/ds/avatar/avatar.tsx` used `bg-tertiary` for the avatar background.
 * `components/base/base/avatar/avatar.tsx` uses `bg-avatar-bg` (UUI's semantic token).
 *
 * This was an undocumented brand decision in the ds/ version — using `bg-tertiary`
 * (a generic background token) instead of `bg-avatar-bg` (a component-specific token).
 * The BOS decision is to ADOPT `bg-avatar-bg` (UUI's token), not preserve `bg-tertiary`.
 *
 * Rationale:
 * - `bg-avatar-bg` is semantically correct: it names the usage site (avatar background)
 *   rather than a generic visual level (tertiary surface)
 * - `bg-avatar-bg` resolves through the token system and supports dark mode correctly
 * - The visual difference is negligible — both resolve to the same background shade in
 *   light mode; `bg-avatar-bg` is the correct choice for maintainability
 * - This aligns with the "lean into UUI primitives" feedback (feedback_lean_into_uui.md)
 *
 * The pre-migration ds/ value (`bg-tertiary`) is recorded in ds/_history/avatar.md and
 * in ds/_exceptions.md for traceability. The migration intentionally adopts `bg-avatar-bg`.
 *
 * @see components/base/base/avatar/avatar.tsx — UUI source of truth (post-Phase 5)
 * @see components/base/base/avatar/base-components/avatar-add-button.tsx — disabled-state fix
 * @see ds/transforms/_history/avatar.md — migration history
 * @see ds/_exceptions.md — bg-tertiary semantic swap entry
 */

import { cva } from "class-variance-authority";

/**
 * CVA configuration for the Avatar component defaults.
 *
 * Avatar has one class-producing variant: `size` with values
 * "xxs", "xs", "sm", "md", "lg", "xl", "2xl".
 *
 * BOS default: size "sm" (matching UUI default).
 *
 * The background class `bg-avatar-bg` is the BOS-adopted default
 * (previously `bg-tertiary` in ds/avatar.tsx — corrected in this migration).
 */
export const avatarDefaults = cva(
  // Base classes: avatar root container defaults
  [
    "relative",
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-full",
    "bg-avatar-bg",
    "outline-transparent",
  ],
  {
    variants: {
      size: {
        xxs: ["size-5", "text-xs"],
        xs: ["size-6", "text-xs"],
        sm: ["size-8", "text-sm"],
        md: ["size-10", "text-base"],
        lg: ["size-12", "text-lg"],
        xl: ["size-14", "text-xl"],
        "2xl": ["size-16", "text-2xl"],
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

/**
 * CVA configuration for AvatarAddButton defaults.
 * Documents the post-transform class composition with disabled-state tokens.
 */
export const avatarAddButtonDefaults = cva(
  [
    "flex",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "rounded-full",
    "border",
    "border-dashed",
    "border-primary",
    "bg-primary",
    "text-fg-quaternary",
    "outline-focus-ring",
    "transition",
    "duration-micro",
    "ease-motion-out",
    "hover:bg-primary_hover",
    "hover:text-fg-quaternary_hover",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "disabled:border-border-disabled",
    "disabled:bg-secondary",
    "disabled:text-fg-disabled",
  ],
  {
    variants: {
      size: {
        xs: ["size-6"],
        sm: ["size-8"],
        md: ["size-10"],
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

/**
 * Non-CVA Defaults — props that affect behavior, not class composition.
 *
 * | Prop    | UUI default | BOS default | Reason for override |
 * | ------- | ----------- | ----------- | ------------------- |
 * | `size`  | "sm"        | "sm"        | No change |
 *
 * No behavioral prop overrides needed at this time.
 */
export const AVATAR_BEHAVIORAL_DEFAULTS = {
  size: "sm" as const,
} as const;

/**
 * TypeScript types.
 */
export type AvatarDefaultsConfig = typeof avatarDefaults;
export type AvatarAddButtonDefaultsConfig = typeof avatarAddButtonDefaults;

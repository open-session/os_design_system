/**
 * ds/defaults/button.ts
 * CVA defaults for Button and CloseButton primitives.
 *
 * Transform audit (4 axes):
 *   Rule 1 — Motion tokens:
 *     base/base/buttons/button.tsx: uses `duration-micro ease-motion-out` (applied in PRD 016)
 *     base/base/buttons/close-button.tsx: uses `duration-micro ease-motion-out` (applied in PRD 016)
 *   Rule 2 — Focus ring: uses `outline-brand focus-visible:outline-2 focus-visible:outline-offset-2` — BOS outline tokens.
 *   Rule 3 — Disabled state: `disabled:cursor-not-allowed disabled:opacity-50` — semantic tokens only.
 *   Rule 4 — Token syntax: all classes use Style 2 mapped tokens.
 *
 * BRAND DECISION (Decision #2 — 2026-04-23):
 *   The `primary` variant in base/base/buttons/button.tsx intentionally deviates from UUI's
 *   default orange CTA (bg-brand-solid text-white) and uses a neutral-secondary style instead:
 *     bg-bg-secondary text-fg-primary hover:bg-bg-brand-primary hover:text-fg-brand-primary
 *   This expresses BOS's "contained but calm" primary action pattern. Hover reveals brand accent.
 *   The UUI orange CTA is reserved for explicit high-contrast CTAs (e.g., onboarding).
 *   See ds/_exceptions.md "Button Primary Variant (Brand Default)" for full rationale.
 *
 *   W2 NOTE (2026-04-28):
 *   ds/buttons/button.tsx was the full BOS implementation — deleted in W2-8a.
 *   The brand override is now canonical in base/base/buttons/button.tsx (primary color variant).
 *   This defaults file documents the intent and provides behavioral defaults for consumers
 *   that need explicit defaults without specifying props.
 */

import { cva } from "class-variance-authority";

/**
 * Button common root — motion-token-corrected.
 */
export const buttonCommonDefaults = cva(
    "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap outline-brand transition duration-micro ease-motion-out before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
);

/**
 * Button primary — BOS brand override (neutral-secondary, NOT UUI orange).
 * Decision #2: BOS primary buttons are calm/contained by default.
 * Canonical implementation is in base/base/buttons/button.tsx primary color variant.
 */
export const buttonPrimaryDefaults = cva(
    "bg-bg-secondary text-fg-primary shadow-xs ring-1 ring-border-primary ring-inset hover:bg-bg-brand-primary hover:text-fg-brand-primary hover:ring-border-brand-solid disabled:opacity-50 disabled:shadow-xs *:data-icon:text-fg-tertiary hover:*:data-icon:text-fg-brand-primary",
);

/**
 * CloseButton root — motion-token-corrected.
 */
export const closeButtonDefaults = cva(
    "flex cursor-pointer items-center justify-center rounded-lg p-2 transition duration-micro ease-motion-out focus:outline-hidden",
    {
        variants: {
            size: {
                xs: "size-7",
                sm: "size-9",
                md: "size-10",
                lg: "size-11",
            },
            theme: {
                light: "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 outline-focus-ring",
                dark: "text-fg-white/70 hover:text-fg-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 outline-focus-ring",
            },
        },
        defaultVariants: {
            size: "sm",
            theme: "light",
        },
    },
);

export const BUTTON_BEHAVIORAL_DEFAULTS = {
    size: "sm" as const,
    color: "primary" as const,
};

/**
 * ds/defaults/badges.ts
 * CVA defaults for Badge, BadgeWithDot, BadgeWithIcon, BadgeWithFlag,
 * BadgeWithImage, BadgeWithButton, and BadgeIcon primitives.
 *
 * Transform audit (4 axes):
 *   Rule 1 — Motion tokens:
 *     ds/badges/badges.tsx BadgeWithButton inner button: `duration-100 ease-linear` → `duration-micro ease-motion-out` (Wave 31)
 *   Rule 2 — Focus ring: no ring-2 found. Uses `outline-focus-ring focus-visible:outline-2` — already correct BOS pattern.
 *   Rule 3 — Disabled state: no raw gray disabled tokens found in badge primitives.
 *   Rule 4 — Token syntax: all classes use Style 2 mapped tokens.
 *
 * BUG FIX (Wave 31):
 *   ds/badges/badges.tsx imported Dot from `@/components/ui/foundations/dot-icon` (wrong path).
 *   Corrected to `@/components/base/foundations/dot-icon` (post-Phase 5 canonical path).
 *
 * W2 NOTE (2026-04-28):
 * ds/badges/badges.tsx has been reduced to a thin re-export stub pointing to base/base/badges/badges.tsx.
 * base/badges/badges.tsx updated: XClose icon import corrected to @untitledui-pro/icons/line.
 * ds/badges/ folder intentionally retained — tabs.tsx still imports from it (W3-9a handles migration).
 * Folder deletion happens in W3-9c after 9a clears the last consumer import.
 */

import { cva } from "class-variance-authority";

/**
 * Badge — base pill/badge container.
 */
export const badgeDefaults = cva(
    "size-max flex items-center whitespace-nowrap ring-1 ring-inset",
    {
        variants: {
            shape: {
                pill: "rounded-full",
                badge: "rounded-md",
            },
            size: {
                sm: "py-0.5 px-2 text-xs font-medium",
                md: "py-0.5 px-2.5 text-sm font-medium",
                lg: "py-1 px-3 text-sm font-medium",
            },
        },
        defaultVariants: {
            shape: "pill",
            size: "md",
        },
    },
);

/**
 * BadgeWithButton inner button — motion token corrected.
 */
export const badgeButtonDefaults = cva(
    "flex cursor-pointer items-center justify-center p-0.5 outline-focus-ring transition duration-micro ease-motion-out focus-visible:outline-2",
    {
        variants: {
            shape: {
                pill: "rounded-full",
                badge: "rounded-[3px]",
            },
        },
        defaultVariants: {
            shape: "pill",
        },
    },
);

export const BADGE_BEHAVIORAL_DEFAULTS = {
    type: "pill-color" as const,
    size: "md" as const,
    color: "gray" as const,
};

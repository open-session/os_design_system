/**
 * ds/defaults/tags.ts
 * CVA defaults for TagCloseX primitive.
 *
 * Transform audit (5 axes — components/base/base/tags/base-components/tag-close-x.tsx):
 *   Rule 1 — Motion tokens:
 *     Original UUI: `duration-100 ease-linear` → applied as `duration-micro ease-motion-out` (already in base/base/tags).
 *   Rule 2 — Focus ring: no `ring-2 ring-offset-2` found. Uses `focus-visible:outline-2 focus-visible:outline-focus-ring` — already correct BOS pattern.
 *   Rule 3 — Disabled state: no raw gray disabled tokens found. Uses `disabled:cursor-not-allowed` — structural only, no color override needed.
 *   Rule 4 — Token syntax: all classes use Style 2 mapped tokens (no bracket syntax).
 *   Rule 5 — devProps: `{...devProps('TagCloseX')}` present on root AriaButton element.
 *
 * ORPHAN CONTEXT (Wave 32):
 *   components/ds/tags/ contained only tag-close-x (no parent Tag component — an orphan).
 *   The full UUI tags primitive was sourced as components/base/base/tags/ (contains tag-close-x only —
 *   UUI does not ship a parent Tag wrapper; tag-close-x IS the complete tags primitive).
 *   components/ds/tags/ deleted in this wave. Registry entry ds-tag-close-x removed.
 *
 * NOTE: TagCloseX uses React Aria's slot="remove" — this is a React Aria composability hook
 *   that must be preserved. CVA defaults do not override slot behavior.
 */

import { cva } from "class-variance-authority";

/**
 * TagCloseX — remove button for tag/chip composites.
 * React Aria slot="remove" preserved; do not override.
 */
export const tagCloseXDefaults = cva(
    "flex cursor-pointer rounded-[3px] text-fg-quaternary outline-transparent transition duration-micro ease-motion-out hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed",
    {
        variants: {
            size: {
                sm: "p-0.5",
                md: "p-0.5",
                lg: "p-0.75",
            },
        },
        defaultVariants: {
            size: "md",
        },
    },
);

export const tagCloseXIconDefaults = cva("transition-inherit-all", {
    variants: {
        size: {
            sm: "size-2.5",
            md: "size-3",
            lg: "size-3.5",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

export const TAG_CLOSE_X_BEHAVIORAL_DEFAULTS = {
    size: "md" as const,
};

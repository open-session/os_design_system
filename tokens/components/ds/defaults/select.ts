/**
 * ds/defaults/select.ts
 * CVA defaults for Select, ComboBox, NativeSelect, and TagSelect primitives.
 *
 * Transform audit (4 axes):
 *   Rule 1 — Motion tokens:
 *     combobox.tsx (ds/):  `duration-100 ease-linear` → `duration-micro ease-motion-out` (applied in Phase 5)
 *     select.tsx (ds/):    `duration-100 ease-linear` → `duration-micro ease-motion-out` (applied in Phase 5)
 *     tag-select.tsx:      `duration-micro ease-motion-out` already present (applied in Phase 5)
 *     Exception: `ease-out animate-in` in popover.tsx — compound class, Rule 1 does NOT apply
 *       (see ds/_exceptions.md: "ease-out animate-in compound class")
 *   Rule 2 — Focus ring:
 *     select-item.tsx:    `ring-2 ring-focus-ring ring-inset` → `ring-1 ring-focus-ring ring-inset` (Wave 28)
 *     select-native.tsx:  `focus-visible:ring-2` → `focus-visible:ring-1 focus-visible:shadow-focus-ring` (Wave 28)
 *   Rule 3 — Disabled state: no raw gray disabled tokens found in select primitives
 *   Rule 4 — Token syntax: all classes use Style 2 mapped tokens
 */

import { cva } from "class-variance-authority";

/**
 * SelectValue trigger button (the visible button that opens the dropdown).
 * Covers ring, shadow, and transition defaults.
 */
export const selectValueDefaults = cva(
    "relative flex w-full cursor-pointer items-center rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-micro ease-motion-out ring-inset",
    {
        variants: {
            state: {
                focused: "ring-1 ring-brand shadow-focus-ring-elevated",
                disabled: "cursor-not-allowed opacity-50",
            },
        },
    },
);

/**
 * ComboBoxValue / TagSelectTagsValue group wrapper.
 */
export const comboBoxValueDefaults = cva(
    "relative flex w-full items-center gap-2 rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition-shadow duration-micro ease-motion-out ring-inset",
    {
        variants: {
            state: {
                focused: "ring-1 ring-brand shadow-focus-ring-elevated",
                disabled: "cursor-not-allowed opacity-50",
            },
        },
    },
);

/**
 * SelectItem (list box item) — inner div sizing.
 */
export const selectItemDefaults = cva(
    "flex cursor-pointer items-center gap-2 rounded-md outline-hidden select-none",
    {
        variants: {
            size: {
                sm: "p-2 pr-2.5",
                md: "p-2.5 pl-2",
            },
            selected: {
                true: "bg-primary_hover",
            },
            focused: {
                true: "bg-primary_hover",
            },
            focusVisible: {
                true: "ring-1 ring-focus-ring ring-inset",
            },
            disabled: {
                true: "cursor-not-allowed",
            },
        },
        defaultVariants: {
            size: "sm",
        },
    },
);

/**
 * NativeSelect element.
 */
export const nativeSelectDefaults = cva(
    "appearance-none rounded-lg bg-primary px-3.5 py-2.5 text-md font-medium text-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-micro ease-motion-out ring-inset placeholder:text-fg-quaternary focus-visible:ring-1 focus-visible:shadow-focus-ring focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50",
);

export const SELECT_BEHAVIORAL_DEFAULTS = {
    size: "sm" as const,
    placeholder: "Select",
    comboBoxPlaceholder: "Search",
    shortcut: true,
};

/**
 * ds/defaults/textarea.ts
 * CVA defaults for TextAreaBase and TextArea primitives.
 *
 * Transform audit (4 axes):
 *   Rule 1 — Motion tokens:
 *     ds/textarea/textarea.tsx: `transition duration-100 ease-linear` → `transition duration-micro ease-motion-out`
 *     Applied in Phase 5 to base/base/textarea/textarea.tsx.
 *   Rule 2 — Focus ring:
 *     No ring-2 found in textarea primitives. Focus state uses shadow-focus-ring-elevated
 *     which is already the correct BOS pattern.
 *   Rule 3 — Disabled state: `cursor-not-allowed opacity-50` — no raw gray tokens found.
 *   Rule 4 — Token syntax: all classes use Style 2 mapped tokens.
 */

import { cva } from "class-variance-authority";

/**
 * TextAreaBase — the raw <textarea> element defaults.
 */
export const textAreaBaseDefaults = cva(
    "w-full scroll-py-3 rounded-lg bg-primary px-3.5 py-3 text-md text-primary shadow-xs ring-1 ring-primary transition duration-micro ease-motion-out ring-inset placeholder:text-placeholder autofill:rounded-lg autofill:text-primary focus:outline-hidden",
    {
        variants: {
            state: {
                focused: "ring-1 ring-brand shadow-focus-ring-elevated",
                disabled: "cursor-not-allowed opacity-50",
                invalid: "ring-error_subtle",
                invalidFocused: "ring-1 ring-error shadow-focus-ring-error-elevated",
            },
        },
    },
);

/**
 * TextArea wrapper (outer flex column).
 */
export const textAreaDefaults = cva(
    "group flex h-max w-full flex-col items-start justify-start gap-1.5",
);

export const TEXTAREA_BEHAVIORAL_DEFAULTS = {
    resize: "vertical" as const,
};

/**
 * BOS Defaults — Tooltip
 *
 * Proof-of-concept for the ds/defaults/ layer.
 * This file codifies BOS's intended default prop values for the Tooltip
 * primitive using CVA (class-variance-authority) defaultVariants.
 *
 * The "defaults layer" thesis: brand prop defaults are captured as data
 * in ds/defaults/, not hardcoded into a forked component. Future changes
 * to BOS defaults become a one-line edit here rather than a component fork.
 *
 * UUI COMPATIBILITY NOTE (from task 0f verification):
 * UUI does NOT use class-variance-authority (CVA) internally. The CVA layer
 * lives exclusively in ds/defaults/. There are no compatibility concerns
 * at the UUI layer — CVA configs here do not conflict with UUI internals.
 *
 * PHASE 1 FINDING:
 * components/ds/tooltip/tooltip.tsx is byte-identical to
 * components/uui/base/tooltip/tooltip.tsx. Zero BOS-specific transforms
 * were applied (no motion, focus-ring, disabled-state, or token-syntax
 * changes needed). This means BOS's intended defaults are exactly UUI's
 * own defaults — the CVA config below has minimal content, which is the
 * expected outcome for a byte-identical component proof-of-concept.
 *
 * @see components/uui/base/tooltip/tooltip.tsx — UUI source of truth
 * @see ds/transforms/motion.mdx — edge case: ease-out in animate-in compound
 * @see docs/spikes/design-system/2026-04-25-architecture-migration-phase1-findings.md — Phase 1 proof
 */

import { cva } from "class-variance-authority";

/**
 * CVA configuration for the Tooltip component defaults.
 *
 * VARIANT CLASSIFICATION:
 * The UUI Tooltip has one class-producing variant: placement affects which
 * directional slide animation class is applied via `isEntering`/`isExiting`
 * render-prop callbacks in the JSX. However, this animation composition
 * is internal to the component and not a CVA-addressable variant —
 * the classes are computed inside the render function, not passed as props.
 *
 * Therefore, the CVA config has no variants. The `base` class string
 * documents the BOS-intended default class composition for the tooltip
 * content container.
 *
 * For behavioral props (non-class), see the comment block below.
 */
export const tooltipDefaults = cva(
  // Base classes: the tooltip content container's default class composition
  // as confirmed in tooltip.tsx:71-74 (byte-identical to UUI source)
  [
    "z-50",
    "flex",
    "max-w-xs",
    "origin-(--trigger-anchor-point)",
    "flex-col",
    "items-start",
    "gap-1",
    "rounded-lg",
    "bg-primary-solid",
    "px-3",
    "shadow-lg",
    "will-change-transform",
  ],
  {
    variants: {
      // No class-producing variants for tooltip.
      // See non-CVA defaults comment below.
    },
    defaultVariants: {
      // No class-producing defaultVariants for tooltip.
      // The component's behavioral defaults are documented below.
    },
  }
);

/**
 * Non-CVA Defaults — props that affect behavior, not class composition.
 *
 * CVA's variants and defaultVariants work on string-keyed variant maps
 * that produce class strings. Props that are behavioral (number, boolean,
 * positional union) cannot be expressed as CVA variants. They are
 * documented here as BOS-intended defaults for reference by task 4b
 * (the wrapper component that applies these defaults via prop forwarding).
 *
 * BOS BEHAVIORAL DEFAULTS:
 *
 * | Prop        | UUI default | BOS default | Reason for override |
 * | ----------- | ----------- | ----------- | ------------------- |
 * | `delay`     | 300         | 300         | No change — UUI default matches BOS intent |
 * | `closeDelay`| 0           | 0           | No change |
 * | `placement` | "top"       | "top"       | No change |
 * | `offset`    | 6           | 6           | No change |
 * | `arrow`     | false       | false       | No change — BOS does not use arrows by default |
 *
 * Since tooltip was byte-identical to UUI in Phase 1, BOS has no prop
 * overrides for behavioral defaults at this time. The wrapper in task 4b
 * will forward props without modification, but this file documents the
 * intended canonical state.
 *
 * If BOS decides to change a behavioral default in the future (e.g.,
 * delay to 200ms), update this comment block AND the wrapper in
 * components/ds/tooltip/tooltip.tsx — both must stay in sync.
 */
export const TOOLTIP_BEHAVIORAL_DEFAULTS = {
  delay: 300,
  closeDelay: 0,
  placement: "top",
  offset: 6,
  arrow: false,
} as const;

/**
 * TypeScript type for the tooltip CVA function output.
 * Task 4b imports both `tooltipDefaults` and this type for type-safe usage.
 */
export type TooltipDefaultsConfig = typeof tooltipDefaults;

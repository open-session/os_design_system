"use client";

/**
 * BOS Tooltip — 5th canonical ds/ wrapper.
 *
 * @upstream-base components/base/base/tooltip/tooltip.tsx (vendor-pristine UUI source)
 * @prd design-system-final-migration (PRD 020, Wave 2, task 2a)
 *
 * Architecture decision: this is Shape A (behavioral defaults only). The vendor Tooltip
 * is imported from the vendor-pristine path and re-exported with BOS behavioral defaults
 * applied via prop forwarding. No forking — BOS deltas live here, vendor source stays in
 * base/base/tooltip/.
 *
 * Dependency direction: ds/ → base/ (correct). Never base/ → ds/.
 * This fixes the latent violation in base/base/tooltip/with-defaults.tsx which imported
 * from @/components/ds/defaults/tooltip (ds/ → base/, arrow inverted).
 *
 * CVA upgrade path (when Tooltip grows variants): if BOS needs to add visual variants
 * (size, color, etc.), migrate to cva({ variants, defaultVariants }) at that point.
 * Today's behavioral-defaults-only approach avoids speculative refactoring.
 * See components/ds/_wrapper-template.md for the Shape A → Shape B upgrade path.
 *
 * Consumer entry point: `import { Tooltip, TooltipTrigger } from '@/components/base'`
 * The barrel (components/base/index.ts) re-exports from this file after Wave 2c.
 *
 * devProps note: the vendor Tooltip already applies {...devProps('Tooltip')} to
 * its <AriaTooltipTrigger> root. This wrapper delegates to the base component,
 * so devProps instrumentation is inherited. Double-applying devProps would create
 * duplicate data-component attributes — intentionally avoided here per ds/_exceptions.md §React Aria.
 */

// Re-export everything from the vendor-pristine base tooltip (types, TooltipTrigger, etc.)
// so consumers have a single import surface that covers both the wrapper and all related types.
export * from "@/components/base/base/tooltip/tooltip";

// Import the vendor-pristine Tooltip to wrap it.
// Note: we import from base/base/tooltip/tooltip (the UUI source), NOT from with-defaults.
// This is the correct dependency direction for ds/ wrappers.
import { Tooltip as BaseTooltip } from "@/components/base/base/tooltip/tooltip";
import { TOOLTIP_BEHAVIORAL_DEFAULTS } from "@/components/ds/defaults/tooltip";
import type { ComponentProps } from "react";

type TooltipBaseProps = ComponentProps<typeof BaseTooltip>;

/**
 * BOS Tooltip — wraps the UUI base Tooltip with BOS behavioral defaults from ds/defaults/tooltip.ts.
 *
 * Today, BOS defaults equal UUI defaults (see ds/defaults/tooltip.ts for the verification).
 * The wrapper exists for dependency-direction correctness and to ensure future default
 * divergences land in one place.
 *
 * Consumer props override defaults via spread order:
 *   BaseTooltip is rendered with bosDefaults applied first, then consumer props.
 *   If a consumer passes delay={500}, the BOS default (300ms) is overridden.
 */
// eslint-disable-next-line bos-local/require-dev-props -- React Aria TooltipTrigger root: devProps flows through to BaseTooltip which applies it to AriaTooltipTrigger. Double-applying devProps on this wrapper creates duplicate data-component attributes. See ds/_exceptions.md §React Aria.
export function Tooltip(props: TooltipBaseProps) {
  return (
    <BaseTooltip
      delay={TOOLTIP_BEHAVIORAL_DEFAULTS.delay}
      closeDelay={TOOLTIP_BEHAVIORAL_DEFAULTS.closeDelay}
      placement={TOOLTIP_BEHAVIORAL_DEFAULTS.placement}
      offset={TOOLTIP_BEHAVIORAL_DEFAULTS.offset}
      arrow={TOOLTIP_BEHAVIORAL_DEFAULTS.arrow}
      {...props}
    />
  );
}

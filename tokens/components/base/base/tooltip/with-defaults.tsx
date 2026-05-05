"use client";

/**
 * BOS Tooltip Wrapper — applies ds/defaults/ layer to the UUI base Tooltip.
 *
 * Pattern established here (Phase 4, PRD 016 task 4b) is replicated in Phase 6
 * for all 7 remaining primitives: button, input, select, checkbox, toggle, avatar, badge.
 *
 * Architecture notes:
 * - This wrapper imports `tooltipDefaults` and `TOOLTIP_BEHAVIORAL_DEFAULTS` from
 *   `ds/defaults/tooltip.ts` (the CVA spec authored in task 4a).
 * - Since tooltip is byte-identical to UUI in Phase 1 (zero BOS-specific transforms),
 *   `tooltipDefaults` has empty variants — the CVA call produces no class string.
 *   The behavioral defaults also match UUI's own defaults exactly.
 * - The primary purpose of this wrapper is to ESTABLISH THE PATTERN: in Phase 6,
 *   when a primitive has real default overrides, this wrapper is the correct place
 *   to apply them without forking the UUI source file.
 *
 * Import path note:
 * - `@/components/ds/defaults/tooltip` resolves via tsconfig `@/*: "./*"` to
 *   `components/ds/defaults/tooltip.ts`. Updated in PRD 017 task 7b when root
 *   `ds/` was merged into `components/ds/`.
 *
 * devProps note:
 * - The base UUI `Tooltip` (imported below) already applies `devProps('Tooltip')` to
 *   its `<AriaTooltipTrigger>` root. The wrapper delegates to the base component, so
 *   devProps instrumentation is inherited. Double-applying devProps would create
 *   duplicate `data-component` attributes and is intentionally avoided here.
 *   See `ds/_exceptions.md` §React Aria for the general pattern.
 *
 * @see components/ds/defaults/tooltip.ts — CVA spec (authored in task 4a)
 * @see components/ds/tooltip/tooltip.tsx — barrel re-export (converted in task 4b)
 * @see .karimo/prds/016_design-system-architecture-revamp/artifacts/phase-4-tooltip-defaults.md
 */

import { TOOLTIP_BEHAVIORAL_DEFAULTS } from "@/components/ds/defaults/tooltip";

// Re-export everything from the base tooltip (types, TooltipTrigger, etc.)
export * from "./tooltip";

// Import the base Tooltip to wrap it
import { Tooltip as BaseTooltip } from "./tooltip";
import type { ComponentProps } from "react";

type TooltipBaseProps = ComponentProps<typeof BaseTooltip>;

/**
 * BOS Tooltip — wraps the UUI base Tooltip with ds/defaults/ behavioral defaults.
 *
 * Consumer props override defaults via spread order:
 *   `<BaseTooltip {...bosDefaults} {...props} />`
 *
 * This means: if a consumer passes `delay={500}`, the BOS default (300ms) is
 * overridden. If no `delay` is passed, the BOS default applies.
 */
// eslint-disable-next-line bos-local/require-dev-props -- React Aria TooltipTrigger root: devProps flows through to BaseTooltip which applies it to the AriaTooltipTrigger compound root. Double-applying devProps on this wrapper would create duplicate data-component attributes. See ds/_exceptions.md §React Aria.
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

export default Tooltip;

# Layer 4 Wrapper Template

> Wrappers live at `components/ds/<primitive>/<primitive>.tsx`. They lift BOS brand-variant overrides OUT of `components/base/`, leaving `base/` as pristine vendor source that survives `bun run uui:add <name>` re-pulls without manual archaeology.

## Why wrappers exist

The `components/base/` layer is **vendor source**: when an engineer runs `bun run uui:add button` (or the legacy `npx untitledui@latest add button`), the file is regenerated from upstream UUI Pro. Any BOS brand-variant override hand-baked inside `base/` will be silently overwritten on that regeneration.

Phase B's contract: `base/<primitive>/<primitive>.tsx` reflects upstream UUI **after** the 5-axis mechanical transforms (motion, focus-ring, disabled-state, token-syntax, devProps — applied by `scripts/uui-apply-transformations.ts`). Anything beyond mechanical — a redefined CVA arm, a forked color variant, a re-shaped sizing scale — belongs in a `ds/` wrapper.

## When to write a wrapper (decision tree)

```
Diff `base/<primitive>/<primitive>.tsx` against a fresh `npx untitledui@latest add <primitive>` pull.
│
├── No deltas (or mechanical-only) → no wrapper. Done.
│
├── Single-token swap where the BOS token name = UUI-native token name with re-defined value in brand.css
│   (e.g., `text-fg-secondary`, `--ring-brand`, `bg-avatar-bg`)
│   → no wrapper. The brand value lives in brand.css; the vendor file is correct.
│
├── CVA-based primitive whose `cva()` ARMS are redefined (variant strings differ)
│   → Shape B wrapper: re-create the cva() call in ds/ with overridden arms.
│     base/<primitive>/<primitive>.tsx imports the wrapper's cva config.
│
├── Object-style (`sortCx`, plain object) primitive whose styles object has STRUCTURAL deltas
│   (multiple variant keys redefined, sizing scale shifted, behavior changed)
│   → Shape C wrapper: full fork. Copy the file into ds/, restore upstream tokens in base/.
│
└── Primitive whose only delta is BEHAVIORAL DEFAULTS (placement, delay, size default — no class deltas)
    → Shape A wrapper: spread `*_BEHAVIORAL_DEFAULTS` from `ds/defaults/<primitive>.ts`
      (mirror the established `components/base/base/tooltip/with-defaults.tsx` pattern).
```

## Shape A — Behavioral defaults

Use when the primitive's CVA / styles object is byte-identical to upstream and the only BOS deltas are non-class default props (e.g., `delay={300}`, `placement="top"`).

**Canonical example:** `components/base/base/tooltip/with-defaults.tsx`. Lives inside `base/<primitive>/with-defaults.tsx` (not `ds/`) because there are no class-level deltas to lift out — only a behavioral spread.

**Barrel re-export:** `components/base/index.ts` exports from `with-defaults.tsx`:

```ts
export { Tooltip, TooltipTrigger } from './base/tooltip/with-defaults';
```

## Shape B — CVA variant override

Use when the primitive uses `cva()` and one or more variant arms have been redefined to express BOS brand semantics.

**Layout:**

- `components/base/base/<primitive>/<primitive>.tsx` — pristine UUI vendor source (cva uses upstream tokens).
- `components/ds/<primitive>/<primitive>.tsx` — re-creates the cva config with overridden arms; re-exports the BOS-branded component.
- `components/base/index.ts` — barrel re-export points at `@/components/ds/<primitive>/<primitive>`.

**Why re-create instead of spread?** CVA does not support spread-based variant override — `{ ...uuiCva, variants: { ...uuiCva.variants } }` clobbers the arm bindings. The wrapper has to call `cva()` again with the overridden arm values.

**Sketch:**

```tsx
'use client';
import { cva } from 'class-variance-authority';
import { ButtonBase } from '@/components/base/base/buttons/button-base'; // un-styled vendor logic
import type { ComponentProps } from 'react';

/**
 * BOS Button — recreates the cva config with brand-overridden variant arms.
 *
 * Wrapper shape: B (CVA variant override).
 * Brand decisions: see ds/_history/button.md.
 * Upstream parity: structural skeleton matches base/<primitive>/<primitive>.tsx;
 * only the variant arm strings differ.
 */
const bosButtonStyles = cva('base-classes-from-upstream', {
  variants: {
    color: {
      primary: 'bg-bg-secondary text-fg-primary ...', // BOS calm/contained primary
      secondary: '...', // typically matches upstream
    },
    size: { xs: '...', sm: '...', md: '...' },
  },
  defaultVariants: { color: 'primary', size: 'sm' },
});

export function Button(props: ComponentProps<typeof ButtonBase>) {
  return (
    <ButtonBase {...props} className={bosButtonStyles({ color: props.color, size: props.size })} />
  );
}
```

In practice, the existing UUI primitives don't always export an "un-styled base"; this is usually Shape C territory (full fork) instead.

## Shape C — Full fork

Use when the primitive uses an object-style `sortCx` / plain `styles` constant AND the BOS deltas span multiple keys (variant redefinition + sizing scale + disabled-state additions + variant-key-ordering differences).

**This is the most common shape for Layer-4 primitives in BOS.** The vendor file uses module-scope `styles`, not props; a runtime override would require either monkey-patching or re-implementing the component. Forking is cleaner and survives re-pulls predictably.

**Layout:**

- `components/base/base/<primitive>/<primitive>.tsx` — pristine UUI vendor source (after 5-axis mechanical transforms).
- `components/ds/<primitive>/<primitive>.tsx` — full copy of the file, with the BOS `styles` object and any structural overrides. Re-exports types from base.
- `components/base/index.ts` — barrel re-export points at `@/components/ds/<primitive>/<primitive>`.

**Trade-off:** Duplication. The two files share most of the JSX skeleton. But:

- Diffing the fork against `base/` after a re-pull makes the brand delta explicit — no silent drift.
- Vendor-survival is automatic: re-pulling `base/<primitive>/<primitive>.tsx` doesn't touch `ds/<primitive>/<primitive>.tsx`.
- Upstream skeleton changes (new variants, refactors) are caught when an engineer next diffs the fork — surfaced as a brand-decision moment, not silent overwrite.

**Sketch:**

```tsx
'use client';
// components/ds/buttons/button.tsx — Wrapper shape: C (full fork).
//
// Brand decisions:
//   - primary variant: neutral-secondary (Decision #2, ds/_exceptions.md)
//   - xs size: shrunk vs upstream UUI (smaller padding/text)
//   - linkRoot: drops UUI's underline-offset additions
//   - several disabled-state classes added across destructive variants
// See ds/_history/button.md for the round-trip history.

import type {} from /* ... */ 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { cx, sortCx } from '@/utils/cx';
import { devProps } from '@/lib/utils/dev-props';

// Re-export types from base — type contract is shared with vendor source.
export type { CommonProps, ButtonProps, Props } from '@/components/ds/buttons/button';

// BOS-branded styles — diverges from base/buttons/button.tsx in:
//   - colors.primary.root (Decision #2)
//   - sizes.xs (smaller text/padding)
//   - sizes.{sm,md,lg,xl}.linkRoot (no underline-offset additions)
//   - colors.{primary-destructive,secondary-destructive}.root (added disabled states)
export const styles = sortCx({
  /* ... full BOS styles object ... */
});

export const Button = (
  {
    /* ...props */
  }
) => {
  // JSX body identical to base/; only `styles` lookup differs.
};
```

## Per-wrapper documentation requirements

Every wrapper file MUST include, at the top of the file:

1. **Wrapper shape declaration** in JSDoc: `Wrapper shape: A | B | C`.
2. **Pointer to `_history/<primitive>.md`** — the round-trip decision log.
3. **Brand-decision callout** — one line per delta, naming what differs from upstream.
4. **Pointer to upstream**: `// @upstream-base components/base/base/<primitive>/<primitive>.tsx`.

The audit row in `docs/audits/2026-05/009-layer4-primitive-classification.md` MUST be updated to point at the wrapper file with `Status: Resolved — wrapper at ds/<primitive>/<primitive>.tsx (Shape <A|B|C>)`.

## Migration checklist (per primitive)

1. **Pull upstream:** `npx untitledui@latest add <primitive> --path /tmp/uui-fresh-<primitive>`
2. **Diff:** `diff /tmp/uui-fresh-<primitive>/base/<path>/<file>.tsx components/base/base/<path>/<file>.tsx`
3. **Triage:**
   - Mechanical-only deltas → no wrapper, but verify the codemod would re-apply on re-pull. Skip.
   - Token-name-only deltas (UUI-native names whose values BOS overrides via brand.css) → no wrapper, leave file as-is. Reclassify in audit.
   - Structural deltas → wrapper required; pick Shape A / B / C per decision tree.
4. **Author wrapper:** copy/refactor into `ds/<primitive>/<primitive>.tsx`. Apply documentation requirements above.
5. **Restore upstream in base/:** for Shape C, replace the BOS-overridden chunks with the upstream pull's content. Re-apply the 5-axis mechanical transforms (motion, focus-ring, disabled-state, token-syntax, devProps) — manually for now, automatically once `bun run uui:add` is wired in B3.
6. **Update barrel:** `components/base/index.ts` — change the export from `./base/<path>/<file>` to `@/components/ds/<primitive>/<primitive>`.
7. **Audit + history:** update `docs/audits/2026-05/009-layer4-primitive-classification.md` row; append `ds/_history/<primitive>.md` round-trip entry; update `_exceptions.md` if applicable.
8. **Validate:** `bun run typecheck && bun run lint && bun run build`. Storybook stories render visually identical.
9. **Cleanup:** `rm -rf /tmp/uui-fresh-<primitive>`.

## Reference files

- **Storybook (canonical, browsable):** Design System → Wrapper Template
- [`components/ds/wrapper-template.mdx`](./wrapper-template.mdx) — Storybook-discoverable version of this doc (PRD 020 Wave 4c, published)
- `components/base/base/tooltip/with-defaults.tsx` — Shape A canonical example.
- `components/ds/_exceptions.md` — documents true brand decisions (Button #2, Avatar token swap, React Aria limitations).
- `components/ds/_history/<primitive>.md` — per-primitive decision log (immutable; append-only).
- `docs/audits/2026-05/009-layer4-primitive-classification.md` — full inventory.
- `docs/spikes/design-system/2026-05-05-vision-internal-external.md` §3.2.1 — wrapper architectural intent.

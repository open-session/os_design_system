# Vendor-Swap Guide: Replacing the Primitive Layer in `components/base/`

> **Status:** Documentation only. Reference for any future engineer (or PRD) that
> needs to swap UUI Pro for an alternate vendor design system. The
> proof-of-concept implementation is scoped to PRD 018
> (Brand-OS Marketplace + Vendor-Swap POC).

---

## Overview

The BOS three-folder architecture (`base/`, `custom/`, `ds/`) is intentionally
designed so the vendor design system in `base/` can be replaced without
touching product code in `custom/` or the brand spec in `ds/`. The principle:

- **`components/base/`** — vendor primitives. The ONLY layer that changes in a swap.
- **`components/ds/`** — BOS formula spec (brand tokens, transform rules, defaults). Vendor-agnostic.
- **`components/custom/`** — product compositions. Import from `base/` via
  `@/components/base/...`. Component callsites only change if the new vendor's
  component API is incompatible.

A vendor swap replaces the contents of `components/base/` with a new vendor's
source files, then applies the four transform rules from
`components/ds/transforms/` to align the new vendor's conventions with BOS
brand tokens. The `components/ds/defaults/` files re-wire CVA defaults to the
new vendor's variant API where applicable.

---

## What Changes vs What Stays

| Layer                                                      | Changes in a swap?                                     | Why                                                                        |
| ---------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `components/base/`                                         | **YES** — replace ~95 vendor source files              | This is the vendor layer                                                   |
| `components/ds/transforms/`                                | NO — formula rules are vendor-agnostic                 | Each rule (motion, focus ring, disabled, token syntax) applies universally |
| `components/ds/defaults/`                                  | Minimal — re-wire CVA `defaultVariants` for new vendor | Only changes if vendor's variant API differs                               |
| `components/ds/brand.css`                                  | NO — brand tokens are semantic CSS variables           | Not vendor-specific                                                        |
| `components/ds/{motion,shape,accessibility,code-quality}/` | NO — formula categories                                | Vendor-agnostic spec                                                       |
| `components/custom/` (~244 files)                          | Minimal — only if vendor's component API changes       | Import paths stay `@/components/base/...`                                  |
| `app/` (route files)                                       | NO — product code goes through `custom/`               | No direct vendor imports in pages                                          |

---

## Pre-Swap Checklist

Before starting a swap, confirm:

1. **All product code routes through `components/custom/`** — no direct
   `@/components/base/` imports outside the spec layer. (Verified by ESLint
   `no-restricted-imports` drift guard at error level.)
2. **Drift guard is locked at error-level** in `eslint.config.mjs` and
   `.githooks/check-components-folders.sh`. The three-folder rule must hold
   before, during, and after the swap.
3. **A `git checkout -b vendor-swap-poc` branch is open** — the swap should
   never land directly on `main`.
4. **Storybook builds clean** on the pre-swap state — the post-swap Storybook
   build is the primary visual-regression check.
5. **PRD 018 (or successor) is the owning workstream** — this guide does not
   itself authorize a swap.

---

## Step-by-Step Procedure

### 1. Replace the primitive layer

Replace `components/base/` contents with the new vendor's primitives.

**For shadcn/ui:**

```bash
# shadcn defaults to components/ui/ — point at components/base/ instead.
# (Note: components/ui/ would re-create the legacy folder; PRD 017 deleted it,
# so shadcn output must land at components/base/ to keep the three-folder rule.)
npx shadcn@latest init
# Then for each primitive needed:
npx shadcn@latest add button --path components/base/base/buttons
npx shadcn@latest add input --path components/base/base/input
# ... etc for each primitive in PRD 017's base/ inventory
```

**For Radix UI primitives:** install packages (`@radix-ui/react-dialog`,
`@radix-ui/react-tabs`, etc.) and create thin wrappers in
`components/base/base/<primitive>/<primitive>.tsx`. Each wrapper composes Radix
primitives with BOS brand tokens via `cx()`.

**For DaisyUI:** install `daisyui` Tailwind plugin and create
Tailwind-class-based wrappers in `components/base/`.

### 2. Apply `components/ds/transforms/` rules to the new vendor sources

The four transform rules (see `docs/design-system/uui-transformation-rules.md`)
align any vendor's stock conventions with BOS brand tokens:

1. **Motion** (`components/ds/motion/`) — replace stock durations
   (`duration-200`) with BOS motion tokens (`duration-micro`,
   `ease-motion-out`, `ease-motion-inout`).
2. **Focus ring** (`components/ds/shape/`) — replace `ring-2 ring-offset-2`
   with `ring-1 shadow-focus-ring`; replace `ring-brand-500/30` with semantic
   `ring-ring-brand`.
3. **Disabled state** (`components/ds/accessibility/`) — replace raw
   `bg-gray-100 text-gray-400` with semantic `disabled:bg-bg-disabled_subtle`
   and other BOS v8 tokens.
4. **Token syntax** (`components/ds/code-quality/`) — always use Style 2
   mapped classes (`bg-bg-primary`), never CSS-var brackets
   (`bg-[var(--bg-primary)]`).

These rules are file-by-file edits applied during or after step 1. The PRD 017
`components/ds/_history/` archive contains examples of how the same rules were
applied to UUI Pro sources in PRD 016 + PRD 017.

### 3. Re-wire CVA defaults in `components/ds/defaults/`

The 10 files in `components/ds/defaults/` (avatar, badges, button, hint-text,
input, label, select, tags, textarea, tooltip) inject brand `defaultVariants`
into vendor components without forking them.

For each file: open the corresponding vendor primitive in the new
`components/base/`, identify the variant API, and update the `defaults/<name>.ts`
file to use the new variant names. If the new vendor uses a different pattern
than CVA (e.g., shadcn's `class-variance-authority` is the same; Radix uses
data attributes; DaisyUI uses utility classes), restructure the defaults file
accordingly.

### 4. Update product callsites if the vendor API changed

```bash
# Map all product imports of base/ primitives:
grep -rn "@/components/base/" components/custom/ app/ --include="*.tsx" --include="*.ts"

# For each callsite, verify the new vendor's component API matches the old.
# Likely mismatches: prop names (e.g., `variant` vs `intent`), children types,
# render-prop signatures.
```

Component API compatibility is a swap risk that scales with API surface size.
For a fully API-compatible vendor, this step is a no-op. For a vendor with
different prop names, this step is a search-and-replace (or codemod) per
primitive.

### 5. Run the drift guards

```bash
# ESLint at error-level — confirms no legacy import paths regressed:
bun run lint

# Three-folder rule — components/ must contain exactly base/, custom/, ds/:
bash .githooks/check-components-folders.sh
# Expected output: "✓ Three-folder check: OK (base, custom, ds)"

# devProps coverage — root elements still have data-component attributes:
bun run lint 2>&1 | grep "bos-local/require-dev-props" | head
```

### 6. Smoke test

```bash
bun run typecheck
bun run build  # must pass — TypeScript compile + production bundle
bun run test:run

# Storybook (primary visual-regression check):
bun run storybook:build
bunx test-storybook

# Manual: bun dev — visit key routes and verify shell renders:
#   /, /home, /chat, /brain, /brand-hub, /spaces, /projects, /account
```

### 7. Lighthouse + bundle baseline comparison

Compare against the post-PRD-017 baseline in
`.karimo/prds/017_design-system-architecture-revamp-part-2/metrics.md`. Any
performance regression > 10% is a blocker — investigate root cause before
merging the swap.

---

## The Four Transform Rules (Reference)

For full details and code examples, see:

- **Motion** — `components/ds/motion/`
- **Focus ring / shape** — `components/ds/shape/`
- **Accessibility / disabled state** — `components/ds/accessibility/`
- **Code-quality / token syntax** — `components/ds/code-quality/`
- **Source spec** — `docs/design-system/uui-transformation-rules.md`

These four rules turn ANY vendor's primitives into BOS-branded primitives.
They are the structural reason why a vendor swap is feasible — they encode
the brand delta as a small, declarative formula instead of forked source files.

---

## CVA Defaults Wiring (Reference)

`components/ds/defaults/` is the layer that injects brand preferences into
vendor components without forking them. Each file in `defaults/` exports a
`defaultVariants` object that is spread into the vendor component's `cva()`
config (or equivalent variant API). Pattern:

```ts
// components/ds/defaults/button.ts
export const buttonBrandDefaults = {
  defaultVariants: {
    variant: 'primary' as const,
    size: 'md' as const,
  },
};

// components/base/base/buttons/button.tsx (vendor source — receives defaults)
import { buttonBrandDefaults } from '@/components/ds/defaults/button';

const buttonVariants = cva(['inline-flex', 'items-center' /* ... */], {
  variants: {
    /* vendor-defined */
  },
  ...buttonBrandDefaults, // brand defaults injected here
});
```

In a vendor swap, the `defaults/` files stay; only the `import` site in the
new vendor's `base/` source needs to be wired.

---

## Estimated Scope

Based on PRD 017 final state (post-W10):

| Layer                | Files (count)         | Expected change in a swap               |
| -------------------- | --------------------- | --------------------------------------- |
| `components/base/`   | ~95 vendor primitives | Replace all                             |
| `components/custom/` | ~244 product files    | 0–10% touched (depends on vendor API)   |
| `components/ds/`     | ~32 spec files        | `defaults/` re-wired (10 files); rest 0 |
| `app/`               | route files           | 0 changes                               |

**Effort estimate** (research-grade, refine in PRD 018):

- Compatible vendor (shadcn/ui — also CVA-based): ~3–5 days for primitives
  - ~1 day for product callsite verification.
- Less-compatible vendor (DaisyUI — different convention): ~1–2 weeks
  including codemods for product callsites.
- Pure primitive vendor (Radix UI raw): ~1 week for wrappers + ~3 days for
  Storybook coverage rebuild.

---

## POC Implementation

This guide describes the procedure. The proof-of-concept implementation —
replacing UUI Pro with shadcn/ui in a branch and validating zero regression
against the PRD 017 baseline — is scoped to:

**PRD 018 — Brand-OS Marketplace + Vendor-Swap POC**

See `.karimo/prds/018_brand-os-marketplace-vendor-swap/` for the PRD stub
and research tracks (13a Settings > Theme runtime swap, 13b
`@opensession/brand-os` shadcn POC).

---

## References

- [`components/README.md`](../README.md) — three-folder decision tree
- [`components/ds/README.md`](./README.md) — formula spec architecture
- [`components/custom/README.md`](../custom/README.md) — pages-vs-shared taxonomy
- [`docs/design-system/uui-transformation-rules.md`](../../docs/design-system/uui-transformation-rules.md) — the four transform rules
- [`docs/spikes/ds-architecture-migration.md`](../../docs/spikes/ds-architecture-migration.md) — the spike that informed PRD 016/017
- [`.karimo/prds/017_design-system-architecture-revamp-part-2/`](../../.karimo/prds/017_design-system-architecture-revamp-part-2/) — PRD 017 artifacts

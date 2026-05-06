# components/ds/ — Formula Spec Layer

`ds/` is the **formula layer** of the three-folder architecture. It contains rules, tokens, and wiring — not component implementations. Nothing in `ds/` is application code; it governs how `components/base/` primitives are tuned to express the BOS brand.

Three-folder rule: `base/` (vendor primitives) · `custom/` (product compositions) · `ds/` (formula spec)

---

## Formula Categories

Transform rules are organized into four formula-category subfolders. Each subfolder represents a distinct design dimension:

| Category         | Scope                                           | Current files                          |
| ---------------- | ----------------------------------------------- | -------------------------------------- |
| `motion/`        | Duration, easing, transitions, animation tokens | `motion.mdx`                           |
| `shape/`         | Radius, border, border-width tokens             | `shape.mdx`                            |
| `accessibility/` | Focus rings, ARIA patterns, keyboard rules      | `focus-ring.mdx`, `disabled-state.mdx` |
| `code-quality/`  | devProps, naming, imports, Tailwind conventions | `token-syntax.mdx`                     |

The four MDX transform rules were previously in `transforms/` (now a redirect stub). Use the category folders directly.

---

## Root Contents

| Item                   | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| `brand.css`            | `@theme` token definitions — single source of truth for all CSS custom properties |
| `defaults/`            | CVA `defaultVariants` wiring per primitive — one `.ts` file per component         |
| `_history/`            | Decision log — immutable record of brand-override decisions per component         |
| `_exceptions.md`       | Component-specific deviations not expressible as universal rules                  |
| `_wrapper-template.md` | How to write a Layer-4 wrapper (decision tree, three shapes, migration checklist) |
| `_swap-guide.md`       | Vendor-swap procedure — replacing the primitive layer in `components/base/`       |
| `transforms/`          | Deprecated redirect stub — points to the category folders above                   |
| `<primitive>/`         | Layer-4 wrappers (one folder per primitive that diverges structurally from UUI)   |

---

## Layer 4 wrappers

`ds/<primitive>/<primitive>.tsx` files contain BOS brand-variant overrides that have been **lifted out of `components/base/`** so the vendor file can be re-pulled (`bun run uui:add <name>`) without losing brand customizations. See [`_wrapper-template.md`](./_wrapper-template.md) for the decision tree (when to wrap), the three shapes (A behavioral, B cva-override, C full-fork), and the per-primitive migration checklist.

The audit at [`docs/audits/2026-05/009-layer4-primitive-classification.md`](../../docs/audits/2026-05/009-layer4-primitive-classification.md) inventories which primitives need wrappers; each row is updated with the wrapper path and shape on resolution.

---

## Canonical UUI update flow

`bun run uui:add <name>` is the supported way to add or update a UUI Pro primitive. The pipeline:

1. Snapshots host files the UUI CLI is known to mutate (`package.json`, `bun.lock`, `utils/is-react-component.ts`, `hooks/use-resize-observer.ts`).
2. Stages `npx untitledui@latest add <name> --path /tmp/...`.
3. Copies new files into `components/base/`, sidecars existing files as `<name>.tsx.uui-fresh` (gitignored).
4. Applies the 5-axis transforms via `scripts/uui-apply-transformations.ts`.
5. Scaffolds a `ds/<folder>/<name>.tsx` wrapper if the audit flags the primitive as Layer 4 and no wrapper exists.
6. Runs `bun run typecheck`. Persists a JSON report.

See [`scripts/uui-add.ts`](../../scripts/uui-add.ts).

---

## brand.css

Defines all CSS custom properties via Tailwind v4 `@theme`. Imported by `app/globals.css` as `@import '../components/ds/brand.css'`. This is the single file that makes semantic tokens like `--bg-primary`, `--fg-secondary`, and `--motion-micro` available to all Tailwind mapped classes.

Do not duplicate token definitions. If a token is wrong, fix it here — not in component files.

---

## defaults/

Each `.ts` file wires `defaultVariants` for one primitive component via CVA. Pattern:

```ts
// defaults/button.ts
export const buttonDefaults = {
  variant: 'primary',
  size: 'md',
} satisfies ButtonVariantProps;
```

Consumed by `components/base/base/<primitive>/with-defaults.tsx` wrappers. This is how BOS brand defaults are applied without forking UUI source files.

---

## \_history/

One Markdown file per component recording brand-override decisions made during PRD 016. Immutable — do not edit existing entries. Append new entries when decisions change.

---

## Applying ds/ transforms to any vendor library

The four transform rules are vendor-agnostic. Examples for current (UUI Pro) and hypothetical vendors:

### UUI Pro (current)

```tsx
// motion (motion/motion.mdx): duration-200 ease-out → duration-micro ease-motion-out
// focus ring (accessibility/focus-ring.mdx): ring-2 ring-offset-2 → ring-1 shadow-focus-ring ring-ring-brand
// disabled state (accessibility/disabled-state.mdx): bg-gray-100 text-gray-400 → bg-bg-disabled_subtle text-fg-disabled
// token syntax (code-quality/token-syntax.mdx): bg-[var(--bg-primary)] → bg-bg-primary
```

### shadcn/Radix (hypothetical — PRD 018 POC)

Apply the same four rules. Import `brand.css` after shadcn's base stylesheet. See `_swap-guide.md` (added in PRD 017 task 12d).

---

## Relationship to PRD 018

`_swap-guide.md` (vendor-swap procedure step-by-step) will be added here in PRD 017 task 12d. The full implementation POC (replacing UUI Pro with shadcn/Radix/DaisyUI) is scoped to PRD 018.

---

## Primitive entry points

Two ways to import a `base/` primitive:

- **Deep path** (preferred for product code): `import { Button } from '@/components/ds/buttons/button'` — explicit, tree-shakeable, no surprises.
- **Barrel** (preferred for tooling): `import { Button } from '@/components/base'` — flat surface for the future `_manifest.json` generator, Storybook indexes, and the Part 2 Generator preview surface that introspects the primitive layer without filesystem walks.

The barrel re-exports public components only. Internal types/constants (`CommonProps`, `sizes`, `styles`) are not re-exported; consume those via deep imports when needed.

---

## Links

- Top-level decision guide: [`../README.md`](../README.md)
- Product compositions: [`../custom/README.md`](../custom/README.md)
- Vendor primitives: [`../base/`](../base/)
- Barrel: [`../base/index.ts`](../base/index.ts)

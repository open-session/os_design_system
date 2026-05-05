# components/ds/ — Formula Spec Layer

`ds/` is the **formula layer** of the three-folder architecture. It contains rules, tokens, and wiring — not component implementations. Nothing in `ds/` is application code; it governs how `components/base/` primitives are tuned to express the BOS brand.

Three-folder rule: `base/` (vendor primitives) · `custom/` (product compositions) · `ds/` (formula spec)

---

## Formula Categories

Transform rules are organized into four formula-category subfolders. Each subfolder represents a distinct design dimension:

| Category | Scope | Current files |
|---|---|---|
| `motion/` | Duration, easing, transitions, animation tokens | `motion.mdx` |
| `shape/` | Radius, border, sizing tokens | _(placeholder — future spec content)_ |
| `accessibility/` | Focus rings, ARIA patterns, keyboard rules | `focus-ring.mdx`, `disabled-state.mdx` |
| `code-quality/` | devProps, naming, imports, Tailwind conventions | `token-syntax.mdx` |

The four MDX transform rules were previously in `transforms/` (now a redirect stub). Use the category folders directly.

---

## Root Contents

| Item | Purpose |
|---|---|
| `brand.css` | `@theme` token definitions — single source of truth for all CSS custom properties |
| `defaults/` | CVA `defaultVariants` wiring per primitive — one `.ts` file per component |
| `_history/` | Decision log — immutable record of brand-override decisions per component |
| `_exceptions.md` | Component-specific deviations not expressible as universal rules |
| `transforms/` | Deprecated redirect stub — points to the category folders above |

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

## _history/

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

## Links

- Top-level decision guide: [`../README.md`](../README.md)
- Product compositions: [`../custom/README.md`](../custom/README.md)
- Vendor primitives: [`../base/`](../base/)

# Tabs Primitive — Migration History

**Phase:** B
**Date:** 2026-05-05
**Status:** Resolved

## Round-trip — Phase B (2026-05-05)

**What happened:**

Tabs had 6 variant arms (button-brand, button-gray, button-border, button-minimal, underline, line)
redefined inside `components/base/application/tabs/tabs.tsx`. The variant arms hardcoded
`*:data-icon:` color classes on hover/selected/border states, plus a restructured sizing scale
that factored typography (`text-sm font-semibold gap-1 *:data-icon:size-4`) into a shared `base`
row per size — upstream UUI repeats the typography per variant.

**Action:**

1. Pulled fresh upstream `npx untitledui@latest add tabs --path /tmp/uui-fresh -y`.
   Note: the CLI emitted `import { Badge } from "@/tmp/uui-fresh/base/badges/badges"` because
   `--path` resolves the import path relative to the staging dir; this was rewritten to
   `@/components/base/base/badges/badges` before applying the codemod.
2. Applied 5-axis codemod (`scripts/uui-apply-transformations.ts`). Axis 1a (`duration-100`)
   and Axis 5 (devProps) fired. `ease-linear` not transformed (codemod limitation; same as Button).
3. Replaced `components/base/application/tabs/tabs.tsx` with the codemod-applied upstream.
4. Created `components/ds/tabs/tabs.tsx` as Shape C full fork holding all BOS variant deltas.
5. Updated `components/base/index.ts` barrel to re-export `{Tab, TabList, TabPanel, Tabs}`
   from `@/components/ds/tabs/tabs`.
6. Migrated 4 consumer files from the deep path `@/components/base/application/tabs/tabs`
   to `@/components/ds/tabs/tabs`.
7. Created `components/ds/tabs/tabs.stories.tsx` (`Design System/Application/Tabs`).
   Retitled `components/base/application/tabs/tabs.stories.tsx` to
   `Base (Upstream UUI)/Application/Tabs` for vendor-swap auditing.

**Brand deltas (now isolated to ds/tabs/tabs.tsx):**

- All 6 variant arm `*:data-icon:` color classes on hover/selected
- Sizing scale restructured (typography factored into `base` row)
- `Fragment` import (uses Fragment for non-orientation rendering — upstream uses `isValidElement`)
- `motion duration` uses `ease-motion-out` instead of upstream `ease-linear`

**Acceptance:**

- `bun run typecheck` — 0 errors.
- `bun run lint` — 0 errors.
- `grep` for variant-arm BOS deltas in `base/application/tabs/tabs.tsx` — 0 matches.
- `bun run uui:add tabs` (Phase B B3) will safely re-pull `base/` without disturbing `ds/`.

---

## Phase C Wave 1 — UUI v8 rebase (2026-05-06)

**Wave:** Phase C, Wave 1 (combined C1 + C1.5).
**Methodology:** three-way diff (wrapper / current base / `bun run uui:add tabs` v8 sidecar).

### Result: most "BOS deltas" turned out to be Type 2 vendor evolution that BOS hadn't pulled. Only ONE Type 3 remains.

| Phase B "BOS delta" claim                                  | v8 reality                                                                                                                         | Reclassified           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Six variant arms with `*:data-icon:` color overrides       | v8 ADDED these. The pre-rebase wrapper LACKED them; base/ was frozen at v7                                                         | **Type 2 → adopted**   |
| Sizing scale "restructure" (typography factored into base) | v8 introduced the `base` factoring. Pre-rebase wrapper repeated typography per variant (verbose v7 leftover, NOT a brand decision) | **Type 2 → adopted**   |
| `Fragment` import for non-orientation rendering            | v8 uses `<>` shorthand; cosmetic                                                                                                   | **Cosmetic → adopted** |
| `ease-motion-out` instead of `ease-linear`                 | v8 still uses `ease-linear`                                                                                                        | **Type 3 → kept**      |

### Adopted from v8 (Type 2)

- All variant arms now have `*:data-icon:text-fg-quaternary` baseline + per-state hover/selected icon-color overrides.
- Sizing scale uses v8's structure: per-size `base` row with shared typography + `*:data-icon:size-{4,5}`, plus per-variant px/py overrides. Padding tightened to `px-2.5` (v8 evolved from v7's `px-3`).
- Tab now accepts an `icon: FC | ReactNode` prop with `<Icon data-icon className="transition-inherit-all" />` rendering.
- Badge type differentiation: `showPillColorBadge = type === "underline" || type === "line" || type === "button-brand"` — only those three get pill-color badges; others get `modern`.
- Badge color: simplified from a `getColorStyles(state)[type]` map to inline `showPillColorBadge && (state.isHovered || state.isSelected) ? "brand" : "gray"`.
- `TabListProps` extends `Omit<AriaTabListProps<T>, "items">` (cleaner type contract).
- `TabList` defensive items rendering: `children ?? (otherProps.items ? ... : undefined)`.
- `items` prop is optional (`items?: T[]`).

### Type 3 retained

- `transition duration-micro ease-motion-out` on the Tab root className (vs. v8's `ease-linear`). The codemod's axis 1b doesn't yet rewrite `ease-linear` → `ease-motion-out`. This wrapper carries the swap until the codemod expansion lands.

### Wrapper deletability

If a future codemod expansion handles `ease-linear` → `ease-motion-out` automatically (Rule 1b), this wrapper has zero remaining Type 3 deltas. At that point the wrapper SHOULD BE DELETED and the barrel re-pointed at `./application/tabs/tabs`. Tracked in [v8 spike §7](docs/spikes/design-system/2026-05-06-vendor-design-system-upgrades.md).

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- Manual visual diff against C0 baseline: pending Karim sign-off.

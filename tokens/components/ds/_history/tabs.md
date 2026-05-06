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

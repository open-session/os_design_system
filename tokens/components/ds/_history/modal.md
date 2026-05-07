# Modal Primitive — Migration History

**Phase:** C, Wave 3A
**Date:** 2026-05-06
**Status:** Resolved (Shape C wrapper)

## Phase C Wave 3A — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add modal` v8 sidecar; auto-scaffolded `ds/modals/modal.tsx` authored as Shape C).

### Result: 2 Type 3 deltas survive; Shape C wrapper authored

| Phase B claim                                                                                                | Three-way diff                                                                                  | Reclassified                                                                     |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Dialog owns surface treatment (`"w-full overflow-hidden rounded-xl bg-bg-primary shadow-xl outline-hidden"`) | Confirmed. v8 Dialog only centers content; consumers would have to manually add surface styling | **Type 3 → wrapped.** Dialog wrapper preserves BOS surface; ~6 consumers benefit |
| ModalOverlay enter: `duration-moderate ease-motion-out` (BOS) vs `duration-micro ease-out` (v8)              | Real cadence difference; BOS deliberately slower for modal scale (~250ms vs ~100ms)             | **Type 3 → wrapped.** Slower enter cadence preserved                             |
| ModalOverlay exit: `duration-standard ease-motion-in` (BOS) vs `duration-micro ease-in` (v8)                 | Same direction — BOS even slower on exit (~300ms vs ~100ms)                                     | **Type 3 → wrapped.** Slower exit cadence preserved                              |
| Modal (zoom-in-95 / zoom-out-95) duration                                                                    | Same as ModalOverlay — BOS slower for zoom-in/out                                               | **Type 3 → wrapped.** Slower zoom cadence preserved                              |

### Wrapper architecture

- `components/base/application/modals/modal.tsx` — vendor-pristine v8 (just centering Dialog, micro-duration motion). devProps applied to all 3 roots.
- `components/ds/modals/modal.tsx` — Shape C full fork. Re-creates ModalOverlay, Modal, Dialog with BOS Type 3 deltas. Re-exports `DialogTrigger` from base/ unchanged (no DOM, no styling).
- `components/base/index.ts` — barrel updated: `Modal`, `ModalOverlay`, `Dialog`, `DialogTrigger` re-exported from `@/components/ds/modals/modal`.

### Adopted from v8 (Type 2)

- Inline import structure unchanged (v8 didn't restructure modal exports).

### Codemod gap workaround

devProps hand-added to `ModalOverlay` `<AriaModalOverlay>`, `Modal` `<AriaModal>`, and `Dialog` `<AriaDialog>` roots in both base/ and ds/.

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — pending (run at end of Wave 3A).
- `bun run lint` — pending.
- Manual visual diff: pending Karim sign-off (modals should look identical to pre-Wave-3A; the surface treatment + motion are preserved via wrapper).

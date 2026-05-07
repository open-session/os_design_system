# Messaging Primitive — Migration History

**Phase:** C, Wave 2C
**Date:** 2026-05-06
**Status:** Resolved (no wrapper)

## Phase C Wave 2C — UUI v8 rebase (2026-05-06)

**Methodology:** three-way diff (current `base/` vs `bun run uui:add messaging` v8 sidecar; no prior wrapper).

### Result: 0 Type 3 deltas; v8 adopted wholesale (Avatar size shrunk + bug fixes + accessibility)

| Phase B claim                                                         | Three-way diff                                                                                                      | Reclassified                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| BOS uses Avatar `size="md"` for senders; v8 changed to `size="sm"`    | Confirmed. With v8's overall avatar visual upgrade (masked inner-div, polished indicators), `sm` looks more refined | **Type 2 → adopted v8.** Avatar shrunk md → sm |
| BOS missing `!msg.typing &&` guard on timestamp/status row            | Bug — timestamp briefly flashed during typing                                                                       | **Type 2 → adopted v8.** Guard added           |
| BOS missing `wrap-break-word` on bubble                               | Bug — long URLs/words overflowed bubble                                                                             | **Type 2 → adopted v8.** Class added           |
| `duration-100 ease-linear` (BOS) vs `duration-micro ease-linear` (v8) | Mechanical (Rule 1 codemod territory)                                                                               | **Type 2 (mechanical) → adopted v8.**          |

### Adopted from v8 (Type 2)

- Avatar `size="md"` → `size="sm"` for sender avatars.
- `!msg.typing && (msg.sentAt || msg.status)` guard on the timestamp/status row.
- `wrap-break-word` on the message bubble for long-content overflow handling.
- All `duration-100` instances → `duration-micro`.

### Type 3 retained

None.

### Pipeline gap surfaced (and worked around)

`bun run uui:add messaging` (sidecar pipeline) generated broken staging-path imports for sibling primitives:

```
import { Avatar } from "@/tmp/uui-staging-messaging-2026-05-07T00-20-02-984Z/base/avatar/avatar";
import { Tooltip } from "@/tmp/uui-staging-messaging-2026-05-07T00-20-02-984Z/base/tooltip/tooltip";
```

Hand-corrected to:

```
import { Avatar } from "@/components/base/base/avatar/avatar";
import { Tooltip } from "@/components/base/base/tooltip/tooltip";
```

Same gap as Avatar Wave 2B's avatar-add-button + Tag-Close-X Wave 2A's tags.tsx. The path-rewrite logic in `scripts/uui-add.ts` does not normalize cross-folder imports back to `@/components/base/...`. Fix candidates: add a regex post-pass in the script that rewrites `@/tmp/uui-staging-*` → `@/components/base/`, OR resolve the import statically via the staging→base file map.

### Codemod gap workaround

devProps hand-added to `MessageStatus` `<Tooltip>` root and `MessageItem` `<li>` root.

### Greenfield surfaced

`bun run uui:add messaging` also pulled sidecars for Avatar family + Tooltip. Avatar sidecars discarded (already at v8 from Wave 2B). Tooltip sidecar discarded (out of scope; Tooltip rebase deferred — no audit row indicates Type 3 deltas).

### Acceptance

- `bun run typecheck` — clean.
- `bun run storybook:build` — exits 0.
- `bun run lint` — 0 errors.
- Manual visual diff: pending Karim sign-off (visible changes — sender avatars are smaller; longer messages now wrap correctly; timestamps no longer flash during typing).

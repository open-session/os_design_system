# components/custom/

Product compositions live here. `custom/` is the middle layer of the three-folder architecture:

- **`base/`** — vendor primitives (UUI Pro, Radix, etc.) — do not compose here
- **`custom/`** — this folder — product compositions built from `base/` primitives
- **`ds/`** — formula spec layer (brand.css, transforms, CVA defaults) — rules, not components

---

## Decision Rule: pages/ vs shared/

Answer in order. Stop at first match.

**Use `custom/pages/<route>/`** if the component is consumed only within a single route segment (e.g., only in `/brain` pages, only in `/account` pages).

**Use `custom/shared/<category>/`** if the component appears in two or more distinct route segments, OR appears in a shell layout (app/layout.tsx or app/(dashboard)/layout.tsx).

**Tie-breaker:** When a component fits multiple categories, pick the category matching its PRIMARY job — not its visual style. A brand-themed loader → `loaders/`. A logo with animation → `branding/`.

---

## shared/ — 9-Category Taxonomy

| category | primary job | examples |
|---|---|---|
| `navigation/` | frames the page | headers, sidebars, breadcrumbs, drawers, page meta |
| `overlays/` | appears over the page | modals, sheets, command palettes, canvas panel |
| `menus/` | click-triggered action popovers | dropdown menus, context menus, plus-menus |
| `selectors/` | click-triggered value-picker popovers | model/project/space/brand/language selectors |
| `loaders/` | loading indicators | spinners, skeletons, brand-loader, dot family |
| `feedback/` | status communication | error boundaries, alerts, toasts, info popovers |
| `branding/` | brand expression | logo, theme toggles, brand-themed icons |
| `effects/` | visual sugar | typewriter, flip-card, transitions-as-components |
| `runtime/` | non-rendering injectors | analytics, providers, palette bootstrap, auth guards |

---

## Links

- Top-level decision guide: [`components/README.md`](../README.md)
- Formula spec layer: [`components/ds/README.md`](../ds/README.md)

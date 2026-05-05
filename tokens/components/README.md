# components/ — Three-Folder Rule

`components/` contains exactly three directories: `base/`, `custom/`, `ds/`.

---

## Decision Tree

Answer in order. Stop at first match.

**1. Is this a vendor primitive (UUI Pro, Radix, etc.)?**
Use `base/`

**2. Is this a non-rendering injector (analytics, auth guard, provider, palette)?**
Use `custom/shared/runtime/`

**3. Is this a brand expression (logo, theme toggle)?**
Use `custom/shared/branding/`

**4. Is this a loading indicator (spinner, skeleton, brand-loader)?**
Use `custom/shared/loaders/`

**5. Is this used in 2+ distinct route segments OR in a shell layout?**
Use `custom/shared/<category>/` — see taxonomy below

**6. Is this a formula-layer rule (easing token, focus-ring spec, CVA defaults)?**
Use `ds/`

**7. Everything else:**
Use `custom/pages/<route>/` — e.g., `custom/pages/brain/`, `custom/pages/chat/`

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

**Tie-breaker:** Pick the category matching the PRIMARY job, not visual style.
A brand-themed loader → `loaders/`. A logo with animation → `branding/`.

---

## Further Reading

- Product compositions: [`custom/README.md`](./custom/README.md)
- Formula spec layer: [`ds/README.md`](./ds/README.md)
- Vendor primitives: [`base/`](./base/)

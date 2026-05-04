# Open Session Design System Reference

> Design system context for building brand-aligned UI components.

---

## Brand Philosophy

**"Steward, not advisor"** — Act as a team member who speaks FROM within the brand, not an external consultant.

- Use "we" and "our" when discussing brand decisions
- Don't preface responses with "according to guidelines"
- Make brand-aligned choices feel natural, not prescriptive

---

## Core Colors

The system uses **warm neutrals** instead of harsh black/white for an inviting, approachable feel.

| Token | Hex | Role |
|-------|-----|------|
| **Aperol** | `#FE5102` | Primary accent — CTAs, links, badges, alerts |
| **Charcoal** | `#191919` | Warm dark — Dark mode backgrounds, primary text |
| **Vanilla** | `#FFFAEE` | Warm light — Light mode backgrounds, light text |

### Color Usage Rules

- **Brand colors (Aperol)**: Use sparingly for primary CTAs, active states, badges
- **NEVER** use brand colors for borders or harsh outlines
- **Semantic colors**: Success (emerald-500), Warning (amber-500), Error (red-500)

### Contrast Ratios

- Vanilla on Charcoal: **18.5:1** (AAA compliant)
- Charcoal on Vanilla: **18.5:1** (AAA compliant)

---

## Typography

| Category | Font | Usage |
|----------|------|-------|
| **Display** | Neue Haas Grotesk Display Pro | Headlines, titles, hero text |
| **Body** | Neue Haas Grotesk Text Pro | Body text, paragraphs, inputs, tabs |
| **Small** | Neue Haas Grotesk Text Pro | Labels, captions, hints, metadata |
| **Accent** | OffBit | Digital/tech feel (max 2 per viewport) |

**Note**: We use Neue Haas Grotesk consistently—no separate code or monospace fonts.

---

## Border & Interaction Philosophy

Borders should **support, not dominate** the visual hierarchy.

> **CSS Variable Opacity Warning**
>
> Tailwind's opacity modifier (`/30`, `/50`, etc.) does NOT work with CSS variables.
> `bg-[var(--bg-secondary)]/30` will silently fail—the opacity is ignored.
>
> **Use mapped semantic classes instead:** `bg-bg-secondary/30` works correctly.

### Border States

```css
/* Default: Subtle */
border border-border-secondary

/* Hover: More visible */
hover:border-border-primary

/* Focus: Clear but not harsh */
focus:border-border-primary
```

### Card Pattern

```tsx
className="bg-bg-secondary border border-border-secondary hover:bg-bg-secondary-hover"
```

---

## Component Patterns

### Buttons

- Primary: Aperol background, warm hover state
- Secondary: Transparent with subtle border
- Tertiary: Text-only with hover underline

```tsx
// Primary
className="bg-bg-brand-solid text-white hover:bg-bg-brand-solid-hover"

// Secondary
className="bg-transparent border border-border-primary hover:bg-bg-secondary"

// Tertiary
className="text-fg-brand-primary hover:underline"
```

### Form Inputs

- Subtle border at rest
- Brand accent on focus (but not harsh)
- Clear label hierarchy
- Helpful hint text below
- Input font ≥16px (prevents iOS auto-zoom)

```tsx
className="bg-bg-tertiary border border-border-primary rounded-md
           focus:border-border-brand focus:ring-1 focus:shadow-focus-ring"
```

### Cards & Containers

- Use `bg-bg-secondary` for elevated surfaces
- Rounded corners: `rounded-lg` (8px) or `rounded-xl` (12px for brand)
- Shadows use Charcoal (25,25,25) not pure black

---

## Interaction Patterns

### Hit Targets

| Context | Minimum |
|---------|---------|
| Desktop | 24×24px |
| Mobile | 44×44px |

### Loading States

- Show delay: 150–300ms (prevent flash)
- Minimum visible: 300–500ms (avoid jarring)
- Keep original label visible during load

---

## Animation & Motion

### Easing Curves

| Token | CSS Value | Tailwind Class | Use For |
|-------|-----------|----------------|---------|
| `--ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease-motion-out` | Entrances, appearing elements |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | `ease-motion-in` | Exits, disappearing elements |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.6, 1)` | `ease-motion-in-out` | Symmetric transitions (toggles) |

### Duration Tiers

| Token | Value | Tailwind Class | Use For |
|-------|-------|----------------|---------|
| `--duration-micro` | 100ms | `duration-micro` | Hover/focus state changes |
| `--duration-quick` | 150ms | `duration-quick` | Tooltips, toggles |
| `--duration-standard` | 200ms | `duration-standard` | Overlay exits |
| `--duration-moderate` | 300ms | `duration-moderate` | Modal entrances |
| `--duration-page` | 350ms | `duration-page` | Route transitions |

### Usage Example

```tsx
// Micro-interactions (buttons, inputs)
"transition duration-micro ease-motion-out"

// Overlay enter (modals, dropdowns)
"duration-moderate ease-motion-out animate-in fade-in"

// Overlay exit
"duration-standard ease-motion-in animate-out fade-out"
```

---

## Semantic Tokens

### Backgrounds

```css
bg-bg-primary          /* Main page background */
bg-bg-secondary        /* Cards, elevated surfaces */
bg-bg-tertiary         /* Inputs, form fields */
bg-bg-brand-solid      /* Brand CTAs */
```

### Text (Foreground)

```css
text-fg-primary        /* Headings, important text */
text-fg-secondary      /* Body text, descriptions */
text-fg-tertiary       /* Metadata, timestamps */
text-fg-brand-primary  /* Brand-colored text */
```

### Borders

```css
border-border-primary   /* Interactive elements */
border-border-secondary /* Container borders */
border-border-brand     /* Accent borders (rarely) */
```

---

## Focus States

Use the focus ring system for accessibility:

```css
focus:ring-1 focus:shadow-focus-ring       /* Standard focus */
focus:ring-1 focus:shadow-focus-ring-error /* Error state focus */
```

---

## Accessibility Requirements

- Focus states: Always visible (`:focus-visible`)
- Contrast: 18.5:1 Vanilla/Charcoal (exceeds AAA)
- Hit targets: Desktop 24×24px, Mobile 44×44px
- Reduced motion: Tokens auto-zero via `prefers-reduced-motion`

---

## Hard Rules (Never Break)

### Forbidden

- **NEVER** use the `Sparkles` icon (hard brand ban)
- **NEVER** put icons before section headers
- **NEVER** use brand colors (`Aperol`) for borders
- **NEVER** use `border-2` or thick borders
- **NEVER** use Aperol as primary background
- **NEVER** use Style 1 syntax: `bg-[var(--bg-primary)]`

### Always

- **ALWAYS** use Style 2 syntax: `bg-bg-primary`
- **ALWAYS** maintain AAA contrast ratios
- **ALWAYS** respect Aperol 10% maximum in compositions
- **ALWAYS** use warm neutrals (Charcoal/Vanilla) over pure black/white

---

## Quick Reference

### CSS Syntax

```css
/* ✅ CORRECT - Style 2 (mapped classes) */
bg-bg-primary
text-fg-primary
border-border-secondary

/* ❌ WRONG - Style 1 (CSS variables) */
bg-[var(--bg-primary)]
text-[var(--fg-primary)]

/* ❌ BROKEN - Opacity with CSS vars */
bg-[var(--bg-secondary)]/30  /* Opacity ignored! */

/* ✅ CORRECT - Opacity with mapped classes */
bg-bg-secondary/30
```

### Component Checklist

Before completing any component:

- [ ] Using semantic tokens, not raw values
- [ ] Borders use `border-border-secondary`
- [ ] Focus states use focus ring system
- [ ] Hit targets meet minimums
- [ ] Motion uses brand tokens
- [ ] No forbidden elements used

---

*Open Session Design System Reference — Build with consistency.*

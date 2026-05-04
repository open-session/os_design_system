# For Developers

> Guide to implementing the Open Session design system in code.

---

## Quick Start

### 1. Import CSS Variables

Add the brand CSS to your project's global styles:

```css
/* globals.css */
@import './path-to/tokens/ds/brand.css';
```

### 2. Configure Tailwind

Use the provided Tailwind preset:

```ts
// tailwind.config.ts
import osTokens from './tokens/tailwind.config';

export default {
  presets: [osTokens],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

Or merge the theme manually:

```ts
import { theme } from './tokens/tailwind.config';

export default {
  theme: {
    extend: {
      ...theme.extend,
    },
  },
};
```

---

## Design Tokens

### Key Files

| File | Purpose |
|------|---------|
| `tokens/tailwind.config.ts` | Tailwind preset (ready to use) |
| `tokens/ds/brand.css` | CSS custom properties (source of truth) |
| `tokens/ds/transforms/` | UUI transformation rules |
| `tokens/ds/defaults/` | Default token values |
| `tokens/ds/motion/` | Animation tokens |
| `tokens/ds/shape/` | Border radius, shadows |
| `tokens/components/examples/` | Reference component implementations |

### Full Token Guide

See `tokens/README.md` for complete documentation including:
- All semantic tokens
- Motion tokens
- Focus states
- Component examples

---

## Color Tokens

### CSS Custom Properties

```css
/* Primary brand colors */
--os-vanilla: #FFFAEE;
--os-charcoal: #191919;
--os-aperol: #FE5102;

/* Semantic tokens */
--bg-primary: var(--os-vanilla);       /* Light mode */
--bg-secondary: var(--os-charcoal);    /* Dark mode */
--fg-primary: var(--os-charcoal);      /* Light mode text */
--fg-inverse: var(--os-vanilla);       /* Dark mode text */
--accent: var(--os-aperol);
```

### Tailwind Classes (Mapped)

```css
/* Backgrounds */
bg-bg-primary          /* Page background */
bg-bg-secondary        /* Cards, elevated surfaces */
bg-bg-tertiary         /* Inputs, form fields */

/* Text */
text-fg-primary        /* Headings, body */
text-fg-secondary      /* Descriptions */
text-fg-tertiary       /* Metadata */

/* Borders */
border-border-primary   /* Interactive elements */
border-border-secondary /* Containers */
```

---

## Typography

### Font Families

```css
font-family: 'Neue Haas Grotesk Display Pro', sans-serif;  /* Headlines */
font-family: 'Neue Haas Grotesk Text Pro', sans-serif;     /* Body */
font-family: 'OffBit', monospace;                          /* Accent */
```

### Tailwind Classes

```css
font-sans      /* Neue Haas Grotesk Text Pro */
font-display   /* Neue Haas Grotesk Display Pro */
font-accent    /* OffBit */
```

### Type Scale

| Level | Size | Line Height | Font |
|-------|------|-------------|------|
| Display 1 | 160px | 1.0 | NH Display Bold |
| H1 | 56px | 1.2 | NH Display Bold |
| H5-H6 | 24-28px | 1.3 | OffBit |
| Body 1 | 20px | 1.5 | NH Text Roman |
| Body 2 | 16px | 1.5 | NH Text Roman |

---

## Motion Tokens

### Easing

```css
ease-motion-out     /* Entrances: cubic-bezier(0.4, 0, 0.2, 1) */
ease-motion-in      /* Exits: cubic-bezier(0.4, 0, 1, 1) */
ease-motion-in-out  /* Toggles: cubic-bezier(0.4, 0, 0.6, 1) */
```

### Duration

```css
duration-micro      /* 100ms - Hover, focus */
duration-quick      /* 150ms - Tooltips, toggles */
duration-standard   /* 200ms - Overlay exits */
duration-moderate   /* 300ms - Modal entrances */
duration-page       /* 350ms - Route transitions */
```

---

## Component Patterns

### Buttons

```tsx
// Primary
className="bg-bg-brand-solid text-white hover:bg-bg-brand-solid-hover"

// Secondary
className="bg-transparent border border-border-primary hover:bg-bg-secondary"

// Tertiary
className="text-fg-brand-primary hover:underline"
```

### Cards

```tsx
className="bg-bg-secondary border border-border-secondary rounded-lg"
```

### Inputs

```tsx
className="bg-bg-tertiary border border-border-primary rounded-md
           focus:border-border-brand focus:ring-1 focus:shadow-focus-ring"
```

---

## Critical Rules

### Opacity Warning

Tailwind opacity modifiers DON'T work with CSS variables:

```tsx
// ❌ BROKEN - opacity silently ignored
bg-[var(--bg-secondary)]/30

// ✅ CORRECT - use mapped classes
bg-bg-secondary/30
```

### Hard Rules

- Never use `Sparkles` icon (brand ban)
- No icons before section headers
- Never use Aperol as primary background
- Never use brand colors for borders
- Input font ≥16px (prevents iOS auto-zoom)

---

## Accessibility

- Focus states: Always visible (`:focus-visible`)
- Contrast: 18.5:1 Vanilla/Charcoal (exceeds AAA)
- Hit targets: Desktop 24×24px, Mobile 44×44px
- Reduced motion: Tokens auto-zero via `prefers-reduced-motion`

---

## Reference Documentation

| Document | Path |
|----------|------|
| Full Token Guide | `tokens/README.md` |
| Design System | `.claude/reference/design-system.md` |
| Brand Identity | `guidelines/markdown/02-brand-identity.md` |
| Component Examples | `tokens/components/examples/` |
| Brand CSS | `tokens/ds/brand.css` |

---

*Questions? See the full token documentation in `tokens/README.md`.*

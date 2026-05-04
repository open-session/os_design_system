# Open Session Design Tokens

> Production-ready design tokens for building with the Open Session design system.

---

## Quick Start

### 1. Install Dependencies

```bash
npm install tailwindcss
# or
bun add tailwindcss
```

### 2. Import CSS Variables

Add the brand CSS to your project's global styles:

```css
/* globals.css */
@import './path-to/tokens/ds/brand.css';
```

### 3. Configure Tailwind

Use the provided Tailwind preset:

```ts
// tailwind.config.ts
import osTokens from './tokens/tailwind.config';

export default {
  presets: [osTokens],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // your project-specific config
};
```

Or merge the theme manually:

```ts
import { theme } from './tokens/tailwind.config';

export default {
  theme: {
    extend: {
      ...theme.extend,
      // your extensions
    },
  },
};
```

---

## Directory Structure

```
tokens/
├── README.md                 # This file
├── tailwind.config.ts        # Tailwind preset with all tokens
├── ds/                       # Design system formula spec
│   ├── brand.css             # CSS custom properties (source of truth)
│   ├── README.md             # Design system documentation
│   ├── defaults/             # Default token values
│   ├── transforms/           # UUI transformation rules
│   ├── motion/               # Animation tokens
│   ├── shape/                # Border radius, shadows
│   ├── accessibility/        # A11y guidelines
│   └── code-quality/         # Code standards
└── components/               # Component examples
    └── examples/             # Reference implementations
        ├── buttons/
        ├── input/
        └── badges/
```

---

## Brand Colors

| Color | Hex | CSS Variable | Tailwind Class |
|-------|-----|--------------|----------------|
| **Aperol** | #FE5102 | `--os-aperol` | `text-brand-aperol` |
| **Charcoal** | #191919 | `--os-charcoal` | `bg-brand-charcoal` |
| **Vanilla** | #FFFAEE | `--os-vanilla` | `bg-brand-vanilla` |

### Usage Rules

- **Backgrounds**: Only use Vanilla or Charcoal
- **Aperol**: Accent color only (max 10% of any composition)
- **Never**: Use brand colors for borders
- **Contrast**: Vanilla/Charcoal = 18.5:1 (AAA)

---

## Semantic Tokens

Use semantic tokens for consistency across themes:

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

## Typography

### Font Families

```css
font-sans      /* Neue Haas Grotesk Text Pro - Body text */
font-display   /* Neue Haas Grotesk Display Pro - Headlines */
font-accent    /* OffBit - Digital accent (max 2/viewport) */
```

### Font Files

Font files are located in `assets/fonts/`:

```
assets/fonts/
├── neue-haas-grotesk-display/
├── neue-haas-grotesk-text/
└── offbit/
```

---

## Motion Tokens

### Timing Functions

```css
ease-motion-out     /* Entrances: cubic-bezier(0.4, 0, 0.2, 1) */
ease-motion-in      /* Exits: cubic-bezier(0.4, 0, 1, 1) */
ease-motion-in-out  /* Toggles: cubic-bezier(0.4, 0, 0.6, 1) */
```

### Durations

```css
duration-micro      /* 100ms - Hover, focus states */
duration-quick      /* 150ms - Tooltips, toggles */
duration-standard   /* 200ms - Overlay exits */
duration-moderate   /* 300ms - Modal entrances */
duration-page       /* 350ms - Route transitions */
```

### Example

```tsx
<button className="transition-colors duration-micro ease-motion-out hover:bg-bg-primary-hover">
  Hover me
</button>
```

---

## Focus States

Use the focus ring system for accessibility:

```css
focus:ring-1 focus:shadow-focus-ring       /* Standard focus */
focus:ring-1 focus:shadow-focus-ring-error /* Error state focus */
```

### Example

```tsx
<input className="focus:ring-1 focus:shadow-focus-ring focus:border-border-brand" />
```

---

## Component Examples

Reference implementations are in `components/examples/`:

### Button

```tsx
// Primary button
<button className="bg-bg-brand-solid text-white hover:bg-bg-brand-solid-hover
                   rounded-md px-4 py-2 transition-colors duration-micro ease-motion-out">
  Primary Action
</button>

// Secondary button
<button className="bg-transparent border border-border-primary text-fg-primary
                   hover:bg-bg-secondary rounded-md px-4 py-2">
  Secondary Action
</button>
```

### Input

```tsx
<input
  className="bg-bg-tertiary border border-border-primary rounded-md px-3 py-2
             focus:border-border-brand focus:ring-1 focus:shadow-focus-ring
             placeholder:text-fg-placeholder"
  placeholder="Enter text..."
/>
```

### Card

```tsx
<div className="bg-bg-secondary border border-border-secondary rounded-lg p-6">
  <h3 className="text-fg-primary font-display text-xl">Card Title</h3>
  <p className="text-fg-secondary mt-2">Card content goes here.</p>
</div>
```

---

## Critical Rules

### Never Do

- ❌ Use `Sparkles` icon (hard brand ban)
- ❌ Put icons before section headers
- ❌ Use Aperol as primary background
- ❌ Use brand colors for borders
- ❌ Use Style 1 syntax: `bg-[var(--bg-primary)]`

### Always Do

- ✅ Use Style 2 syntax: `bg-bg-primary`
- ✅ Respect Aperol 10% maximum
- ✅ Maintain AAA contrast ratios
- ✅ Use semantic tokens over raw values

### Opacity Warning

Tailwind opacity modifiers don't work with CSS variables in bracket notation:

```css
/* ❌ BROKEN - opacity silently ignored */
bg-[var(--bg-secondary)]/30

/* ✅ CORRECT - use mapped classes */
bg-bg-secondary/30
```

---

## Integration with BOS-3.0

This design system is the source of truth for BOS-3.0 (Brand Operating System). The tokens defined here are used directly in production.

### Syncing Changes

Changes to tokens here should be reflected in BOS-3.0. The original BOS-3.0 location for these files:

- `tokens/ds/` → `BOS-3.0/components/ds/`
- `tokens/components/` → `BOS-3.0/components/base/`

---

## Resources

- **Brand Guidelines**: `guidelines/markdown/`
- **Full Design System Docs**: `ds/README.md`
- **Art Direction**: `assets/art-direction/`
- **Font Files**: `assets/fonts/`

---

*Open Session Design Tokens - Build with consistency.*

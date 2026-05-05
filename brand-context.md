# Open Session Brand Context

> Consolidated brand context for AI agents. Version 1.0.0 | Updated 2025-05-04

## Brand Essence

Open Session is an interdisciplinary design studio democratizing world-class design through AI, education, and community. We're stewards of good design, not just advisors.

### Voice Formula

| Attribute | Description |
|-----------|-------------|
| Smart but not smug | Expert without condescension |
| Technical but accessible | Explain complexity simply |
| Confident but humble | Know your stuff, stay open |
| Warm but professional | Friendly without being casual |

**Write FROM the brand, not ABOUT it.** Use "we" and "our" naturally. Don't preface with "according to guidelines."

---

## Core Colors

| Color | Hex | CSS Variable | Role |
|-------|-----|--------------|------|
| **Aperol** | `#FE5102` | `--color-brand-500` | Primary accent (CTAs, links, icons) |
| **Charcoal** | `#191919` | `--color-charcoal` | Warm dark neutral |
| **Vanilla** | `#FFFAEE` | `--color-vanilla` | Warm light neutral |

### Accessibility
- Vanilla on Charcoal: **18.5:1** (AAA)
- Aperol on Charcoal: **5.5:1** (AA large text only)

### Aperol Usage Rules
- **Maximum 10%** of any composition
- **Allowed:** CTAs, links, icons, hover states, small accents
- **Forbidden:** Primary backgrounds, large sections, borders

---

## Typography

| Role | Font Family | CSS Variable |
|------|-------------|--------------|
| Display/Headlines | Neue Haas Grotesk Display | `--font-display` |
| Body/UI | Neue Haas Grotesk Text | `--font-sans` |
| Monospace/Code | OffBit | `--font-mono` |

### Font Weights
- **Display:** XXThin (100) → Black (900)
- **Text:** Regular (400), Medium (500), Bold (700)
- **OffBit:** Regular, Bold, 101, Dot variants

---

## CSS Token Syntax

**Always use Style 2 (mapped classes):**
```css
/* CORRECT */
bg-bg-primary
text-fg-secondary
border-border-primary

/* INCORRECT - avoid bracket notation */
bg-[var(--bg-primary)]
```

**Never use opacity modifiers with bracket notation** — they silently fail.

---

## Key Semantic Tokens

### Light Mode
| Token | Value | Use |
|-------|-------|-----|
| `--bg-primary` | `#faf8f5` | Page background |
| `--bg-secondary` | `#ffffff` | Cards, modals |
| `--fg-primary` | Charcoal | Body text |
| `--fg-secondary` | `gray-700` | Secondary text |
| `--border-primary` | `gray-300` | Input borders |
| `--border-secondary` | `gray-200` | Dividers |

### Dark Mode
| Token | Value | Use |
|-------|-------|-----|
| `--bg-primary` | Charcoal | Page background |
| `--bg-secondary` | `#1f1f1f` | Cards, modals |
| `--fg-primary` | Vanilla | Body text |
| `--fg-secondary` | `gray-300` | Secondary text |
| `--border-primary` | `#3d3d3d` | Input borders |

---

## Hard Rules (Never Break)

1. **Never use Sparkles icon** from any icon library
2. **Never use Aperol as background** for large areas
3. **Never use brand colors for borders** — use neutral grays
4. **Never use thick borders** (`border-2` or larger)
5. **Never put icons before section headers**
6. **Always maintain AAA contrast** (Vanilla/Charcoal)
7. **Always use Style 2 syntax** for Tailwind classes

---

## Logo Assets

### Main Logos
Path: `assets/logos/main/{format}/{color}/{variant}.{ext}`
- **Variants:** brandmark, combo, horizontal, stacked
- **Colors:** charcoal, glass, vanilla
- **Formats:** svg, png

### Accessory Logos
Path: `assets/logos/accessory/{format}/{color}/{variant}.{ext}`
- **Variants:** filled, outline, monogram

### Stamps (Decorative)
Path: `assets/logos/stamps/stamp-{color}-{1-6}.png`
- **Colors:** aperol, charcoal, vanilla, raw-scan
- **Count:** 24 total (6 per color)

---

## Illustrations

**Library:** Goodle (223 SVGs)
**Path:** `assets/illustrations/{category}/{name}.svg`

| Category | Count | Description |
|----------|-------|-------------|
| avatars | 99 | Character faces/heads |
| hobby | 25 | Leisure activities |
| life | 25 | Everyday scenarios |
| tech | 25 | Technology/AI themes |
| work | 49 | Professional scenarios |

**Style:** Single-color line art, uses `currentColor`

---

## Component Reference

Components are symlinked from BOS-3.0:
```
tokens/components/base/    → UUI base components
tokens/components/custom/  → Open Session custom components
tokens/components/ds/      → Design system transforms
```

---

## Button Patterns

### Primary (Brand)
```
bg-bg-brand-solid text-button-primary-fg
hover:bg-bg-brand-solid_hover
```

### Secondary (Outlined)
```
bg-bg-secondary text-fg-secondary border-border-primary
hover:bg-bg-secondary_hover
```

### Tertiary (Ghost)
```
bg-transparent text-fg-tertiary
hover:bg-bg-tertiary
```

---

## Motion

| Duration | Value | Use |
|----------|-------|-----|
| micro | 100ms | Micro-interactions |
| quick | 150ms | Tooltips, badges |
| standard | 200ms | Default transitions |
| moderate | 300ms | Modals, drawers |
| page | 350ms | Page transitions |

**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (motion-out)

**Reduced motion:** All durations become 0ms

---

## Quick Reference Paths

| Resource | Path |
|----------|------|
| CSS Tokens | `tokens/ds/brand.css` |
| Token JSON | `tokens/exports/tokens.json` |
| Asset Manifest | `assets/manifest.json` |
| Logo SVGs | `assets/logos/main/svg/` |
| Illustrations | `assets/illustrations/` |
| Fonts (Web) | `assets/fonts/*/Web/` |
| Components | `tokens/components/` (symlinked to BOS-3.0) |

---

## External Resources

For large media files not in this repo:
- **Video:** `~/Desktop/OS BRAND/CONTENT/VIDEO/`
- **Photo:** `~/Desktop/OS BRAND/CONTENT/PHOTO/`
- **3D/Experimental:** `~/Desktop/OS BRAND/BRAND/LOGO/Experimental/`

---

*Open Session Design System — Brand context for AI agents*

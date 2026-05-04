# For Designers

> Quick guide to using the Open Session design system for visual work.

---

## Asset Locations

### Logos

```
assets/logos/
├── main/           # Primary logo variants (SVG, PNG)
├── stamps/         # Badge/stamp versions
├── accessory/      # Secondary marks
└── experimental/   # 3D logos, CRT effects, OSCI
```

**Usage rules:**
- Default to Combination logo when space permits (min 110px digital)
- Use Brandmark for sizes below 70px
- Never mix logo variants in same composition
- Never use Aperol logos on Vanilla backgrounds

### Fonts

```
assets/fonts/
├── neue-haas-grotesk-display/   # Headlines, titles
├── neue-haas-grotesk-text/      # Body, inputs
└── offbit/                       # Digital accent (max 2/viewport)
```

### Art Direction

```
assets/art-direction/
├── analog-details/
├── productive-outdoors/
├── the-work/
├── dreamscape/
├── reality-on-film/
└── code-in-life/
```

---

## Color Palette

### Primary

| Color | Hex | Usage |
|-------|-----|-------|
| Aperol | #FE5102 | CTAs, accents (max 10%) |
| Charcoal | #191919 | Dark backgrounds, text |
| Vanilla | #FFFAEE | Light backgrounds, light text |

### Rules

- Backgrounds: Only Vanilla or Charcoal
- Text: Inverse of background
- Aperol: Prefer on Charcoal for accessibility
- Never use Aperol as primary background
- Never use brand colors for borders

### Contrast

- Vanilla on Charcoal: 18.5:1 (AAA)
- Charcoal on Vanilla: 18.5:1 (AAA)

---

## Typography

| Level | Mobile | Desktop | Font |
|-------|--------|---------|------|
| Display 1 | 60px | 160px | NH Display Bold |
| Heading 1 | 32px | 56px | NH Display Bold |
| Heading 5-6 | 18-20px | 24-28px | OffBit |
| Body 1 | 20px | 20px | NH Text Roman |
| Body 2 | 16px | 16px | NH Text Roman |

---

## Visual Territories

### Social Channels (Instagram, Dribbble, Pinterest)

| Territory | Core Concept | Visual Language |
|-----------|-------------|-----------------|
| **Auto** | Performance & Precision | High-contrast automotive, dramatic lighting |
| **Lifestyle** | Human Connection | Authentic portraiture, diverse, natural |
| **Move** | Dynamic Energy | Motion blur, dynamic angles, athletic |

### Deeper Channels (Website, Newsletter)

| Territory | Core Concept | Visual Language |
|-----------|-------------|-----------------|
| **Work** | Design Transformation | Real projects, before/after, data viz |
| **Escape** | Wanderlust & Solitude | Environmental, single figures, golden hour |
| **Feel** | Atmospheric Abstraction | Textures, gradients, organic shapes |

---

## Texture System

### ASCII Textures
- Layer: Back-most
- Opacity: 25%
- Blend: Difference (dark on light) / Plus Darker (light on dark)

### Halftone Textures
- Vanilla BG: 25%, Difference
- Charcoal BG: 100%, Soft Light

### Paper Textures
- Vanilla BG: 50%, Difference
- Charcoal BG: 100%, Hard Light

---

## Content Resources

```
content/
├── illustrations/    # Goodle, Counterfeit collections
├── photos/           # Orange Images, Charcoal Images
├── videos/           # CRT Stock, VHS Textures
├── textures/         # Static texture files
└── composition/      # Mocks, guides, social templates
```

---

## Quick Checklist

Before finalizing any design:

- [ ] Colors within Vanilla/Charcoal/Aperol palette
- [ ] Aperol at max 10% of composition
- [ ] No brand colors for borders
- [ ] Logo meets minimum size requirements
- [ ] OffBit used max 2 times per viewport
- [ ] No Sparkles icon
- [ ] No icons before section headers
- [ ] Contrast meets AAA (18.5:1)

---

## Brand Guidelines

For complete details:

1. `guidelines/markdown/02-brand-identity.md` — Colors, typography, logos
2. `guidelines/markdown/03-art-direction.md` — Visual territories, textures
3. `guidelines/markdown/05-brand-activation.md` — Web, social, physical presence
4. `guidelines/pdf/` — Original PDF references

---

*Questions? Contact the brand team.*

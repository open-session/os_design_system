# Open Session Design System

> The second brain for Open Session brand assets, design tokens, and AI-ready documentation.

---

## Quick Start

### For Designers

1. **Brand Guidelines**: `guidelines/markdown/` — Markdown source (primary)
2. **Assets**: `assets/logos/`, `assets/fonts/`, `assets/art-direction/`
3. **Content**: `content/` — Illustrations, photos, videos, textures

### For Developers

1. **Tailwind Config**: `tokens/tailwind.config.ts` — Ready-to-use Tailwind preset
2. **CSS Variables**: `tokens/ds/brand.css` — CSS custom properties
3. **Component Examples**: `tokens/components/examples/` — Reference implementations
4. **Reference**: `.claude/reference/design-system.md` — Token selection guide

### For AI Agents

1. **Voice & Tone**: `guidelines/markdown/01-brand-messaging.md`
2. **Writing Guides**: `.claude/brand/writing/`
3. **Skills**: `.claude/skills/` — Auto-activating context

---

## Brand Overview

| Color | Hex | Role |
|-------|-----|------|
| **Aperol** | #FE5102 | Primary accent (max 10%) |
| **Charcoal** | #191919 | Warm dark neutral |
| **Vanilla** | #FFFAEE | Warm light neutral |

| Font | Usage |
|------|-------|
| Neue Haas Grotesk Display Pro | Headlines, titles |
| Neue Haas Grotesk Text Pro | Body text, inputs |
| OffBit | Digital accent (max 2/viewport) |

---

## Repository Structure

```
os_design_system/
├── README.md                   # This file
├── assets/                     # Static brand assets
│   ├── logos/                  # main, stamps, accessory, experimental
│   ├── fonts/                  # Display, text, accent fonts
│   └── art-direction/          # Thematic visual collections
├── content/                    # Media resources
│   ├── illustrations/          # Goodle, Counterfeit
│   ├── photos/                 # Brand photography
│   ├── videos/                 # CRT, VHS effects
│   ├── textures/               # Static textures
│   └── composition/            # Templates, guides
├── guidelines/                 # Brand guidelines
│   ├── pdf/                    # Original PDFs (6 documents)
│   └── markdown/               # Converted MDs (5 documents)
├── tokens/                     # Design system
│   ├── tailwind.config.ts      # Tailwind preset (ready to use)
│   ├── ds/                     # CSS variables, transforms, motion
│   └── components/examples/    # Reference implementations
├── docs/                       # Audience guides
│   ├── for-designers.md
│   ├── for-developers.md
│   └── for-agents.md
└── .claude/                    # Claude Code config
    ├── CLAUDE.md
    ├── brand/                  # Identity & writing
    ├── skills/                 # Auto-activating skills
    └── reference/              # Design system ref
```

---

## Guidelines

| Document | Path | Content |
|----------|------|---------|
| Brand Messaging | `guidelines/markdown/01-brand-messaging.md` | Voice, audience, content pillars |
| Brand Identity | `guidelines/markdown/02-brand-identity.md` | Colors, typography, logo system |
| Art Direction | `guidelines/markdown/03-art-direction.md` | Visual territories, textures |
| AI Usage | `guidelines/markdown/04-ai-usage.md` | AI integration across copy, code, creative |
| Brand Activation | `guidelines/markdown/05-brand-activation.md` | Web, social, physical presence |

---

## Design Tokens

Ready-to-use design tokens for any development environment:

```bash
# Import the Tailwind preset
import osTokens from './tokens/tailwind.config';

export default {
  presets: [osTokens],
  // your config
};
```

Key files:
- `tokens/tailwind.config.ts` — Complete Tailwind preset
- `tokens/ds/brand.css` — CSS custom properties (source of truth)
- `tokens/ds/README.md` — Design system formula spec
- `tokens/components/examples/` — Reference component implementations

> See `tokens/README.md` for full integration guide.

---

## Hard Rules

- **Never use the Sparkles icon** — hard brand ban
- **No icons before section headers**
- **Never use Aperol as primary background**
- **Never use brand colors for borders**
- **Max 10% Aperol in any composition**
- **OffBit: max 2 instances per viewport**

---

## Voice Philosophy

> **"Steward, not advisor"** — Speak from within the brand.

- Smart but not smug
- Technical but accessible
- Confident but humble
- Warm but professional

**Formula**: Expert + Humble + Accessible + Community-focused = **Open Session**

---

## Related Resources

- **BOS-3.0**: Production codebase with live design tokens
- **Figma**: Source designs and component library
- **Brand Hub**: Live brand exploration at `/brand-hub`

---

## License

Internal use only. All assets are proprietary to Open Session.

---

*Maintained by Open Session. Last updated May 2026.*

# open session design system

> The "coding CMS" for Open Session — brand assets, design tokens, and AI-ready context in one canonical source.

---

## Quick Start

### For AI Agents (Claude Code/Desktop)

1. **Brand Context**: `brand-context.md` — Single-file consolidated brand reference
2. **Token JSON**: `tokens/exports/tokens.json` — Programmatic token access
3. **Asset Manifest**: `assets/manifest.json` — Asset paths and usage guidelines
4. **Skills**: `.claude/skills/` — Auto-activating brand and development skills

### For Developers

1. **CSS Variables**: `tokens/ds/brand.css` — 787 lines of semantic tokens
2. **Tailwind Config**: `tokens/tailwind.config.ts` — Ready-to-use preset
3. **Components**: `tokens/components/` — Symlinked to BOS-3.0 (source of truth)
4. **Reference**: `.claude/reference/design-system.md` — Token selection guide

### For Designers

1. **Brand Guidelines**: `guidelines/markdown/` — Complete brand documentation
2. **Logos**: `assets/logos/` — SVG/PNG in all variants and colors
3. **Illustrations**: `assets/illustrations/` — 223 Goodle SVGs
4. **Fonts**: `assets/fonts/` — Web (woff2) and desktop (otf/ttf)

---

## Brand Overview

| Color | Hex | Role |
|-------|-----|------|
| **Aperol** | #FE5102 | Primary accent (max 10%) |
| **Charcoal** | #191919 | Warm dark neutral |
| **Vanilla** | #FFFAEE | Warm light neutral |

| Font | Usage |
|------|-------|
| Neue Haas Grotesk Display | Headlines, titles |
| Neue Haas Grotesk Text | Body text, UI |
| OffBit | Digital accent (max 2/viewport) |

**Accessibility**: Vanilla on Charcoal = 18.5:1 (AAA)

---

## Repository Structure

```
os_design_system/
├── README.md                    # This file
├── brand-context.md             # Consolidated AI context (~10KB)
│
├── assets/                      # Static brand assets
│   ├── manifest.json            # Asset paths and metadata
│   ├── logos/
│   │   ├── main/                # brandmark, combo, horizontal, stacked
│   │   │   ├── svg/{charcoal,glass,vanilla}/
│   │   │   └── png/{charcoal,glass,vanilla}/
│   │   ├── accessory/           # filled, outline, monogram
│   │   └── stamps/              # 24 decorative stamps
│   ├── fonts/
│   │   ├── neue-haas-grotesk-display/
│   │   ├── neue-haas-grotesk-text/
│   │   └── offbit/
│   └── illustrations/           # 223 Goodle SVGs
│       ├── avatars/             # 99 character faces
│       ├── hobby/               # 25 leisure activities
│       ├── life/                # 25 everyday scenarios
│       ├── tech/                # 25 technology themes
│       └── work/                # 49 professional scenarios
│
├── guidelines/                  # Brand guidelines
│   ├── pdf/                     # Original PDFs
│   └── markdown/                # 5 converted documents
│       ├── 01-brand-messaging.md
│       ├── 02-brand-identity.md
│       ├── 03-art-direction.md
│       ├── 04-ai-usage.md
│       └── 05-brand-activation.md
│
├── tokens/                      # Design system
│   ├── ds/
│   │   └── brand.css            # CSS variables (source of truth)
│   ├── exports/
│   │   └── tokens.json          # JSON export for tooling
│   ├── components/
│   │   ├── base/                # → BOS-3.0/components/base (symlink)
│   │   ├── custom/              # → BOS-3.0/components/custom (symlink)
│   │   ├── ds/                  # → BOS-3.0/components/ds (symlink)
│   │   └── examples/            # Standalone reference implementations
│   └── tailwind.config.ts       # Tailwind preset
│
├── docs/                        # Audience guides
│   ├── for-designers.md
│   ├── for-developers.md
│   └── for-agents.md
│
└── .claude/                     # Claude Code tooling hub
    ├── CLAUDE.md                # Hub manifest
    ├── core/karimo/             # KARIMO autonomous dev framework
    ├── plugins/                 # 8 reusable plugins
    ├── skills/                  # 15+ auto-activating skills
    ├── agency-packs/            # 5 specialized agent packs
    ├── commands/                # Standalone commands
    └── templates/               # Integration templates
```

---

## Guidelines

| Document | Path | Content |
|----------|------|---------|
| Brand Messaging | `guidelines/markdown/01-brand-messaging.md` | Voice, audience, content pillars |
| Brand Identity | `guidelines/markdown/02-brand-identity.md` | Colors, typography, logo system |
| Art Direction | `guidelines/markdown/03-art-direction.md` | Visual territories, textures |
| AI Usage | `guidelines/markdown/04-ai-usage.md` | AI integration guidelines |
| Brand Activation | `guidelines/markdown/05-brand-activation.md` | Web, social, physical presence |

---

## Design Tokens

Ready-to-use design tokens for any development environment:

```typescript
// Import the Tailwind preset
import osTokens from './tokens/tailwind.config';

export default {
  presets: [osTokens],
  // your config
};
```

Key files:
- `tokens/ds/brand.css` — CSS variables (787 lines, light/dark mode)
- `tokens/exports/tokens.json` — JSON export for programmatic access
- `tokens/tailwind.config.ts` — Complete Tailwind preset
- `tokens/components/` — Symlinks to BOS-3.0 production components

> See `tokens/README.md` for full integration guide.

---

## Component Synchronization

Components are **automatically synced** from BOS-3.0 via GitHub Actions:

```
BOS-3.0 push → GitHub Actions → os_design_system commit
```

| Directory | Source | Files |
|-----------|--------|-------|
| `tokens/components/base/` | UUI base components | ~110 |
| `tokens/components/custom/` | Open Session custom | ~309 |
| `tokens/components/ds/` | Design system transforms | ~33 |

BOS-3.0 is the **single source of truth** — edits here will be overwritten.

**Manual sync:** `./scripts/sync-components.sh`

See `tokens/components/SYNC.md` for details.

---

## Hard Rules

- **Never use the Sparkles icon** — hard brand ban
- **No icons before section headers**
- **Never use Aperol as primary background**
- **Never use brand colors for borders** — use neutral grays
- **Max 10% Aperol in any composition**
- **Never use thick borders** (`border-2` or larger)
- **Always use Style 2 syntax**: `bg-bg-primary` not `bg-[var(--bg-primary)]`

---

## Voice Philosophy

> **"Steward, not advisor"** — Speak FROM within the brand.

- Smart but not smug
- Technical but accessible
- Confident but humble
- Warm but professional

**Formula**: Expert + Humble + Accessible + Community-focused = **Open Session**

---

## Claude Code Tooling

This repository serves as the canonical hub for Claude Code tooling:

| Category | Count | Description |
|----------|-------|-------------|
| Plugins | 8 | feature-dev, pr-review-toolkit, code-review, commit-commands, etc. |
| Skills | 15+ | development (7), tooling (5), brand (3) |
| Agency Packs | 5 | a11y, perf, security, database, ux |
| KARIMO | 22 agents | PRD-driven autonomous development |

See `.claude/CLAUDE.md` for hub documentation.

---

## External Assets

Large media files not included in repo:
- **Video**: `~/Desktop/OS BRAND/CONTENT/VIDEO/`
- **Photo**: `~/Desktop/OS BRAND/CONTENT/PHOTO/`
- **3D/Experimental**: `~/Desktop/OS BRAND/BRAND/LOGO/Experimental/`

---

## Related Resources

- **BOS-3.0**: Production codebase (components source of truth)
- **Figma**: Source designs and component library
- **Brand Hub**: Live brand exploration at `/brand-hub`

---

## License

Internal use only. All assets are proprietary to Open Session.

---

*Open Session Design System — Maintained by Open Session. Last updated May 2025.*

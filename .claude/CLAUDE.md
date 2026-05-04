# Open Session Design System - Claude Configuration

> Brand assets, design tokens, and AI-ready documentation for Open Session.

---

## Repository Overview

This is the **second brain** for Open Session brand — combining:

- **Brand Assets**: Logos, fonts, art direction, content resources
- **Design Tokens**: CSS variables, Tailwind config, component examples
- **Guidelines**: Voice, identity, art direction, AI usage, activation
- **AI Context**: Writing guides, auto-activating skills, design system reference

---

## Quick Start

### For Brand Context

Read in order for full brand understanding:

1. `guidelines/markdown/01-brand-messaging.md` — Voice & tone
2. `guidelines/markdown/02-brand-identity.md` — Colors, typography, logos
3. `guidelines/markdown/03-art-direction.md` — Visual territories, textures
4. `guidelines/markdown/04-ai-usage.md` — AI integration guidelines
5. `guidelines/markdown/05-brand-activation.md` — Web, social, physical presence

### For Development

1. Import `tokens/ds/brand.css` for CSS variables
2. Use `tokens/tailwind.config.ts` as Tailwind preset
3. Reference `tokens/components/examples/` for patterns

### For Content Creation

Check writing guides in `.claude/brand/writing/`:
- `blog.md` — Long-form articles
- `creative.md` — Artistic expression
- `short-form.md` — Social media
- `strategic.md` — Business content

---

## Brand Essence

> We're interdisciplinary designers democratizing world-class design through AI, education, and community.

### Voice Formula

| Attribute | Description |
|-----------|-------------|
| Smart but not smug | Expert without condescension |
| Technical but accessible | Explain complexity simply |
| Confident but humble | Know your stuff, stay open |
| Warm but professional | Friendly without being casual |

**Core attitude**: "Steward, not advisor" — speak FROM within the brand.

---

## Core Colors

| Color | Hex | Role |
|-------|-----|------|
| **Aperol** | #FE5102 | Primary accent (max 10%) |
| **Charcoal** | #191919 | Warm dark neutral |
| **Vanilla** | #FFFAEE | Warm light neutral |

---

## Hard Rules (Never Break)

- **NEVER** use the `Sparkles` icon
- **NEVER** put icons before section headers
- **NEVER** use Aperol as primary background
- **NEVER** use brand colors for borders
- **ALWAYS** maintain AAA contrast (18.5:1)
- **ALWAYS** use Style 2 syntax: `bg-bg-primary` not `bg-[var(--bg-primary)]`

---

## Auto-Activating Skills

| Skill | Triggers On |
|-------|-------------|
| `brand-guidelines` | Brand identity questions |
| `frontend-design` | UI/component work |
| `create-post-copy` | Content creation |

---

## Directory Structure

```
os_design_system/
├── assets/              # Logos, fonts, art direction
├── content/             # Illustrations, photos, textures
├── guidelines/          # Brand guidelines (PDF + Markdown)
├── tokens/              # Design system
│   ├── tailwind.config.ts
│   ├── ds/              # CSS variables, motion, shape
│   └── components/      # Reference implementations
├── docs/                # Audience guides
└── .claude/             # Claude Code config
    ├── brand/writing/   # Writing guides
    ├── skills/          # Auto-activating skills
    └── reference/       # Design system ref
```

---

## File Reference

| Need | File |
|------|------|
| Voice guide | `guidelines/markdown/01-brand-messaging.md` |
| Colors/typography | `guidelines/markdown/02-brand-identity.md` |
| Visual style | `guidelines/markdown/03-art-direction.md` |
| AI integration | `guidelines/markdown/04-ai-usage.md` |
| Activation guide | `guidelines/markdown/05-brand-activation.md` |
| Tailwind config | `tokens/tailwind.config.ts` |
| CSS variables | `tokens/ds/brand.css` |
| Design system | `.claude/reference/design-system.md` |

---

## Related Resources

- **BOS-3.0**: Production codebase using these tokens
- **Figma**: Source designs and component library
- **Brand Hub**: Live brand exploration at `/brand-hub`

---

*Open Session Design System — The second brain for brand consistency.*

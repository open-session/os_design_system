# Open Session Design System - Claude Configuration Hub

> Central hub for brand assets, design tokens, and agnostic Claude Code tooling.

---

## Repository Overview

This repository serves two purposes:

1. **Brand System**: Logos, tokens, guidelines, and content resources for Open Session
2. **Claude Code Hub**: Canonical template for agnostic Claude Code tooling (KARIMO, plugins, skills)

---

## Quick Start

### For New Projects

Copy the tooling you need to your project. See `templates/integration-guide.md` for full instructions.

```bash
# Copy essential skills
cp -R .claude/skills/development/* your-project/.claude/skills/

# Copy plugins you need
cp -R .claude/plugins/feature-dev your-project/.claude/plugins/
cp -R .claude/plugins/commit-commands your-project/.claude/plugins/

# Copy KARIMO for PRD-driven development
cp -R .claude/core/karimo your-project/.claude/plugins/karimo
```

### For Brand Context

Read in order for full brand understanding:

1. `guidelines/markdown/01-brand-messaging.md` — Voice & tone
2. `guidelines/markdown/02-brand-identity.md` — Colors, typography, logos
3. `guidelines/markdown/03-art-direction.md` — Visual territories, textures
4. `guidelines/markdown/04-ai-usage.md` — AI integration guidelines
5. `guidelines/markdown/05-brand-activation.md` — Web, social, physical presence

---

## Claude Code Hub Structure

```
.claude/
├── CLAUDE.md                    # This file (hub manifest)
├── README.md                    # Hub documentation
│
├── core/                        # Foundational methodology
│   └── karimo/                  # KARIMO autonomous dev framework
│       ├── KARIMO_RULES.md      # Core methodology rules
│       ├── agents/              # 22 specialized agents
│       ├── commands/            # 11 commands (/karimo:*)
│       └── skills/              # Internal KARIMO skills
│
├── plugins/                     # Reusable plugins
│   ├── feature-dev/             # 7-phase feature workflow
│   ├── pr-review-toolkit/       # Multi-agent PR review
│   ├── code-review/             # Automated code review
│   ├── plugin-dev/              # Plugin creation toolkit
│   ├── commit-commands/         # Git commit helpers
│   ├── agent-sdk-dev/           # Agent SDK development
│   ├── hookify/                 # Custom hooks framework
│   └── ralph-wiggum/            # AI loop handler
│
├── skills/                      # Auto-activating skills
│   ├── development/             # Workflow skills
│   │   ├── incremental-commits/
│   │   ├── verification-before-completion/
│   │   ├── writing-plans/
│   │   ├── systematic-debugging/
│   │   ├── subagent-driven-development/
│   │   ├── security-guidance/
│   │   └── docs-conventions/
│   ├── tooling/                 # Tool-specific skills
│   │   ├── skill-creator/
│   │   ├── website-intelligence/
│   │   ├── firecrawl-web-tools/
│   │   ├── git-worktree-ops/
│   │   └── untitled-ui/
│   └── brand/                   # Brand-specific skills
│       ├── brand-guidelines/
│       ├── frontend-design/
│       └── create-post-copy/
│
├── commands/                    # Standalone commands
│   ├── design-review.md         # Design system validation
│   ├── chatlog.md               # Export conversation
│   ├── restart.md               # Reset session
│   └── use-pack.md              # Load agency packs
│
├── agency-packs/                # Specialized agent templates
│   ├── a11y/                    # Accessibility auditor
│   ├── perf/                    # Performance benchmarker
│   ├── security/                # Security engineer
│   ├── database/                # Database optimizer
│   └── ux/                      # UX researcher
│
├── brand/writing/               # Writing guides
├── reference/                   # Design system reference
└── templates/                   # Integration templates
    ├── settings.json.template
    ├── claude.md.template
    └── integration-guide.md
```

---

## Available Plugins

| Plugin | Command | Purpose |
|--------|---------|---------|
| feature-dev | `/feature-dev` | 7-phase feature development workflow |
| pr-review-toolkit | `/review-pr` | Multi-agent PR review system |
| code-review | `/code-review` | Automated code review |
| commit-commands | `/commit` | Git commit with conventional format |
| plugin-dev | `/create-plugin` | Plugin creation toolkit |
| agent-sdk-dev | `/new-sdk-app` | Anthropic Agent SDK development |

---

## Auto-Activating Skills

### Development Skills

| Skill | Triggers On |
|-------|-------------|
| `incremental-commits` | Commit-related work |
| `verification-before-completion` | Task completion |
| `systematic-debugging` | Debugging sessions |
| `writing-plans` | Plan documentation |
| `subagent-driven-development` | Multi-agent patterns |
| `security-guidance` | Security considerations |

### Brand Skills

| Skill | Triggers On |
|-------|-------------|
| `brand-guidelines` | Brand identity questions |
| `frontend-design` | UI/component work |
| `create-post-copy` | Content creation |

---

## KARIMO Framework

KARIMO enables PRD-driven autonomous development with multi-agent execution.

### Core Commands

| Command | Purpose |
|---------|---------|
| `/karimo:research` | Research phase with web context |
| `/karimo:plan` | Interview → PRD generation |
| `/karimo:run` | Execute PRD tasks in parallel |
| `/karimo:merge` | Final PR creation |
| `/karimo:feedback` | Learning capture |

### Key Features

- Feature branch execution model
- Wave-based parallel task execution
- Automatic Greptile review integration
- Loop awareness and model escalation
- 22 specialized agents

See `core/karimo/README.md` for full documentation.

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

## Integration

To use this hub in your project:

1. Copy directories you need to your `.claude/` folder
2. Customize `CLAUDE.md` with your project specifics
3. Configure `settings.json` for permissions

See `templates/integration-guide.md` for detailed instructions.

---

## Related Resources

- **BOS-3.0**: Production codebase using these tokens
- **Figma**: Source designs and component library
- **Brand Hub**: Live brand exploration at `/brand-hub`

---

*Open Session Design System — Central hub for brand and Claude Code tooling.*

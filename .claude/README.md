# OS Design System - Claude Code Hub

Central repository for agnostic Claude Code tooling extracted from BOS-3.0.

## Purpose

This `.claude/` directory serves as:

1. **Canonical Template** - Copy tooling to new projects
2. **Reference Hub** - Engineers and designers can browse and adapt
3. **Agnostic Versions** - Proven tooling made project-agnostic

## Quick Reference

| Need | Location |
|------|----------|
| PRD-driven development | `core/karimo/` |
| Feature workflow | `plugins/feature-dev/` |
| PR review | `plugins/pr-review-toolkit/` |
| Commit helpers | `plugins/commit-commands/` |
| Development skills | `skills/development/` |
| Brand skills | `skills/brand/` |
| Agency packs | `agency-packs/` |
| Integration guide | `templates/integration-guide.md` |

## Directory Structure

```
.claude/
├── core/karimo/           # KARIMO autonomous dev framework
├── plugins/               # 8 reusable plugins
├── skills/
│   ├── development/       # 7 workflow skills
│   ├── tooling/           # 5 tool-specific skills
│   └── brand/             # 3 brand skills
├── commands/              # 4 standalone commands
├── agency-packs/          # 5 specialized agent templates
├── brand/writing/         # Writing guides
├── reference/             # Design system docs
└── templates/             # Integration templates
```

## Getting Started

### Copy to Your Project

```bash
# Minimum (all projects should have)
cp -R skills/development/incremental-commits/ your-project/.claude/skills/
cp -R plugins/commit-commands/ your-project/.claude/plugins/

# Recommended
cp -R plugins/feature-dev/ your-project/.claude/plugins/
cp -R plugins/code-review/ your-project/.claude/plugins/
cp -R skills/development/ your-project/.claude/skills/development/

# Full KARIMO setup
cp -R core/karimo/ your-project/.claude/plugins/karimo/
```

### Use Templates

```bash
# CLAUDE.md scaffold
cp templates/claude.md.template your-project/.claude/CLAUDE.md

# Settings
cp templates/settings.json.template your-project/.claude/settings.json
```

See `templates/integration-guide.md` for complete instructions.

## What's Included

### KARIMO Framework (core/karimo/)

PRD-driven autonomous development with 22 specialized agents.

- Interview → PRD → Parallel Execution → Review
- Feature branch model with wave-based task execution
- Automatic Greptile code review integration
- Loop awareness and Sonnet→Opus escalation

### Plugins (8 total)

| Plugin | Purpose |
|--------|---------|
| feature-dev | 7-phase feature development |
| pr-review-toolkit | Multi-agent PR review |
| code-review | Automated code review |
| commit-commands | `/commit` with conventional format |
| plugin-dev | Create new plugins |
| agent-sdk-dev | Anthropic Agent SDK |
| hookify | Custom hooks framework |
| ralph-wiggum | AI loop handler |

### Skills (15 total)

**Development (7)**: incremental-commits, verification-before-completion, writing-plans, systematic-debugging, subagent-driven-development, security-guidance, docs-conventions

**Tooling (5)**: skill-creator, website-intelligence, firecrawl-web-tools, git-worktree-ops, untitled-ui

**Brand (3)**: brand-guidelines, frontend-design, create-post-copy

### Commands (4 total)

- `/design-review` - Design system validation
- `/chatlog` - Export conversation
- `/restart` - Reset session
- `/use-pack` - Load agency packs

### Agency Packs (5 total)

Specialized agents loaded on-demand with `/use-pack`:

- **a11y** - Accessibility auditor
- **perf** - Performance benchmarker
- **security** - Security engineer
- **database** - Database optimizer
- **ux** - UX researcher

## Origin

This hub was extracted from BOS-3.0's `.claude/` directory and made project-agnostic:

- Removed BOS-specific path references
- Made design system checks configurable
- Updated conventions to read from project CLAUDE.md
- Created integration templates for new projects

BOS-3.0 continues to evolve independently with its own configuration.

## Relationship Model

```
┌───────────────────────────────────────────────┐
│         os_design_system/.claude/             │
│           (this hub - canonical)              │
└───────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌────────────────┐   ┌────────────────┐
│  New Project A │   │  New Project B │
│ (copies/adapts)│   │ (copies/adapts)│
└────────────────┘   └────────────────┘
```

## License

Internal Open Session tooling. Contact team for usage outside organization.

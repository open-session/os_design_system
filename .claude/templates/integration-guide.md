# Integration Guide

How to use the OS Design System Claude Hub in your project.

---

## Quick Start

### 1. Copy Essential Directories

Copy the directories you need from this hub to your project's `.claude/` folder:

```bash
# Minimum setup (recommended for all projects)
cp -R os_design_system/.claude/skills/development/* your-project/.claude/skills/
cp -R os_design_system/.claude/plugins/commit-commands your-project/.claude/plugins/

# Full setup (for comprehensive tooling)
cp -R os_design_system/.claude/core your-project/.claude/
cp -R os_design_system/.claude/plugins your-project/.claude/
cp -R os_design_system/.claude/skills your-project/.claude/
cp -R os_design_system/.claude/commands your-project/.claude/
cp -R os_design_system/.claude/agency-packs your-project/.claude/
```

### 2. Create Your CLAUDE.md

Use the template as a starting point:

```bash
cp os_design_system/.claude/templates/claude.md.template your-project/.claude/CLAUDE.md
```

Then customize for your project.

### 3. Configure Settings

Use the settings template:

```bash
cp os_design_system/.claude/templates/settings.json.template your-project/.claude/settings.json
```

---

## What to Copy

### Minimum (All Projects)

| Item | Purpose |
|------|---------|
| `skills/development/incremental-commits/` | Commit discipline |
| `skills/development/verification-before-completion/` | Quality checks |
| `plugins/commit-commands/` | `/commit` command |

### Recommended (Most Projects)

| Item | Purpose |
|------|---------|
| `plugins/feature-dev/` | 7-phase feature workflow |
| `plugins/code-review/` | Automated code review |
| `plugins/pr-review-toolkit/` | PR review agents |
| `skills/development/systematic-debugging/` | Debug methodology |
| `commands/design-review.md` | Design system checks |

### Advanced (Complex Projects)

| Item | Purpose |
|------|---------|
| `core/karimo/` | Full PRD-driven development |
| `plugins/hookify/` | Custom hooks framework |
| `agency-packs/` | Specialized agent templates |

---

## Integration Patterns

### Pattern 1: Copy and Adapt

The simplest approach. Copy what you need, adapt to your project:

1. Copy the directories
2. Update paths/references in copied files
3. Add project-specific rules to CLAUDE.md

### Pattern 2: Selective Import

Cherry-pick specific files:

```bash
# Just the skills you need
mkdir -p your-project/.claude/skills/development
cp os_design_system/.claude/skills/development/incremental-commits/SKILL.md \
   your-project/.claude/skills/development/incremental-commits/SKILL.md
```

### Pattern 3: Reference Hub

Keep the hub as a reference, copy when needed:

```bash
# Symlink for reference (don't commit)
ln -s /path/to/os_design_system/.claude .claude-hub
# Then copy specific files as needed
```

---

## Customization Guide

### Skills

Skills auto-activate based on keywords in their SKILL.md frontmatter:

```yaml
---
trigger_keywords:
  - "commit"
  - "git"
  - "push"
---
```

Modify these to fit your project's terminology.

### Commands

Commands are invoked with `/command-name`. The filename determines the command name:

- `design-review.md` → `/design-review`
- `my-custom.md` → `/my-custom`

### Plugins

Plugins bundle commands, agents, and skills together. Each plugin has:

- `.claude-plugin/plugin.json` - Manifest
- `commands/` - Plugin commands
- `agents/` - Plugin agents (optional)
- `skills/` - Plugin skills (optional)

---

## KARIMO Setup

For full PRD-driven autonomous development:

### 1. Copy KARIMO Core

```bash
cp -R os_design_system/.claude/core/karimo your-project/.claude/plugins/karimo
```

### 2. Create Config Directory

```bash
mkdir -p your-project/.karimo
```

### 3. Create config.yaml

```yaml
# .karimo/config.yaml
github:
  owner_type: organization  # or "user"
  owner: your-org-name
  repository: your-repo-name

execution:
  default_mode: feature_branch  # or "direct_to_main"

models:
  default: sonnet
  complex_threshold: 5  # Tasks with complexity 5+ use opus
```

### 4. Add KARIMO Section to CLAUDE.md

```markdown
<!-- KARIMO:START -->
## KARIMO

Commands: `/karimo:plan`, `/karimo:run`, `/karimo:merge`
Config: `.karimo/config.yaml`
<!-- KARIMO:END -->
```

---

## Agency Packs

Load specialized agents on demand with `/use-pack`:

```
/use-pack a11y      # Accessibility auditor
/use-pack perf      # Performance benchmarker
/use-pack security  # Security engineer
/use-pack database  # Database optimizer
/use-pack ux        # UX researcher
```

---

## Troubleshooting

### Skills Not Activating

1. Check the skill's `trigger_keywords` match your conversation
2. Ensure SKILL.md has valid frontmatter
3. Verify the skill directory is in `.claude/skills/`

### Commands Not Found

1. Verify the command file exists in `.claude/commands/`
2. Check the frontmatter has required fields
3. Ensure the file extension is `.md`

### KARIMO Issues

1. Run `/karimo:doctor` for diagnostics
2. Check `.karimo/config.yaml` exists
3. Verify GitHub MCP server is configured

---

## Version Compatibility

This hub was extracted from BOS-3.0 and made agnostic. It's designed to work with:

- Claude Code CLI v1.x+
- Any JavaScript/TypeScript project
- Projects using Tailwind CSS (for design-review)
- Git-based workflows

---

*OS Design System Hub - Central Claude Code tooling for Open Session projects*

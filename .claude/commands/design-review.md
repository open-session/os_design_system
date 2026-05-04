---
description: Run a design-system quality check against staged changes. Flags DS violations with file:line citations and returns PASS or FAIL.
allowed-tools: Read, Bash, Grep
---

# /design-review — Design System Quality Check

You are executing a pre-commit design-system review. First, read the project's `.claude/CLAUDE.md` and `.claude/reference/design-system.md` (if present) to understand project-specific design rules. Apply those rules alongside the standard violation patterns below.

## Step 1: Get the staged diff

Run `git diff --cached` to obtain the staged changes.

If git state is unavailable (e.g., slash-command context without git access), fall back:

1. Run `git status --porcelain` to list modified files.
2. Read each modified file from disk.
3. Treat the entire file content as the diff scope.

## Step 2: Identify files in scope

From the diff, extract the list of modified files. Skip files outside component directories (consult project CLAUDE.md for the component directory structure). Non-component files (test files, config, docs) are out of scope.

Default component paths (adapt to project structure):
- `components/`
- `app/` (only UI components, not API routes)

## Step 3: Scan for violations

Check each in-scope file for these standard violation categories. Record every match with **file path and line number**. Projects may define additional rules in their CLAUDE.md.

### Violation 1 — Raw color Tailwind classes

Pattern: `text-gray-`, `bg-gray-`, `border-gray-` (or any hardcoded color like `text-blue-500`)

These should be replaced with semantic tokens from the design system (e.g., `text-fg-secondary`, `bg-bg-secondary`). Raw color classes bypass theming.

### Violation 2 — Thick border (`border-2`)

Pattern: `border-2`

Generally, use `border` (1px) for subtle borders. Thick borders can overwhelm the design.

### Violation 3 — Banned icon imports

Check project CLAUDE.md for banned icons. Common examples:
- `Sparkles` icon from Lucide (hard ban in many projects)

Pattern: `import.*{BannedIcon}` or `from.*{BannedIcon}`

### Violation 4 — Bracket CSS variable syntax (Style 1)

Pattern: `bg-\[var\(--`, `text-\[var\(--`, `border-\[var\(--`, or any `[var(--` bracket notation

Use mapped classes instead (Style 2): `bg-bg-primary` not `bg-[var(--bg-primary)]`. Bracket notation breaks opacity modifiers silently.

### Violation 5 — Brand color misuse

Pattern: Brand/accent colors (e.g., `brand-solid`, `primary`) applied to non-CTA elements.

Brand colors should typically be reserved for call-to-action elements, not general text or backgrounds.

## Step 4: Produce the report

Output a structured report using this format:

```
## Design Review

**Files reviewed:** {n}
**Violations found:** {total}

### Violation 1 — Raw color classes
{No violations} OR:
- components/ui/button.tsx:42 — `text-gray-400`
- components/card.tsx:18 — `bg-gray-100`

### Violation 2 — border-2
{No violations} OR:
- components/input.tsx:31 — `border-2`

### Violation 3 — Banned icons
{No violations} OR:
- components/chat/message.tsx:5 — `import { Sparkles } from 'lucide-react'`

### Violation 4 — Bracket CSS syntax
{No violations} OR:
- components/badges.tsx:12 — `bg-[var(--bg-primary)]`

### Violation 5 — Brand color misuse
{No violations} OR:
- app/dashboard/page.tsx:88 — `text-brand-solid` on a non-CTA element

---
**Verdict: PASS** (no violations)
```

or:

```
---
**Verdict: FAIL** — {n} violation(s) found. Fix before committing.
```

## Implementation notes

- Each violation must include a file path, line number, and the offending string.
- If a violation is ambiguous (e.g., brand color on an element that may be a CTA), flag it with a note: `(verify manually — may be a CTA element)`.
- If no files are in scope (diff is empty or all changes are in non-component files), report: `No component files in staged diff — design review skipped. Verdict: PASS`.
- This command is read-only. Do not modify any files.
- Adapt violation patterns to project-specific conventions defined in CLAUDE.md.

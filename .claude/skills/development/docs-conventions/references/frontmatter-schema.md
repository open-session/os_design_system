# Frontmatter Schema — Reference

Mirrors the zod schema in [scripts/lint-docs-frontmatter.ts](../../../../scripts/lint-docs-frontmatter.ts). When the lint script changes, update this file and the main [SKILL.md](../SKILL.md) together.

## Full schema

```yaml
---
# Required
title: string # non-empty
status: open | in-progress | shipped | closed | stale
audience: designer | backend | shared | ops
owner: '@<handle>' # must start with @

# Required: at least one date field
created: 'YYYY-MM-DD'
last-audited: 'YYYY-MM-DD'

# Optional lineage
related: [path1, path2] # array of relative paths
supersedes: [path1] # docs this file replaces
prd: '<slug or number>' # KARIMO PRD link (singular)
prds: ['<slug>', '<slug>'] # multi-PRD case
pr: '#<number>' # pinning PR
commit: '<sha>' # pinning commit SHA

# Optional confidence (for research/audit docs)
confidence: high | medium | low
confidence-method: '<how confidence was established>'
---
```

## Field-by-field

### `title` — string, required

The human-readable title shown in `docs/INDEX.md`. Should match the first `# <heading>` in the body.

### `status` — enum, required

| Value         | Meaning                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| `open`        | Work begun, outcome not yet known (spikes, roadmap items)                |
| `in-progress` | Actively being executed                                                  |
| `shipped`     | Concluded, current, authoritative                                        |
| `closed`      | Concluded, archived (audits, superseded spikes, completed roadmap items) |
| `stale`       | Known-outdated — kept for lineage; usually carries `supersedes:`         |

### `audience` — enum, required

| Value      | Primary readers                    |
| ---------- | ---------------------------------- |
| `designer` | Designers, frontend engineers      |
| `backend`  | Backend / infra engineers          |
| `shared`   | Cross-role (default when in doubt) |
| `ops`      | Operations, infrastructure, SRE    |

Drives grouping in `docs/INDEX.md`.

### `owner` — `@handle`, required

Single point of accountability. Must match `/^@\w+/`. Group handles (`@open-session/development`) are allowed.

### `created` / `last-audited` — YYYY-MM-DD

At least one must be present. `created` stays fixed after first write; `last-audited` bumps when substantive content changes. For docs older than the convention (backfilled), `last-audited` may be the only date.

### Optional lineage fields

| Field        | Example                                    | When                                                           |
| ------------ | ------------------------------------------ | -------------------------------------------------------------- |
| `related`    | `[docs/concepts/auth-surfaces.md]`         | Sibling docs in the same topical cluster                       |
| `supersedes` | `[docs/concepts/old-path.md]`              | Deprecation / replacement — this doc replaces the listed files |
| `prd`        | `.karimo/prds/015_onboarding-readiness/`   | Tied to a single KARIMO PRD                                    |
| `prds`       | `['015_onboarding', '016_auth-migration']` | Multiple PRDs draw on this doc                                 |
| `pr`         | `#219`                                     | The PR that shipped the subject of this doc                    |
| `commit`     | `09898ead`                                 | The commit SHA this doc describes / was written against        |

### Confidence fields (research / audit docs)

| Field               | Purpose                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `confidence`        | `high` / `medium` / `low` — self-grade of certainty                                               |
| `confidence-method` | Prose description of how confidence was established (e.g., direct inspection, external benchmark) |

## Validation

- Unknown keys are stripped silently (zod default). Don't rely on it — if a field isn't in this list, it doesn't belong.
- Empty arrays are allowed (`related: []`) but prefer omitting the field.
- Null values are tolerated for legacy docs but should not be used in new docs.

## Exclusions

- `docs/INDEX.md` — auto-generated, no frontmatter, skipped by lint.
- `docs/_templates/` — scaffolds, carry placeholder frontmatter, skipped by lint and INDEX.

## Changing the schema

1. Update [scripts/lint-docs-frontmatter.ts](../../../../scripts/lint-docs-frontmatter.ts).
2. Update this file (field-by-field section).
3. Update [docs/CONVENTIONS.md §4](../../../../docs/CONVENTIONS.md).
4. Update the `docs-conventions` skill's §3.
5. Update the scaffolds in [docs/\_templates/](../../../../docs/_templates/) if the change adds a required field.
6. Run `bun run lint:docs` against every existing doc — ship backfill commits if anything breaks.

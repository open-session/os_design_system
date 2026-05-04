# Archetype Matrix — Quick Reference

One-page lookup for the eleven doc archetypes. Paired with [../SKILL.md](../SKILL.md) and the scaffolds in [docs/\_templates/](../../../../docs/_templates/).

## At a glance

| Archetype      | Folder            | Status default | Key frontmatter                                    | Required sections                                                                 |
| -------------- | ----------------- | -------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| Spike          | `spikes/`         | `open`         | `created`, `owner`, `audience`                     | TL;DR · Context · Options · Recommendation · Open questions · Evidence            |
| Decision (ADR) | `decisions/`      | `shipped`      | `created`, `owner`, `commit`                       | Status · Context · Decision · Consequences · Alternatives                         |
| Concept        | `concepts/`       | `shipped`      | `created`, `last-audited`, `related`               | Summary · When it applies · Model · Code pointers · Gotchas · Related             |
| Overview       | `overview/`       | `shipped`      | `created`, `last-audited`, `related`               | What this is · Subsystems · Data flow · Interfaces · Operational notes · Related  |
| Component doc  | `components/`     | `shipped`      | `created`, `owner`, `audience: designer`           | Import · Props · Usage · devProps · Edge cases · Tests · Standards checklist      |
| Design-system  | `design-system/`  | `shipped`      | `created`, `owner`, `audience: designer`           | Rule · Rationale · Do/Don't · Tokens · Enforcement · Related                      |
| Roadmap        | `roadmap/`        | `open`         | `created`, `owner`; add `pr`/`commit` when shipped | Outcome · Why now · Phases · Risks · Related research                             |
| Testing        | `testing/`        | `shipped`      | `created`, `owner`; add `pr`/`commit` for reports  | Scope · Approach · Fixtures · Test matrix · Results · Next steps                  |
| Audit          | `audits/YYYY-MM/` | `closed`       | `created`, `commit`, `confidence`                  | TL;DR · Context · Findings · Action plan · Evidence · Out of scope                |
| Onboarding     | `onboarding/`     | `shipped`      | `created`, `last-audited`, `related`               | Who this is for · Before you start · Day 1 · Day 2 · Week 1 · Where to go next    |
| DevOps         | `devops/`         | `shipped`      | `created`, `last-audited`, `related`               | Purpose · When you'd use this · Prerequisites · Steps · Troubleshooting · Related |

## Folder-to-archetype mapping

```
docs/
├── CONVENTIONS.md          ← master guide (this schema enforced here)
├── README.md               ← folder map + role routing
├── INDEX.md                ← auto-generated, do not edit
├── _templates/             ← scaffolds (excluded from lint + INDEX)
├── audits/YYYY-MM/*.md     ← audit archetype, append-only
├── audits/archive/*.md     ← historical audits (pre-ISO naming, Notion exports)
├── components/*.md         ← component-doc archetype
├── concepts/*.md           ← concept archetype
├── decisions/NNNN-*.md     ← decision (ADR) archetype
├── design-system/*.md      ← design-system archetype
├── devops/*.md             ← devops archetype
├── onboarding/*.md         ← onboarding archetype
├── overview/*.md           ← overview archetype
├── roadmap/*.md            ← roadmap archetype
├── spikes/*.md             ← spike archetype
└── testing/*.md            ← testing archetype
```

## Disambiguation cheats

When you're torn between two archetypes:

- **Spike vs Decision** — spike answers "what should we do?"; decision answers "what we did and why." Spike leads to decision if adopted.
- **Decision vs Concept** — decision captures the _choice_ at a point in time (ADR); concept captures the _pattern_ as it lives in the code today.
- **Onboarding vs DevOps** — onboarding gets a new person running; devops is how any operator runs the tooling. `dev-environment-setup` is devops (anyone may re-run); `designer-quickstart` is onboarding (day-1 primer).
- **Concept vs Overview** — "why does this work the way it does" → concept. "What is this thing and where does it live" → overview.
- **Concept vs DevOps** — "what is the pattern" → concept. "How do I execute the procedure" → devops.
- **Spike vs Audit** — "before a decision" → spike. "after a decision / incident / snapshot" → audit.
- **Overview vs DevOps** — "reference I'll read once" → overview. "runbook I'll return to" → devops.
- **Roadmap vs Spike** — "we've decided to do this; here's the plan" → roadmap. "we haven't decided; here's the research" → spike.
- **Roadmap vs Decision** — roadmap is the plan to _execute_ a decision; decision is the choice being executed.
- **Audit vs Roadmap (shipped)** — audit records what _happened_; roadmap records what _will ship_. When a roadmap item completes, pin `pr:` + `commit:` and bump to `shipped` — don't convert to an audit.

## When the tree returns "none of the above"

Stop. Either:

1. Reframe the doc to fit an existing archetype (most cases — RFCs fit roadmap or decision; runbooks fit devops; tutorials fit onboarding or devops).
2. Propose a new archetype to the user, with an updated CONVENTIONS.md §3, a new scaffold in `_templates/`, and updates to both this matrix and [SKILL.md](../SKILL.md) §1.

Do not silently create a new folder.

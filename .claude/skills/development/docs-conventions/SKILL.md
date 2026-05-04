---
name: docs-conventions
description: Enforce BOS docs/ folder taxonomy, frontmatter schema, and lineage conventions. Activates when creating, editing, or reviewing any markdown file under docs/, when editing docs/_templates/, or when the user asks to write documentation, a spike, an ADR, an audit, a runbook, an overview, or a roadmap item.
---

# Docs Conventions

> This skill activates when any file path matches `docs/**/*.md` or `docs/_templates/*.md`, when the user says "write docs", "add a spike", "document this", "write an ADR", "create an overview", "write a runbook", or similar. The canonical human guide is [docs/CONVENTIONS.md](../../../docs/CONVENTIONS.md); this skill makes Claude enforce it.

---

## The Iron Law

**NO DOC SHIPS WITHOUT COMPLETE FRONTMATTER AND A CORRECT FOLDER.**

Every `docs/**/*.md` file must have valid YAML frontmatter (`title`, `status`, `audience`, `owner`, and either `created` or `last-audited`) and live in the folder whose archetype matches its purpose. `scripts/lint-docs-frontmatter.ts` blocks CI on violations — the skill blocks the draft.

---

## Activation behavior

When a user asks Claude to produce or edit a doc:

1. **Identify the archetype** from the user's request (spike / concept / overview / component / design-system / roadmap / testing / audit / devops). Ask if ambiguous.
2. **Pick the folder** via the decision tree in §2 below. Do not invent new folders.
3. **Copy the matching scaffold** from [`docs/_templates/`](../../../docs/_templates/). Do not write frontmatter from scratch — the scaffold IS the contract.
4. **Fill the frontmatter** with validated values (see §3). Refuse to proceed if any required field is unknown — ask the user.
5. **Only then** write the body, using the section skeleton as the outline.
6. **Verify** with `bun run lint:docs` before declaring done.

If the user asks to skip frontmatter or stash a doc "without all that stuff": refuse. Explain which field is missing and ask them to supply it.

---

## 1. The eleven archetypes

| Archetype      | Folder            | Template                           | Lifecycle                          | Audience default |
| -------------- | ----------------- | ---------------------------------- | ---------------------------------- | ---------------- |
| Spike          | `spikes/`         | `docs/_templates/spike.md`         | `open` → `in-progress` → `closed`  | `shared`         |
| Decision (ADR) | `decisions/`      | `docs/_templates/decision.md`      | `shipped` (flip on Superseded)     | `shared`         |
| Concept        | `concepts/`       | `docs/_templates/concept.md`       | `shipped` (evergreen)              | `shared`         |
| Overview       | `overview/`       | `docs/_templates/overview.md`      | `shipped` + quarterly audit        | `shared`         |
| Component doc  | `components/`     | `docs/_templates/component.md`     | `shipped`                          | `designer`       |
| Design-system  | `design-system/`  | `docs/_templates/design-system.md` | `shipped`                          | `designer`       |
| Roadmap        | `roadmap/`        | `docs/_templates/roadmap.md`       | `open` → `in-progress` → `shipped` | `shared`         |
| Testing        | `testing/`        | `docs/_templates/testing.md`       | `shipped`                          | `backend`        |
| Audit          | `audits/YYYY-MM/` | `docs/_templates/audit.md`         | `closed` (append-only)             | `shared`         |
| Onboarding     | `onboarding/`     | `docs/_templates/onboarding.md`    | `shipped` + quarterly audit        | `shared`         |
| DevOps         | `devops/`         | `docs/_templates/devops.md`        | `shipped` + quarterly audit        | `ops`            |

Override the default only when a doc's primary readership genuinely differs from the archetype norm (e.g., a design-system doc that's cross-role gets `audience: shared`, as with [docs/design-system/uui-transformation-rules.md](../../../docs/design-system/uui-transformation-rules.md)).

---

## 2. Folder decision tree

Walk top-down; stop at the first match.

```
Dated investigation / incident post-mortem / point-in-time snapshot?
  → audits/YYYY-MM/<slug>.md                 (append-only, status: closed)

Research produced BEFORE a decision is made?
  → spikes/<slug>.md                         (status: open/in-progress/closed, link a prd on close)

A SINGLE architectural decision (what we chose + why)?
  → decisions/NNNN-<slug>.md                 (ADR-lite, status: shipped, flip on Superseded)

Planned initiative with phases and a target state?
  → roadmap/<slug>.md                        (open → in-progress → shipped)

Onboarding material — day-1/week-1 content for new contributors?
  → onboarding/<slug>.md                     (shipped, quarterly last-audited)

How-to-operate: dev toolchain, CI/CD, secrets, infra, setup procedure?
  → devops/<slug>.md                         (shipped, quarterly last-audited)

Component API / standard / checklist?
  → components/<slug>.md                     (shipped)

Design-system rule / token reference / Figma alignment?
  → design-system/<slug>.md                  (shipped)

Test strategy / test plan / test results?
  → testing/<slug>.md                        (shipped)

Cross-cutting architectural pattern — the "why" behind a system?
  → concepts/<slug>.md                       (shipped, evergreen)

Canonical "what IS X" system reference?
  → overview/<slug>.md                       (shipped, last-audited tracked)

None of the above?
  → STOP. Ask the user before minting a new folder.
```

---

## 3. Frontmatter schema

Canonical source: [scripts/lint-docs-frontmatter.ts](../../../scripts/lint-docs-frontmatter.ts). Detailed reference: [references/frontmatter-schema.md](./references/frontmatter-schema.md).

### Required

| Field      | Format                                              | Purpose                                   |
| ---------- | --------------------------------------------------- | ----------------------------------------- |
| `title`    | non-empty string                                    | Human-readable title shown in `INDEX.md`  |
| `status`   | `open \| in-progress \| shipped \| closed \| stale` | Lifecycle state                           |
| `audience` | `designer \| backend \| shared \| ops`              | Role routing — drives `INDEX.md` grouping |
| `owner`    | `@<handle>`                                         | Single point of accountability            |
| date       | `created` or `last-audited` (YYYY-MM-DD)            | At least one must be present              |

### Optional (use eagerly — lineage compounds)

| Field               | When to use                                       |
| ------------------- | ------------------------------------------------- |
| `related`           | Array of relative paths to sibling docs           |
| `supersedes`        | Array of relative paths to docs this replaces     |
| `prd`               | Link from spike → PRD it spawned                  |
| `prds`              | Array when multiple PRDs draw on the same spike   |
| `pr`                | Pin a doc to the PR that shipped its subject      |
| `commit`            | Pin a doc to a specific commit SHA                |
| `confidence`        | `high \| medium \| low` — for research/audit docs |
| `confidence-method` | Free-form — how confidence was established        |

**Omit empty fields.** Do not use `null`. Use relative paths for in-repo targets.

---

## 4. Lineage rules

Write lineage whenever it applies. It's the highest-leverage signal for retrieval in the BOS Context System.

- **`related`** — the doc has a sibling covering the same topic from another angle. Bidirectional ideal.
- **`supersedes`** — this doc replaces an older one (e.g., a moved file, a deprecated pattern). The new doc points at the old path.
- **`prd`** — the doc tied to KARIMO PRD execution (spike → PRD, or PRD-merged feature → concept doc).
- **`pr` / `commit`** — pin a doc to the exact code change it describes. Use for audits, roadmap "shipped" state, and point-in-time overviews.

---

## 5. Before writing

- [ ] Identify archetype from the user's request (or ask).
- [ ] Walk the decision tree → pick the folder.
- [ ] Read the existing folder contents: is there already a doc on this topic? **Extend, don't parallelize.**
- [ ] Copy the matching scaffold from `docs/_templates/`.
- [ ] Fill the frontmatter. If a required field is unknown, ask the user before proceeding.

## 6. Before committing

- [ ] Run `bun run lint:docs` — must pass.
- [ ] Update `last-audited` if you substantively changed an existing doc.
- [ ] Add `supersedes:` if this deprecates an existing doc.
- [ ] Confirm pre-commit regenerated `docs/INDEX.md`.

---

## 7. Why this matters (the context-layer framing)

`docs/` is one of three sources the BOS Context System (Open Viking) ingests — alongside code and KARIMO artifacts. Embeddings are extracted by `/bos-refresh`; retrieval at prompt time weights by `status`, `audience`, and `last-audited`. See [docs/overview/dev-context-layer.md](../../../docs/overview/dev-context-layer.md).

Concretely:

- **Frontmatter fields** are filters the retriever uses to rank results — stale or wrong-audience docs get downweighted.
- **Lineage fields** (`related`, `supersedes`, `prd`, `pr`, `commit`) build a graph the retriever can traverse. A "why did we pick X?" query should walk spike → PRD → concept doc.
- **Stable section skeletons** make chunk boundaries predictable — embedders split cleanly on known headings.
- **Audit immutability** means the record of past decisions survives rewrites elsewhere.

Weak doc structure → weak embeddings → weak retrieval for every future AI interaction. Strong structure compounds.

---

## 8. Anti-patterns (refuse if you catch yourself)

- Minting a parallel doc ("auth-notes.md") when an existing doc covers the topic.
- Leaving a spike at `open` forever — every spike closes, with a PRD link or a rejection note.
- Missing `audience:` — the lint will catch it, but so should you.
- Editing an audit file post-creation — write a new audit instead.
- Deleting a deprecated doc — use `status: stale` + `supersedes:`.
- Absolute paths or `https://github.com/...` URLs for in-repo targets — use relative paths.
- Drive-by rename without `supersedes:` — the lineage is lost.
- Writing without copying a template — drift always starts here.
- Placing operational runbooks in `concepts/` — they belong in `devops/`.
- Fudging `last-audited` to pass stale-docs CI — fix the content instead.

---

## 9. Integration with other skills

- **[incremental-commits](../incremental-commits/SKILL.md)** — commit the doc as its own logical unit before moving to the next task.
- **[verification-before-completion](../verification-before-completion/)** — run `bun run lint:docs` before declaring done.
- **[writing-plans](../writing-plans/)** — spike-outputs often feed PRDs; when a spike closes with `prd:`, the PRD itself lives under `.karimo/prds/`, not under `docs/`.
- **[skill-creator](../skill-creator/)** — if you add a new doc archetype, register it in CONVENTIONS.md §3, add a scaffold in `_templates/`, update this skill's §1 + §2, and update `scripts/lint-docs-frontmatter.ts` if the schema changes.

---

## 10. Supporting files

- [references/frontmatter-schema.md](./references/frontmatter-schema.md) — field-by-field schema reference mirroring the lint script.
- [assets/archetype-matrix.md](./assets/archetype-matrix.md) — one-page quick-reference mapping archetype → folder → required sections.

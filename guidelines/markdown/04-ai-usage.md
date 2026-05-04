---
title: "AI Usage Guidelines"
version: "1.0"
source_pdf: "../pdf/4- AI Usage.pdf"
last_updated: "2026-05"
---

# AI Usage Guidelines

> How Open Session integrates AI across copy, code, and creative production.

---

## Brand Context System

The Brand Context System is our thesis for AI-augmented brand management. It enables collective intelligence by making brand knowledge accessible to both humans and AI agents.

### Core Principles

1. **Democratize Design Expertise** — Make world-class brand knowledge available to everyone
2. **Human-AI Collaboration** — AI amplifies human creativity, never replaces it
3. **Systematic Context** — Structured brand data that AI can understand and apply
4. **Living Documentation** — Brand guidelines that evolve with the organization

---

## Copy Pyramid

AI assistance varies by content layer. The pyramid defines where AI helps most and where human judgment is essential.

### Soul (Human-Led)

The foundational layer that defines who we are.

| Element | Description | AI Role |
|---------|-------------|---------|
| Mission | Why we exist | None — purely human |
| Values | What we stand for | None — purely human |
| Vision | Where we're going | None — purely human |
| Positioning | How we're different | Research support only |

**Rule**: Soul-level content requires human authorship. AI may research competitors or surface insights, but final decisions are human.

### Voice (Human-AI Collaboration)

The expression layer that shapes how we communicate.

| Element | Description | AI Role |
|---------|-------------|---------|
| Tone Guidelines | How we sound | Draft suggestions, human approval |
| Writing Style | Sentence structure, vocabulary | Generate options, human selection |
| Audience Personas | Who we speak to | Research and synthesis |
| Content Pillars | What we talk about | Ideation and expansion |

**Rule**: Voice-level content uses AI for generation and iteration, with human curation and approval.

### Operations (AI-Assisted)

The execution layer for day-to-day content.

| Element | Description | AI Role |
|---------|-------------|---------|
| Social Posts | Platform-specific content | Draft, human review |
| Email Copy | Newsletters, sequences | Draft with templates |
| Product Copy | UI text, descriptions | Generate variations |
| SEO Content | Blog posts, articles | Research, outline, draft |

**Rule**: Operations-level content can be AI-generated with human review. Use brand context to ensure consistency.

---

## Code Layers

AI assistance in development follows a similar hierarchy.

### Shared Context (Foundation)

The knowledge layer that informs all development.

| Element | Location | AI Role |
|---------|----------|---------|
| Design Tokens | `tokens/ds/` | Reference, never modify |
| Brand Config | `.claude/brand/` | Context for decisions |
| Component Library | `tokens/components/` | Pattern reference |
| Documentation | `docs/`, `guidelines/` | Knowledge retrieval |

**Rule**: Shared context is read-only for AI. Changes require human approval through proper PRD process.

### Backend & Infrastructure

Server-side systems and data management.

| Element | AI Role |
|---------|---------|
| API Design | Suggest patterns, human architects |
| Database Schema | Generate migrations, human review |
| Authentication | Security-critical — human-led |
| Infrastructure | Terraform/config generation, human approval |

**Rule**: Backend changes require human review. Security-sensitive code is human-authored.

### Frontend & UX

User-facing implementation.

| Element | AI Role |
|---------|---------|
| Component Creation | Generate from design system |
| Styling | Apply tokens, suggest patterns |
| Interactions | Implement with motion tokens |
| Accessibility | Audit and suggest fixes |

**Rule**: Frontend can leverage AI heavily when using established design system patterns. Novel UX requires human design.

---

## Creative Production

How AI assists in visual and multimedia creation.

### Human Layer (Non-Negotiable)

Creative direction that must remain human.

| Element | Why Human |
|---------|-----------|
| Art Direction | Defines brand visual identity |
| Photography Direction | Captures authentic moments |
| Concept Development | Original creative thinking |
| Final Approval | Quality and brand alignment |

### Model Assistance (Permitted)

Where AI tools enhance production.

| Task | Tools | Guidelines |
|------|-------|------------|
| Image Enhancement | Lightroom AI, Topaz | Maintain authenticity |
| Background Removal | Remove.bg, Photoshop | Clean cutouts only |
| Color Grading | Preset application | Use brand LUTs |
| Mockup Generation | Figma plugins | For concepting only |
| Copy Variations | Claude, GPT | Human selection required |

### Prohibited Uses

AI should never be used for:

- **Hero Photography** — Must be real, authentic images
- **Team/People Photos** — Never AI-generated faces
- **Brand Mark Creation** — Logo and identity elements
- **Final Campaign Assets** — AI for concepting only
- **Testimonials/Quotes** — Must be real customer words

---

## Untitled UI Integration

Our design system is built on Untitled UI Pro with BOS transformations applied.

### Component Usage

```
components/base/     → UUI Pro primitives (vendor source)
components/custom/   → BOS compositions (our code)
components/ds/       → Design system formula spec
```

### AI Component Generation

When generating components:

1. **Check `components/base/` first** — Use existing primitives
2. **Apply BOS transforms** — Motion tokens, focus rings, disabled states
3. **Use Style 2 syntax** — `bg-bg-primary`, not `bg-[var(--bg-primary)]`
4. **Include devProps** — `{...devProps('ComponentName')}` on root element

### Token Reference

AI agents should reference:

- `tokens/ds/brand.css` — CSS custom properties
- `tokens/ds/transforms/` — UUI transformation rules
- `.claude/reference/design-system.md` — Full token guide

---

## AI Agent Guidelines

For AI agents working with Open Session brand:

### Context Loading Priority

1. **Voice & Tone**: `guidelines/markdown/01-brand-messaging.md`
2. **Visual Identity**: `guidelines/markdown/02-brand-identity.md`
3. **Art Direction**: `guidelines/markdown/03-art-direction.md`

### Decision Framework

| Question | Reference |
|----------|-----------|
| How should this sound? | Brand Messaging (01) |
| What colors/fonts? | Brand Identity (02) |
| What imagery style? | Art Direction (03) |
| How to implement? | Design System Reference |

### Output Requirements

- Use "we" and "our" (steward voice)
- Balance expertise with humility
- Provide concrete examples
- Include clear next steps
- Show process, not just polish

---

## Quick Reference

### Permitted AI Tasks

- Content drafting with human review
- Code generation using design system
- Research and synthesis
- Mockup and concept generation
- Documentation writing

### Prohibited AI Tasks

- Soul-level brand decisions
- Final creative approval
- Security-critical code authorship
- Customer testimonial creation
- Hero photography creation

### Review Requirements

| Content Type | Review Level |
|--------------|--------------|
| Soul/Mission | Leadership only |
| Voice/Tone | Brand team |
| Operations | Content owner |
| Code | PR review |
| Creative | Creative director |

---

*AI usage guidelines for Open Session brand. Human creativity leads, AI amplifies.*

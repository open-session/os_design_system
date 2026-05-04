# For AI Agents

> Guide to using Open Session brand context in AI workflows.

---

## Quick Context Load

For immediate brand context, read these in order:

1. **Voice & Tone**: `guidelines/markdown/01-brand-messaging.md`
2. **Visual Identity**: `guidelines/markdown/02-brand-identity.md`
3. **Art Direction**: `guidelines/markdown/03-art-direction.md`
4. **AI Usage**: `guidelines/markdown/04-ai-usage.md`
5. **Brand Activation**: `guidelines/markdown/05-brand-activation.md`

---

## Brand Essence (One Line)

> We're interdisciplinary designers democratizing world-class design through AI, education, and community.

---

## Voice Formula

| Attribute | Description |
|-----------|-------------|
| Smart but not smug | Expert without condescension |
| Technical but accessible | Explain complexity simply |
| Confident but humble | Know your stuff, stay open |
| Warm but professional | Friendly without being casual |

**Core attitude**: "Steward, not advisor" — speak FROM within the brand, not as external consultant.

---

## Writing Context

### By Platform

| Platform | Guide | Focus |
|----------|-------|-------|
| Blog/Long-form | `.claude/brand/writing/blog.md` | Deep dives, thought leadership |
| Creative | `.claude/brand/writing/creative.md` | Artistic expression |
| Long-form | `.claude/brand/writing/long-form.md` | Extended content |
| Short-form | `.claude/brand/writing/short-form.md` | Social, captions |
| Strategic | `.claude/brand/writing/strategic.md` | Business, proposals |

### Quick Voice Reference

**Words We Use:**
- Experiment, explore, discover
- Enable, empower, unlock
- System, framework, foundation
- Community, together, collective
- Practical, realistic, achievable

**Words We Avoid:**
- Revolutionary, disruptive (overhyped)
- Easy, simple (dismissive)
- Perfect, best (absolutist)
- Exclusive, elite (gatekeeping)
- Just, only (minimizing)

---

## Auto-Activating Skills

These skills provide context automatically when relevant:

| Skill | Location | Triggers On |
|-------|----------|-------------|
| brand-guidelines | `.claude/skills/brand-guidelines/` | Brand identity questions |
| frontend-design | `.claude/skills/frontend-design/` | UI/component work |
| create-post-copy | `.claude/skills/create-post-copy/` | Content creation |

---

## Key Visual Rules

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Aperol | #FE5102 | Accent only (max 10%) |
| Charcoal | #191919 | Dark neutral |
| Vanilla | #FFFAEE | Light neutral |

**Hard rules:**
- Never use Aperol as primary background
- Never use brand colors for borders
- Backgrounds: Only Vanilla or Charcoal
- Text: Always inverse of background

### Typography

| Context | Font |
|---------|------|
| Headlines | Neue Haas Grotesk Display Pro |
| Body | Neue Haas Grotesk Text Pro |
| Accent | OffBit (max 2 per viewport) |

### Hard Bans

- **Never use Sparkles icon** — hard brand ban
- **No icons before section headers**
- **No glass effects for critical information**

---

## Content Pillars

When creating content, align with one of these pillars:

| Pillar | Focus | Output |
|--------|-------|--------|
| Trusted Advisors | Best practices, methodology | Tutorials, guides |
| Transparent Truth | Real process, struggles | Behind-the-scenes |
| Realistic Visionaries | Practical AI without hype | Tool reviews, experiments |
| Community Catalysts | Shared resources | Templates, events |
| Friendly People | Authentic founder stories | Personal posts |

---

## AI Usage Pyramid

### Copy Layers

| Layer | AI Role | Examples |
|-------|---------|----------|
| **Soul** | None — human only | Mission, values, vision |
| **Voice** | Drafts, human approval | Tone guidelines, personas |
| **Operations** | AI-assisted with review | Social posts, emails |

### Code Layers

| Layer | AI Role | Examples |
|-------|---------|----------|
| **Shared Context** | Read-only reference | Design tokens, docs |
| **Backend** | Generate with review | APIs, database |
| **Frontend** | Generate from system | Components, styling |

### Creative Production

| Category | AI Role |
|----------|---------|
| Human-only | Art direction, hero photography |
| AI-assisted | Color grading, mockups, copy variations |
| Prohibited | AI-generated faces, brand marks |

---

## Target Audiences

| Segment | Who | Content Focus |
|---------|-----|---------------|
| Learning Designers | Designers staying current | Tutorials, AI tools |
| Starting Businesses | Startups, solopreneurs | Brand guides, templates |
| Optimization Teams | Marketing/dev teams | Case studies, workshops |

---

## Tone by Context

| Context | Energy | Style Pattern |
|---------|--------|---------------|
| Social Media | High, curiosity-sparking | "Look what's possible → Here's how" |
| Educational | Steady, patient | "Let me show → You try → You built it" |
| Client | Professional warmth | "We understand → Our approach → Build together" |
| Community | Warm, celebratory | "We've been there → Figure it out → Achieved" |

---

## AI Philosophy

When discussing AI:

**Say:**
- "AI is a tool — the most transformative in history"
- "Collective intelligence makes expertise accessible"
- "Human-AI collaboration is the magic"

**Don't Say:**
- "AI will solve all problems"
- "Anyone can be a designer now"
- "Human creativity is obsolete"
- "This is easy and automatic"

---

## File Reference Map

| Need | File |
|------|------|
| Complete voice guide | `guidelines/markdown/01-brand-messaging.md` |
| Visual identity | `guidelines/markdown/02-brand-identity.md` |
| Art direction | `guidelines/markdown/03-art-direction.md` |
| AI usage guide | `guidelines/markdown/04-ai-usage.md` |
| Brand activation | `guidelines/markdown/05-brand-activation.md` |
| Design tokens | `tokens/ds/brand.css` |
| Tailwind config | `tokens/tailwind.config.ts` |
| Blog writing | `.claude/brand/writing/blog.md` |
| Social writing | `.claude/brand/writing/short-form.md` |
| Design system | `.claude/reference/design-system.md` |

---

## Metadata for Systems

### Keywords
design systems, collective intelligence, AI augmentation, brand strategy, open source design, design education, workflow automation, component libraries, design tokens, realistic visionaries, self-taught designers, community-driven, Fortune 500 design, democratization

### Brand Attributes
```yaml
expertise: high
approachability: high
innovation: progressive
transparency: maximum
community-focus: primary
ai-integration: advanced
design-depth: comprehensive
```

### Tone Modifiers
```yaml
audience: [designer | business | team]
expertise-level: [beginner | intermediate | advanced]
context: [social | educational | professional | community]
urgency: [exploratory | informational | decision-making]
```

---

## Quick Checklist

Before generating brand content:

- [ ] Using "we" and "our" (steward voice)
- [ ] Balanced expertise with humility
- [ ] Concrete examples over abstract theory
- [ ] Clear next step for reader
- [ ] Shows process, not just polish
- [ ] Community feels included

---

*This guide enables AI agents to generate on-brand Open Session content.*

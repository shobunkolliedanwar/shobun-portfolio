# Design Plan — Shobun Kollied Anwar Portfolio

## Subject
A backend/software engineer's personal engineering brand. The audience is
hiring managers, tech leads, and fellow engineers evaluating credibility.
The job of the design: read as senior, deliberate, and quietly confident —
never like a bootcamp template or a card-grid SaaS kit.

## Color — 6 tokens
- `#0A0B0D` bg — near-black but with a cool blue undertone, not flat #000
- `#121317` bg-elevated — panels, cards, admin surfaces
- `#EDEEF0` foreground — off-white, not pure #FFF
- `#9A9CA6` muted — secondary text
- `#C98F4A` accent — a desaturated bronze/amber. Chosen deliberately over
  the common AI-default terracotta (#D97757) or acid-green: bronze reads
  as a status/signal light on infra dashboards — ties to the subject
  (backend systems) rather than being decoration.
- `rgba(237,237,240,.08)` border — hairline, barely visible

## Type
One family used two ways, not two families: **Geist Sans** for both
display and body (large/tight tracking for headlines, regular for body),
**Geist Mono** reserved only for genuinely technical labels — tech stack
tags, dates in the experience timeline, metric units. This is justified
by the subject matter (an engineer's own interface idioms), not decoration.
No tracked-out all-caps eyebrows, no middle-dot-joined meta strings.

## Layout
Left-aligned, editorial, asymmetric — not centered hero, not a card grid.
- Hero: two-column asymmetric (60/40), headline stacked left, portrait
  bleeding off the right edge past the container, breaking the grid
  intentionally.
- About: text block + a tight 3-item pillar list (numbered — legitimate
  here because the brief frames it as a sequence of focus areas).
- Experience: single-column left-rule timeline, year in mono.
- Projects: full-bleed alternating editorial rows (image/text swap sides),
  not thumbnail cards.
- Tech stack: grouped by category as plain lists, no percentage bars,
  no icon-soup grid.

## Principles
1. One bold move — the portrait's parallax/float — everything else stays
   quiet and disciplined.
2. Numbers only where content is genuinely sequential or a real metric.
3. Motion answers scroll/hover/mouse, not an autoplay entrance on every
   section.
4. Bronze accent used sparingly: links, one underline, the availability
   dot, focus rings — never as a background wash.

## Self-check against generic-AI defaults
- Not warm cream + serif (trait 1) — dark, sans-only. ✓
- Not near-black + acid-green (trait 2) — bronze instead, and used sparingly. ✓
- Not broadsheet hairline-column newspaper (trait 3) — editorial but not that. ✓
- Not identical rounded SaaS cards everywhere (trait 4) — projects are
  full-bleed rows, timeline is a rule not cards, only admin tables use
  light card framing where it's functionally appropriate. ✓
- No ALL-CAPS eyebrows, no middle-dot metadata, no auto-appended "→" on
  every link (arrows only on project CTAs where directional motion is
  literal). ✓

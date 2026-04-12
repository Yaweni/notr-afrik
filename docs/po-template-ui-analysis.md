# PO Template UI Analysis

## Summary

The reference screens point to a French-first marketing site with a guided onboarding layer. The visual language is clean, bright, and conversion-focused. It uses a white canvas, strong dark headings, a saturated yellow primary CTA, light blue accents, rounded cards, and large human photography that centers African students and mobility.

## Core Visual Direction

- Brand feel: optimistic, credible, approachable, international.
- Page structure: classic landing-page sections with generous spacing and clear vertical rhythm.
- Tone: professional and warm, with practical reassurance rather than institutional stiffness.
- Audience signal: aspirational travelers and students who want guidance, trust, and visible next steps.

## Layout Characteristics

- A thin, clean top navigation with a small logo, centered menu, and a single highlighted CTA on the right.
- A full-width hero with lifestyle photography, a dark overlay, one compact badge, one large headline, supporting copy, and two CTAs.
- Section blocks arranged in a predictable sequence: hero, trust/reasons, services, guided onboarding.
- Wide whitespace and centered headings between sections.
- Card grids with three columns on desktop and soft spacing around each block.

## Typography And Color

- Headings are heavy, rounded, and friendly, closer to a geometric display font than a corporate default.
- Body text is light and breathable, with muted gray used for explanations.
- The main color system seems to be:
  - deep navy for headings and navigation
  - warm yellow for the primary CTA and key numbers
  - light blue for section pills and highlight words
  - soft red and soft blue for icon tiles in feature cards
  - white and very pale gray for most surfaces

## Component Vocabulary

- Pill badges above section titles.
- Rounded CTA buttons with bright fill and subtle shadow.
- White feature cards with thin borders and soft hover potential.
- Small colored icon containers in each service/reason card.
- Numeric proof points placed directly under the hero.
- A multi-step onboarding card with progress dots and large selectable options.

## UX Reading

This frontend feels like a guided service website first, with lightweight product behavior layered inside it. The onboarding screen is especially important because it suggests the PO wants lead qualification and recommendation, not only content browsing.

The strongest UX signals are:

- reassure visitors quickly
- make the service offer legible in seconds
- move the visitor into a guided selection flow
- keep each section visually simple and easy to scan

## What This Means For Our FE

If we refactor toward this direction, the frontend should move toward:

- a more editorial landing page with stronger section identity
- French-first content hierarchy with bilingual support built in
- warmer, more human imagery instead of abstract product-first visuals
- softer, more rounded cards and buttons
- a clearer onboarding wizard near the top of the funnel
- fewer dashboard cues on public pages and more trust-building marketing cues

## Mismatch With Current FE

Compared with the current frontend, the template direction is:

- more brand-led
- more French-first
- more marketing-oriented
- more photographic and emotionally expressive
- more guided at the start of the journey
- less generic SaaS in tone

## Recommendation

If we adopt this direction, I would keep the existing app architecture and refactor only the presentation layer plus onboarding flow. The best target would be:

1. Public home and destination discovery.
2. A guided intake wizard for the main immigration journey.
3. A cleaner handoff into the existing dashboard and admin operations.
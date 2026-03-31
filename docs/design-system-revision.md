# Design System Revision

## Purpose

This document defines the revised visual system for `project-portal`.

The goal is not to make the site more decorative.  
The goal is to make it:

- clearer
- more serious
- more portal-like
- more maintainable
- easier to scan
- less similar to the recruitment page

---

## 1. Design Direction

### Core tone
- clean
- project-oriented
- editorial
- calm
- traceable
- collaborative
- engineering-friendly

### Not the goal
- heavy “AI dashboard” card collage
- oversized marketing hero
- rounded bubble UI everywhere
- flashy motion
- cyber / futuristic branding language
- too much “soft playful product” feeling

---

## 2. Surface Hierarchy

The portal must stop treating every visible object as the same kind of rounded white card.

We use the following surface hierarchy.

### 2.1 `page-shell`
The outer page container.

Use for:
- global spacing
- width control
- page rhythm

Should feel:
- open
- stable
- breathable

### 2.2 `section-shell`
The outer section wrapper.

Use for:
- grouping content sections
- providing section-level background and spacing
- soft visual separation between major parts of a page

Should feel:
- calm
- slightly elevated
- not too “component-like”

### 2.3 `surface-card`
Standard content card.

Use for:
- summary blocks
- team cards
- risk cards
- repo cards
- right-side detail cards

Should feel:
- clear
- structured
- not bubbly
- not playful

### 2.4 `callout-box`
Used sparingly for:
- warnings
- design notes
- fallback-language notices
- one-paragraph explanations

Should rely more on:
- subtle accent border
- left-side color accent
- background tint

Not on:
- giant pill shape

### 2.5 `meta-panel`
A stricter side panel for metadata.

Use for:
- article metadata
- action items
- references
- evidence
- status blocks

Should feel:
- disciplined
- compact
- document-like

---

## 3. Corner Radius Rules

The old version overused large bubble radii.

### Allowed large pill radius
Only for:
- language switch buttons
- small filter chips
- small status badges
- compact secondary buttons

### Restricted radius
For:
- cards
- side panels
- article shells
- section wrappers
- list items

Recommended:
- small: 10px–12px
- medium: 16px
- large: 18px–20px

Avoid:
- 24px+ on everything
- paragraph containers shaped like giant pills
- nested rounded bubble stacks

---

## 4. Color Hierarchy

The problem is not “too many colors”.  
The problem is “not enough meaningful contrast”.

### Base colors
- background: soft cool white / pale blue gray
- surface: white with mild transparency
- border: subtle cool gray
- main text: deep navy / charcoal
- secondary text: desaturated blue gray
- tertiary text: lighter gray-blue

### Functional accents
- blue: current / active / primary interaction
- teal / cyan: system / structure / neutral highlights
- amber / orange: warning / attention / blocker
- purple: review / archive / note
- red: only for true risk or error

### Rules
1. Every color must mean something.
2. Tags should not all look equally light and equally weak.
3. If a label matters, it needs contrast.
4. Use pale fills sparingly; pale plus pale plus pale reduces legibility.

---

## 5. Typography Hierarchy

The portal must feel readable before it feels styled.

### Heading system
- H1: page title, strong but not theatrical
- H2: section title
- H3: subsection title / list block title
- H4: metadata or grouped label

### Body text
- comfortable line height
- moderate width
- avoid long lines in article pages
- avoid narrow, over-wrapped card paragraphs

### Emphasis
Allowed:
- subtle weight contrast
- short highlighted phrases
- larger terms or numbers for key signals
- muted overline labels

Avoid:
- random giant words
- excessive alternating weights
- decorative headline experimentation in every section

---

## 6. Icon Rules

Icons are allowed and encouraged, but only when they improve recognition.

Good uses:
- docs
- logs
- risks
- repos
- external links
- internal jump links
- event types
- team cards

Bad uses:
- decorative icons with no semantic value
- too many icons in the same row
- icons replacing clear wording

---

## 7. CTA Rules

Calls to action must be explicit.

Allowed CTA patterns:
- View all logs
- Open docs hub
- View architecture
- Open calendar
- Meet the team
- Read document
- Open repository

CTA types:
- internal primary
- internal secondary
- external
- inline anchor copy

Do not disguise:
- links as tags
- buttons as badges
- filters as static labels

---

## 8. Home Page Specific Rules

The home page is a summary dashboard, not a wall of equal cards.

### Must do
- highlight only selected content
- link out to details
- show section purpose clearly
- differentiate summary blocks from full-content pages

### Must avoid
- repeating detail-page structures on the home page
- card soup
- too many same-size tiles
- visually equivalent blocks with different semantics

---

## 9. Article / Detail Page Rules

Article pages must feel more rigorous.

### Required layout logic
- stable article shell
- visible page title
- lead paragraph
- metadata row
- optional fallback-language note
- content tags
- article body
- right-side metadata panels
- previous / next navigation if available

### Avoid
- chat bubble feel
- giant lead callout pills
- too many floating cards around the article body
- weak separation between content and metadata

---

## 10. Calendar Rules

The calendar is a tool page, not a decorative board.

### Must feel
- stable
- legible
- scannable
- event-first

### Must avoid
- unstable colors
- too many equally styled event types
- “toy calendar” feeling
- decorative UI noise

---

## 11. Gantt Rules

The Gantt view must be:

- factual
- structured
- editable through data
- visually aligned with project planning habits

It must not be a fake “sprint card” pretending to be a schedule.

---

## 12. Visual Smell Tests

If a new block looks like any of the following, redesign it:

- a chat bubble
- a prompt-generated dashboard tile
- a startup pricing card
- a recruitment landing page leftover
- a tag pretending to be a link

---

## 13. Practical Checklist

Before shipping a page, ask:

1. Can a first-time viewer tell what is summary and what is detail?
2. Are cards visually differentiated by role, not just by size?
3. Are status, tags, filters and links obviously different?
4. Is the text easier to scan than before?
5. Would this still look stable in English with long strings?
6. Does this feel more like a portal than a landing page?
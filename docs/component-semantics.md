# Component Semantics

## Purpose

This document defines the meaning and use boundaries of recurring UI elements in `project-portal`.

The main problem it prevents is semantic confusion.

A small UI element must not leave the user asking:

- Is this a label?
- Is this clickable?
- Does it filter?
- Is it a link?
- Is it external?
- Does it jump inside the page?

---

## 1. StatusBadge

### Meaning
A non-interactive state indicator.

### Examples
- Draft
- In Review
- Active
- Archived
- Final

### Behavior
- not clickable
- not hover-elevated like a button
- should not trigger filtering
- should not navigate

### Visual cues
- compact
- stable fill and border
- color depends on state
- cursor must not suggest interaction

---

## 2. StaticTag

### Meaning
A non-interactive category label.

### Examples
- research
- interface
- deliverable
- demo
- meeting

### Behavior
- not clickable by default
- not used as a filter control
- no link affordance

### Use case
For content classification shown in cards or article headers.

---

## 3. AttentionTag

### Meaning
A special category label indicating that a team, role or collaborator should notice this item.

### Examples
- attention:V2
- attention:M1
- attention:backend
- attention:hardware

### Behavior
Can be clickable **only if** the page supports filtering by attention tag.

### Visual cues
- more prominent than StaticTag
- should communicate “needs attention”
- must still remain restrained and readable

### Important
AttentionTag is not a general highlight decoration.

---

## 4. FilterChip

### Meaning
An interactive filter used within the current page.

### Examples
- All
- Meetings
- Docs
- Current
- Completed
- holiday-cn
- milestone

### Behavior
- clickable
- selected / unselected states required
- changes visible content in the current view
- never navigates away from the page

### Visual cues
- strong active state
- hover state
- keyboard focus state
- pointer cursor

---

## 5. InternalLinkPill

### Meaning
A compact internal navigation control.

### Examples
- View all logs
- Open docs hub
- View architecture
- Read document

### Behavior
- navigates to another route or anchor in the portal
- may be used in summary cards and side panels
- should not be confused with a plain tag

### Visual cues
- arrow or internal-navigation cue
- stronger affordance than a tag
- hover behavior consistent with links

---

## 6. ExternalLinkPill

### Meaning
A compact external navigation control.

### Examples
- GitHub repo
- Team homepage
- Friend link
- Demo link

### Behavior
- opens external URL
- should be visually distinct from internal links

### Visual cues
- external-link icon strongly recommended
- do not style exactly like StaticTag
- must not be visually identical to FilterChip

---

## 7. InlineAnchor

### Meaning
A heading-level deep-link affordance.

### Examples
- article heading anchors
- architecture section anchors
- content-level sharable links

### Behavior
- navigates to a section hash
- copy-link support encouraged
- appears on hover or focus

### Visual cues
- anchor / link icon
- subtle by default
- stronger on hover

---

## 8. SectionLead

### Meaning
A short explanatory paragraph or short summary at the start of a section.

### Behavior
- not a giant bubble
- not a decorative card
- should improve readability, not become a visual gimmick

### Visual cues
- restrained
- can use subtle accent line or soft tone
- should not dominate the section

---

## 9. DocListItem

### Meaning
A full-width document entry in the docs hub.

### Behavior
- row-like
- structured metadata
- clear title and summary
- explicit CTA

### Must include
- doc type
- title
- summary
- version
- owner
- last updated
- review status
- tags
- action link

### Must not resemble
- a tiny dashboard tile
- a playful product card

---

## 10. LogListItem

### Meaning
A list entry in the logs page.

### Must emphasize
- date
- type
- title
- ownerRole
- summary
- attention tags if any

### Behavior
- clicking the title or CTA opens the full entry
- list should feel chronological, not gallery-like

---

## 11. MetadataPanel

### Meaning
A structured side panel for article metadata.

### Typical contents
- owner
- sprint
- related teams
- related repos
- links
- evidence
- action items

### Behavior
- mostly non-interactive except explicit links
- should read like structured document metadata

---

## 12. Design Rule of Thumb

Before introducing a small UI element, ask:

1. Is it informative or interactive?
2. If interactive, what kind?
3. Can users tell that from its appearance?
4. Is its role already covered by an existing semantic component?

If the answer is unclear, do not invent a new pill shape.
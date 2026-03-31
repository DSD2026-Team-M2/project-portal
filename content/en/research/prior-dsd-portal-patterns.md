---
id: research-prior-dsd-portal-patterns
slug: prior-dsd-portal-patterns
title: Prior DSD portal patterns reviewed
type: research
date: 2026-03-28
owner: M2 PM
ownerRole: PM
status: completed
summary: Comparative review of prior course project sites to extract recurring portal requirements for logs, milestones, deliverables and boundary statements.
relatedTeams:
  - M2
relatedRepos:
  - project-portal
sprint: Sprint 5
tags:
  - research
  - deliverable
attentionTags:
  - attention:M2
lastUpdated: 2026-03-28
links:
  - label: Portal IA
    href: /docs/requirement-analysis-v1
evidence:
  - label: IA planning note
    href: /docs/system-design-outline-v1
actionItems:
  - owner: M2
    task: Convert recurring portal patterns into reusable content and layout rules.
featured: true
---

## Purpose

Review prior DSD team sites and identify what repeatedly made a "portal" page useful during midterm and final reporting.

## Scope

The review focused on structure rather than decoration:

- how teams exposed progress
- where deliverables were indexed
- how meeting and weekly records were linked
- whether ownership boundaries were stated clearly

## Findings

The strongest examples were never the flashiest pages. They worked because they answered the same questions quickly: what the project is, who owns which part, what changed recently, and where formal evidence lives.

> A portal is most useful when it reduces coordination cost instead of trying to look like the main product.

## Design Decisions Derived

- Keep the home page as a hub, not as a product landing page.
- Separate `project-main-web`, `project-portal`, and `m2-recruitment-site` clearly.
- Treat research notes, meeting minutes and weekly reports as first-class content, not hidden appendices.
- Build list pages from markdown metadata so PM-side updates do not require React edits.

## Open Questions

- Which evidence links should point to repo files versus portal detail pages?
- How much IF2 detail should be visible on the public architecture page before the interface is frozen?

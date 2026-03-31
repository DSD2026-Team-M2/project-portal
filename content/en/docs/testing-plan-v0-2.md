---
id: doc-testing-plan-v0-2
slug: testing-plan-v0-2
title: Portal Testing Plan
type: testing
date: 2026-03-29
owner: M2 Tester
ownerRole: Tester
status: draft
summary: Testing checklist covering routing, generated content, language fallback, calendar visibility and link stability.
relatedTeams:
  - M2
relatedRepos:
  - project-portal
sprint: Sprint 5
tags:
  - deliverable
attentionTags:
  - attention:M2
version: v0.2
reviewStatus: draft
lastUpdated: 2026-03-29
links:
  - label: Demo checklist
    href: /logs/demo-path-checklist
evidence:
  - label: Calendar page
    href: /calendar
actionItems:
  - owner: M2
    task: Add regression checks for language fallback and generated content validation.
---

## Coverage

- Required routes load correctly.
- Missing locale content falls back to English.
- Markdown headings keep sharable anchors.
- Calendar page shows holidays and timezone cards.
- Docs and logs lists render from generated content data.

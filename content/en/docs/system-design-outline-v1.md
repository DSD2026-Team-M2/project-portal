---
id: doc-system-design-outline-v1
slug: system-design-outline-v1
title: Portal System Design Outline
type: system-design
date: 2026-03-25
owner: M2 Architect
ownerRole: Architect
status: in-review
summary: Design outline for routed pages, generated content indexes, language fallback, markdown rendering and static holiday data.
relatedTeams:
  - M2
relatedRepos:
  - project-portal
sprint: Sprint 5
tags:
  - deliverable
attentionTags:
  - attention:M2
version: v0.9
reviewStatus: in-review
lastUpdated: 2026-03-29
links:
  - label: Calendar decision
    href: /logs/calendar-design-and-holiday-strategy
evidence:
  - label: Docs hub
    href: /docs
actionItems:
  - owner: M2
    task: Confirm content index field coverage before the final build review.
---

## Architecture

The portal uses a routed React shell with lightweight reusable sections and content-rendering pages.

## Content Pipeline

- Scan markdown files under `content/<locale>/...`
- Parse front matter into a unified index
- Validate required fields and duplicate slugs
- Render lists and detail pages from generated JSON

## Rendering Rules

- UI strings come from i18n JSON.
- Content lookup falls back to English when the selected locale is missing.
- Markdown headings receive stable anchors for direct linking.

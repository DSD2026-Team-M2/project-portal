---
id: weekly-report-05
slug: weekly-report-05
title: Week 05 report
type: weekly-report
date: 2026-03-30
owner: M2 Team
ownerRole: Programmer
status: in-progress
summary: This week moved the portal from IA planning into routed pages and a maintainable content-driven shell.
relatedTeams:
  - M2
  - V2
  - M1
relatedRepos:
  - project-portal
sprint: Sprint 5
tags:
  - deliverable
  - milestone
attentionTags:
  - attention:M2
lastUpdated: 2026-03-30
links:
  - label: Logs hub
    href: /logs
evidence:
  - label: Routing update
    href: /logs/portal-shell-and-routing
actionItems:
  - owner: M2
    task: Finish the calendar page interaction and detail linking.
  - owner: PM
    task: Review summary wording for teacher-facing reporting.
---

## Goal

This week we focused on turning the portal IA into actual routed pages with a maintainable content pipeline.

## Completed

- Implemented the required route structure for overview, progress, logs, docs, architecture and calendar.
- Prepared markdown-driven content entries for logs, weekly reports, meetings and deliverables.
- Clarified the narrative boundary between the portal, the main web repository and the archived recruitment site.

## Technical Learning

- Vite plus React Router is enough for a clean multi-page shell without adding extra state libraries.
- Front matter validation is important because missing fields break list pages silently if left unchecked.

## Coordination

- Synced IF2-facing wording with V2 and M1 assumptions.
- Kept PM requirements aligned with the portal IA and field template documents.

## Blockers

- Final holiday data fetch may fail if the source is unavailable, so fallback JSON needs to remain in repo.
- Some evidence links still depend on the latest screenshots and demo notes.

## Plan for Next Week

- Finalize calendar polish and evidence deep-links.
- Run content checks before every build.

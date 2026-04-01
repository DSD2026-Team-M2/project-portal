---
id: log-calendar-design-and-holiday-strategy
slug: calendar-design-and-holiday-strategy
title: Calendar design and holiday strategy fixed
type: decision
date: 2026-03-29
owner: M2 Architect
ownerRole: Architect
status: completed
summary: The calendar will stay month-view only, use static holiday generation and expose timezone context without becoming a scheduling system.
relatedTeams:
  - M2
  - PM
relatedRepos:
  - project-portal
tags:
  - deliverable
  - milestone
attentionTags:
  - attention:M2
lastUpdated: 2026-03-29
links:
  - label: Calendar page
    href: /calendar
evidence:
  - label: System design
    href: /docs/system-design-outline-v1
actionItems:
  - owner: M2
    task: Implement FullCalendar in dayGridMonth mode and keep holiday JSON static.
---

## Decision Summary

The portal calendar should support reporting and coordination, not full task management. For that reason the view stays intentionally narrow and stable.

## Static Holiday Workflow

- Fetch China and Portugal public holidays during a script step.
- Write generated JSON into the repository.
- Keep previous JSON when fetching fails.
- Render holidays as normal calendar events so the page still works offline.

## Timezone Rules

- Always show China time and Portugal time.
- Optionally show the user's local browser timezone.
- Use browser `Intl.DateTimeFormat` instead of introducing a time library.

## Boundary

No drag-and-drop editing, no recurring-event editor, and no heavy planning features. This is a portal month calendar, not a team scheduler.

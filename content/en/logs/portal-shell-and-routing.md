---
id: log-portal-shell-and-routing
slug: portal-shell-and-routing
title: Portal shell and routing implemented
type: update
date: 2026-03-31
owner: M2 Developer
ownerRole: Programmer
status: in-progress
summary: The routed shell for the portal is now in place, covering overview, progress, logs, docs, architecture and calendar pages.
relatedTeams:
  - M2
relatedRepos:
  - project-portal
tags:
  - deliverable
  - milestone
attentionTags:
  - attention:M2
lastUpdated: 2026-03-31
links:
  - label: Architecture page
    href: /architecture
evidence:
  - label: Progress page
    href: /progress
actionItems:
  - owner: M2
    task: Wire generated markdown content into all route-level list and detail pages.
featured: true
---

## What Changed

The portal now has a stable routed shell so each major information pillar has its own addressable page.

## Route Set

- `/`
- `/progress`
- `/logs`
- `/logs/:slug`
- `/docs`
- `/docs/:slug`
- `/architecture`
- `/calendar`

## Why It Matters

This turns the portal into a real collaboration hub instead of a single long page. Teachers and teammates can now deep-link directly to the relevant section or record.

## Next Steps

1. Connect generated markdown data to every content list and detail page.
2. Finalize section anchors and copy-link behavior.
3. Polish the calendar page and holiday workflow.

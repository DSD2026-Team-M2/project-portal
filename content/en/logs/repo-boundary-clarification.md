---
id: log-repo-boundary-clarification
slug: repo-boundary-clarification
title: Repository boundaries clarified for portal narrative
type: decision
date: 2026-03-26
owner: M2 PM
ownerRole: PM
status: completed
summary: The portal narrative now distinguishes the main product web repository, the portal repository and the archived recruitment site.
relatedTeams:
  - M2
  - PM
relatedRepos:
  - project-main-web
  - project-portal
  - m2-recruitment-site
tags:
  - deliverable
attentionTags:
  - attention:M2
lastUpdated: 2026-03-26
links:
  - label: Repository map
    href: /architecture#repository-map
evidence:
  - label: M2 contribution
    href: /#m2-contribution
actionItems:
  - owner: M2
    task: Keep labels and responsibility notes consistent across cards, docs and logs.
---

## Boundary Statement

The portal is not the main product web app, and the archived recruitment site is not the current portal deliverable.

## Repository Roles

- `project-main-web` remains the core product-facing frontend repository.
- `project-portal` is the process, documentation and collaboration hub maintained by M2.
- `m2-recruitment-site` is a completed historical artifact kept for traceability.

## Reason

This distinction prevents over-claiming ownership and helps reviewers understand where to look for each kind of deliverable.

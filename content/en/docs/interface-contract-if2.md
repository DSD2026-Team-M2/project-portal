---
id: doc-interface-contract-if2
slug: interface-contract-if2
title: IF2 Interface Contract
type: interface
date: 2026-03-24
owner: V2 and M2
ownerRole: Architect
status: completed
summary: Working interface contract for the IF2 fields currently consumed by monitor-side pages and portal-facing explanations.
relatedTeams:
  - V2
  - M1
  - M2
relatedRepos:
  - project-main-web
  - project-portal
tags:
  - deliverable
  - interface
attentionTags:
  - attention:V2
  - attention:M1
  - attention:M2
version: v0.6
reviewStatus: completed
lastUpdated: 2026-03-24
links:
  - label: Related log archive
    href: /logs
evidence:
  - label: IF2 dependency section
    href: /architecture#if2-dependencies
actionItems:
  - owner: V2
    task: Freeze the minimum field subset required for the current review flow.
---

## Minimum Field Set

| Field | Meaning | Used by |
| --- | --- | --- |
| `patientSessionId` | Session identifier for traceability | M1, M2 |
| `captureTime` | Timestamp for the processed result | M1, M2 |
| `motionScoreSummary` | High-level motion result summary | M1, M2 |
| `reviewFlags` | Warnings or status notes for review | M2 |

## Notes

This contract is intentionally scoped to the current portal and dashboard communication needs. It is not the full backend schema.

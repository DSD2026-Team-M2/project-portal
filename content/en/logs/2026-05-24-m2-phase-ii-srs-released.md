---
id: log-2026-05-24-m2-phase-ii-srs-released
slug: 2026-05-24-m2-phase-ii-srs-released
title: M2 Phase II Doctor Web SRS Released
type: update
date: "2026-05-24T22:20:00+08:00"
owner: M2 Team
ownerRole: Doctor Web Team
status: completed
summary: M2 released the Phase II Software Requirements Specification for the doctor web end, turning the latest rehabilitation workflow decisions into an implementation reference for the next integration stage.
relatedTeams:
  - M2
  - M1
  - S1
  - S2
  - V1
  - V2
relatedRepos:
  - project-portal
tags:
  - release
  - requirements
  - srs
  - phase-ii
  - doctor-side
  - rehabilitation
attentionTags:
  - attention:M2
  - attention:M1
  - attention:S1
  - attention:S2
  - attention:V1
  - attention:V2
lastUpdated: 2026-05-24
links:
  - label: Phase II SRS
    href: /docs/m2-srs-phase-ii-doctor-web-end
  - label: Phase II diagrams
    href: /docs/m2-phase-ii-workflow-and-use-case-diagrams
  - label: Interface change requests
    href: /docs/m2-v2-interface-change-requests
  - label: Phase II requirement meeting minutes
    href: /docs/phase-ii-requirement-meeting-minutes-rehabilitation-system
evidence: []
actionItems: []
featured: true
archived: false
---

M2 has published the Phase II Software Requirements Specification for the doctor web end. The document consolidates the current Phase II direction into a single implementation reference for patient ownership, motion-session classification, standard-curve comparison, schedule delivery, and AI suggestion storage.

The SRS clarifies that M2's immediate focus is the stable doctor-side workflow: doctors should only see their assigned patients, movement records should carry a clear `movement_type`, standard curves should support walking, stair climbing, and squatting, and rehabilitation schedules should be created from preset exercise items rather than free-text-only instructions.

The document also records the cross-team dependencies needed for integration. M2 depends on V2 for backend and database support, M1 for patient-side registration and schedule display, S1 and S2 for motion-data collection and processing, and V1 for later AI suggestion generation once the data foundation is ready.

## Published Document

- [Software Requirements Specification for M2 Doctor Web End - Phase II](/docs/m2-srs-phase-ii-doctor-web-end)

This release gives the team a clearer baseline for Phase II implementation and cross-group review.

---

Posted by Team M2 · DSD 2025-2026 · UTAD × JLU

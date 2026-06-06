---
id: log-2026-06-06-m2-v2-interface-change-requests-released
slug: 2026-06-06-m2-v2-interface-change-requests-released
title: M2 to V2 Interface Change Requests Released
type: update
date: "2026-06-06T22:10:00+08:00"
owner: M2 Team
ownerRole: Doctor Web Team
status: completed
summary: M2 published its interface change requests for V2, defining the backend and database support needed for doctor-patient ownership, movement-type records, rehabilitation schedules, AI suggestions, and admin permissions.
relatedTeams:
  - M2
  - V2
  - M1
  - V1
relatedRepos:
  - project-portal
tags:
  - release
  - interface
  - database
  - api
  - phase-ii
  - doctor-side
attentionTags:
  - attention:M2
  - attention:V2
  - attention:M1
  - attention:V1
lastUpdated: 2026-06-06
links:
  - label: Interface change requests
    href: /docs/m2-v2-interface-change-requests
  - label: Phase II SRS
    href: /docs/m2-srs-phase-ii-doctor-web-end
evidence: []
actionItems:
  - owner: V2
    task: Review the requested backend/database fields and confirm implementation feasibility.
  - owner: M2
    task: Update doctor-side integration assumptions after V2 confirms the final interface shape.
featured: true
archived: false
---

M2 has published the interface change requests prepared for the V2 database and backend team. The document focuses on the data and API support needed to make the Phase II doctor web workflow practical during integration.

The request set covers several core changes: adding `doctor_id` to patient data, preparing preset rehabilitation exercises with stable `exercise_id` values, adding `movement_type` to motion sessions, supporting doctor-created schedules, saving one AI-generated suggestion per session when available, and separating administrator permissions from normal doctor-side access.

These changes are important because the doctor web end can only deliver a reliable Phase II workflow if patient ownership, measured movement type, schedule data, and stored AI suggestions are all represented consistently by the backend. Publishing the request document gives M2 and V2 a shared review target before implementation details are finalized.

## Published Document

- [Interface Change Requests from M2 to V2](/docs/m2-v2-interface-change-requests)

This release should be treated as the current M2-side interface request baseline for V2 review.

---

Posted by Team M2 · DSD 2025-2026 · UTAD × JLU

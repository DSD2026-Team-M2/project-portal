---
id: doc-m2-phase-ii-workflow-and-use-case-diagrams
slug: m2-phase-ii-workflow-and-use-case-diagrams
title: M2 Phase II Workflow and Use Case Diagrams
type: requirement-analysis
date: 2026-05-24
owner: M2 Team
ownerRole: Doctor Web Team
status: completed
summary: Diagram appendix for the Phase II doctor web requirements, covering the overall use case model, detailed doctor portal responsibilities, prescription delivery flow, and AI curve recommendation flow.
relatedTeams:
  - M2
  - M1
  - V1
  - V2
relatedRepos:
  - project-portal
tags:
  - deliverable
  - requirement-analysis
  - phase-ii
  - diagrams
  - doctor-side
attentionTags:
  - attention:M2
  - attention:M1
  - attention:V1
  - attention:V2
version: v1.0
reviewStatus: completed
lastUpdated: 2026-05-24
links:
  - label: Phase II SRS
    href: /docs/m2-srs-phase-ii-doctor-web-end
  - label: SRS release news
    href: /logs/2026-05-24-m2-phase-ii-srs-released
evidence:
  - label: M2 Phase II Overall Use Case Diagram
    href: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/m2-phase-ii-overall-use-case-diagram.png
  - label: M2 Doctor Portal Detailed Use Case Diagram
    href: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/m2-doctor-portal-detailed-use-case-diagram.png
  - label: Rehabilitation Prescription Delivery Sequence
    href: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/rehabilitation-prescription-delivery-sequence.png
  - label: AI Curve Recommendation Sequence
    href: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/ai-curve-recommendation-sequence.png
actionItems: []
featured: true
archived: false
---

# M2 Phase II Workflow and Use Case Diagrams

This document collects the Phase II diagrams used with the M2 doctor web requirements. The order moves from the broad system boundary to the detailed doctor-side model, then to the two main sequence flows that require cross-team integration.

The images are referenced through predicted GitHub raw URLs under:

`public/images/docs/phase-ii/`

## 1. M2 Phase II Overall Use Case Diagram

This diagram gives the overall Phase II boundary for the rehabilitation system, including doctor, admin, patient, M1 patient app, V1 curve AI, V2 backend/database, and S1/S2 data pipeline responsibilities.

![M2 Phase II Overall Use Case Diagram](https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/m2-phase-ii-overall-use-case-diagram.png)

**Figure 1. M2 Phase II Overall Use Case Diagram**

## 2. M2 Doctor Portal Detailed Use Case Diagram

This diagram expands the M2 clinical web scope into doctor onboarding, patient workspace, analysis and AI, session review, prescription and feedback, and patient binding/access control.

![M2 Doctor Portal Detailed Use Case Diagram](https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/m2-doctor-portal-detailed-use-case-diagram.png)

**Figure 2. M2 Doctor Portal Detailed Use Case Diagram**

## 3. Rehabilitation Prescription Delivery Sequence

This sequence describes how the doctor reviews the current schedule, creates a rehabilitation prescription, how the patient views and completes it through the M1 patient app, and how completion state returns to the doctor workspace.

![Rehabilitation Prescription Delivery Sequence](https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/rehabilitation-prescription-delivery-sequence.png)

**Figure 3. Rehabilitation Prescription Delivery Sequence**

## 4. AI Curve Recommendation Sequence

This sequence describes the doctor-side AI recommendation path, including standard curve loading, the M2 web API service, Nginx routing, the M2 AI FastAPI service, the V1 recommendation script, and V2 backend/database measurement retrieval.

![AI Curve Recommendation Sequence](https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/phase-ii/ai-curve-recommendation-sequence.png)

**Figure 4. AI Curve Recommendation Sequence**

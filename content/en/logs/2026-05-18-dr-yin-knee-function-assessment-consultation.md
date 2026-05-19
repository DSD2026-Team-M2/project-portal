---
id: log-2026-05-18-dr-yin-knee-function-assessment-consultation
slug: 2026-05-18-dr-yin-knee-function-assessment-consultation
title: M2 Team Holds Online Consultation with Dr. Yin on Knee Function Assessment System
type: meeting
date: "2026-05-18T20:00:00+08:00"
owner: Lee
ownerRole: PM
status: completed
summary: On May 18, M2 team lead Lee and course consultant Dr. Yin held an online consultation on the doctor-side web system, patient data collection, standard knee-function assessment movements, doctor-patient binding, and later feature directions.
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
  - meeting
  - consultation
  - requirements
  - doctor-side
  - knee-assessment
attentionTags:
  - attention:M2
  - attention:M1
  - attention:S1
  - attention:S2
  - attention:V1
  - attention:V2
lastUpdated: 2026-05-19
links:
  - label: Detailed meeting minutes
    href: /docs/meeting-minutes-2026-05-18-dr-yin-knee-function-assessment-consultation
evidence:
  - label: OARSI physical performance measures
    href: https://oarsi.org/research-oarsi-success/physical-performance-measures
  - label: Timed Up and Go - RehabMeasures Database
    href: https://www.sralab.org/rehabilitation-measures/timed-and-go
actionItems: []
featured: false
archived: false
---

On May 18, 2026, M2 team lead Lee held an online consultation with course consultant Dr. Yin to review the current knee-function assessment system. The discussion covered the doctor-side web pages, administrator approval workflow, patient collection records, curve visualisation, rehabilitation advice delivery, and the next requirements that should guide the system.

## From Curve Display to Functional Assessment

During the consultation, Dr. Yin pointed out that the system should not over-focus on an idealised interface at this stage. The more important questions are whether the collected movement is standardised, whether the resulting curve can be explained, and whether the assessment result has practical clinical meaning.

The meeting therefore clarified a shift in direction: the system should move from simply displaying joint-angle curves toward a standard-movement-based functional assessment process. Dr. Yin suggested prioritising three everyday movement categories: sitting down and standing up or squat-like movement, forward walking on level ground, and going up and down stairs.

This direction is also consistent with external knee and lower-limb function assessment references. OARSI performance-based measures include tests such as the 30-second chair stand, 40-meter fast-paced walk, stair-climb test, Timed Up and Go, and six-minute walk. The standard TUG flow also includes rising from a chair, walking, turning, returning, and sitting down.

## Standard Curves and Interpretable Differences

The meeting further confirmed that patient curves should be compared against a standard or baseline curve rather than reviewed in isolation. Dr. Yin suggested collecting data from healthy participants performing the same standard movements, then using averaged or normalised curves as a baseline.

In future displays, the doctor should be able to compare the patient curve with the baseline curve and inspect differences in movement amplitude, movement speed, cycle width, and irregularity. These differences may help explain reduced range of motion, insufficient muscle strength, poor movement control, or broader functional limitation.

## Workflow and AI Boundaries

The consultation also discussed doctor-patient binding and patient-side usage. Dr. Yin recommended a simple one-to-many structure: patients should register through a link or QR code provided by their doctor, then bind to that doctor. Doctors should only see their own patients, and patients should not register independently outside the doctor workflow.

For data collection, the meeting leaned toward using a fixed doctor-side tablet or dedicated device that has already been paired with the sensors, rather than relying on each patient's personal phone. This would reduce Bluetooth compatibility problems and make the collection process easier to standardise.

The AI suggestion module was also treated cautiously. Because the system does not yet have enough standardised data or labelled clinical examples, Dr. Yin advised that AI should not become the core medical judgement function at this stage. The priority should be standard movements, standard baseline curves, interpretable comparison, doctor notes, and manually selected rehabilitation exercises. More advanced motion capture, patient training videos, and doctor-assistant AI can be explored later after the basic assessment workflow becomes reliable.

---

Posted by Team M2 · DSD 2025-2026 · UTAD × JLU

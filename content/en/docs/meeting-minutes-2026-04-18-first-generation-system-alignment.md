---
id: doc-meeting-minutes-2026-04-18-first-generation-system-alignment
slug: meeting-minutes-2026-04-18-first-generation-system-alignment
title: Six-Team Joint Meeting Minutes (2026-04-18)
type: meeting-minutes
date: 2026-04-18
owner: Lee
ownerRole: PM
status: completed
summary: Formal record of the April 18 six-team joint meeting, including participants, first-generation system scope, team responsibilities, cross-team data flow, key decisions, and follow-up actions.
relatedTeams:
  - S1
  - S2
  - V1
  - V2
  - M1
  - M2
relatedRepos:
  - project-portal
tags:
  - deliverable
  - meeting
  - coordination
  - requirements
attentionTags:
  - attention:S1
  - attention:S2
  - attention:V1
  - attention:V2
  - attention:M1
  - attention:M2
lastUpdated: 2026-04-20
version: v1.0
reviewStatus: in-review
links:
  - label: Related news log
    href: /logs/2026-04-18-first-generation-system-alignment-meeting-held
  - label: Meeting minutes index
    href: /docs/meeting-minutes-index-v1
evidence: []
actionItems:
  - owner: S1 and S2
    task: Finalise how raw sensor data is converted into angle data, including input/output formats and the minimum field set.
  - owner: V1 and S2
    task: Confirm the minimum input fields and output structure required for first-generation template recommendation.
  - owner: V2
    task: Confirm interface directions, deployment conditions, and the minimum backend support scope with all connected teams.
  - owner: M1
    task: Refine the patient-side flow and clarify alerts, session start/end behaviour, and sensor connection details.
  - owner: M2
    task: Consolidate a unified system-flow narrative and continue structuring doctor-side and admin-side pages.
featured: false
archived: false
---

# Six-Team Joint Meeting Minutes (2026-04-18)

## 1. Meeting Info

- **Date**: April 18, 2026, evening (Beijing time)
- **Format**: Online meeting
- **Purpose**: To align the first-generation system scope, clarify team responsibilities, and define the next interface coordination tasks across all six teams

## 2. Participants

All six teams were represented:

- **M2**: Lee
- **M1**: Pinhel
- **S2**: ZhiqiZhang
- **S1**: MofanXu
- **V1**: Borges
- **V2**: Nuno (attending on behalf of Moniz)

## 3. Meeting Goal

The meeting was held to recover delayed requirement alignment work and establish a practical shared understanding of what must be completed before **April 30** for the first-generation system. The discussion focused on:

1. What the first-generation system should and should not include
2. What each team is responsible for at the minimum viable level
3. How data should move across teams
4. How interface specifications, system design work, and website updates should proceed

## 4. Core Agreement on the First-Generation System

The meeting confirmed that the first-generation system should focus on the most basic working loop rather than advanced features. The priority is to make the following flow operational:

- the patient side starts a training session
- the sensor is connected and motion data is collected
- raw data is processed into structured output
- AI produces a basic template recommendation
- the backend stores and routes the result
- the doctor side displays the result and supports manual advice

M2 restated the two key motion angles identified during earlier doctor-side discussion:

- **leg extension angle**: should be close to `0°` for a healthy person
- **knee bending angle**: should usually fall around `130°–150°`

These two angles were treated as the most important motion indicators for the current stage.

## 5. Team Responsibilities

### 5.1 M2: Web / Doctor Side

M2 is responsible for doctor-side web pages and admin-related web pages. The current focus includes:

- doctor registration, login, and password reset
- doctor credential submission and approval-related flow
- patient list and patient information display
- motion data display
- AI recommendation display
- manual doctor suggestion input

The meeting also made it clear that the **admin interface will be prepared on the web side rather than on mobile**.

### 5.2 M1: Mobile / Patient Side

M1 is responsible for the patient-side mobile application. Current scope includes:

- registration and login
- sensor connection
- session start / session end
- receiving alerts or reminders
- viewing session history
- viewing rehabilitation plans
- achievements and notifications

A specific point clarified during the meeting was that alerts should not be generated independently by the mobile side. They should come from backend or AI-side results and then be displayed on mobile.

### 5.3 S1: Sensor Collection

The meeting reduced S1's first-generation work to two core tasks:

- collect raw sensor / motion-related data
- work with the mobile side on sensor connection

S1 is also expected to continue considering communication protocol, packet format, sampling rate, and error handling, but these remain supporting concerns around the core collection chain.

### 5.4 S2: Data Processing

S2 is responsible for receiving raw sensor data from S1 and session start / end requests from M1, then processing the raw input into structured output such as angles and other usable motion data.

S1 and S2 still need to clarify:

- the raw input format
- the processing boundary
- output fields and units
- the minimum field set needed by downstream modules

### 5.5 V1: AI Recommendation

V1's first-generation role is intentionally lightweight. The aim is not to build a complex intelligence layer yet, but to make one basic capability work:

- receive patient motion data
- select or recommend a suitable rehabilitation template
- return the result for storage and display

The common view in the meeting was that first-generation AI should prioritise being runnable before being sophisticated.

### 5.6 V2: Database / Backend

V2 was repeatedly described as the system hub during the meeting. Its role includes:

- receiving and managing data from multiple teams
- providing interfaces for frontends and service modules
- acting as the routing layer between doctor side, patient side, AI, and data processing
- handling storage and service-side organisation

Server and deployment conditions were also discussed, but final confirmation still depends on further team-level follow-up.

## 6. Agreed Overall Data Flow

The meeting established the following main flow for the first-generation system:

1. **M1** starts a training session and connects the sensor
2. **S1** collects raw motion data
3. **S2** processes the raw input into structured results such as angles
4. **V1** generates a template recommendation based on the processed data
5. **V2** stores the result and provides interfaces
6. **M2** displays the patient data and recommendation on the doctor side, while leaving room for manual doctor advice

This was treated as the minimum viable working loop for the current stage.

## 7. Key Decisions

### 7.1 System Target

All teams are currently working toward one fixed target: **complete the first-generation system before April 30**. More complex second-generation and third-generation features will be considered later.

### 7.2 Interface Coordination

Each team should use the next two days to speak directly with the teams they interact with most closely and confirm:

- input and output fields
- data direction
- session flow dependencies
- minimum implementation scope

### 7.3 Documents and Website Updates

The meeting asked teams to complete and upload:

- `System Design`
- `Interface Specification`

Preferably this should be done over the weekend, and no later than Monday. Teams were also asked to keep their websites updated with visible progress.

### 7.4 Weekly Checking Rhythm

Website progress will continue to be checked on a regular weekly basis so that work remains externally traceable rather than only internally discussed.

## 8. Main Problems Noted

The meeting also exposed several practical issues:

- overall requirement alignment had already fallen behind
- some teams still needed stronger internal synchronisation
- some design work had started before interface definitions were fully aligned
- some materials were not yet publicly visible in a way that supported cross-team understanding
- backend deployment and interface ownership still needed clearer confirmation

## 9. Follow-Up Actions

- **S1 ↔ S2**: define the raw-data-to-angle conversion path
- **S2 ↔ V1**: confirm the minimum input and output format for recommendation
- **V2 ↔ M1 / M2 / V1 / S2**: align interface directions and service support conditions
- **M1**: continue refining the patient-side flow and prototype details
- **M2**: consolidate a unified system-flow explanation and continue building doctor-side and admin-side structure

## 10. Conclusion

The April 18 six-team joint meeting completed one of the most important alignment steps for the first-generation system. Its main value was not adding more complexity, but making three things clearer: who is responsible for what, how the data should move, and what needs to happen next. At the current stage, that clarity is itself a prerequisite for actual delivery.

---

Posted by Team M2 · DSD 2025-2026 · UTAD × JLU

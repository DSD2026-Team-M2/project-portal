---
id: doc-meeting-minutes-2026-05-18-dr-yin-knee-function-assessment-consultation
slug: meeting-minutes-2026-05-18-dr-yin-knee-function-assessment-consultation
title: Meeting Minutes - Consultation with Dr. Yin on Knee Function Assessment System
type: meeting-minutes
date: 2026-05-18
owner: Lee
ownerRole: PM
status: completed
summary: Detailed minutes of the May 18 consultation between M2 team lead Lee and course consultant Dr. Yin, covering doctor-side system review, patient data collection, standard movement design, doctor-patient binding, AI boundaries, and future feature directions.
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
  - deliverable
  - meeting
  - consultation
  - requirements
  - knee-assessment
attentionTags:
  - attention:M2
  - attention:M1
  - attention:S1
  - attention:S2
  - attention:V1
  - attention:V2
lastUpdated: 2026-05-19
version: v1.0
reviewStatus: in-review
links:
  - label: Related news log
    href: /logs/2026-05-18-dr-yin-knee-function-assessment-consultation
  - label: Meeting minutes index
    href: /docs/meeting-minutes-index-v1
evidence:
  - label: OARSI physical performance measures
    href: https://oarsi.org/research-oarsi-success/physical-performance-measures
  - label: Timed Up and Go - RehabMeasures Database
    href: https://www.sralab.org/rehabilitation-measures/timed-and-go
actionItems:
  - owner: M2 / frontend
    task: "Rename session records to collection records where the UI refers to patient sensor collection rather than chat sessions."
  - owner: M2 / collection-related teams
    task: "Define the first three standard movement flows: sit-to-stand or squat-like movement, level walking, and stair ascent/descent."
  - owner: Collection-related teams
    task: "Collect baseline curves from healthy participants and prepare a standard reference curve or reference range."
  - owner: M2 / frontend
    task: "Design patient curve versus baseline curve comparison in the doctor-side chart view."
  - owner: M1 / V2
    task: "Add doctor-patient binding so patients register through a doctor link or QR code and doctors only see their own patients."
  - owner: V1 / medical guidance
    task: "Keep AI output limited to auxiliary or rule-based summaries until standardised data and labels are available."
featured: false
archived: false
---

# Meeting Minutes - Consultation with Dr. Yin on Knee Function Assessment System

## 1. Meeting Info

- **Date**: May 18, 2026, Beijing time
- **Format**: Online meeting with screen-sharing demonstration
- **Participants**: Lee, M2 team lead; Dr. Yin, course consultant
- **Topic**: Doctor-side feature demonstration and next-stage requirement confirmation for the knee-function assessment system
- **Goal**: Review the current doctor-side and administrator-side web system, collect medical-scenario feedback, and clarify the next direction for data collection, functional assessment, doctor-patient binding, patient-side training, and AI suggestion boundaries.

## 2. Current System Demonstration

### 2.1 Doctor Registration and Administrator Review

Lee first demonstrated the current doctor-side web system using the Chinese interface. The registration flow supports display name, email or phone number, password, and doctor credential image upload. After submission, the system informs the doctor that the application has been submitted and must be approved by an administrator before login.

Lee then demonstrated the administrator side. The administrator can review doctor applications, inspect uploaded credential photos, and approve or reject the application. If rejected, the doctor needs to upload materials again. If approved, the doctor can access the doctor-side system.

### 2.2 Patient List and Data Review

After login, the doctor side currently displays a patient list. Lee explained that because the patient-side team has not yet completed doctor selection or doctor-patient assignment, every doctor can temporarily see all patient data. This is a temporary implementation state, not the final design.

Each row represents one patient. Some patient accounts have been created but do not yet contain valid collection data, so their detail pages show an empty state. For patients with existing data, the system can display multiple collection records, with each session corresponding to one sensor-data collection activity.

### 2.3 Curve Display and Collection Records

Lee demonstrated angle curves for patient data. The system can currently show multiple left-leg and right-leg angle curves, and it supports chart zooming, local time-window filtering, full timeline browsing, and individual collection record review.

Lee noted that the current label "session record" is not accurate. A better term is "collection record", because each session represents one sensor-data collection action rather than doctor-patient chat. Dr. Yin agreed and emphasised that the system should not be framed as online consultation or chat. Its focus should be patient-data assessment.

## 3. Dr. Yin's Core Feedback

### 3.1 Focus Should Move from Interface Display to Standardised Functional Assessment

Dr. Yin observed that the team had invested significant effort in how the interface is used and how charts are displayed. From a doctor's perspective, however, the more important issue is whether the collected data has medical assessment value.

The current curves are difficult to interpret if there is no standard movement, no standard curve, and no assessment baseline. The meeting therefore formed a core judgement: the next stage should build a functional assessment framework around **standard movement, standard curve, patient curve, and difference explanation**, rather than only showing angle changes.

### 3.2 Standard Movements Are Required

Dr. Yin advised that patients should not simply attach sensors and collect data while moving randomly. The system needs a standardised movement process so that collection results are comparable.

The meeting prioritised three everyday movement categories:

| Movement | Assessment Value |
| --- | --- |
| Sit-to-stand or squat-like movement | Observes the transition from knee flexion to extension, movement amplitude, speed, and control. |
| Forward walking on level ground | Can use a short walking distance, such as about 5 meters, to inspect gait rhythm, knee activity pattern, and walking stability. |
| Stair ascent and descent | Requires weight-bearing force and is more demanding than level walking, so it can reflect strength, control, and functional limitation. |

These movements are closer to daily-life function than simple extension and flexion, and they can provide a broader view of patient status.

### 3.3 A Healthy Baseline Curve Is Needed

Dr. Yin emphasised that the system needs a standard or baseline curve. Knee-motion curves do not have a clinical reading convention as mature as electrocardiograms, so the project can first build reference curves from healthy participants.

Suggested approach:

1. Recruit several healthy participants.
2. Ask them to complete the same standard movements.
3. Average or normalise the collected curves.
4. Use the result as a baseline curve or reference range.
5. Display the patient curve together with the baseline curve.

External references support this direction. OARSI performance-based measures for knee or lower-limb function include tests such as the 30-second chair stand, 40-meter fast-paced walk, stair-climb test, Timed Up and Go, and six-minute walk. The Timed Up and Go procedure also includes rising from a chair, walking, turning, returning, and sitting down, which is consistent with Dr. Yin's focus on everyday functional movements.

### 3.4 Curve Differences Should Map to Interpretable Functional Problems

Dr. Yin stressed that doctors care about the difference between a patient's curve and a normal curve, not whether the curve looks visually neat. Differences can be interpreted through amplitude, speed, cycle width, and regularity.

| Curve Pattern | Possible Meaning | Initial Interpretation |
| --- | --- | --- |
| Lower amplitude | Insufficient movement range | May suggest limited joint range of motion or structural limitation. |
| Wider cycle or slower action | Reduced movement speed | May suggest insufficient muscle strength, poor drive, or reduced control. |
| Low amplitude and wide cycle | Combined range and strength limitation | May indicate poorer overall functional status and the need for combined rehabilitation support. |
| Irregular curve | Non-standard movement or poor control | Needs to be checked against the collection process to distinguish operation error from functional limitation. |

For example, if a patient can complete the squat-like movement with enough amplitude but takes much longer, the issue may be less about range of motion and more about muscle strength or driving force. If the amplitude is clearly insufficient, the issue may relate more directly to knee range of motion.

## 4. Doctor-Patient Binding and Patient Registration

### 4.1 Current Issue

At present, any doctor can see all patients after logging in. Lee asked whether the final design should allow doctors to select patients or patients to select doctors during registration.

### 4.2 Meeting Decision

Dr. Yin suggested a simpler and more controlled one-to-many structure: one doctor can manage multiple patients, and each patient should be bound to one doctor. Doctors should not be able to view every patient.

Recommended flow:

1. The doctor generates a registration link or QR code.
2. The patient enters registration through the doctor-provided link or QR code.
3. After registration, the patient is automatically bound to that doctor.
4. The patient's data is visible only to the bound doctor.
5. Patients should not register independently outside the doctor workflow.

### 4.3 Design Reason

Dr. Yin noted that the system should not become a complex doctor-patient communication network. In a realistic setting, patients use the system under doctor guidance, and the responsible doctor reviews the data. This better matches offline diagnosis, rehabilitation follow-up, and data-permission control.

## 5. Collection Devices and Usage Scenario

### 5.1 Patient Personal Phones Are Not Ideal

Lee explained that the current patient measurement flow requires opening a phone, connecting sensors, and completing the collection process. He asked whether a doctor-side collection mode is needed for patients without smartphones or older patients unfamiliar with phone operation.

Dr. Yin pointed out that real use should not over-depend on personal phones. Different phone brands and systems may pair with Bluetooth sensors differently, and requiring every patient to connect sensors themselves would make execution unstable.

### 5.2 Fixed Doctor-Side Device Is Preferred

The meeting suggested binding sensors to a fixed doctor-side tablet or dedicated device. In this model, the device can be configured in the clinic in advance. When patients arrive, the doctor or staff member guides them through standard movements and data collection.

| Aspect | Benefit |
| --- | --- |
| Device compatibility | Reduces instability across phone brands and systems. |
| Operation flow | Allows on-site guidance by the doctor or staff. |
| Data quality | Makes it easier to ensure standard movement and complete collection. |
| System positioning | Keeps the system focused on assessment support rather than online consultation. |

## 6. Rehabilitation Advice and Training Movement Module

### 6.1 Current Doctor-Side Advice Function

Lee demonstrated the function for sending rehabilitation training advice to patients. Doctors can select or enter exercises, sets, repetitions, duration, and clinical notes. For example, a doctor can prescribe knee flexion-extension training, set it as "10 repetitions x 3 sets", and add precautions. The patient side can view the assigned training task and mark it as completed.

### 6.2 Clinical Notes

The doctor side also supports clinical notes for patients. These notes are visible only to the doctor and not to the patient. They can be used to record special patient conditions, curve characteristics, differences from normal status, and follow-up reminders. Dr. Yin agreed that this function is reasonable.

### 6.3 Patient-Side Training Videos

Lee further described a patient-side idea: after measurement, patients could view rehabilitation exercises on mobile based on the doctor's advice. Each exercise may include an instructional video.

Dr. Yin considered this acceptable, but said patients do not need to keep wearing sensors during training. Patients can follow the doctor's advice and the exercise videos. The exercise library does not need to be large at first; around ten suitable movements would be enough. Doctors can select movement combinations for different patients.

## 7. AI Suggestion Module

### 7.1 Current Issue

Lee explained that the system reserves an AI suggestion module, but the AI team has not yet provided effective content. The intended idea is that AI could judge angle range, functional state, and rehabilitation suggestions from patient curves.

### 7.2 Dr. Yin's View: AI Is Too Early as Medical Judgement

Dr. Yin clearly stated that AI involvement is premature at this stage for two reasons:

1. **Insufficient data volume**: medical AI usually requires large labelled datasets. Without enough patient data and standard samples, reliable judgement is difficult.
2. **Insufficient labels and expert definitions**: before training, doctors or experts must define what is normal, what is abnormal, and what types of abnormality exist.

Dr. Yin compared this with medical image AI. Before training a model, humans first screen and label many tumour and non-tumour images, and then AI learns from those examples. Knee-motion curve analysis similarly needs standards and doctor-defined rules first.

### 7.3 Stage Positioning for AI

The meeting suggested that AI should not be the core medical judgement module now. The current stage should prioritise:

1. Standard movement design.
2. Healthy baseline curve collection.
3. Patient curve and baseline curve comparison.
4. Interpretable difference indicators.
5. Doctor notes and manual rehabilitation advice.

After these foundations are established, AI can assist doctors by reducing curve-reading workload, but it should not replace doctors or directly produce diagnostic conclusions.

## 8. Additional Directions

### 8.1 Doctor-Assistant AI

In the later part of the meeting, Dr. Yin mentioned personal needs for a doctor-assistant AI, such as answering common patient questions through WeChat or helping with appointment scheduling. Lee explained the difference between simple automatic replies and a real AI agent, and noted uncertainty around whether WeChat would support large-scale AI automated replies.

This topic was treated as a later research direction and not part of the current core system.

### 8.2 Future Motion Capture

Dr. Yin also mentioned an earlier idea of showing a dynamic character-like motion-capture view through sensors. Lee noted that 3D reconstruction or motion capture would be relatively complex. The meeting concluded that the current stage should first complete standard movements, baseline curves, and the assessment workflow. If the next-stage foundation is strong enough, motion capture can be revisited.

## 9. Main Decisions

| ID | Decision | Detail |
| --- | --- | --- |
| D1 | System positioning | Focus on knee-function data assessment, not online consultation or doctor-patient chat. |
| D2 | Collection logic | Move from arbitrary collection to standard-movement collection. |
| D3 | Standard movements | Prioritise sit-to-stand or squat-like movement, level walking, and stair ascent/descent. |
| D4 | Baseline curves | Collect healthy participant data and build reference baseline curves. |
| D5 | Curve display | Show patient curves and baseline curves together. |
| D6 | Doctor-patient binding | Patients register through a doctor link or QR code and bind to that doctor. |
| D7 | Patient registration | Patients should not independently register outside the doctor workflow. |
| D8 | Collection device | Prefer a fixed doctor-side tablet or dedicated device over patient personal phones. |
| D9 | AI suggestion | Do not treat AI as core medical judgement at the current stage. |
| D10 | Exercise library | Build a small exercise library that doctors can select from. |
| D11 | Motion capture | Keep motion capture as a later extension, not a current priority. |

## 10. Follow-Up Tasks

| Priority | Task | Owner / Related Group | Notes |
| --- | --- | --- | --- |
| High | Rename "session record" to "collection record" | M2 / frontend | Avoid misunderstanding the feature as doctor-patient chat. |
| High | Design three standard movement flows | M2 / collection teams / Dr. Yin guidance | Sit-to-stand or squat-like movement, level walking, stair ascent/descent. |
| High | Collect healthy baseline curves | Collection-related teams | Collect from multiple healthy participants and build an average or reference range. |
| High | Implement patient curve versus baseline curve comparison | M2 / frontend | Use visual distinction for baseline and patient curves. |
| High | Add doctor-patient binding | M1 / V2 | Doctor link or QR code registration, automatic binding after registration. |
| High | Restrict doctor data permission | V2 | Doctors should only access their own patients. |
| Medium | Optimise chart loading speed | M2 / frontend / V2 | Current deployed charts may load slowly. |
| Medium | Build rehabilitation exercise library | Patient side / medical guidance | About ten suitable movements are enough for the first stage. |
| Medium | Refine doctor-side training advice delivery | M2 / frontend | Support exercise selection, repetitions, sets, duration, and notes. |
| Medium | Clarify stage output of AI module | V1 | Use rule-based summaries or placeholder content rather than diagnosis. |
| Low | Research WeChat doctor-assistant AI feasibility | Later research | Not part of the current main line. |
| Low | Research motion-capture display | Later version | Not part of the current core target. |

## 11. Risks and Notes

| Risk | Symptom | Mitigation |
| --- | --- | --- |
| Non-standard collection | Curves are messy and difficult to explain. | Define movement, timing, posture, and collection procedure first. |
| Missing baseline curve | Doctors cannot judge whether a patient curve is abnormal. | Collect healthy data and build a baseline curve or reference range. |
| Phone compatibility instability | Different phones connect to sensors differently. | Use fixed doctor-side devices where possible. |
| Over-wide doctor access | Every doctor can view every patient. | Add doctor-patient binding and permission isolation. |
| Unreliable AI output | Data volume and labels are insufficient. | Delay AI medical judgement and keep doctor-defined rules first. |
| System positioning drift | The system may be misunderstood as online consultation or chat. | Position it as data assessment and rehabilitation support. |
| Chart performance limitations | Deployed charts may load slowly. | Optimise data loading, chart rendering, and related interfaces. |

## 12. Conclusion

The May 18 consultation clarified the next-stage direction of the knee-function assessment system. The system should not remain a simple angle-curve display. It should build an interpretable functional assessment process around standard movements, baseline curves, and patient-curve differences.

Dr. Yin suggested starting with three daily-life movement categories: sit-to-stand or squat-like movement, level walking, and stair ascent/descent. Patient data should be displayed together with a baseline curve so that doctors can interpret function through amplitude, speed, cycle width, and regularity.

The meeting also clarified that patients should register through doctor-provided links or QR codes and bind to the corresponding doctor. Collection devices should preferably be fixed doctor-side devices rather than patient personal phones. AI suggestions should not become the core medical judgement function until standard movements, standard data, and doctor-defined labels are established.

---

Posted by Team M2 · DSD 2025-2026 · UTAD × JLU

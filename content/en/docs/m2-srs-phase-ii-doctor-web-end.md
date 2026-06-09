---
id: doc-m2-srs-phase-ii-doctor-web-end
slug: m2-srs-phase-ii-doctor-web-end
title: Software Requirements Specification for M2 Doctor Web End - Phase II
type: requirement-analysis
date: 2026-05-24
owner: M2 Team
ownerRole: Doctor Web Team
status: completed
summary: Phase II SRS for the M2 doctor web end, defining doctor-patient binding, movement-type classification, standard-curve comparison, rehabilitation schedule delivery, AI suggestion storage, and cross-team interface expectations.
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
  - requirement-analysis
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
version: v2.0
reviewStatus: completed
lastUpdated: 2026-05-24
links:
  - label: Release news
    href: /logs/2026-05-24-m2-phase-ii-srs-released
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

# Software Requirements Specification for M2 Doctor Web End - Phase II

Revision History:

| Date | Author | Description |
| ---- | ------ | ----------- |
| May 24, 2026 | M2 Team | Initial Phase II SRS for the doctor web end based on the Phase II requirement meeting |
| May 24, 2026 | M2 Team | Updated according to the M2-to-V2 interface change requests, including `doctor_id`, `exercise_id`, `movement_type`, schedule data structure, AI suggestion storage, and administrator permission constraints |

## 0. Background

This document specifies the Phase II software requirements for the M2 group, which is responsible for the doctor web end of the lower-limb rehabilitation motion detection system.

The system is used to support rehabilitation training and motion assessment for patients with lower-limb movement problems. Doctors use the web end to manage patients, view motion sessions, compare patient motion curves with standard curves, issue rehabilitation schedules or prescriptions, and follow up on completion status.

According to the Phase II requirement discussion, the current system has several limitations:

1. The doctor-side system can currently view all patients, so a doctor-patient binding mechanism is required.
2. Motion sessions are not clearly classified by movement type, making it difficult to select the correct standard curve for comparison.
3. Standard curves are needed for squat, walking, and stair climbing.
4. Rehabilitation schedules should be created from preset exercise items instead of free-text input.
5. AI recommendations are still a later-stage feature because the current data volume is limited, but the database interface should be prepared so that one generated AI suggestion can be saved for each session.

Therefore, the main goal of Phase II is to build a stable patient-management, data-classification, curve-comparison, and schedule-delivery workflow before introducing advanced AI features.

### 0.1 Purpose of This Document

This SRS is intended to:

- Clarify what the M2 doctor web team needs to implement in Phase II.
- Extract and organize the use cases related to the doctor web end.
- Define the data fields and interface expectations that M2 depends on from the V2 backend/database team.
- Provide a shared reference for M1, M2, S1, S2, V1, and V2 during cross-group integration.

### 0.2 Scope of M2

In scope for M2 Phase II:

- Doctor-side patient management based on `doctor_id`.
- Doctor-generated patient registration link or QR code.
- Display of only the patients bound to the current doctor.
- Session record display with `movement_type`.
- Date and movement-type filtering for session records.
- Embedded standard curves for walking, stair climbing, and squatting.
- Overlay display of patient curves and standard curves.
- Basic curve comparison indicators, such as amplitude, frequency, width, and other available features.
- Preset rehabilitation exercise list display.
- Schedule or prescription creation using `exercise_id`, `repetitions`, `sets`, `date`, and `notes`.
- Display of schedule or prescription status returned by the backend.
- Optional doctor-triggered AI suggestion generation for a session.
- Retrieval and display of saved AI suggestions if they already exist.

Out of scope for M2 Phase II:

- Sensor Bluetooth connection and raw sensor data acquisition.
- Healthy-person data collection.
- Standard curve fitting algorithm implementation.
- Backend permission enforcement implementation.
- Database schema implementation.
- Patient mobile-end implementation for registration, prescription viewing, or completion marking.
- Administrator backend permission implementation, unless an admin UI is later assigned to M2.
- WeChat AI assistant implementation.

### 0.3 Definitions and Naming Rules

To avoid confusion across groups, the following naming rules should be used consistently.

| Concept | Recommended Field Name | Description |
| ------- | ---------------------- | ----------- |
| Doctor ID | `doctor_id` | The identifier of the doctor who owns or manages a patient. |
| Patient ID | `user_id` or `patient_id` | The identifier of the patient. The backend may currently use `user_id`; M2 should map it clearly in the interface layer. |
| Rehabilitation exercise ID | `exercise_id` | The identifier of a preset rehabilitation exercise used in schedules or prescriptions. |
| Measured movement type | `movement_type` | The movement actually measured in a session, such as `walking`, `stair_climbing`, or `squatting`. |
| Session ID | `session_id` | The identifier of a measurement session. |
| AI suggestion reference | `session_id` | Each AI suggestion should be linked to exactly one measurement session. |

The term `exercise` should mainly refer to rehabilitation training items used in schedules or prescriptions. The term `movement_type` should refer to the actual measured action in a sensor session.

### 0.4 Related Groups and Dependencies

| Group | Dependency for M2 |
| ----- | ----------------- |
| M1 Patient Mobile End | Patient registration through doctor link, schedule display, teaching video display, and completion status update. |
| S1 Sensor Group | Standard action data collection workflow and healthy-person motion data for walking, stair climbing, and squatting. |
| S2 Data Group | Storage and processing support for patient curves; visualization support such as zooming, dragging, and session detail navigation. |
| V1 AI Group | Standard-curve fitting and optional later-stage AI analysis. Borges' AI source code may be used for suggestion generation. |
| V2 Backend and Database Group | `doctor_id`, `exercise_id`, `movement_type`, schedule data structure, AI suggestion storage, doctor-patient binding, and permission filtering. |

## 1. Requirements Summary

### 1.1 Functional Requirements

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| M2-FR-01 | The doctor web end shall allow a logged-in doctor to generate a patient registration link or QR code. | High |
| M2-FR-02 | The generated registration link or QR code shall contain or be associated with the current doctor's `doctor_id`. | High |
| M2-FR-03 | A patient who registers through the doctor's link or QR code shall be automatically bound to that doctor. | High |
| M2-FR-04 | The doctor web end shall not provide an independent patient registration entrance that bypasses doctor binding. | High |
| M2-FR-05 | The patient data returned by the backend shall include `doctor_id` so that M2 can identify patient ownership. | High |
| M2-FR-06 | The doctor web end shall display only patients whose `doctor_id` matches the current doctor. | High |
| M2-FR-07 | For the current development stage, if the backend can only return all patients, the M2 web end may temporarily filter patients locally by `doctor_id`. | Medium |
| M2-FR-08 | The final integrated system should enforce doctor-patient access control on the backend side, not only on the frontend side. | High |
| M2-FR-09 | A regular doctor shall not be allowed to modify a patient's `doctor_id`. | High |
| M2-FR-10 | Administrators shall be able to view all patients regardless of `doctor_id`; this is a backend/admin-side requirement and is not part of the normal doctor workflow. | Medium |
| M2-FR-11 | Administrators shall be able to modify a patient's `doctor_id`; regular doctors shall not have this permission. | Medium |
| M2-FR-12 | The patient list shall support opening a patient detail page. | Medium |
| M2-FR-13 | The session record page shall show session records for a selected patient. | High |
| M2-FR-14 | Each session record shall include `movement_type`. | High |
| M2-FR-15 | The session record page shall support filtering by date range and `movement_type`. | Medium |
| M2-FR-16 | The supported measured movement types for Phase II shall include `walking`, `stair_climbing`, and `squatting`. | High |
| M2-FR-17 | The doctor web end shall support standard curve comparison for walking, stair climbing, and squatting. | High |
| M2-FR-18 | In the current stage, the three standard curves shall be embedded directly in the M2 code because only three curves and one age group are available. | High |
| M2-FR-19 | The V2 database team does not need to store standard curves in Phase II unless a later integration decision changes this scope. | Medium |
| M2-FR-20 | The doctor web end shall select the correct embedded standard curve according to the session's `movement_type`. | High |
| M2-FR-21 | The doctor web end shall overlay the patient curve and the standard curve in the same chart. | High |
| M2-FR-22 | The curve comparison page shall support comparison indicators including amplitude, frequency, width, and other available curve features. | Medium |
| M2-FR-23 | The backend/database shall provide a preset rehabilitation exercise list with stable `exercise_id` values. | High |
| M2-FR-24 | The preset exercise list should include about 10 to 15 common lower-limb rehabilitation exercises. | Medium |
| M2-FR-25 | The doctor shall select an exercise from the preset exercise list instead of manually typing a free-text exercise name. | High |
| M2-FR-26 | When creating a schedule or prescription, the M2 web end shall submit `exercise_id` instead of a free-text `exercise` field. | High |
| M2-FR-27 | The schedule or prescription data structure shall use `repetitions` and `sets` instead of `duration`. | High |
| M2-FR-28 | The schedule or prescription form shall include `exercise_id`, `date`, `repetitions`, `sets`, `notes`, and patient information. | High |
| M2-FR-29 | If the backend returns schedule information, it should include exercise details such as `exercise_name` and description to support direct display on the M2 page. | Medium |
| M2-FR-30 | The doctor web end shall submit a schedule or prescription to the backend so that the patient end can view it. | High |
| M2-FR-31 | The doctor web end shall display schedule or prescription status such as `pending`, `completed`, or other backend-defined values. | Medium |
| M2-FR-32 | The patient end shall be able to mark a schedule or prescription as completed; M2 shall display the updated status after synchronization. | Medium |
| M2-FR-33 | The doctor web end may provide a **Generate AI Suggestions** button for a selected session if the AI integration is available. | Low |
| M2-FR-34 | Each session shall correspond to at most one saved AI-generated suggestion in the database. | Medium |
| M2-FR-35 | If an AI suggestion has already been generated for a session, M2 shall retrieve and display the saved suggestion instead of requiring regeneration every time the doctor logs in. | Medium |
| M2-FR-36 | AI-generated suggestions shall be displayed as auxiliary analysis only and shall not be presented as final clinical conclusions. | High |

### 1.2 Non-Functional Requirements

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| M2-NFR-01 | The doctor web end shall identify the current doctor from authentication status before requesting patient data. | High |
| M2-NFR-02 | Patient-related requests shall be associated with or validated against the current doctor's `doctor_id`. | High |
| M2-NFR-03 | The system shall show clear error messages when patient loading, QR code generation, session loading, schedule submission, or AI suggestion generation fails. | Medium |
| M2-NFR-04 | The curve visualization page shall provide readable legends, axes, units, and labels for patient curves and standard curves. | Medium |
| M2-NFR-05 | The page shall provide loading states for slow backend responses to reduce confusion. | Medium |
| M2-NFR-06 | The doctor web end shall be usable on common desktop browsers and doctor-side tablet devices. | Medium |
| M2-NFR-07 | The UI shall clearly distinguish `exercise_id` for prescribed rehabilitation exercises from `movement_type` for measured sessions. | High |
| M2-NFR-08 | Locally embedded standard curves shall be stored in a maintainable configuration file or module so that they can be replaced by database-provided curves in a later phase. | Medium |
| M2-NFR-09 | The frontend shall not rely on local filtering as the only security mechanism in the final integrated system. | High |
| M2-NFR-10 | AI suggestions shall include a visible warning or wording that they are for reference only, especially while the model and data quality are still immature. | High |

## 2. Use Cases

1.1. Case: Generate Patient Registration Link or QR Code  
1.2. Case: Register and Bind Patient through Doctor Link  
1.3. Case: View Bound Patient List  
1.4. Case: View Patient Session Records by Movement Type  
1.5. Case: Compare Patient Curve with Embedded Standard Curve  
1.6. Case: View Preset Rehabilitation Exercise List  
1.7. Case: Create and Deliver Rehabilitation Schedule or Prescription  
1.8. Case: View Schedule or Prescription Completion Status  
1.9. Case: Generate AI Suggestion for a Session  
1.10. Case: Retrieve Saved AI Suggestion  
1.11. Case: Block Unauthorized Doctor Access  
1.12. Case: Administrator Reassigns Patient to Another Doctor

### 2.1 Use Case Diagram

The complete visual diagram is maintained in the Phase II diagram appendix.

See : [M2 Phase II Workflow and Use Case Diagrams](/docs/m2-phase-ii-workflow-and-use-case-diagrams).

## 3. Key Examples

### 3.1 Generate Patient Registration Link or QR Code

#### 3.1.1 Basic Info

- Reference to Use Case 1.1.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System
- Goal: Allow a doctor to create a registration entrance for new patients so that patients are automatically bound to this doctor after registration.
- Summary: The doctor clicks a button to generate a registration link or QR code. The system associates the link with the current doctor's `doctor_id` and displays it to the doctor for sharing with the patient.
- Trigger: A doctor wants to invite a new patient into the rehabilitation system.
- Frequency: Several times per doctor, depending on the number of new patients.
- Precondition: The doctor has logged in successfully, and the backend can identify the current doctor's `doctor_id`.
- Postconditions: A valid registration link or QR code is generated and shown on the doctor web page.

![]()

#### 3.1.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens the patient management page. |  |
| Doctor clicks **Generate Registration Link** or **Generate QR Code**. |  |
|  | System reads the current doctor's identity from the login session. |
|  | System sends a request to the backend to create a doctor-bound registration token. |
|  | Backend creates a token associated with the current `doctor_id`. |
|  | Backend returns the registration URL and QR code data. |
|  | Doctor web end displays the link and QR code. |
| Doctor copies the link or asks the patient to scan the QR code. |  |

#### 3.1.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| Doctor is not logged in or the session has expired. |  |
|  | System redirects the doctor to the login page or displays an authentication error. |
| Backend fails to generate the token. |  |
|  | System displays a failure message and keeps the page available for retry. |
| Doctor wants to regenerate the link. |  |
|  | System requests a new token and updates the displayed link or QR code. |

### 3.2 Register and Bind Patient through Doctor Link

#### 3.2.1 Basic Info

- Reference to Use Case 1.2.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Patient, Patient Mobile End, Backend System, Doctor Web End
- Goal: Ensure that a patient can only register through a doctor-provided link or QR code and is automatically bound to that doctor.
- Summary: The patient opens the link or scans the QR code generated by the doctor. After registration, the backend stores the patient's information together with the corresponding `doctor_id`. The doctor web end can then display this patient in the doctor's patient list.
- Trigger: A patient receives a registration link or QR code from a doctor.
- Frequency: Once per new patient account.
- Precondition: The registration link or QR code is valid and contains a valid doctor-binding token.
- Postconditions: A patient account is created and bound to the correct doctor.

![]()

#### 3.2.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Patient opens the registration link or scans the QR code. |  |
|  | System verifies the registration token and retrieves the corresponding `doctor_id`. |
| Patient fills in the required registration information. |  |
| Patient submits the registration form. |  |
|  | System validates the patient information. |
|  | System creates the patient account and stores the associated `doctor_id`. |
|  | System returns a successful registration message to the patient end. |
| Doctor opens the patient list. |  |
|  | System displays the newly registered patient in the bound patient list. |

#### 3.2.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| Patient opens an expired or invalid link. |  |
|  | System rejects the registration request and displays an invalid-link message. |
| Patient tries to register without a doctor link. |  |
|  | System does not allow independent registration and asks the patient to contact a doctor. |
| Patient account already exists. |  |
|  | System displays an account-exists message and prevents duplicate account creation. |
| Patient is already bound to another doctor. |  |
|  | System rejects repeated binding or requires administrator reassignment according to backend rules. |

### 3.3 View Bound Patient List

#### 3.3.1 Basic Info

- Reference to Use Case 1.3.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System
- Goal: Allow a doctor to view only the patients bound to that doctor.
- Summary: After login, the doctor enters the patient list page. The doctor web end requests patient data and displays only the records whose `doctor_id` matches the current doctor.
- Trigger: The doctor wants to manage or review patients.
- Frequency: Daily or whenever the doctor uses the system.
- Precondition: The doctor has logged in successfully and the backend returns patient records with `doctor_id`.
- Postconditions: The doctor sees only bound patients and can open a patient detail page.

![]()

#### 3.3.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens the patient list page. |  |
|  | System identifies the current doctor's `doctor_id`. |
|  | System requests patient data from the backend. |
|  | Backend returns patient records including `doctor_id`. |
|  | Doctor web end filters and displays only patients whose `doctor_id` matches the current doctor. |
| Doctor clicks one patient record. |  |
|  | System opens the patient detail page. |

#### 3.3.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| No patient is currently bound to the doctor. |  |
|  | System displays an empty-state message and suggests generating a registration link. |
| Backend returns patients not matching the current doctor. |  |
|  | In the temporary development stage, M2 filters out unmatched records locally. |
| Backend already supports doctor-filtered queries. |  |
|  | M2 directly displays the filtered result returned by the backend. |
| Doctor attempts to access an unbound patient by direct URL. |  |
|  | System blocks the page or displays a permission-denied message. |

### 3.4 View Patient Session Records by Movement Type

#### 3.4.1 Basic Info

- Reference to Use Case 1.4.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System
- Goal: Allow the doctor to review a bound patient's historical measurement sessions and identify what movement was measured in each session.
- Summary: The doctor opens the session record page for a selected patient. Each session record includes `movement_type`, such as `walking`, `stair_climbing`, or `squatting`. The doctor can filter records by date and movement type.
- Trigger: The doctor wants to review a patient's motion data.
- Frequency: Several times per patient treatment cycle.
- Precondition: The patient is bound to the current doctor and the backend returns session records with `movement_type`.
- Postconditions: The doctor can select a session and open the curve comparison view.

![]()

#### 3.4.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens the detail page of a bound patient. |  |
| Doctor opens the session records tab. |  |
|  | System requests session records for the selected patient. |
|  | System verifies that the patient belongs to the current doctor. |
|  | Backend returns session records including `session_id`, `user_id`, `movement_type`, `created_at`, and related measurement metadata. |
|  | Doctor web end displays the session record list. |
| Doctor selects a date range or `movement_type` filter. |  |
|  | System refreshes the session record list according to the selected filters. |
| Doctor clicks a session record. |  |
|  | System opens the selected session detail or curve comparison page. |

#### 3.4.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| The selected patient has no session records. |  |
|  | System displays an empty-state message. |
| A session record does not include `movement_type`. |  |
|  | System displays the record as unknown movement type and cannot automatically select a standard curve. |
| The selected `movement_type` has no data. |  |
|  | System displays a no-data message for this movement type. |
| Backend response is slow or fails. |  |
|  | System displays a loading state first and then an error message if the request fails. |

### 3.5 Compare Patient Curve with Embedded Standard Curve

#### 3.5.1 Basic Info

- Reference to Use Case 1.5.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System
- Goal: Help doctors compare a patient's motion curve against the corresponding standard baseline curve.
- Summary: The doctor selects a session. The doctor web end loads the patient curve from the backend and selects the corresponding embedded standard curve according to the session's `movement_type`. Both curves are shown in the same chart.
- Trigger: The doctor opens a session detail page and wants to evaluate movement quality.
- Frequency: Whenever the doctor reviews a patient's measurement session.
- Precondition: The selected session belongs to a bound patient and has a valid `movement_type`. The corresponding embedded standard curve is available in M2 code.
- Postconditions: The doctor can visually and quantitatively compare the patient's movement with the standard baseline.

![]()

#### 3.5.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens a session detail page. |  |
|  | System reads the session's `movement_type`. |
|  | System requests the patient curve for the selected `session_id`. |
|  | System selects the embedded standard curve matching the `movement_type`. |
|  | System overlays the patient curve and the standard curve on one chart. |
|  | System displays legends, axes, units, and time range. |
|  | System displays available comparison indicators, such as amplitude, frequency, width, and duration-related features. |
| Doctor reviews the chart and comparison indicators. |  |

#### 3.5.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| `movement_type` is not one of `walking`, `stair_climbing`, or `squatting`. |  |
|  | System displays the patient curve only and shows a warning that no embedded standard curve is available. |
| Patient curve data is incomplete or invalid. |  |
|  | System displays an invalid-data warning and prevents misleading comparison results. |
| Feature comparison data is not available. |  |
|  | System hides unavailable indicators and still displays the curve overlay if possible. |
| A later phase provides standard curves from the database. |  |
|  | M2 may replace the embedded curve source with a backend standard-curve API without changing the main UI workflow. |

### 3.6 View Preset Rehabilitation Exercise List

#### 3.6.1 Basic Info

- Reference to Use Case 1.6.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System
- Goal: Allow doctors to select rehabilitation exercises from a preset list with stable `exercise_id` values.
- Summary: The doctor opens the schedule or prescription creation page. The system loads a predefined exercise list from the backend and displays exercise names and descriptions. The doctor selects one exercise by `exercise_id`.
- Trigger: The doctor wants to create or update a rehabilitation schedule or prescription.
- Frequency: Whenever the doctor creates a schedule or prescription.
- Precondition: The backend has configured a preset exercise list containing about 10 to 15 exercises.
- Postconditions: One exercise is selected for a schedule item.

![]()

#### 3.6.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens the schedule or prescription creation page. |  |
|  | System requests the preset exercise list from the backend. |
|  | Backend returns exercise records with `exercise_id`, name, and description. |
|  | System displays exercise names and descriptions. |
| Doctor searches or filters the exercise list. |  |
|  | System updates the displayed exercise list. |
| Doctor selects one exercise. |  |
|  | System stores the selected `exercise_id` in the schedule draft. |

#### 3.6.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| The exercise list fails to load. |  |
|  | System displays an error message and asks the doctor to retry. |
| Doctor selects an exercise that has been disabled or removed. |  |
|  | System blocks the selection and asks the doctor to refresh the list. |
| No exercise matches the search condition. |  |
|  | System displays an empty search result message. |

### 3.7 Create and Deliver Rehabilitation Schedule or Prescription

#### 3.7.1 Basic Info

- Reference to Use Case 1.7.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System, Patient Mobile End
- Goal: Allow a doctor to issue rehabilitation training instructions to a bound patient.
- Summary: The doctor selects a bound patient, selects a preset exercise, enters the date, repetitions, sets, notes, and then submits the schedule or prescription. The backend stores the data and makes it available to the patient end.
- Trigger: The doctor wants to assign home or clinic rehabilitation training to a patient.
- Frequency: Based on each patient's treatment plan.
- Precondition: The patient is bound to the current doctor, and the selected exercise has a valid `exercise_id`.
- Postconditions: The schedule or prescription is saved and can be retrieved by the patient end.

![]()

#### 3.7.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens a bound patient's detail page. |  |
| Doctor clicks **Create Schedule** or **Create Prescription**. |  |
|  | System opens the schedule form. |
| Doctor selects one preset exercise. |  |
|  | System stores the selected `exercise_id`. |
| Doctor enters `date`, `repetitions`, `sets`, and `notes`. |  |
| Doctor submits the form. |  |
|  | System validates required fields and numeric ranges. |
|  | System sends the schedule data to the backend. |
|  | Backend stores the schedule and associates it with the selected patient and doctor. |
|  | System displays a successful submission message. |
|  | Patient mobile end can retrieve and display the schedule. |

#### 3.7.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| Doctor submits the form without selecting an exercise. |  |
|  | System displays a validation error. |
| Doctor submits invalid `repetitions` or `sets`. |  |
|  | System displays a validation error and asks the doctor to correct the input. |
| The selected patient is not bound to the current doctor. |  |
|  | System blocks schedule submission and displays a permission error. |
| Backend fails to save the schedule. |  |
|  | System displays a submission failure message and keeps the draft. |

### 3.8 View Schedule or Prescription Completion Status

#### 3.8.1 Basic Info

- Reference to Use Case 1.8.
- Version: 1.1
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System, Patient Mobile End
- Goal: Allow doctors to know whether a patient has completed the prescribed rehabilitation exercise.
- Summary: After the patient views a schedule or prescription and marks it as completed on the patient end, the doctor web end retrieves and displays the latest status.
- Trigger: The doctor wants to follow up on a patient's rehabilitation progress.
- Frequency: During patient follow-up or before the next treatment session.
- Precondition: The schedule exists and belongs to a patient bound to the current doctor.
- Postconditions: The doctor can see the latest schedule status.

![]()

#### 3.8.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens the patient's schedule page. |  |
|  | System requests schedules for the selected bound patient. |
|  | Backend returns schedule records and status information. |
|  | System displays each schedule with exercise name, date, repetitions, sets, notes, status, and creation time. |
| Patient marks a schedule as completed on the patient end. |  |
|  | Patient mobile end updates the status through the backend. |
| Doctor refreshes or reopens the schedule page. |  |
|  | System displays the updated completion status. |

#### 3.8.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| No schedule has been created for the patient. |  |
|  | System displays an empty-state message and provides an entry to create a schedule. |
| Schedule status is not synchronized from the patient end. |  |
|  | System displays the latest known status and update time. |
| Backend returns a permission error. |  |
|  | System displays a permission-denied message. |

### 3.9 Generate AI Suggestion for a Session

#### 3.9.1 Basic Info

- Reference to Use Case 1.9.
- Version: 0.5
- Created: May 24, 2026
- Authors: M2 Team
- Source: M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, AI Module, Backend System
- Goal: Allow a doctor to generate an auxiliary AI suggestion for a selected measurement session when the AI integration is available.
- Summary: The doctor clicks **Generate AI Suggestions** on a session detail page. The AI module generates a suggestion based on measurement data. The doctor web end displays the suggestion and saves it to the database with `session_id`, `user_id`, `doctor_id`, and `movement_type`.
- Trigger: A doctor wants AI-assisted interpretation for a selected measurement session.
- Frequency: At most once per session in the normal workflow.
- Precondition: The selected session belongs to a bound patient; the session data is valid; the AI module is available.
- Postconditions: The generated suggestion is displayed and saved in the database for later retrieval.

![]()

#### 3.9.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens a session detail page. |  |
| Doctor clicks **Generate AI Suggestions**. |  |
|  | System checks whether a saved suggestion already exists for the `session_id`. |
|  | If no saved suggestion exists, system sends the session data to the AI module. |
|  | AI module generates a suggestion based on the measurement data. |
|  | System displays the generated suggestion on the M2 page. |
|  | System saves the suggestion to the backend with `session_id`, `user_id`, `doctor_id`, `movement_type`, `suggestion`, and `created_at`. |

#### 3.9.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| A suggestion already exists for this session. |  |
|  | System retrieves and displays the saved suggestion instead of generating a new one. |
| AI module fails or returns invalid output. |  |
|  | System displays an AI generation failure message and does not save invalid content. |
| Session data is incomplete. |  |
|  | System disables AI generation or warns the doctor that the suggestion may be unreliable. |
| Doctor is not the owner of the patient. |  |
|  | System blocks the operation and displays a permission error. |

### 3.10 Retrieve Saved AI Suggestion

#### 3.10.1 Basic Info

- Reference to Use Case 1.10.
- Version: 0.5
- Created: May 24, 2026
- Authors: M2 Team
- Source: M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System
- Goal: Avoid regenerating AI suggestions every time the doctor logs in again.
- Summary: When a doctor opens a session detail page, the M2 web end checks whether a saved AI suggestion exists for the selected `session_id`. If it exists, the saved suggestion is displayed directly.
- Trigger: The doctor opens a session detail page with a previous AI suggestion.
- Frequency: Whenever a doctor reviews a session with saved AI output.
- Precondition: A saved AI suggestion exists and the current doctor owns the corresponding patient.
- Postconditions: The saved suggestion is displayed on the doctor web page.

![]()

#### 3.10.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens a session detail page. |  |
|  | System requests saved AI suggestion by `session_id`. |
|  | Backend verifies access permission. |
|  | Backend returns the saved AI suggestion if it exists. |
|  | M2 displays the saved suggestion and its creation time. |

#### 3.10.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| No saved suggestion exists. |  |
|  | System displays the **Generate AI Suggestions** entry if AI integration is available. |
| Backend returns a permission error. |  |
|  | System displays a permission-denied message. |
| Suggestion content is empty or malformed. |  |
|  | System hides the content and displays a data-format warning. |

### 3.11 Block Unauthorized Doctor Access

#### 3.11.1 Basic Info

- Reference to Use Case 1.11.
- Version: 1.0
- Created: May 24, 2026
- Authors: M2 Team
- Source: Phase II requirement meeting and M2-to-V2 interface change requests
- Actors: Doctor, Doctor Web End, Backend System
- Goal: Prevent a doctor from accessing patients or sessions that are not bound to the doctor's `doctor_id`.
- Summary: A doctor may try to open another patient's detail page or session page by direct URL or stale data. The system must check the ownership relationship before displaying data.
- Trigger: A doctor accesses a patient, session, schedule, or AI suggestion that may not belong to them.
- Frequency: Rare in normal use, but important for safety and privacy.
- Precondition: The current doctor is logged in.
- Postconditions: Unauthorized data is not displayed.

![]()

#### 3.11.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Doctor opens a patient detail page or session page. |  |
|  | System identifies the current `doctor_id`. |
|  | System requests the target resource from the backend. |
|  | Backend or frontend checks whether the resource belongs to a patient with the same `doctor_id`. |
|  | If the check passes, system displays the requested data. |

#### 3.11.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| The patient does not belong to the current doctor. |  |
|  | System displays a permission-denied message and does not render patient data. |
| The backend returns all patients during temporary development. |  |
|  | M2 filters locally by `doctor_id`, but this is treated as a temporary implementation shortcut rather than final security control. |
| The current doctor tries to modify `doctor_id`. |  |
|  | System hides or disables this operation for regular doctors. |

### 3.12 Administrator Reassigns Patient to Another Doctor

#### 3.12.1 Basic Info

- Reference to Use Case 1.12.
- Version: 0.5
- Created: May 24, 2026
- Authors: M2 Team
- Source: M2-to-V2 interface change requests
- Actors: Administrator, Backend System, Optional Admin Interface
- Goal: Allow administrators to correct or change doctor-patient ownership when necessary.
- Summary: Administrators can view all patients regardless of `doctor_id` and modify a patient's `doctor_id`. This is required for reassignment, but it is not part of the normal doctor workflow.
- Trigger: A patient is assigned to the wrong doctor or needs to be transferred to another doctor.
- Frequency: Occasionally, depending on clinic management needs.
- Precondition: The user has administrator permission.
- Postconditions: The patient's `doctor_id` is updated, and the patient appears under the new doctor's patient list.

![]()

#### 3.12.2 Basic Flow

| Actor | System |
| ----- | ------ |
| Administrator opens the patient management page. |  |
|  | System verifies administrator permission. |
|  | System displays all patients regardless of `doctor_id`. |
| Administrator selects a patient and modifies `doctor_id`. |  |
|  | System validates the target doctor ID. |
|  | System updates the patient's `doctor_id`. |
|  | System records or returns the updated patient ownership information. |

#### 3.12.3 Alternative Flow

| Actor | System |
| ----- | ------ |
| A regular doctor tries to view all patients. |  |
|  | System denies the request or returns only patients bound to that doctor. |
| A regular doctor tries to modify `doctor_id`. |  |
|  | System denies the operation. |
| Administrator enters an invalid target doctor ID. |  |
|  | System rejects the update and displays a validation error. |

## 4. Data and Interface Requirements

### 4.1 Patient Data

The patient object should include `doctor_id`.

Example:

```json
{
  "id": 36,
  "name": "Example Patient",
  "doctor_id": 2
}
```

Requirements:

- `doctor_id` shall be returned when the backend returns patient information.
- Doctors should only see patients whose `doctor_id` matches their own ID.
- For the current implementation stage, M2 may fetch all patients and filter locally by `doctor_id` if V2 cannot provide a filtered API immediately.
- In the final integrated system, backend-side filtering or permission checking is strongly preferred.
- Administrators can view all patients and modify `doctor_id`; regular doctors cannot.

### 4.2 Session Data

Each session shall include `movement_type`.

Example:

```json
{
  "id": 101,
  "user_id": 36,
  "movement_type": "walking",
  "created_at": "2026-05-22T05:41:24Z"
}
```

Supported Phase II values:

```text
walking
stair_climbing
squatting
```

Requirements:

- `movement_type` is used to select the correct embedded standard curve.
- `movement_type` is used to filter session records.
- `movement_type` is used as context for AI suggestion generation and storage.
- `movement_type` should not be named `exercise_type`, because `exercise` is already used for rehabilitation schedules.

### 4.3 Standard Curves

For Phase II, M2 will embed three standard curves directly in frontend code or local configuration:

- standard curve for `walking`;
- standard curve for `stair_climbing`;
- standard curve for `squatting`.

The current available age group is 20 years old only. Therefore, V2 does not need to store standard curves in Phase II.

Future extension:

- The database may later store standard curves by `movement_type`, age group, and other demographic or clinical conditions.
- The M2 code should keep the standard curve source modular so that embedded curves can be replaced by API-provided curves later.

### 4.4 Preset Rehabilitation Exercises

The backend/database shall preset about 10 to 15 rehabilitation exercises. Each exercise shall have a stable `exercise_id`.

Example:

```json
{
  "exercise_id": 3,
  "name": "Squat Training",
  "description": "A lower-limb rehabilitation exercise used to improve leg strength and knee control."
}
```

Initial exercise list for development:

| exercise_id | Exercise Name | Description / Purpose |
| ----------- | ------------- | --------------------- |
| 1 | Walking Training | Improve walking rhythm, balance, and lower-limb coordination. |
| 2 | Stair Climbing Training | Improve stair ascent ability and lower-limb control. |
| 3 | Squat Training | Improve leg strength and knee control. |
| 4 | Knee Extension | Strengthen quadriceps and improve knee extension control. |
| 5 | Knee Flexion | Improve knee bending range and hamstring control. |
| 6 | Straight Leg Raise | Strengthen quadriceps while reducing knee joint load. |
| 7 | Hip Abduction | Improve hip stability and lateral lower-limb control. |
| 8 | Heel Raise | Strengthen calf muscles and ankle plantarflexion. |
| 9 | Balance Standing | Improve static balance and proprioception. |
| 10 | Sit-to-Stand Training | Improve functional transfer from sitting to standing. |
| 11 | Step-Up Training | Improve step control and functional leg strength. |
| 12 | Ankle Pump | Promote ankle mobility and circulation. |

Requirements:

- The doctor shall select exercises from this list.
- The schedule shall store `exercise_id`, not a free-text exercise name.
- Exercise names and descriptions are allowed to be refined later, but `exercise_id` values should remain stable after integration.

### 4.5 Schedule or Prescription Data

The old schedule format used free-text `exercise` and `duration`. Phase II should replace it with `exercise_id`, `repetitions`, and `sets`.

Expected request or storage format:

```json
{
  "id": 5,
  "user_id": 36,
  "exercise_id": 3,
  "date": "2026-05-22",
  "repetitions": 30,
  "sets": 10,
  "notes": "Keep the back straight and stop if pain occurs.",
  "status": "pending",
  "created_at": "2026-05-22T05:41:24Z"
}
```

Preferred response format for display:

```json
{
  "id": 5,
  "user_id": 36,
  "exercise_id": 3,
  "exercise_name": "Squat Training",
  "exercise_description": "A lower-limb rehabilitation exercise used to improve leg strength and knee control.",
  "date": "2026-05-22",
  "repetitions": 30,
  "sets": 10,
  "notes": "Keep the back straight and stop if pain occurs.",
  "status": "pending",
  "created_at": "2026-05-22T05:41:24Z"
}
```

Requirements:

- Replace free-text `exercise` with `exercise_id`.
- Replace `duration` with `repetitions` and `sets`.
- Keep `notes` for precautions or additional doctor instructions.
- Keep `status` so that the patient end can mark completion and M2 can display progress.

### 4.6 AI Suggestion Data

Each measurement session should have at most one corresponding AI-generated suggestion.

Example:

```json
{
  "id": 12,
  "session_id": 101,
  "user_id": 36,
  "doctor_id": 2,
  "movement_type": "walking",
  "suggestion": "The patient's walking stability is slightly lower than the standard curve. It is recommended to continue low-intensity walking training and monitor knee control.",
  "created_at": "2026-05-22T05:45:00Z"
}
```

Requirements:

- Store the AI suggestion with a reference to `session_id`.
- Store `user_id`, `doctor_id`, and `movement_type` to simplify retrieval and permission checking.
- M2 should be able to retrieve saved suggestions later.
- If a suggestion already exists for a session, M2 should display the saved suggestion instead of regenerating it automatically.
- AI suggestion generation is optional and low priority compared with doctor-patient binding, standard curves, and schedule delivery.

### 4.7 Suggested API Interfaces

The following API names are suggested for cross-group discussion. The exact endpoints may be adjusted by V2.

| Purpose | Suggested Request | Required Response / Notes |
| ------- | ----------------- | ------------------------- |
| Generate doctor registration link | `POST /api/doctors/{doctor_id}/registration-links` | Return registration URL, token, and QR code data. |
| Get all patients for temporary local filtering | `GET /api/patients` | Return patient records including `doctor_id`. Temporary development option only. |
| Get bound patient list | `GET /api/doctors/{doctor_id}/patients` | Preferred final API; return only bound patients. |
| Get patient detail | `GET /api/patients/{user_id}` | Must verify doctor ownership unless administrator. |
| Update patient doctor ownership | `PATCH /api/patients/{user_id}/doctor` | Administrator only; update `doctor_id`. |
| Get session records | `GET /api/patients/{user_id}/sessions?movement_type=&start_date=&end_date=` | Return sessions including `movement_type`. |
| Get patient curve | `GET /api/sessions/{session_id}/curve` | Return measurement curve data. |
| Get preset exercise list | `GET /api/exercises` | Return `exercise_id`, name, and description. |
| Create schedule | `POST /api/schedules` | Submit `user_id`, `exercise_id`, `date`, `repetitions`, `sets`, and `notes`. |
| Get patient schedules | `GET /api/patients/{user_id}/schedules` | Prefer returning exercise name and description with schedule data. |
| Update schedule status | `PATCH /api/schedules/{schedule_id}/status` | Mainly used by M1 patient end. |
| Get saved AI suggestion | `GET /api/sessions/{session_id}/ai-suggestion` | Return saved suggestion if it exists. |
| Save AI suggestion | `POST /api/ai-suggestions` | Store one suggestion for one session. |

## 5. Acceptance Criteria

| ID | Acceptance Criterion |
| -- | -------------------- |
| AC-01 | A logged-in doctor can generate and display a patient registration link or QR code. |
| AC-02 | A patient registered through the doctor link is associated with the correct `doctor_id`. |
| AC-03 | Patient records returned to or used by M2 include `doctor_id`. |
| AC-04 | A regular doctor can see only patients whose `doctor_id` matches the current doctor's ID. |
| AC-05 | Direct access to an unbound patient's detail page is blocked or returns a permission error. |
| AC-06 | Regular doctors cannot modify a patient's `doctor_id`. |
| AC-07 | Administrators can view all patients and modify `doctor_id` if the backend/admin interface supports this function. |
| AC-08 | A session record contains and displays `movement_type`. |
| AC-09 | The session list can be filtered by `walking`, `stair_climbing`, and `squatting`. |
| AC-10 | For `walking`, `stair_climbing`, and `squatting`, the doctor web end can select the correct embedded standard curve. |
| AC-11 | The patient curve and standard curve can be displayed in one chart with clear legends. |
| AC-12 | The curve comparison page can display at least one available quantitative comparison indicator. |
| AC-13 | The doctor can load a preset exercise list with stable `exercise_id` values. |
| AC-14 | The doctor can create a schedule or prescription by selecting `exercise_id` instead of typing a free-text exercise name. |
| AC-15 | The submitted schedule or prescription uses `repetitions` and `sets` instead of `duration`. |
| AC-16 | A successfully submitted schedule or prescription can be retrieved by the patient end through backend support. |
| AC-17 | When the patient marks a schedule or prescription as completed, the doctor web end can display the updated status after synchronization. |
| AC-18 | If AI integration is enabled, a doctor can generate an AI suggestion for a selected session and save it to the database. |
| AC-19 | A saved AI suggestion can be retrieved later by `session_id` without regenerating it. |
| AC-20 | AI suggestions are displayed as auxiliary information and do not block the main Phase II workflow. |

## 6. Implementation Priority

| Priority | M2 Features |
| -------- | ----------- |
| Priority 1 | Doctor-patient binding, `doctor_id` display and filtering, registration link/QR code generation, access control, `movement_type` in session records, embedded standard curves for the three standard actions. |
| Priority 2 | Preset exercise list using `exercise_id`, schedule/prescription delivery, replacement of `duration` with `repetitions` and `sets`, data visualization, date and movement-type filtering, completion status display. |
| Priority 3 | AI suggestion generation and storage, retrieval of saved AI suggestions, advanced curve interpretation, WeChat assistant, and other optional intelligent functions. |

## 7. Open Questions

1. Should patient reassignment be implemented only by V2/backend and an administrator page, or should M2 also provide an admin UI?
2. How long should a registration link or QR code remain valid?
3. Should the preferred patient identifier in the API be `user_id` or `patient_id`? M2 should follow V2's final naming but keep mapping clear.
4. What exact status values should be used for schedules across M2, M1, and V2? For example, should the values be only `pending` and `completed`, or should `viewed`, `expired`, and `cancelled` also be included?
5. Should one schedule contain only one `exercise_id`, or should a prescription support multiple schedule items in one submission?
6. Which curve features will be calculated by M2 locally, and which features will be calculated by the backend or AI group?
7. What exact input and output format does Borges' AI code use, and which group will wrap it as an API or callable service?
8. Should AI suggestions be overwritten if the doctor clicks **Generate AI Suggestions** again, or should the database keep version history?
9. When standard curves for more age groups become available, should they be stored in the database and queried by `movement_type` and age group?
10. What should happen if a patient's `movement_type` is missing in old session data?

## 8. Traceability Matrix

| Source Need | Related Requirement IDs | Related Use Cases |
| ----------- | ----------------------- | ----------------- |
| Doctors can only view their own patients | M2-FR-01 to M2-FR-09, M2-NFR-01, M2-NFR-02, M2-NFR-09 | 1.1, 1.2, 1.3, 1.11 |
| Patients register only through doctor link or QR code | M2-FR-01 to M2-FR-04 | 1.1, 1.2 |
| Add `doctor_id` to patient model | M2-FR-05 to M2-FR-08 | 1.3, 1.11, 1.12 |
| Add `movement_type` to sessions | M2-FR-13 to M2-FR-16 | 1.4, 1.5 |
| Compare patient curves with standard curves | M2-FR-17 to M2-FR-22 | 1.5 |
| M2 embeds three standard curves for now | M2-FR-18 to M2-FR-20, M2-NFR-08 | 1.5 |
| Preset rehabilitation exercises with `exercise_id` | M2-FR-23 to M2-FR-26 | 1.6, 1.7 |
| Replace schedule `duration` with `repetitions` and `sets` | M2-FR-27 to M2-FR-31 | 1.7, 1.8 |
| Store one AI suggestion per session | M2-FR-33 to M2-FR-36, M2-NFR-10 | 1.9, 1.10 |
| Administrator can view all patients and modify `doctor_id` | M2-FR-10, M2-FR-11 | 1.12 |

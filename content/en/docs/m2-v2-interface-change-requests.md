---
id: doc-m2-v2-interface-change-requests
slug: m2-v2-interface-change-requests
title: Interface Change Requests from M2 to V2
type: interface
date: 2026-06-06
owner: M2 Team
ownerRole: Doctor Web Team
status: completed
summary: M2's requested database and API interface changes for V2, covering patient ownership, rehabilitation exercise presets, movement types, schedule data, AI suggestion storage, and administrator permissions.
relatedTeams:
  - M2
  - V2
  - M1
  - V1
relatedRepos:
  - project-portal
tags:
  - deliverable
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
version: v1.0
reviewStatus: completed
lastUpdated: 2026-06-06
links:
  - label: Release news
    href: /logs/2026-06-06-m2-v2-interface-change-requests-released
  - label: Phase II SRS
    href: /docs/m2-srs-phase-ii-doctor-web-end
evidence: []
actionItems:
  - owner: V2
    task: Review requested field and API changes for backend/database implementation.
  - owner: M2
    task: Align doctor-side UI integration with the confirmed V2 interface response.
featured: true
archived: false
---

# Interface Change Requests from the Doctor Web Team M2 to the Database Team V2

This document summarizes the database and API interface changes requested by the M2 doctor web team. These changes are mainly related to patient ownership, rehabilitation exercise presets, session movement types, doctor schedules, AI-generated suggestions, and administrator permissions.

---

## 1. Doctor Side Requirements

### 1.1 Add a `doctor_id` Field to Each Patient

Please add a field called `doctor_id` to the patient data model.

When the API returns patient information, especially when getting all patients, the `doctor_id` field should also be included in the response.

This field allows us to identify which doctor each patient belongs to, so that doctors can only see their own patients.

For the current development stage, the M2 team can temporarily fetch all patients from the database and then filter them locally according to `doctor_id`. Although this is not the most standard or secure approach, it is the simplest solution for our current implementation.

A patient object should therefore include a field similar to this:

```json
{
  "id": 36,
  "name": "Example Patient",
  "doctor_id": 2
}
```

---

### 1.2 Preset Several Rehabilitation Exercises

Please preset a list of rehabilitation exercises in the database. Each exercise should have a unique `exercise_id`.

When a doctor creates a training schedule or prescription for a patient, the doctor should select one exercise from this predefined exercise list.

Around 10 to 15 preset rehabilitation exercises should be enough for now. These can be common rehabilitation exercises found from public online resources.

Example exercise data structure:

```json
{
  "exercise_id": 3,
  "name": "Squat Training",
  "description": "A lower-limb rehabilitation exercise used to improve leg strength and knee control."
}
```

Possible preset exercises may include:

| exercise_id | Exercise Name |
|---:|---|
| 1 | Walking Training |
| 2 | Stair Climbing Training |
| 3 | Squat Training |
| 4 | Knee Extension |
| 5 | Knee Flexion |
| 6 | Straight Leg Raise |
| 7 | Hip Abduction |
| 8 | Heel Raise |
| 9 | Balance Standing |
| 10 | Sit-to-Stand Training |
| 11 | Step-Up Training |
| 12 | Ankle Pump |

The exact names and descriptions do not need to be final at this stage, but each exercise should have a stable `exercise_id` so that schedules can refer to it.For this, you can discuss with Pinhel. Maybe he can offer some exercises templates.

---

### 1.3 Add a `movement_type` Field to Each Session

Please add a field called `movement_type` to each session.

We prefer the name `movement_type` instead of `exercise_type`, because the word `exercise` is already used for rehabilitation training schedules. Using `movement_type` can avoid confusion.

The `movement_type` field is used to indicate what type of movement was measured during that session.

For now, the possible values can be:

```text
walking
stair_climbing
squatting
```

Example session object:

```json
{
  "id": 101,
  "user_id": 36,
  "movement_type": "walking",
  "created_at": "2026-05-22T05:41:24Z"
}
```

This field is necessary because different movement types need to be compared with different standard curves and may generate different AI suggestions.

---

### 1.4 Standard Curves Will Be Embedded in the M2 Code for Now

Currently, we only have three standard curves:

- one standard curve for walking;
- one standard curve for stair climbing;
- one standard curve for squatting.

Also, the only available age group is 20 years old.

Therefore, the M2 team will directly embed these three standard curves into our own code for now.

In a more standard database design, the database should store standard curves for different movement types and different age groups. However, since we do not have enough data at the moment, this part can be simplified temporarily. For now, the V2 database team does not need to store the standard curves.

---

### 1.5 Update the Schedule Data Structure

The current schedule format is:

```json
{
  "id": 5,
  "user_id": 36,
  "exercise": "xxxxxxxxxxxxxxx",
  "date": "2026-05-22",
  "duration": 30,
  "notes": "xxxxxxxx",
  "status": "pending",
  "created_at": "2026-05-22T05:41:24Z"
}
```

We would like to change it to:

```json
{
  "id": 5,
  "user_id": 36,
  "exercise_id": 3,
  "date": "2026-05-22",
  "repetitions": 30,
  "sets": 10,
  "notes": "xxxxxxxxxxx",
  "status": "pending",
  "created_at": "2026-05-22T05:41:24Z"
}
```

The main changes are:

1. Replace the free-text `exercise` field with `exercise_id`.
2. Replace `duration` with `repetitions` and `sets`.
3. The doctor should select an exercise from the predefined exercise list instead of manually typing the exercise name.

If possible, when returning schedule information, it would also be helpful to include the corresponding exercise details, such as the exercise name and description. For example:

```json
{
  "id": 5,
  "user_id": 36,
  "exercise_id": 3,
  "exercise_name": "Squat Training",
  "date": "2026-05-22",
  "repetitions": 30,
  "sets": 10,
  "notes": "xxxxxxxxxxx",
  "status": "pending",
  "created_at": "2026-05-22T05:41:24Z"
}
```

This would make it easier for the M2 web page to display the schedule information.

---

### 1.6 Store AI-Generated Suggestions in the Database

Regarding the AI-generated suggestions, Borges has already shared the AI source code with us.

The AI source code is available here:

```text
https://github.com/abenjas69/v1-motion-standard-curves
```

The planned workflow is:

1. A doctor clicks the **Generate AI Suggestions** button on the M2 web page.
2. The AI code runs and generates a suggestion based on the measurement data.
3. The generated suggestion is displayed on the M2 web page.
4. The generated suggestion is also saved into the database.

A key requirement is that **each measurement/session should correspond to one AI-generated suggestion**.

Therefore, we suggest storing AI suggestions with a reference to the corresponding `session_id`. For example:

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

The exact content format of the AI suggestion can be checked from Borges' source code, or confirmed directly with Borges if the format may change later.

However, from the M2 team's perspective, the important database requirement is:

- each session should be able to store one corresponding AI suggestion;
- the suggestion should be retrievable later;
- the suggestion should not need to be regenerated every time the doctor logs in again.

If the AI suggestion has already been generated for a session, the M2 page should be able to get the saved suggestion directly from the database.

---

## 2. Administrator Side Requirements

### 2.1 Administrators Can View All Patients

Administrators should be able to see all patients, regardless of the value of the patient's `doctor_id` field.

Unlike doctors, administrators should not be restricted by patient ownership.

---

### 2.2 Administrators Can Modify a Patient's `doctor_id`

Administrators should be allowed to modify the `doctor_id` field of a patient.

Only administrators should have this permission. Regular doctors should not be allowed to change a patient's `doctor_id`.

This is needed so that administrators can assign or reassign patients to different doctors.

---

## 3. Summary of Requested Database/API Changes

| Area | Requested Change |
|---|---|
| Patient | Add `doctor_id` field and return it when getting patients |
| Doctor view | Doctors should only see patients whose `doctor_id` matches their own ID |
| Admin view | Administrators can view all patients regardless of `doctor_id` |
| Admin permission | Only administrators can modify a patient's `doctor_id` |
| Exercise presets | Add 10 to 15 predefined rehabilitation exercises, each with a unique `exercise_id` |
| Session | Add `movement_type` field to distinguish `walking`, `stair_climbing`, and `squatting` |
| Standard curves | No database storage needed for now; M2 will embed the three existing standard curves in code |
| Schedule | Replace `exercise` with `exercise_id`; replace `duration` with `repetitions` and `sets` |
| AI suggestions | Each session/measurement should have one corresponding AI-generated suggestion stored in the database |

---

## 4. Notes on Naming

To avoid confusion, we suggest using the following field names consistently:

| Concept | Recommended Field Name |
|---|---|
| Doctor ID | `doctor_id` |
| Rehabilitation exercise ID | `exercise_id` |
| Measured movement type in a session | `movement_type` |
| AI suggestion related to a session | `session_id` as the reference field |

The term `exercise` should mainly refer to rehabilitation training items in the doctor's schedule. The term `movement_type` should refer to the actual measured movement in a session, such as walking, stair climbing, or squatting.

---
id: doc-software-requirements-specification-v0-1
slug: software-requirements-specification-v0-1
title: Software Requirements Specification
type: requirement-analysis
date: 2026-04-01
owner: Lee
ownerRole: PM
status: completed
summary: Simplified draft SRS for the M2 doctor module, reflecting consolidated use cases and the April 16 doctor-side requirement updates.
relatedTeams:
  - PM
  - M2
relatedRepos:
  - project-portal
tags:
  - deliverable
  - requirement-analysis
  - srs
attentionTags:
  - attention:M2
version: v1.2-draft
reviewStatus: completed
lastUpdated: 2026-04-16
links:
  - label: Requirement analysis
    href: /docs/requirement-analysis-v1
  - label: System design outline
    href: /docs/system-design-outline-v1
  - label: Doctor-side requirements meeting
    href: /logs/2026-04-16-doctor-side-requirements-meeting-held
  - label: Archived detailed SRS
    href: /docs/software-requirements-specification-v0-1-archive
evidence: []
actionItems: []
---

# Software Requirements Specification (M2) - Doctor Module (Simplified)

## Revision History

| Date | Author | Description |
| ---- | ------ | ----------- |
| Apr 1 | Lee | Add use cases |
| Apr 4 | Shu | Add web frontend interface requirements |
| Apr 5 | Shu | Consolidate and merge fine-grained use cases ([archived detailed version](/docs/software-requirements-specification-v0-1-archive)) |
| Apr 16 | Shu, Lee | Modify doctor use cases according to the meeting with Doctor Yin |
| Apr 16 | Lee | Modify admin use cases |

## 0. Background

Our team is responsible for designing and developing a web-based platform with the primary functions of receiving sensor data, conducting motion analysis, and providing health recommendations. The system users primarily include registered users (who upload motion data), doctors (who provide the recommendations) and administrators (who monitor and manage the data).

## 1. Use Cases

### 1.1. Doctor - Detailed Scenarios (Doctor Operation Workflow)

| Case | Description | Operation Steps / Interface Elements |
| ---- | ----------- | ------------------------------------ |
| **Manage Account** | Doctor registers an account and logs into the system. | **Registration:**<br>1. Fill in username<br>2. Set password<br>3. Fill in email address<br>4. Upload doctor license photo<br>5. Submit registration and wait for admin approval<br><br>**Login:**<br>1. Enter username and password<br>2. Click login button<br><br>**Password Reset:**<br>1. Click "Forgot Password" on login page<br>2. Enter the registered email address<br>3. System sends a reset link to that email<br>4. Doctor clicks the link in the email<br>5. Set a new password |
| **Manage Patient List** | Doctor views the list of assigned patients, can search and filter, and clicks on a patient to view their full profile. | **View Patient List:**<br>1. After login, enter the home page, which displays the list of assigned patients by default<br>2. Search by patient name<br>3. Filter by active/inactive status<br>4. Click on any patient to enter their detailed profile page<br><br>**Patient Profile Includes:**<br>- Basic patient information (age, gender, etc.)<br>- Rehabilitation history records<br>- Current rehabilitation plan |
| **View Patient Motion Data** | Doctor views the patient's knee joint movement data in a line chart format. The Y-axis represents knee joint angle: **0° at the top** (full extension / straightest position), **180° at the bottom** (maximum flexion, target is 130°). Two lines are displayed:<br>- **Extension line** (straightening movement)<br>- **Flexion line** (bending movement)<br>Doctor can toggle between left and right leg data. | **View Motion Data:**<br>1. On the patient profile page, click the "Motion Data" tab<br>2. View the line chart:<br>   - Top of chart is 0° (straightest)<br>   - Bottom of chart is 180° (most bent, target 130°)<br>   - Blue line represents extension movement<br>   - Red line represents flexion movement<br>3. Click the "Left Leg"/"Right Leg" toggle button to view data for the corresponding leg<br>4. Select date range (e.g., last week, last month) |
| **Write Manual Suggestion** | Doctor writes rehabilitation suggestions for the patient using **preset buttons** to quickly select exercises, as well as **free-text notes**. | **Write Suggestion:**<br>1. On the patient profile page, click the "Add Suggestion" button<br>2. **Select preset exercises (multiple selection allowed):**<br>   - Extension exercise area: check corresponding exercise options<br>   - Flexion exercise area: check corresponding exercise options<br>3. **Add free-text notes** (optional):<br>   Enter additional instructions in the text box<br>4. Click "Submit" to send to the patient<br><br>**Manage Existing Suggestions:**<br>- View the list of sent suggestions<br>- Edit suggestion content (edit history will be preserved)<br>- Delete a suggestion (only hidden from doctor's view, no longer displayed to patient) |

### 1.2. Admin

#### UC-ADMIN-01: Admin Login / Logout

**Description:**
Administrator logs into the system and accesses the admin dashboard.

**Preconditions:**
- Admin account exists

**Postconditions:**
- Admin session is created or terminated

**Main Flow:**

- Admin enters username and password
- System validates credentials
- System grants access and creates session
- Admin logs out and session is destroyed

**Alternative Flows:**

- Invalid credentials -> error message displayed

#### UC-ADMIN-02: Review Doctor Registration (Core Use Case)

**Description:**
Administrator reviews doctor registration applications and verifies submitted licenses.

**Preconditions:**
- Doctor has submitted registration request

**Postconditions:**
- Application status is updated (approved/rejected)

**Main Flow:**

- Admin views pending applications
- Admin opens doctor profile
- Admin reviews license documents
- Admin approves or rejects application
- System updates status and notifies doctor

**Alternative Flows:**

- Missing or unclear documents -> reject with reason

#### UC-ADMIN-03: Manage Doctor Accounts

**Description:**
Administrator manages doctor accounts after registration.

**Preconditions:**

- Doctor account exists

**Postconditions:**

- Account status updated

**Main Flow:**

- Admin searches doctor list
- Admin views account details
- Admin enables/disables or deletes account

#### UC-ADMIN-04: Manage Patient Accounts

**Description:**
Administrator manages patient/user accounts.

**Main Flow:**

- Admin views user list
- Admin inspects user data summary
- Admin disables or deletes account if necessary

#### UC-ADMIN-05: View Health Data Reports

**Description:**
Administrator views aggregated system statistics.

**Main Flow:**

- Admin accesses dashboard
- System displays charts and metrics
- Admin analyzes platform usage

#### UC-ADMIN-06: Handle User Feedback

**Description:**
Administrator processes feedback submitted by users.

**Main Flow:**

- Admin views feedback list
- Admin reads details
- Admin marks as resolved or responds

#### UC-ADMIN-07: Manage Content

**Description:**
Administrator manages platform content such as announcements.

**Main Flow:**

- Admin creates or edits content
- Admin publishes or deletes content

#### UC-ADMIN-08: Role & Permission Management

**Description:**
Administrator assigns roles and permissions.

**Main Flow:**

- Admin selects user
- Admin assigns role (Doctor/User/Admin)
- System updates permissions

#### UC-ADMIN-09: Audit Admin Actions

**Description:**
System records administrator activities for traceability.

**Main Flow:**

- System logs admin actions
- Admin queries logs when needed

#### UC-ADMIN-10: Notification Management

**Description:**
Administrator manages system notifications.

**Main Flow:**

- System sends automatic notifications (e.g., approval result)
- Admin sends manual notifications if needed

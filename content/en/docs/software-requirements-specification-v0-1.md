---
id: doc-software-requirements-specification-v0-1
slug: software-requirements-specification-v0-1
title: Software Requirements Specification
type: requirement-analysis
date: 2026-04-01
owner: Lee
ownerRole: PM
status: in-review
summary: Formal Software Requirements Specification for M2 covering detailed patient, doctor, and administration scenarios, required interfaces, and key example flows.
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
version: v1.1
reviewStatus: in-review
lastUpdated: 2026-04-09
links:
  - label: Requirement analysis
    href: /docs/requirement-analysis-v1
  - label: System design outline
    href: /docs/system-design-outline-v1
  - label: SRS update log
    href: /logs/2026-04-09-srs-updated-with-detailed-scenarios
evidence: []
actionItems: []
---

# Software Requirements Specification (M2)

## Revision History

| Date | Author | Description |
| ---- | ------ | ----------- |
| Apr 1 | Lee | Add use cases |
| Apr 4 | Shu | Add web frontend interface requirements |
| Apr 5 | Shu | Consolidate and merge fine-grained use cases |

## 0. Background

Our team is responsible for designing and developing a web-based platform with the primary functions of receiving sensor data, conducting motion analysis, and providing health recommendations. The system users primarily include registered users (who upload motion data), doctors (who provide the recommendations) and administrators (who monitor and manage the data).

## 1. Use Cases

### 1.1. Patient - Complete scenario list

| Case | Description | Required Interfaces / Capabilities |
| ---- | ----------- | ---------------------------------- |
| **Register** | Patient creates an account with username, password, email (optional). System validates input format, ensures username uniqueness, and stores new user credentials. | - Check username uniqueness across all roles.<br>- Validate email format, password strength, and character restrictions.<br>- Handle database errors (timeout, conflict) and return appropriate messages. |
| **Login** | Patient authenticates with username and password, receives a session token. System tracks failed attempts and can temporarily lock the account. | - Verify username/password.<br>- Track failed login attempts per user.<br>- Generate and validate session tokens (JWT).<br>- Support logout (token revocation).<br>- (Optional) Support password reset via email. |
| **View Rehabilitation Plan** | Patient views their personalized exercise plan (exercises, frequency, duration, notes). | - Retrieve the active (published) plan for the patient.<br>- Return an empty state if no plan exists. |
| **Execute Motion with Guidance** | Patient performs an exercise with video guidance and real-time sensor feedback. System receives sensor data, detects disconnection, scores the motion, and detects anomalies. | - Stream video/animation guidance.<br>- Establish and maintain sensor connection (pairing, status).<br>- Receive and process real-time sensor data stream.<br>- Detect sensor disconnection and attempt to reconnect.<br>- Provide real-time audio/visual feedback based on motion deviation (via WebSocket).<br>- Generate a motion score and detect anomalies for the session. |
| **View Rehabilitation Records** | Patient views historical exercise data (dates, scores, completion status) with pagination. | - Query historical session data with pagination support.<br>- Return empty set if none. |
| **Set Rehabilitation Goals** | Patient sets weekly goals (e.g., number of sessions, target accuracy). System checks for existing goals and prompts for overwrite. | - Store and update weekly goal settings per patient.<br>- Handle existing goal conflicts. |
| **View Achievements & Motivations** | Patient views earned badges, streaks, and motivational messages. System detects milestone completion. | - Store and retrieve earned badges and streak counts.<br>- Provide badge images and messages.<br>- Automatically detect and award milestone completions. |
| **Receive Messages & Notifications** | Patient receives messages from doctors or system alerts (e.g., plan updated, new suggestion). | - Store and manage messages (unread count, mark as read).<br>- Support push notifications for real-time alerts. |

### 1.2. Doctor - Detailed scenarios

#### 1.2.1. Doctor Register

:::usecase-flow
title: Doctor Register
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/doctor-register.svg
:::

Doctor creates an account with username and password. The system validates input format, ensures username uniqueness, and stores credentials with `role=doctor`.

Required Interfaces / Capabilities:

- Same registration capabilities as Patient, including validation, uniqueness checks, and error handling.
- Store user role as `doctor`.

#### 1.2.2. Doctor Login

:::usecase-flow
title: Doctor Login
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/doctor-login.svg
:::

Doctor authenticates, receives a session token. The system handles wrong password, non-existent user, account locking, session expiry, and concurrent sessions.

Required Interfaces / Capabilities:

- Same authentication capabilities as Patient, including verification, lockout handling, and token management.
- Support multiple concurrent sessions.
- Support password reset flow.

#### 1.2.3. Manage Patient List

:::usecase-flow
title: Manage Patient List
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/manage-patient-list.svg
:::

Doctor views, searches, sorts, filters, and paginates a list of assigned patients. The list can be exported to CSV and individual patient profiles can be opened.

Required Interfaces / Capabilities:

- Query patients assigned to the doctor.
- Support sorting by name or last activity.
- Support substring search on patient name.
- Support filtering by active or inactive status based on last activity.
- Support pagination with offset and limit.
- Generate CSV from query results.
- Retrieve full patient profile, including demographics, history, and plan.

#### 1.2.4. View Patient Motion Data

:::usecase-flow
title: View Patient Motion Data
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/view-patient-motion-data.svg
:::

Doctor views time-series charts of motion quality scores and joint angles. The view supports date range and exercise filters, joint comparison, and raw sensor data download.

Required Interfaces / Capabilities:

- Provide time-series motion scores and per-joint angle data.
- Support filtering by date range and exercise type.
- Support overlaying symmetric joint data.
- Provide raw sensor data, such as accelerometer and gyroscope output, for download as JSON or CSV.

#### 1.2.5. View AI Analysis & Suggestions

:::usecase-flow
title: View AI Analysis & Suggestions
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/view-ai-analysis-and-suggestions.svg
:::

Doctor views AI-generated summary, progress, problem areas, and suggestions. The doctor can inspect confidence scores and timestamps, trigger re-analysis, and mark suggestions as reviewed.

Required Interfaces / Capabilities:

- Provide per-patient AI analysis summary with confidence metrics and timestamp.
- Accept manual re-analysis requests and return results asynchronously.
- Retrieve AI-generated suggestions sorted by date.
- Update suggestion status to `reviewed`.

#### 1.2.6. Write Manual Suggestion

:::usecase-flow
title: Write Manual Suggestion
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/write-manual-suggestion.svg
:::

Doctor writes free-text suggestions, optionally attaching images or PDFs. Suggestions can be edited, soft-deleted, versioned, and marked as critical.

Required Interfaces / Capabilities:

- Store suggestions with patient ID, doctor ID, timestamp, text content, and priority flag.
- Accept file uploads such as images and PDFs and return URLs.
- Support editing with version and change history.
- Support soft deletion.

#### 1.2.7. Manage Patient Rehabilitation Plan

:::usecase-flow
title: Manage Patient Rehabilitation Plan
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/manage-patient-rehabilitation-plan.svg
:::

Doctor views the current plan and its history. The doctor can add or remove exercises, adjust sets, reps, and frequency, add notes, duplicate a plan from another patient, set dates, and manage draft versus published states. Concurrent edit conflicts must be handled.

Required Interfaces / Capabilities:

- Retrieve the active plan and version history.
- Insert, update, and delete exercises and plan parameters such as frequency and dates.
- Store exercise-level notes.
- Duplicate another patient's plan.
- Support optimistic locking for concurrent edits.
- Support draft and published states for plans.

#### 1.2.8. View Patient Progress Reports

:::usecase-flow
title: View Patient Progress Reports
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/view-patient-progress-reports.svg
:::

Doctor generates weekly or monthly progress reports in PDF format with summary charts and text. The report can be downloaded or emailed to the patient.

Required Interfaces / Capabilities:

- Aggregate adherence and score trends over the specified period.
- Generate PDF output from HTML.
- Send email with PDF attachment through the email service.

#### 1.2.9. Handle Anomaly Alerts

:::usecase-flow
title: Handle Anomaly Alerts
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/handle-anomaly-alerts.svg
:::

Doctor views a list of alerts for assigned patients, filtered by severity. Alert details can be opened, alerts can be marked as resolved, private notes can be added, and similar alerts can be muted for a period.

Required Interfaces / Capabilities:

- Retrieve alerts with severity, time, and patient association.
- Provide motion snippet and explanation for an alert.
- Update alert status to `resolved`.
- Store private notes per alert.
- Store mute rules to suppress future similar alerts.

#### 1.2.10. Collaborate on Patient Cases

:::usecase-flow
title: Collaborate on Patient Cases
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/collaborate-on-patient-cases.svg
:::

Doctor starts a discussion thread about a patient and can invite other doctors. Replies, mentions, notifications, and resolved status must all be supported. The doctor can also review unresolved threads across patients.

Required Interfaces / Capabilities:

- Create and store discussion threads scoped to a patient.
- Store replies with timestamp and author.
- Support `@mentions` with user search and notification.
- Update thread status to `resolved`.
- Query unresolved threads for the doctor.

#### 1.2.11. Manage Notifications

:::usecase-flow
title: Manage Notifications
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/manage-notifications.svg
:::

Doctor receives in-app notifications for alerts, mentions, and messages. Individual notifications or the full set can be marked as read.

Required Interfaces / Capabilities:

- Store notifications per doctor.
- Return unread count and notification list.
- Support single update to `read` status.
- Support batch update to `read` status.

#### 1.2.12. Manage Account

:::usecase-flow
title: Manage Account
image: https://raw.githubusercontent.com/DSD2026-Team-M2/project-portal/main/public/images/docs/doctor-usecase-flows/manage-account.svg
:::

Doctor changes password, updates email, enables 2FA, views login history, or requests account deactivation pending admin approval.

Required Interfaces / Capabilities:

- Verify old password hash and update to new hash.
- Store and validate email address.
- Generate and verify TOTP secrets for 2FA.
- Store and retrieve login session metadata such as time, IP, and device.
- Mark account as inactive pending admin approval for deactivation.

### 1.3. Administration - Detailed scenarios

| Case | Description | Required Interfaces / Capabilities |
| ---- | ----------- | ---------------------------------- |
| **Admin Login/Logout** | Administrator authenticates with credentials. System handles wrong password, account locking, and token revocation. | - Authenticate admin role.<br>- Track failed attempts and lock account after threshold.<br>- Generate/revoke session tokens. |
| **Monitor System Health** | Admin views overall health status of all backend services (database, AI, storage, sensor gateway), with detailed metrics (latency, error rate). Can set alert thresholds and simulate outages for testing. | - Each service provides a `/health` endpoint.<br>- Aggregate status into a dashboard.<br>- Provide detailed metrics endpoints.<br>- Store threshold configurations and evaluate against metrics.<br>- Inject controlled failures for testing. |
| **Manage APIs** | Admin views all API endpoints (REST/WebSocket) with versions, status, and usage statistics. Can enable/disable endpoints, configure rate limits per endpoint/role, and view auto-generated OpenAPI docs. | - Register API endpoints with metadata.<br>- Dynamically enable/disable routing.<br>- Collect and query API usage metrics (count, latency, errors).<br>- Enforce rate limits based on configuration.<br>- Serve OpenAPI specification. |
| **Manage Logs** | Admin views, searches (full-text), and downloads recent logs. Can set log retention policy, and view aggregated error patterns. | - Query logs by time range, level, service.<br>- Perform full-text search on log messages.<br>- Export log data to CSV/JSON.<br>- Auto-delete logs older than retention period.<br>- Group similar error messages with counts. |
| **Manage Users** | Admin lists, searches, creates, edits, enables/disables, and deletes users (any role). Can reset passwords, export all user data (GDPR), and view a user's data export. | - Query all users with pagination and filters (by role, status, etc.).<br>- Insert/update user fields (email, role, active flag).<br>- Change user password hash.<br>- Cascade delete user and all associated data.<br>- Serialize all user-related data to JSON. |
| **Manage Sensors** | Admin lists all sensor devices, views assignment history, assigns/unassigns sensors to patients, marks sensors as broken, and views live sensor data stream for debugging. | - Query device registry (ID, type, battery, status, assigned patient).<br>- Store and retrieve sensor assignment logs.<br>- Update device assignment and status.<br>- Subscribe to real-time sensor data feed. |
| **Manage AI Models** | Admin lists AI model versions, uploads new models, sets the active model, rolls back to previous versions, configures A/B testing (traffic splitting), views model performance metrics (accuracy, latency), and schedules automatic retraining. | - Provide model metadata (version, date, accuracy, status).<br>- Accept model file upload and deploy to serving infrastructure.<br>- Switch inference endpoint to selected model.<br>- Split inference requests between model versions.<br>- Collect and display model inference metrics.<br>- Trigger retraining pipeline on a schedule. |
| **Manage Database** | Admin views database health (connection pool, query latency, slow queries), runs read-only ad-hoc SQL queries, triggers backups, restores from backups, and views backup history. | - Provide database metrics endpoint.<br>- Execute read-only SQL queries and return results.<br>- Perform full database backup to configured storage.<br>- Restore database from backup.<br>- List backup metadata (time, size). |
| **Monitor Performance** | Admin views CPU/memory usage, request latency (p99, p95), error rates (HTTP 5xx), and slowest endpoints for all services. Can set up alerts based on metric thresholds. | - Collect and expose system metrics (e.g., Prometheus).<br>- Compute latency percentiles from request logs.<br>- Count errors per time interval.<br>- Aggregate and sort endpoints by latency.<br>- Evaluate metrics against thresholds and send notifications. |
| **Manage Security** | Admin views failed login attempts and API access logs, rotates internal API keys, configures CORS allowed origins, views active user sessions, and can revoke any session. | - Log failed logins and API access with user identity.<br>- Generate new API keys and invalidate old ones.<br>- Update CORS policy dynamically.<br>- Query active session tokens.<br>- Invalidate a specific session token. |
| **Manage Configuration** | Admin views system configuration (env vars, feature flags), updates feature flags and logging levels in real-time, and exports/imports configuration as JSON. | - Expose current configuration (non-secret).<br>- Change feature flag values without redeploy.<br>- Dynamically change log level of running service.<br>- Serialize and apply configuration from JSON. |
| **Export Data & Manage Retention** | Admin exports all patient data (anonymized for research) by date range, schedules automatic exports, sets data retention policies (e.g., keep motion data for 1 year), and runs dry-run deletions. | - Aggregate anonymized data and generate archive.<br>- Filter data by timestamp.<br>- Run export jobs on a cron schedule.<br>- Auto-delete data older than retention period.<br>- Count records that would be deleted without committing. |
| **View Audit Log** | Admin views a log of all administrative actions (who did what, when), searches by admin user, and exports the audit log for compliance. | - Log admin actions (create user, delete data, change config).<br>- Query audit logs by user ID.<br>- Generate CSV/JSON of audit log entries. |
| **Configure Email & Notifications** | Admin tests SMTP settings, updates email templates, configures webhook URLs for system alerts, and tests webhook delivery. | - Send email via configured SMTP server.<br>- Store and render email templates.<br>- Send HTTP POST to webhook on specified events.<br>- Send a sample event to test webhook. |
| **Manage System Upgrade** | Admin checks for platform updates, applies updates (frontend/backend with minimal downtime), and rolls back to a previous version. | - Query version manifest from update server.<br>- Orchestrate rolling update of services.<br>- Revert to previous deployment. |
| **Manage Developer API & Portal** | Admin generates/revokes API tokens for programmatic access with scoped permissions, views token usage, manages OAuth client applications, and serves API documentation to external developers. | - Create and store API tokens with permissions.<br>- Invalidate tokens.<br>- Log and aggregate token usage.<br>- Store OAuth client credentials (client ID, secret, redirect URIs).<br>- Serve OpenAPI spec and interactive docs. |

## 2. Key Examples

### 2.1. User Register

#### 2.1.1. Basic info

- Reference to Use Case 1.1.
- Version: 0.1
- Created: Apr 1
- Authors: Lee
- Source: Web Interface
- Actors: Patient
- Goal: Allow users to become platform members through registration.
- Summary: New users input basic information, and the system validates and creates a user account.
- Trigger: User clicks the "Register" button.
- Frequency: Depends on the number of new users.
- Precondition: The system permits new user registration.
- Postconditions: The system returns registration success information and creates an account.

#### 2.1.2. Basic Flow

| Actor | System |
| ----- | ------ |
| User fills in registration information (username, password, email, age, etc.) | |
| User clicks the "Register" button | |
| | Validate input (username uniqueness, password strength, email format, required fields) |
| | Create user account and store in the database |
| | Return success information to the interface |
| User receives registration success notification | |

#### 2.1.3. Alternative Flow

| Actor | System |
| ----- | ------ |
| | Validation fails (e.g., username exists, weak password, invalid email, missing fields), return specific error message |

### 2.2. Sensor Connection

#### 2.2.1. Basic Info

- Reference to Use Case 1.1. (Patient - Execute Motion with Guidance)
- Version: 1.0
- Created: Apr 1
- Authors: Lee
- Source: Sensor Device / Mobile SDK
- Actors: Logged-in Patient
- Goal: Allow patients to connect sensor devices to the platform and upload motion data.
- Summary: Users connect sensor devices via Bluetooth/WiFi; the system validates the connection and begins receiving motion data streams.
- Trigger: User clicks the "Connect Device" button.
- Frequency: Before each rehabilitation training session.
- Precondition: User is logged in; sensor device is powered on and has sufficient battery; device is within connection range.
- Postconditions: The system successfully binds the sensor to the user account and begins receiving and storing motion data.

#### 2.2.2. Basic Flow

| Actor | System |
| ----- | ------ |
| User clicks the "Connect Sensor" button and selects device type | |
| | Scan for nearby available sensor devices and return the list |
| User selects the target device from the list | |
| | Initiate pairing request, verify device identity, and confirm successful pairing |
| | Display "Device Connected" status and begin receiving sensor data stream |
| User starts training session | |

#### 2.2.3. Alternative Flow

| Actor | System |
| ----- | ------ |
| | No devices found, display "No devices found. Please check Bluetooth/WiFi." |
| | Pairing fails, display "Pairing failed. Please ensure the device is discoverable." |
| | Connection interrupted, display "Connection lost. Attempting to reconnect..." and handle reconnection logic |
| | Low sensor battery, display "Low battery. Please charge the device." |

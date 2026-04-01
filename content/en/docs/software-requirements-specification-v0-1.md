---
id: doc-software-requirements-specification-v0-1
slug: software-requirements-specification-v0-1
title: Software Requirements Specification
type: requirement-analysis
date: 2026-04-01
owner: Lee
ownerRole: PM
status: final
summary: Formal Software Requirements Specification for M2 covering system background, user use cases, and key example flows.
relatedTeams:
  - PM
  - M2
relatedRepos:
  - project-portal
tags:
  - deliverable
  - requirement-analysis
attentionTags:
  - attention:M2
version: v1.0
reviewStatus: final
lastUpdated: 2026-04-01
links:
  - label: Requirement analysis
    href: /docs/requirement-analysis-v1
  - label: System design outline
    href: /docs/system-design-outline-v1
evidence: []
actionItems: []
---

# Software Requirements Specification (M2)

Revision History:

| Date | Author | Description |
| ---- | ------ | ----------- |
| Apr 1 | Lee | Add use cases |

## 0. Background

Our team is responsible for designing and developing a web-based platform with the primary functions of receiving sensor data, conducting motion analysis, and providing health recommendations. The system users primarily include registered users (who upload motion data), doctors (who provide the recommendations) and administrators (who monitor and manage the data).
## 1. Use Cases

### 1.1. Patient

| Case | Description | Trigger condition |
| ---- | ----------- | ----------------- |
| **Register** | Users can register as platform members by providing basic information. | The user clicks the "Register" button, and the system starts the registration process. |
| **Log in** | The user inputs their account and password for authentication, and after successful authentication, they enter the platform. | The user clicks the "Login" button, and the system starts the login process. |
| **View Rehabilitation Plan** | Patients can view their personalized rehabilitation plan, including scheduled exercises, frequency, and duration. | The user clicks "My Plan" on the dashboard. |
| **Execute Motion with Guidance** | Patients can view motion demonstration videos or animations and receive step-by-step guidance during exercise execution. | The user selects a specific exercise and clicks "Start Exercise". |
| **View Rehabilitation Records** | Patients can view historical rehabilitation records, including exercise completion status, motion quality scores, and progress trends. | The user clicks "History" or "My Records". |
| **Receive Real-time Feedback** | Patients receive immediate feedback on motion execution quality during or after exercise, including correction suggestions. | The system detects motion completion or deviation during exercise. |
| **Set Rehabilitation Goals** | Patients can set personal rehabilitation goals (e.g., weekly exercise frequency, motion accuracy targets) and track achievement progress. | The user clicks "Set Goals" in the goal tracking section. |
| **View Achievements & Motivations** | Patients can view earned achievement badges, streaks, and receive motivational messages based on their progress. | The user clicks "Achievements" or receives system-triggered motivational notifications. |
| **Receive Messages & Notifications** | Patients can receive system messages, doctor notifications, appointment reminders, and progress alerts. | The system pushes a notification when new messages arrive or important events occur. |

### 1.2. Doctor

| Case | Description | Trigger condition |
| ---- | ----------- | ----------------- |
| **Register** | Doctors can register as platform members by providing professional credentials and basic information. | The doctor clicks the "Register as Doctor" button, and the system starts the registration process. |
| **Log in** | The doctor inputs their account and password for authentication, and after successful authentication, they enter the platform. | The doctor clicks the "Login as Doctor" button, and the system starts the login process. |
| **View Patient Management Panel** | Doctors can view the list and basic information of all assigned patients. | The doctor clicks "Patient Management" after logging in. |
| **View Data Visualization & Analysis** | Doctors can view patients' motion data charts, trends, and statistical analysis. | The doctor enters a patient's detail page and clicks "Data Analysis". |
| **Playback Motion Capture** | Doctors can replay motion capture videos or data trajectories uploaded by patients. | The doctor enters a patient's motion record and clicks "Playback". |
| **Generate Smart Report** | The system automatically generates motion analysis reports; doctors can review and modify them. | The doctor clicks the "Generate Report" button. |
| **Handle Anomaly Detection Alerts** | Doctors receive abnormal motion alerts, review details, and provide recommendations. | The system detects abnormal motion and pushes a notification. |
| **Adjust Treatment Plan** | Doctors can modify or create new rehabilitation plans based on patient data. | The doctor enters a patient's detail page and clicks "Edit Treatment Plan". |
| **Collaboration & Discussion** | Doctors can discuss patient cases with other medical team members. | The doctor clicks the "Collaboration" entry. |

### 1.3. Administration

| Case | Description | Trigger condition |
| ---- | ----------- | ----------------- |
| **Register** | Administrators can register as platform members (typically created by super admin or system initialization). | The super admin clicks "Create Administrator", and the system starts the registration process. |
| **Log in** | The administrator inputs their account and password for authentication, and after successful authentication, they enter the management platform. | The administrator clicks the "Login as Administrator" button, and the system starts the login process. |
| **Manage Data Interfaces** | Administrators can view and manage API interface status and call logs. | The administrator enters the "Interface Management" page. |
| **Manage Sensor Devices** | Administrators can monitor sensor device status and handle device binding exceptions. | The administrator enters the "Sensor Management" page. |
| **Manage AI Models** | Administrators can manage AI analysis model versions, updates, and deployments. | The administrator enters the "AI Model Management" page. |
| **View Logs & Monitoring** | Administrators can view system operation logs, performance monitoring, and anomaly alerts. | The administrator enters the "Log Monitoring" page. |
| **Manage Permissions & Roles** | Administrators can manage user roles, access permissions, and data permissions. | The administrator enters the "Permission Management" page. |
| **Data Export & Backup** | Administrators can perform system data backup and export data on demand. | The administrator enters the "Data Management" page and clicks "Backup/Export". |
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
| | Validate that the username is unique |
| | Validate that the password meets format requirements |
| | Create user account and store in the database |
| | Return success information to the interface |
| User receives registration success notification | |

#### 2.1.3. Alternative Flow

| Actor | System |
| ----- | ------ |
| | Username already exists, return "Username already taken" |
| | Password does not meet format requirements, return "Password must contain at least 8 characters, including letters and numbers" |
| | Email format is invalid, return "Invalid email format" |
| | Required fields are missing, return "Please fill in all required fields" |

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
| User clicks the "Connect Sensor" button | |
| User selects device type (e.g., IMU sensor, smartwatch) | |
| | Scan for nearby available sensor devices |
| | Return list of available devices |
| User selects the target device from the list | |
| | Initiate pairing request and verify device identity |
| | Confirm successful pairing |
| | Display "Device Connected" status |
| | Begin receiving sensor data stream |
| User starts training session | |

#### 2.2.3. Alternative Flow

| Actor | System |
| ----- | ------ |
| | No devices found, display "No devices found. Please check Bluetooth/WiFi." |
| | Device pairing fails, display "Pairing failed. Please ensure the device is discoverable." |
| | Connection interrupted, display "Connection lost. Attempting to reconnect..." |
| | Low sensor battery, display "Low battery. Please charge the device." |

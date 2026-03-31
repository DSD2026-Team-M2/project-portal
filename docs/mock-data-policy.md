# Mock Data Policy

## Purpose

This document defines how mock, sample and template content may be used in `project-portal`.

The goal is to support development without creating fake project history.

---

## 1. Why This Policy Exists

The portal contains:

- logs
- docs
- meetings
- weekly reports
- risks
- milestones
- gantt tasks
- calendar events

These look like formal project records.  
If mock content is written carelessly, readers may mistake it for real history.

That is unacceptable for a portal intended for:
- teachers
- teammates
- collaborators
- future maintainers

---

## 2. Allowed Non-Factual Labels

Any non-factual content must be clearly labeled with one of the following:

- SAMPLE
- EXAMPLE
- MOCK
- TEMPLATE

Use the most accurate label.

### Suggested meanings
- SAMPLE: illustrative but not real project record
- EXAMPLE: demonstration of expected format
- MOCK: placeholder for UI or data testing
- TEMPLATE: reusable authoring skeleton

---

## 3. What May Be Mocked

Mock content is allowed for:

- layout testing
- component testing
- example pages for teammates
- schema demonstration
- temporary gantt / calendar previews
- template content in `/examples`

Mock data may also be used before real records exist, as long as it is clearly marked.

---

## 4. What Must Not Be Mocked Silently

The following must never be presented as real if they are not real:

- sprint history
- milestone completion
- meeting decisions
- interface agreements
- review outcomes
- blocker history
- risk resolution
- teacher-facing deliverable status

If such data is illustrative only, label it clearly.

---

## 5. Where Mock Content Belongs

Preferred places:
- `/examples`
- template directories
- clearly labeled example entries
- sample data files for development

Less preferred:
- core home-page summaries
- production-facing timeline without clear marking
- formal logs mixed with real history and no distinction

---

## 6. Required Marking Methods

Use at least one of the following, and preferably more than one:

1. Front matter field:
   - `mock: true`
   - `example: true`
   - `template: true`

2. Visible label in UI:
   - MOCK
   - SAMPLE
   - EXAMPLE
   - TEMPLATE

3. Visible note in article body or page header:
   - “This entry is an example template.”
   - “This timeline item is mock data for layout testing.”

### Recommended rule
Mock content should be machine-detectable **and** human-visible.

---

## 7. Gantt and Calendar Special Rule

Because gantt views and calendars are easily interpreted as factual schedules, they require extra care.

### If using mock gantt tasks:
- mark the whole dataset as sample
- show a visible SAMPLE / MOCK marker on the page
- explain that the structure is for visualization testing

### If using mock calendar items:
- do not write them like confirmed official events
- use example wording
- avoid fake institutional tone

---

## 8. Transition from Mock to Real

When replacing mock data with real data:

1. remove visible mock labels
2. update front matter flags
3. review title wording
4. update dates and owners
5. ensure links and evidence are real
6. verify the entry no longer appears in example-only sections

---

## 9. Example Pages

The portal should include at least one visible example/template area so that content authors understand formatting expectations.

Recommended:
- `/examples`
- example entries in docs/logs templates section

The goal is to teach teammates structure without polluting factual pages.

---

## 10. Responsibilities

### Content authors
Must not publish fabricated project history as if it were real.

### Developers
Must ensure mock flags can be read by the UI and build scripts.

### Reviewers
Must check whether new entries are factual, example-based or still mock.

---

## 11. Review Checklist

Before publishing any content, check:

- Is this real or illustrative?
- If illustrative, is it clearly labeled?
- Does the UI make that obvious?
- Could a teacher or teammate mistake this for real project history?
- Should this live in `/examples` instead?

If there is any doubt, mark it more clearly.

---

## 12. Final Principle

Mock data is acceptable.  
Ambiguous mock data is not.

The portal should remain:
- honest
- traceable
- reviewable
- credible
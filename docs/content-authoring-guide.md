# Content Authoring Guide

## Purpose

This guide explains how to add and maintain content for `project-portal`.

The main principle is simple:

> Update content by editing markdown files whenever possible.  
> Do not edit React components just to publish a new log, meeting note or research record.

---

## 1. Content Types

The portal currently supports the following content types:

- update
- weekly-report
- meeting
- decision
- interface
- test
- demo
- research
- document
- calendar-event

These types may appear in:

- logs
- docs
- architecture references
- calendar
- home-page summaries

---

## 2. Directory Structure

Recommended structure:

```text
content/
  en/
    logs/
    docs/
    meetings/
    weekly-reports/
    research/
    calendar/
  zh-CN/
    logs/
    docs/
    meetings/
    weekly-reports/
    research/
    calendar/
  pt/
    logs/
    docs/
    meetings/
    weekly-reports/
    research/
    calendar/
````

### Important rule

Dynamic content is maintained with **English as the primary source language**.

This means:

* English entries should exist first
* zh-CN and pt versions are optional for dynamic content
* if a translation is missing, the portal falls back to English

---

## 3. UI Translation vs Content Translation

### UI text

Use i18n locale JSON files for:

* navigation
* button labels
* status labels
* fixed page titles
* fixed section names
* interface wording

### Content text

Use markdown files for:

* logs
* weekly reports
* meeting minutes
* research notes
* documents
* calendar event notes

Do not mix these two systems.

---

## 4. Front Matter Basics

Each markdown entry must begin with YAML front matter.

Required base fields:

* `id`
* `slug`
* `title`
* `type`
* `date`
* `owner`
* `ownerRole`
* `status`
* `summary`
* `relatedTeams`
* `relatedRepos`
* `sprint`
* `tags`
* `attentionTags`
* `lastUpdated`

Common optional fields:

* `links`
* `evidence`
* `actionItems`
* `featured`
* `archived`
* `language`

Additional fields may exist for specific types such as:

* `version`
* `reviewStatus`
* `meetingType`
* `participants`
* `decisions`
* `eventType`
* `start`
* `end`

---

## 5. Slug Rules

The `slug` must be:

* stable
* short
* URL-friendly
* reused across translations of the same entry

Example:

* `prior-dsd-portal-patterns`
* `weekly-sync-2026-04-03`
* `portal-ia-v1`

Do not rename slugs casually after publication.

---

## 6. English-First Dynamic Content Policy

This policy is mandatory.

### For dynamic entries

English is the canonical source.

If a zh-CN or pt version does not exist:

* the portal shows the English entry
* the portal displays a short fallback note

### Why this policy exists

Because maintaining frequent logs and docs in three languages creates unnecessary overhead and slows down updates.

### What this does not affect

This does **not** remove trilingual UI support.

---

## 7. Writing Style Recommendations

### Logs

Write short, factual, traceable updates.

Good:

* what changed
* why it changed
* who owns it
* what is next
* where the evidence is

Avoid:

* vague motivational text
* large self-congratulatory paragraphs
* repeating page-level introduction

### Meetings

Always include:

* meeting info
* agenda
* decisions
* action items

### Research Notes

Treat research as a formal project asset.

A research note should answer:

* what was reviewed
* what questions guided the review
* what patterns were found
* what decisions were derived

### Documents

Document entries should clearly state:

* version
* status
* owner
* purpose
* scope

---

## 8. Evidence and Links

Use `links` for:

* references
* related pages
* repos
* files
* demos

Use `evidence` for:

* screenshots
* proofs
* source records
* payload examples
* attachments

If an update or claim matters, provide evidence.

---

## 9. Tags and Attention Tags

### `tags`

Use for classification.

Examples:

* research
* interface
* demo
* milestone
* meeting
* weekly-report

### `attentionTags`

Use when another team or role should notice this item.

Examples:

* attention:V2
* attention:M1
* attention:backend
* attention:hardware
* attention:ai

Do not use attention tags casually.
They are not decoration.

---

## 10. Mock / Example / Template Rules

Non-factual content must be clearly labeled.

Allowed labels:

* SAMPLE
* EXAMPLE
* MOCK
* TEMPLATE

Use these labels when:

* building layouts before real content exists
* giving teammates a writing example
* testing list structures or filters

Never let mock content look like real project history.

---

## 11. Recommended Content Workflow

### When adding a new entry

1. Pick the correct content type
2. Copy the appropriate template
3. Fill front matter carefully
4. Write markdown body
5. Check tags and related teams
6. Add evidence links if relevant
7. Run content validation
8. Preview locally

### When editing an existing entry

1. Preserve `id` and `slug`
2. Update `lastUpdated`
3. Keep historical wording traceable
4. Avoid rewriting history unless needed for factual correction

---

## 12. Example Content Types to Maintain Early

Priority items include:

* research note on prior DSD portal patterns
* portal IA rationale
* content pipeline design note
* calendar / holiday design note
* weekly reports
* meeting notes
* portal progress updates

---

## 13. What Should Not Live in Markdown

Avoid storing these as ad hoc markdown body content if they are really configuration:

* external link registry
* static team-link configuration
* color maps
* route definitions
* icon mappings

These should live in config or generated data.

---

## 14. Final Reminder

The portal should become easier to update over time, not harder.

When writing content, optimize for:

* clarity
* consistency
* traceability
* team usability
* future maintainers

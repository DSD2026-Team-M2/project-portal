# AGENT.md

## Read These Files Before Major Changes

- [README](./README.md)
- [Design system revision](./docs/design-system-revision.md)
- [Content authoring guide](./docs/content-authoring-guide.md)
- [Component semantics](./docs/component-semantics.md)
- [Mock data policy](./docs/mock-data-policy.md)

## Portal Identity

This repository contains the source code and content pipeline for `project-portal`.

`project-portal` is **not**:

- the main product frontend
- the recruitment site
- a portfolio
- a SaaS landing page
- a marketing homepage

`project-portal` **is**:

- the process and collaboration hub of the project
- the entry point for progress, logs, documents, architecture, calendar and team visibility
- a traceable reporting surface for teachers and collaborators
- an M2-maintained site that makes M2-visible work clear without claiming ownership of the whole project

## Hard Boundaries

These boundaries are mandatory:

1. `project-main-web` is the main product frontend and must not be replaced by portal content.
2. `m2-recruitment-site` is a related, already-finished deliverable, not the visual template for this portal.
3. M2 is responsible for portal maintenance, project-facing narrative structure, reporting surfaces and M2-visible frontend presentation.
4. M2 does **not** own the whole project frontend and must not present the portal as the full product.

## Visual Direction

The portal belongs to the same series as our other project pages, but it must be more serious and more portal-like than the recruitment page.

Required qualities:

- light background
- soft gradient atmosphere
- restrained glass / translucent layering
- editorial clarity
- strong information hierarchy
- low animation
- professional, engineering-oriented tone

Forbidden qualities:

- oversized hero-first landing-page layout
- bubble UI everywhere
- pill-shaped paragraph containers
- AI-dashboard card soup
- marketing slogans
- excessive decoration
- visual ambiguity between tags, links and buttons

## Surface Hierarchy

Use the revised surface system consistently:

- `page-shell`
- `section-shell`
- `surface-card`
- `callout-box`
- `meta-panel`
- `status-badge`
- `filter-chip`
- `static-tag`
- `attention-tag`
- `nav-link-card`

Do not reintroduce giant bubble blocks for long explanations or article shells.

## Summary vs Detail Rule

This rule is mandatory.

### Home page

The home page shows:

- summary
- overview
- current status
- selected highlights
- entry points to detail pages

The home page must **not** duplicate full-detail content from logs, docs, architecture, calendar or team pages.

### Detail pages

Detail pages show:

- full content
- metadata
- evidence
- action items
- links
- archived context
- content-level anchors

If something is already fully explained in `/logs`, `/docs`, `/architecture`, `/calendar`, `/team`, or `/examples`, the home page should only summarize it and link out.

## Dynamic Content Language Policy

UI remains static trilingual:

- zh-CN
- en
- pt

Dynamic content is maintained with **English as the default source language**.

This applies to:

- logs
- docs
- meetings
- weekly reports
- research notes
- news
- article-style content

Rules:

1. If a zh-CN or pt version of a dynamic entry is missing, the site must display the English version.
2. Never leave dynamic content blank just because a translation is missing.
3. The fallback notice must be clear and short.
4. Do not force the team to maintain trilingual article bodies.

## Tags, Links And Interaction Semantics

Do not blur interaction meaning.

### Non-interactive

- `StatusBadge`: state only
- `StaticTag`: category only

### Interactive

- `FilterChip`: filters content in the current page
- `InternalLinkPill`: navigates to an internal page
- `ExternalLinkPill`: navigates to an external URL
- `AttentionTag`: highlights content that another team should notice, and may also support filtering

If a UI element looks like a tag but behaves like a link or filter, redesign it.

## Mock / Sample Data Policy

Mock data is allowed only when needed for layout or system testing.

Rules:

1. Mock content must be explicitly labeled as:
   - SAMPLE
   - EXAMPLE
   - MOCK
   - TEMPLATE
2. Mock content must never be written in a way that looks like real project history.
3. Fake sprints, fake milestones and fake decisions must not be presented as factual records.
4. Any page that contains sample content should make that obvious.

## Content Pipeline Expectations

The portal is designed so that content updates are mostly done by editing markdown files rather than rewriting React components.

Maintain:

- markdown + front matter content structure
- build script for content indexing
- fallback to English for untranslated entries
- static holiday data generation
- deep-linkable article headings
- clearly marked example/template entries

## Bionic Reading Rule

Bionic reading must follow the established pattern from the proposal project.

Do not invent a new “Readable” mode as a substitute.

Reading enhancement:

- only applies to article-like content
- must be easy to toggle
- must not affect tables, metadata cards, diagrams, navigation or calendar

## What Codex / Agents Should Optimize For

When changing the portal, prefer:

1. clarity
2. maintainability
3. stronger hierarchy
4. cleaner semantics
5. lower visual noise
6. real traceability

When in doubt:

- do **not** make it more decorative
- do **not** make it more marketing-like
- do **not** add another rounded bubble
- do **not** hide structure behind card clutter
- do **not** invent fake project history

## Related Links

Keep external links centralized in `src/config/links.ts`.

Important references include:

- M2 GitHub org
- M2 logo asset
- `project-main-web`
- `project-portal`
- `m2-recruitment-site`

## Final Reminder

This portal should feel like:

- a serious course project hub
- a collaboration and reporting surface
- a traceable engineering site
- a readable document-first web portal

It should **not** feel like:

- a clone of the recruitment page
- a prompt-generated bubble dashboard
- a portfolio splash page
- a generic startup landing page

# project-portal

`project-portal` is the process display, collaboration index and delivery hub for the Limb Motion Recognition and Assistant project.

It is not the main product website, not the historical recruitment site, and not a portfolio page. This repository is maintained by M2 to make progress, logs, documents, milestones, architecture and calendar information easy to review and share.

## Portal positioning and boundary

- `project-portal` is a reporting and collaboration portal.
- `project-main-web` remains the main product-facing frontend in a separate repository.
- `m2-recruitment-site` is an archived historical deliverable and appears here only as a related archive.
- M2 owns this portal and the M2-visible dashboard / portal narrative pages, not every web deliverable in the overall project.

## Page structure

- `/` overview hub
- `/progress` timeline, gantt, milestones, iteration digests and risks
- `/logs` logs, meetings, weekly reports, decisions and research
- `/logs/:slug` single log detail page
- `/docs` deliverables and document hub
- `/docs/:slug` single document detail page
- `/architecture` system layers, team matrix, repository map and interface dependencies
- `/calendar` month calendar with milestones, meetings, deadlines and static holiday data
- `/team` team members, roles, timezones and contribution focus
- `/examples` template and example entries for authors

## Design direction

The visual direction intentionally follows the same family as the series pages, but with a stricter portal tone:

- light background
- soft radial gradient atmosphere
- restrained glass layering
- stronger editorial hierarchy
- low motion
- document-first reading rhythm

The implementation intentionally avoids:

- recruitment-site bubble UI
- full-screen marketing hero sections
- heavy animation libraries
- large UI frameworks
- decorative dashboard clutter

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- i18next + react-i18next
- react-router-dom
- FullCalendar React
- react-markdown
- remark-gfm
- rehype-slug
- rehype-autolink-headings
- gray-matter
- fast-glob
- Frappe Gantt
- text-vide

The site stays intentionally simple so someone learning Vite + React + TypeScript can continue maintaining it.

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build generated content only:

```bash
npm run build:content
```

Fetch and update static holiday JSON:

```bash
npm run build:holidays
```

Validate markdown content without writing generated output:

```bash
npm run check:content
```

Create the production build:

```bash
npm run build
```

`prebuild` automatically regenerates content and holiday data before the production build.

## Markdown content workflow

Most frequent updates should happen in `content/`, not in React components.

Recommended structure:

```text
content/
  en/
    logs/
    docs/
    research/
    meetings/
    weekly-reports/
    gantt/
  zh-CN/
    ...
  pt/
    ...
```

Every markdown file uses front matter plus body content.

### Required base front matter fields

- `id`
- `slug`
- `title`
- `type`
- `date`
- `owner`
- `ownerRole`
- `status`
- `summary`
- `relatedTeams`
- `relatedRepos`
- `sprint`
- `tags`

### Common optional fields

- `attentionTags`
- `lastUpdated`
- `links`
- `evidence`
- `actionItems`
- `featured`
- `archived`

### Additional document fields

- `version`
- `reviewStatus`

### Example / mock fields

Use these when the entry is not factual:

- `sample: true`
- `example: true`
- `mock: true`
- `template: true`

These markers are surfaced in the UI and routed into `/examples` instead of the main factual lists.

## Content generation

`scripts/build-content.ts` scans the `content/` tree, parses front matter, validates required fields, checks duplicate slugs and generates:

- `src/generated/content-index.generated.json`

The frontend reads this generated JSON and resolves localized content at runtime.

## Language strategy

The portal supports:

- `zh-CN`
- `en`
- `pt`

### UI chrome

UI strings live in:

- `src/i18n/locales/zh-CN.json`
- `src/i18n/locales/en.json`
- `src/i18n/locales/pt.json`

This includes:

- navigation
- button labels
- section titles
- status labels
- fixed page copy

### Dynamic article content

Logs, docs, meetings, weekly reports, research and similar article-style content are English-first.

Rules:

- browser language is used first
- manual language switching is persisted
- `<html lang="">` is synchronized
- if a dynamic entry is missing in `zh-CN` or `pt`, the site automatically falls back to the English version
- if English is also missing, the content is treated as unavailable

This reduces the maintenance burden for frequently updated content.

## Bionic reading

The article pages support a `Normal` / `Bionic` reading toggle based on the proposal project pattern.

Rules:

- default is normal
- only available for English article content
- applies only inside the long-form article body
- does not affect navigation, tables, calendar, metadata panels or system diagrams

## Holiday data

The calendar uses static holiday JSON for:

- China
- Portugal

`scripts/fetch-holidays.ts` fetches holiday data and writes generated files under:

- `src/generated/holidays/cn.generated.json`
- `src/generated/holidays/pt.generated.json`

If fetching fails, the script keeps existing files instead of deleting them, so the site remains usable.

## Why the site avoids flashy hero sections and heavy animation

This portal is for:

- course reporting
- cross-team collaboration
- document lookup
- progress tracking
- traceable project records

Because of that, the design stays:

- light
- readable
- restrained
- calm
- maintainable

Large marketing hero sections, aggressive animation and decorative complexity would make the portal harder to read and harder to maintain.

## Deployment to GitHub Pages

This project is configured to work as a static GitHub Pages site.

Key settings:

- Vite uses `base: "./"` so built asset paths stay relative.
- Routing uses hash URLs such as `#/logs` and `#/docs/requirement-analysis-v1`, so GitHub Pages does not need server-side history fallback.

Recommended workflow:

1. Run `npm install`.
2. Run `npm run build`.
3. Publish the generated `dist/` directory to GitHub Pages.
4. Open the deployed `index.html` entry from the Pages site root.

Because the site uses hash routing, direct refresh on inner pages remains valid on GitHub Pages.

## Deployment to VPS

Typical workflow:

1. Install Node.js on the VPS.
2. Clone the repository.
3. Run `npm install`.
4. Run `npm run build`.
5. Serve the generated `dist/` directory with Nginx, Caddy or another static file server.
6. Configure history fallback to `index.html` so browser-routed pages work correctly.

For Nginx, that usually means using a `try_files` rule so `/logs/...`, `/docs/...`, `/team`, and `/examples` still resolve to the SPA entry.

## Directory overview

```text
src/
  app/
  components/
  config/
  content/
  contexts/
  data/
  generated/
  hooks/
  i18n/
  pages/
  types/
  utils/
scripts/
content/
docs/
```

## Maintenance notes

- Prefer updating markdown records instead of adding hardcoded page text.
- Keep repository boundary statements consistent with the architecture page.
- Add new UI strings to all locale JSON files.
- Keep external links centralized in `src/config/links.ts`.
- Mark mock or sample scheduling content clearly until real PM-maintained data is available.

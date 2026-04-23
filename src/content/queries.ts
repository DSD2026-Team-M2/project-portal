import { contentIndex } from "./index";
import { siteMode } from "../config/siteMode";
import type { SupportedLanguage } from "../i18n/language";
import type { GeneratedContentEntry } from "../utils/content";

const visibleExampleSlugs = new Set<string>(siteMode.visibleExampleSlugs);
const visibleDocSlugs = new Set<string>([
  "software-requirements-specification-v0-1",
  "meeting-minutes-index-v1",
  "meeting-minutes-2026-04-18-first-generation-system-alignment",
]);

function selectLocalizedEntry(entries: GeneratedContentEntry[], language: SupportedLanguage): GeneratedContentEntry | null {
  return (
    entries.find((entry) => entry.locale === language) ??
    entries.find((entry) => entry.locale === "en") ??
    entries[0] ??
    null
  );
}

function groupBySlug(routeBase: "logs" | "docs") {
  const grouped = new Map<string, GeneratedContentEntry[]>();

  for (const entry of contentIndex.entries.filter((item) => item.routeBase === routeBase)) {
    const items = grouped.get(entry.slug) ?? [];
    items.push(entry);
    grouped.set(entry.slug, items);
  }

  return grouped;
}

type EntryQueryOptions = {
  includeMarked?: boolean;
  onlyMarked?: boolean;
};

function shouldIncludeEntry(entry: GeneratedContentEntry, options?: EntryQueryOptions) {
  const isMarked = entry.markers.length > 0;

  if (options?.onlyMarked) return isMarked;
  if (options?.includeMarked) return true;

  return !isMarked;
}

function isRouteEntryVisible(routeBase: "logs" | "docs", slug: string) {
  if (routeBase !== "docs") {
    return true;
  }

  return visibleDocSlugs.has(slug);
}

export function getResolvedEntries(
  routeBase: "logs" | "docs",
  language: SupportedLanguage,
  options?: EntryQueryOptions,
): GeneratedContentEntry[] {
  const grouped = groupBySlug(routeBase);
  const resolved = [...grouped.values()]
    .map((entries) => selectLocalizedEntry(entries, language))
    .filter((entry): entry is GeneratedContentEntry => Boolean(entry))
    .filter((entry) => isRouteEntryVisible(routeBase, entry.slug))
    .filter((entry) => shouldIncludeEntry(entry, options))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  return resolved;
}

export function getContentEntryBySlug(
  routeBase: "logs" | "docs",
  slug: string,
  language: SupportedLanguage,
): { entry: GeneratedContentEntry | null; isFallback: boolean } {
  const grouped = groupBySlug(routeBase);
  const entries = grouped.get(slug) ?? [];
  const localeEntry = entries.find((item) => item.locale === language);
  const isVisibleTemplateExample = siteMode.showTemplateExamples && visibleExampleSlugs.has(slug);

  if (!isRouteEntryVisible(routeBase, slug)) {
    return { entry: null, isFallback: false };
  }

  const canExposeEntry = (entry: GeneratedContentEntry | null) => {
    if (!entry) return false;
    if (entry.markers.length === 0) return true;
    return isVisibleTemplateExample;
  };

  if (localeEntry && canExposeEntry(localeEntry)) {
    return { entry: localeEntry, isFallback: false };
  }

  const englishEntry = entries.find((item) => item.locale === "en") ?? null;

  if (!canExposeEntry(englishEntry)) {
    return { entry: null, isFallback: false };
  }

  return { entry: englishEntry, isFallback: Boolean(englishEntry) && language !== "en" };
}

export function getNeighborEntries(
  routeBase: "logs" | "docs",
  slug: string,
  language: SupportedLanguage,
): { previous: GeneratedContentEntry | null; next: GeneratedContentEntry | null } {
  const entries = getResolvedEntries(routeBase, language);
  const index = entries.findIndex((entry) => entry.slug === slug);

  return {
    previous: index >= 0 ? entries[index + 1] ?? null : null,
    next: index >= 0 ? entries[index - 1] ?? null : null,
  };
}

export function getLatestUpdates(language: SupportedLanguage, limit = 6): GeneratedContentEntry[] {
  return getResolvedEntries("logs", language).slice(0, limit);
}

export function getExampleEntries(language: SupportedLanguage): GeneratedContentEntry[] {
  if (!siteMode.showTemplateExamples) {
    return [];
  }

  const templateEntries = [
    ...getResolvedEntries("docs", language, { onlyMarked: true }),
    ...getResolvedEntries("logs", language, { onlyMarked: true }),
  ]
    .filter((entry) => entry.markers.includes("template"))
    .filter((entry) => visibleExampleSlugs.has(entry.slug))
    .sort((left, right) => left.type.localeCompare(right.type) || left.title.localeCompare(right.title));

  const firstByType = new Map<string, GeneratedContentEntry>();

  for (const entry of templateEntries) {
    if (!firstByType.has(entry.type)) {
      firstByType.set(entry.type, entry);
    }
  }

  return [...firstByType.values()];
}

import type { SupportedLanguage } from "../i18n/language";

export type LocalizedText = {
  en: string;
  "zh-CN"?: string;
  pt?: string;
};

export type ContentLink = {
  label: string;
  href: string;
};

export type ActionItem = {
  owner: string;
  task: string;
  due?: string;
};

export type ContentMarker = "sample" | "example" | "mock" | "template";

export type GeneratedContentEntry = {
  id: string;
  slug: string;
  locale: SupportedLanguage;
  collection: string;
  routeBase: "logs" | "docs";
  title: string;
  type: string;
  date: string;
  owner: string;
  ownerRole: string;
  status: string;
  summary: string;
  relatedTeams: string[];
  relatedRepos: string[];
  tags: string[];
  attentionTags: string[];
  lastUpdated?: string;
  version?: string;
  reviewStatus?: string;
  links: ContentLink[];
  evidence: ContentLink[];
  actionItems: ActionItem[];
  featured: boolean;
  archived: boolean;
  markers: ContentMarker[];
  body: string;
  sourcePath: string;
};

export type TaxonomyItem = {
  value: string;
  count: number;
};

export type GeneratedContentIndex = {
  generatedAt: string;
  entries: GeneratedContentEntry[];
  taxonomies: {
    types: TaxonomyItem[];
    tags: TaxonomyItem[];
    attentionTags: TaxonomyItem[];
    teams: TaxonomyItem[];
    years: TaxonomyItem[];
    collections: TaxonomyItem[];
  };
};

export function resolveLocalizedText(value: LocalizedText, language: SupportedLanguage): string {
  return value[language] ?? value.en;
}

export function ensureArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

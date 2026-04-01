import { promises as fs } from "node:fs";
import path from "node:path";

import fg from "fast-glob";
import matter from "gray-matter";

const SUPPORTED_LOCALES = ["en", "zh-CN", "pt"] as const;
const DOC_COLLECTIONS = new Set(["docs"]);
const REQUIRED_FIELDS = [
  "id",
  "slug",
  "title",
  "type",
  "date",
  "owner",
  "ownerRole",
  "status",
  "summary",
  "relatedTeams",
  "relatedRepos",
  "tags",
] as const;
const REQUIRED_DOC_FIELDS = ["version", "reviewStatus", "lastUpdated"] as const;

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type ContentLink = {
  label: string;
  href: string;
};

type ActionItem = {
  owner: string;
  task: string;
  due?: string;
};

type ContentMarker = "sample" | "example" | "mock" | "template";

type ContentEntry = {
  id: string;
  slug: string;
  locale: SupportedLocale;
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

type TaxonomyItem = {
  value: string;
  count: number;
};

export type GeneratedContentIndex = {
  generatedAt: string;
  entries: ContentEntry[];
  taxonomies: {
    types: TaxonomyItem[];
    tags: TaxonomyItem[];
    attentionTags: TaxonomyItem[];
    teams: TaxonomyItem[];
    years: TaxonomyItem[];
    collections: TaxonomyItem[];
  };
};

type BuildResult = {
  index: GeneratedContentIndex;
  problems: string[];
};

function normalizeDateValue(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return typeof value === "string" ? value : String(value ?? "");
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateLinks(value: unknown): ContentLink[] {
  return toArray<Record<string, unknown>>(value)
    .filter((item) => typeof item.label === "string" && typeof item.href === "string")
    .map((item) => ({ label: String(item.label), href: String(item.href) }));
}

function validateActionItems(value: unknown): ActionItem[] {
  return toArray<Record<string, unknown>>(value)
    .filter((item) => typeof item.owner === "string" && typeof item.task === "string")
    .map((item) => ({
      owner: String(item.owner),
      task: String(item.task),
      due: typeof item.due === "string" ? item.due : undefined,
    }));
}

function resolveMarkers(entry: Record<string, unknown>): ContentMarker[] {
  const markers: ContentMarker[] = [];

  if (entry.sample === true) markers.push("sample");
  if (entry.example === true) markers.push("example");
  if (entry.mock === true) markers.push("mock");
  if (entry.template === true) markers.push("template");

  return markers;
}

function countBy(values: string[]): TaxonomyItem[] {
  const counts = new Map<string, number>();

  for (const value of values.filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => left.value.localeCompare(right.value));
}

function validateRequiredFields(entry: Record<string, unknown>, routeBase: "logs" | "docs", sourcePath: string): string[] {
  const problems: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    const value = entry[field];
    const missingArray = ["relatedTeams", "relatedRepos", "tags"].includes(field) && !Array.isArray(value);
    const missingScalar = value === undefined || value === null || value === "";

    if (missingArray || missingScalar) {
      problems.push(`${sourcePath}: missing required field "${field}"`);
    }
  }

  if (routeBase === "docs") {
    for (const field of REQUIRED_DOC_FIELDS) {
      const value = entry[field];
      if (value === undefined || value === null || value === "") {
        problems.push(`${sourcePath}: missing required document field "${field}"`);
      }
    }
  }

  return problems;
}

export async function buildContentIndex(): Promise<BuildResult> {
  const rootDir = process.cwd();
  const contentDir = path.join(rootDir, "content");
  const files = await fg("content/**/*.md", { cwd: rootDir, onlyFiles: true });
  const problems: string[] = [];
  const seenKeys = new Set<string>();
  const entries: ContentEntry[] = [];

  for (const relativeFilePath of files) {
    const absolutePath = path.join(rootDir, relativeFilePath);
    const raw = await fs.readFile(absolutePath, "utf8");
    const parsed = matter(raw);
    const sourcePath = relativeFilePath.replace(/\\/g, "/");
    const parts = sourcePath.split("/");
    const locale = parts[1] as SupportedLocale | undefined;
    const collection = parts[2];

    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
      problems.push(`${sourcePath}: unsupported locale folder`);
      continue;
    }

    if (!collection) {
      problems.push(`${sourcePath}: collection folder is missing`);
      continue;
    }

    if (!isRecord(parsed.data)) {
      problems.push(`${sourcePath}: front matter must be an object`);
      continue;
    }

    const routeBase = DOC_COLLECTIONS.has(collection) ? "docs" : "logs";
    problems.push(...validateRequiredFields(parsed.data, routeBase, sourcePath));

    const slug = typeof parsed.data.slug === "string" ? parsed.data.slug : "";
    const key = `${routeBase}:${locale}:${slug}`;
    if (slug && seenKeys.has(key)) {
      problems.push(`${sourcePath}: duplicate slug "${slug}" for ${routeBase} in locale ${locale}`);
    }
    seenKeys.add(key);

    entries.push({
      id: String(parsed.data.id ?? ""),
      slug,
      locale,
      collection,
      routeBase,
      title: String(parsed.data.title ?? ""),
      type: String(parsed.data.type ?? ""),
      date: normalizeDateValue(parsed.data.date),
      owner: String(parsed.data.owner ?? ""),
      ownerRole: String(parsed.data.ownerRole ?? ""),
      status: String(parsed.data.status ?? ""),
      summary: String(parsed.data.summary ?? ""),
      relatedTeams: toArray<string>(parsed.data.relatedTeams).map(String),
      relatedRepos: toArray<string>(parsed.data.relatedRepos).map(String),
      tags: toArray<string>(parsed.data.tags).map(String),
      attentionTags: toArray<string>(parsed.data.attentionTags).map(String),
      lastUpdated: parsed.data.lastUpdated ? normalizeDateValue(parsed.data.lastUpdated) : undefined,
      version: typeof parsed.data.version === "string" ? parsed.data.version : undefined,
      reviewStatus: typeof parsed.data.reviewStatus === "string" ? parsed.data.reviewStatus : undefined,
      links: validateLinks(parsed.data.links),
      evidence: validateLinks(parsed.data.evidence),
      actionItems: validateActionItems(parsed.data.actionItems),
      featured: parsed.data.featured === true,
      archived: parsed.data.archived === true,
      markers: resolveMarkers(parsed.data),
      body: parsed.content.trim(),
      sourcePath,
    });
  }

  entries.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  const index: GeneratedContentIndex = {
    generatedAt: new Date().toISOString(),
    entries,
    taxonomies: {
      types: countBy(entries.map((entry) => entry.type)),
      tags: countBy(entries.flatMap((entry) => entry.tags)),
      attentionTags: countBy(entries.flatMap((entry) => entry.attentionTags)),
      teams: countBy(entries.flatMap((entry) => entry.relatedTeams)),
      years: countBy(entries.map((entry) => entry.date.slice(0, 4))),
      collections: countBy(entries.map((entry) => entry.collection)),
    },
  };

  return { index, problems };
}

export async function writeContentIndex(index: GeneratedContentIndex): Promise<void> {
  const outputPath = path.join(process.cwd(), "src/generated/content-index.generated.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

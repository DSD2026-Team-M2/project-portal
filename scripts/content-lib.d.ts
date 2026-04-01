declare const SUPPORTED_LOCALES: readonly ["en", "zh-CN", "pt"];
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
export declare function buildContentIndex(): Promise<BuildResult>;
export declare function writeContentIndex(index: GeneratedContentIndex): Promise<void>;
export {};

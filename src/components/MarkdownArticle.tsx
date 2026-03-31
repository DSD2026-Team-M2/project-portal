import { ArrowLeft, ArrowRight, Copy } from "lucide-react";
import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { textVide } from "text-vide";

import { useReadingPreferences } from "../contexts/ReadingPreferencesContext";
import type { SupportedLanguage } from "../i18n/language";
import type { GeneratedContentEntry } from "../utils/content";
import { formatDate } from "../utils/date";
import { isExternalHref } from "../utils/links";
import { ArticleShell } from "./ArticleShell";
import { AttentionTag } from "./AttentionTag";
import { BionicReadingToggle } from "./BionicReadingToggle";
import { ExternalLinkPill } from "./ExternalLinkPill";
import { InternalLinkPill } from "./InternalLinkPill";
import { MetadataPanel } from "./MetadataPanel";
import { StaticTag } from "./StaticTag";
import { StatusBadge } from "./StatusBadge";

type NeighborEntry = {
  title: string;
  slug: string;
};

type MarkdownArticleProps = {
  entry: GeneratedContentEntry;
  language: SupportedLanguage;
  isFallback?: boolean;
  routeBase: "logs" | "docs";
  backHref: string;
  backLabel: string;
  previous?: NeighborEntry | null;
  next?: NeighborEntry | null;
};

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;
type HeadingTag = "h1" | "h2" | "h3" | "h4";

const autolinkContent = [
  {
    type: "element",
    tagName: "span",
    properties: {
      "aria-hidden": "true",
    },
    children: [{ type: "text", value: "#" }],
  },
] as unknown[];

const BIONIC_MIN_WORDS = 12;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function renderBionicText(text: string, key: string): ReactNode {
  if (countWords(text) < BIONIC_MIN_WORDS) return text;

  const highlightedText = textVide(text, {
    sep: ['<span class="bionic-focus">', "</span>"],
  });

  return <span key={key} className="bionic-text" dangerouslySetInnerHTML={{ __html: highlightedText }} />;
}

function transformBionicChildren(children: ReactNode, enabled: boolean): ReactNode {
  if (!enabled) return children;

  return Children.map(children, (child, index) => {
    if (typeof child === "string") {
      return renderBionicText(child, `bionic-${index}`);
    }

    if (!isValidElement(child)) return child;

    const props = child.props as { children?: ReactNode };
    if (props.children === undefined) return child;

    return cloneElement(child as ReactElement<{ children?: ReactNode }>, {
      ...props,
      children: transformBionicChildren(props.children, enabled),
    });
  });
}

function ArticleHeading(level: HeadingTag, className: string) {
  return function HeadingRenderer({ children, ...props }: HeadingProps) {
    return createElement(level, { ...props, className: `anchor-target ${className}` }, children);
  };
}

function ArticleLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "#";

  if (isExternalHref(href)) {
    return (
      <a {...props} href={href} target="_blank" rel="noreferrer" className="article-link">
        {props.children}
      </a>
    );
  }

  return (
    <a {...props} href={href} className="article-link">
      {props.children}
    </a>
  );
}

export function MarkdownArticle({
  entry,
  language,
  isFallback = false,
  routeBase,
  backHref,
  backLabel,
  previous,
  next,
}: MarkdownArticleProps) {
  const { t } = useTranslation();
  const { isBionicEnabled } = useReadingPreferences();
  const [copied, setCopied] = useState(false);
  const isEnglishArticle = entry.locale === "en";
  const bionicEnabled = isEnglishArticle && isBionicEnabled;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const sidebar = (
    <>
      <MetadataPanel title={t("common.metadata")}>
        <p>
          <span className="font-semibold text-slate-900">{t("common.owner")}:</span> {entry.owner}
        </p>
        <p>
          <span className="font-semibold text-slate-900">{t("common.sprint")}:</span> {entry.sprint}
        </p>
        <p>
          <span className="font-semibold text-slate-900">{t("common.relatedTeams")}:</span> {entry.relatedTeams.join(", ")}
        </p>
        <p>
          <span className="font-semibold text-slate-900">{t("common.relatedRepos")}:</span> {entry.relatedRepos.join(", ")}
        </p>
        {entry.version ? (
          <p>
            <span className="font-semibold text-slate-900">{t("common.version")}:</span> {entry.version}
          </p>
        ) : null}
      </MetadataPanel>

      {entry.links.length > 0 ? (
        <MetadataPanel title={t("common.links")}>
          <div className="flex flex-wrap gap-2">
            {entry.links.map((item) =>
              isExternalHref(item.href) ? (
                <ExternalLinkPill key={item.href} href={item.href}>
                  {item.label}
                </ExternalLinkPill>
              ) : (
                <InternalLinkPill key={item.href} to={item.href}>
                  {item.label}
                </InternalLinkPill>
              ),
            )}
          </div>
        </MetadataPanel>
      ) : null}

      {entry.evidence.length > 0 ? (
        <MetadataPanel title={t("common.evidence")}>
          <div className="flex flex-wrap gap-2">
            {entry.evidence.map((item) =>
              isExternalHref(item.href) ? (
                <ExternalLinkPill key={item.href} href={item.href}>
                  {item.label}
                </ExternalLinkPill>
              ) : (
                <InternalLinkPill key={item.href} to={item.href}>
                  {item.label}
                </InternalLinkPill>
              ),
            )}
          </div>
        </MetadataPanel>
      ) : null}

      {entry.actionItems.length > 0 ? (
        <MetadataPanel title={t("common.actionItems")}>
          <ul className="space-y-3">
            {entry.actionItems.map((item) => (
              <li key={`${item.owner}-${item.task}`}>
                <span className="font-semibold text-slate-900">{item.owner}</span>: {item.task}
                {item.due ? ` · ${item.due}` : ""}
              </li>
            ))}
          </ul>
        </MetadataPanel>
      ) : null}
    </>
  );

  const footer = previous || next ? (
    <div className="grid gap-4 md:grid-cols-2">
      {previous ? (
        <Link to={`/${routeBase}/${previous.slug}`} className="nav-link-card">
          <p className="text-sm text-slate-500">{t("common.previous")}</p>
          <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            <span>{previous.title}</span>
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={`/${routeBase}/${next.slug}`} className="nav-link-card text-right">
          <p className="text-sm text-slate-500">{t("common.next")}</p>
          <p className="mt-2 inline-flex items-center gap-2 font-semibold text-slate-900">
            <span>{next.title}</span>
            <ArrowRight className="h-4 w-4" />
          </p>
        </Link>
      ) : null}
    </div>
  ) : null;

  const header = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Link to={backHref} className="internal-link-pill">
          <ArrowLeft className="h-4 w-4" />
          <span>{backLabel}</span>
        </Link>
        <StaticTag label={formatDate(entry.date, language)} tone="blue" />
        <StaticTag label={t(`types.${entry.type}`)} />
        <StaticTag label={entry.ownerRole} />
        {entry.reviewStatus ? <StatusBadge value={entry.reviewStatus} /> : <StatusBadge value={entry.status} />}
        {entry.markers.map((marker) => (
          <StaticTag key={marker} label={marker.toUpperCase()} tone="violet" />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{entry.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{entry.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleCopyLink} className="external-link-pill">
            <Copy className="h-4 w-4" />
            <span>{copied ? t("common.linkCopied") : t("common.copyLink")}</span>
          </button>
          <BionicReadingToggle visible={isEnglishArticle} />
        </div>
      </div>

      {isFallback ? (
        <div className="callout-box mt-6">
          <p className="text-sm leading-7 text-amber-800">{t("common.showingEnglishFallback")}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <StaticTag key={tag} label={tag} />
        ))}
        {entry.attentionTags.map((tag) => (
          <AttentionTag key={tag} label={tag} />
        ))}
      </div>
    </>
  );

  const articleClassName = useMemo(
    () => `article-prose ${bionicEnabled ? "article-prose-bionic" : ""}`,
    [bionicEnabled],
  );

  return (
    <ArticleShell header={header} sidebar={sidebar} footer={footer}>
      <article className={articleClassName}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "append",
                properties: { className: ["inline-anchor"], "aria-label": t("common.copyLink") },
                content: autolinkContent,
              },
            ],
          ]}
          components={{
            h1: ArticleHeading("h1", "mt-8 text-3xl font-semibold tracking-tight text-slate-950"),
            h2: ArticleHeading("h2", "mt-10 text-2xl font-semibold tracking-tight text-slate-950"),
            h3: ArticleHeading("h3", "mt-8 text-xl font-semibold tracking-tight text-slate-900"),
            h4: ArticleHeading("h4", "mt-6 text-lg font-semibold tracking-tight text-slate-900"),
            p: ({ children }) => <p className="mt-5">{transformBionicChildren(children, bionicEnabled)}</p>,
            li: ({ children }) => <li>{transformBionicChildren(children, bionicEnabled)}</li>,
            a: (props) => <ArticleLink {...props} />,
            ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
            blockquote: ({ children }) => (
              <blockquote className="mt-6 border-l-4 border-sky-200 bg-sky-50/70 px-5 py-4 text-slate-700">
                {transformBionicChildren(children, bionicEnabled)}
              </blockquote>
            ),
            hr: () => <hr className="my-8 border-slate-200" />,
            table: ({ children }) => (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white/90">
                <table className="min-w-full border-collapse text-left text-sm">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">{children}</th>
            ),
            td: ({ children }) => <td className="border-b border-slate-100 px-4 py-3 align-top">{children}</td>,
            code: ({ className, children }) => (
              <code className={`rounded bg-slate-100 px-1.5 py-0.5 text-[0.92em] text-slate-900 ${className ?? ""}`}>
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 px-5 py-4 text-sm text-slate-100">
                {children}
              </pre>
            ),
          }}
        >
          {entry.body}
        </ReactMarkdown>
      </article>
    </ArticleShell>
  );
}

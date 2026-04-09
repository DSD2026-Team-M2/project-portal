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
import { Link, useLocation } from "react-router-dom";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { textVide } from "text-vide";

import { useReadingPreferences } from "../contexts/ReadingPreferencesContext";
import type { SupportedLanguage } from "../i18n/language";
import type { GeneratedContentEntry } from "../utils/content";
import { formatDate } from "../utils/date";
import { isExternalHref, resolveAssetHref } from "../utils/links";
import { ArticleShell } from "./ArticleShell";
import { AttentionTag } from "./AttentionTag";
import { BionicReadingToggle } from "./BionicReadingToggle";
import { ExternalLinkPill } from "./ExternalLinkPill";
import { InternalLinkPill } from "./InternalLinkPill";
import { MetadataPanel } from "./MetadataPanel";
import { StaticTag } from "./StaticTag";
import { StatusBadge } from "./StatusBadge";
import { UseCaseFlowPreview } from "./UseCaseFlowPreview";

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
type MarkdownSegment =
  | { kind: "markdown"; content: string }
  | { kind: "usecase-flow"; imageSrc: string; title: string };

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

function ArticleHeading(level: HeadingTag, className: string, resolveHref: (id: string) => string) {
  return function HeadingRenderer({ children, id, ...props }: HeadingProps) {
    return createElement(
      level,
      { ...props, id, className: `anchor-target ${className}` },
      <>
        {children}
        {typeof id === "string" ? (
          <a href={resolveHref(id)} className="inline-anchor" aria-label={id}>
            <span aria-hidden="true">¶</span>
          </a>
        ) : null}
      </>,
    );
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

function splitMarkdownSegments(body: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  const blockPattern = /:::usecase-flow\s*\r?\n([\s\S]*?):::/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(body)) !== null) {
    const markdownBefore = body.slice(cursor, match.index);
    const definition = match[1]?.trim() ?? "";
    const lines = definition
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const titleLine = lines.find((line) => line.startsWith("title:"));
    const imageLine = lines.find((line) => line.startsWith("image:"));

    if (markdownBefore.trim()) {
      segments.push({ kind: "markdown", content: markdownBefore });
    }

    if (titleLine && imageLine) {
      segments.push({
        kind: "usecase-flow",
        title: titleLine.replace("title:", "").trim(),
        imageSrc: imageLine.replace("image:", "").trim(),
      });
    } else {
      segments.push({ kind: "markdown", content: match[0] });
    }

    cursor = match.index + match[0].length;
  }

  const trailingMarkdown = body.slice(cursor);
  if (trailingMarkdown.trim()) {
    segments.push({ kind: "markdown", content: trailingMarkdown });
  }

  return segments.length > 0 ? segments : [{ kind: "markdown", content: body }];
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
  const location = useLocation();
  const { isBionicEnabled } = useReadingPreferences();
  const [copied, setCopied] = useState(false);
  const isEnglishArticle = entry.locale === "en";
  const bionicEnabled = isEnglishArticle && isBionicEnabled;
  const contentSegments = useMemo(() => splitMarkdownSegments(entry.body), [entry.body]);

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
  const resolveHeadingHref = (id: string) => `#${location.pathname}#${id}`;
  const markdownComponents = {
    h1: ArticleHeading("h1", "mt-8 text-4xl font-bold tracking-tight text-slate-950", resolveHeadingHref),
    h2: ArticleHeading("h2", "mt-12 text-[2rem] font-bold tracking-tight text-slate-950", resolveHeadingHref),
    h3: ArticleHeading("h3", "mt-9 text-[1.45rem] font-bold tracking-tight text-slate-950", resolveHeadingHref),
    h4: ArticleHeading("h4", "mt-7 text-[1.18rem] font-bold tracking-tight text-slate-900", resolveHeadingHref),
    p: ({ children }: { children?: ReactNode }) => <p className="mt-5">{transformBionicChildren(children, bionicEnabled)}</p>,
    li: ({ children }: { children?: ReactNode }) => <li>{transformBionicChildren(children, bionicEnabled)}</li>,
    a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <ArticleLink {...props} />,
    ul: ({ children }: { children?: ReactNode }) => <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>,
    ol: ({ children }: { children?: ReactNode }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="mt-6 border-l-4 border-sky-200 bg-sky-50/70 px-5 py-4 text-slate-700">
        {transformBionicChildren(children, bionicEnabled)}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-slate-200" />,
    table: ({ children }: { children?: ReactNode }) => (
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-300 bg-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
        <table className="min-w-full border-collapse text-left text-[0.98rem]">{children}</table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th className="border border-slate-300 px-4 py-3.5 font-bold text-slate-950">{children}</th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="border border-slate-200 px-4 py-3.5 align-top text-slate-700">{children}</td>
    ),
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <img
        src={resolveAssetHref(src ?? "")}
        alt={alt ?? ""}
        loading="lazy"
        className="mt-6 max-w-full rounded-2xl border border-slate-200 bg-white/95 shadow-[0_8px_24px_rgba(148,163,184,0.08)]"
      />
    ),
    code: ({ className, children }: { className?: string; children?: ReactNode }) => (
      <code className={`rounded bg-slate-100 px-1.5 py-0.5 text-[0.92em] text-slate-900 ${className ?? ""}`}>
        {children}
      </code>
    ),
    pre: ({ children }: { children?: ReactNode }) => (
      <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 px-5 py-4 text-sm text-slate-100">
        {children}
      </pre>
    ),
  };

  return (
    <ArticleShell header={header} sidebar={sidebar} footer={footer}>
      <article className={articleClassName}>
        {contentSegments.map((segment, index) =>
          segment.kind === "markdown" ? (
            <ReactMarkdown
              key={`markdown-${index}`}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
              components={markdownComponents}
            >
              {segment.content}
            </ReactMarkdown>
          ) : (
            <UseCaseFlowPreview
              key={`usecase-flow-${segment.title}-${index}`}
              title={segment.title}
              imageSrc={segment.imageSrc}
            />
          ),
        )}
      </article>
    </ArticleShell>
  );
}

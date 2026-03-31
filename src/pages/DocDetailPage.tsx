import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getContentEntryBySlug, getNeighborEntries } from "../content/queries";
import { MarkdownArticle } from "../components/MarkdownArticle";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { NotFoundPage } from "./NotFoundPage";

export function DocDetailPage() {
  const { i18n, t } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const { slug = "" } = useParams();
  const { entry, isFallback } = getContentEntryBySlug("docs", slug, language);
  const neighbors = getNeighborEntries("docs", slug, language);

  useDocumentTitle("meta.pages.docDetail.title", { descriptionKey: "meta.pages.docDetail.description" });

  if (!entry) {
    return <NotFoundPage />;
  }

  return (
    <MarkdownArticle
      entry={entry}
      language={language}
      isFallback={isFallback}
      routeBase="docs"
      backHref="/docs"
      backLabel={t("common.backToDocs")}
      previous={neighbors.previous}
      next={neighbors.next}
    />
  );
}

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getContentEntryBySlug, getNeighborEntries } from "../content/queries";
import { MarkdownArticle } from "../components/MarkdownArticle";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { NotFoundPage } from "./NotFoundPage";

export function LogDetailPage() {
  const { i18n, t } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const { slug = "" } = useParams();
  const { entry, isFallback } = getContentEntryBySlug("logs", slug, language);
  const neighbors = getNeighborEntries("logs", slug, language);

  useDocumentTitle("meta.pages.logDetail.title", { descriptionKey: "meta.pages.logDetail.description" });

  if (!entry) {
    return <NotFoundPage />;
  }

  return (
    <MarkdownArticle
      entry={entry}
      language={language}
      isFallback={isFallback}
      routeBase="logs"
      backHref="/logs"
      backLabel={t("common.backToLogs")}
      previous={neighbors.previous}
      next={neighbors.next}
    />
  );
}

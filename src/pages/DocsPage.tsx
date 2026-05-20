import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getResolvedEntries } from "../content/queries";
import { siteMode } from "../config/siteMode";
import { docCategoryOrder } from "../data/portalData";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { DocListItem } from "../components/DocListItem";
import { FilterChip } from "../components/FilterChip";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";

export function DocsPage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const entries = getResolvedEntries("docs", language);
  const [category, setCategory] = useState<string>("all");

  useDocumentTitle("meta.pages.docs.title", { descriptionKey: "meta.pages.docs.description" });

  const filteredEntries = useMemo(
    () => entries.filter((entry) => category === "all" || entry.type === category),
    [category, entries],
  );

  const currentEntries = filteredEntries.filter((entry) => !entry.archived && entry.status !== "archived");
  const archivedEntries = filteredEntries.filter((entry) => entry.archived || entry.status === "archived");

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle
          title={t("docs.title")}
          action={siteMode.showTemplateExamples ? <InternalLinkPill to="/examples">{t("common.openExamples")}</InternalLinkPill> : undefined}
        />
        <SectionLead>{t("docs.lead")}</SectionLead>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip label={t("common.all")} selected={category === "all"} onClick={() => setCategory("all")} />
          {docCategoryOrder.map((item) => (
            <FilterChip
              key={item}
              label={t(`docs.categories.${item}`)}
              selected={category === item}
              onClick={() => setCategory(item)}
            />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle
          title={t("docs.current.title")}
          action={siteMode.showTemplateExamples ? <InternalLinkPill to="/examples">{t("common.viewTemplates")}</InternalLinkPill> : undefined}
        />
        <SectionLead>{t("docs.current.lead", { count: currentEntries.length })}</SectionLead>

        {currentEntries.length > 0 ? (
          <div className="mt-6 space-y-4">
            {currentEntries.map((entry) => (
              <DocListItem
                key={entry.slug}
                entry={entry}
                language={language}
                showFallback={entry.locale !== language && language !== "en"}
              />
            ))}
          </div>
        ) : (
          <div className="home-empty-state mt-6" data-empty-state>
            {t("docs.current.emptyFiltered")}
          </div>
        )}
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("docs.archived.title")} />
        <SectionLead>{t("docs.archived.lead", { count: archivedEntries.length })}</SectionLead>

        {archivedEntries.length > 0 ? (
          <div className="mt-6 space-y-4">
            {archivedEntries.map((entry) => (
              <div key={entry.slug} className="opacity-85">
                <DocListItem
                  entry={entry}
                  language={language}
                  showFallback={entry.locale !== language && language !== "en"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty-state mt-6" data-empty-state>
            {t("docs.archived.emptyFiltered")}
          </div>
        )}
      </RevealOnScroll>
    </main>
  );
}

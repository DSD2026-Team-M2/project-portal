import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getExampleEntries } from "../content/queries";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { DocListItem } from "../components/DocListItem";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { LogListItem } from "../components/LogListItem";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { StaticTag } from "../components/StaticTag";

export function ExamplesPage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const entries = getExampleEntries(language);

  useDocumentTitle("meta.pages.examples.title", { descriptionKey: "meta.pages.examples.description" });

  const grouped = useMemo(
    () => ({
      docs: entries.filter((entry) => entry.routeBase === "docs"),
      logs: entries.filter((entry) => entry.routeBase === "logs"),
    }),
    [entries],
  );

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle
          title={t("examples.title")}
          action={<InternalLinkPill to="/docs">{t("common.browseDocuments")}</InternalLinkPill>}
        />
        <SectionLead>{t("examples.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("examples.policyTitle")}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{t("examples.policyBody")}</p>
          </div>
          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("examples.authoringTitle")}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{t("examples.authoringBody")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StaticTag label="TEMPLATE" tone="violet" />
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("examples.docsTitle")} />
        <SectionLead>{t("examples.docsLead", { count: grouped.docs.length })}</SectionLead>

        <div className="mt-6 space-y-4">
          {grouped.docs.map((entry) => (
            <DocListItem key={entry.slug} entry={entry} language={language} showFallback={entry.locale !== language && language !== "en"} />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("examples.logsTitle")} />
        <SectionLead>{t("examples.logsLead", { count: grouped.logs.length })}</SectionLead>

        <div className="mt-6 divide-y divide-slate-200/80">
          {grouped.logs.map((entry) => (
            <LogListItem key={entry.slug} entry={entry} language={language} showFallback={entry.locale !== language && language !== "en"} />
          ))}
        </div>
      </RevealOnScroll>
    </main>
  );
}

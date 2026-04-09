import { useTranslation } from "react-i18next";

import { siteMode } from "../config/siteMode";
import {
  ganttTasks,
  milestones,
  progressDatasetMeta,
  progressOverview,
  riskRegister,
} from "../data/progressData";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { resolveLocalizedText } from "../utils/content";
import { GanttPanel } from "../components/GanttPanel";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { StaticTag } from "../components/StaticTag";
import { StatusBadge } from "../components/StatusBadge";

export function ProgressPage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const hideSimulatedProgress = siteMode.hideSimulatedData && progressDatasetMeta.sample;

  useDocumentTitle("meta.pages.progress.title", { descriptionKey: "meta.pages.progress.description" });

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle
          title={t("progress.overview.title")}
          action={siteMode.showTemplateExamples ? <InternalLinkPill to="/examples">{t("common.viewTemplates")}</InternalLinkPill> : undefined}
        />
        <SectionLead>{t("progress.overview.lead")}</SectionLead>

        {hideSimulatedProgress ? (
          <div className="callout-box mt-6">
            <p className="text-sm leading-7 text-slate-700">{t("progress.hiddenDataNote")}</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("progress.overview.phase")}</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                  {resolveLocalizedText(progressOverview.currentStage, language)}
                </p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("progress.overview.goal")}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(progressOverview.stageGoal, language)}</p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("progress.overview.nextMilestone")}</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                  {resolveLocalizedText(milestones[1].title, language)}
                </p>
                <p className="mt-2 text-sm text-slate-500">{milestones[1].dateLabel}</p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("progress.overview.risk")}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(progressOverview.currentRisk, language)}</p>
              </div>
            </div>

            {progressDatasetMeta.sample ? (
              <div className="callout-box mt-6">
                <p className="text-sm leading-7 text-amber-800">{resolveLocalizedText(progressDatasetMeta.note, language)}</p>
              </div>
            ) : null}
          </>
        )}
      </RevealOnScroll>

      <RevealOnScroll as="section" id="timeline" className="section-shell anchor-target p-6 sm:p-8">
        <GanttPanel tasks={ganttTasks} />
      </RevealOnScroll>

      <RevealOnScroll as="section" id="milestones" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle title={t("progress.milestones.title")} />
        <SectionLead>{t("progress.milestones.lead")}</SectionLead>

        <div className="callout-box mt-6">
          <p className="text-sm leading-7 text-slate-700">{t("progress.hiddenSections.milestones")}</p>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="risk-register" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle title={t("progress.risks.title")} />
        <SectionLead>{t("progress.risks.lead")}</SectionLead>

        {hideSimulatedProgress ? (
          <div className="callout-box mt-6">
            <p className="text-sm leading-7 text-slate-700">{t("progress.hiddenSections.risks")}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {riskRegister.map((risk) => (
              <article key={risk.riskId} className="surface-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{risk.riskId}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                      {resolveLocalizedText(risk.title, language)}
                    </h3>
                  </div>
                  <StatusBadge value={risk.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StaticTag label={t(`progress.severity.${risk.severity}`)} tone={risk.severity === "high" ? "violet" : "default"} />
                  <StaticTag label={risk.owner} />
                  <StaticTag label={risk.lastUpdated} />
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{resolveLocalizedText(risk.mitigation, language)}</p>
              </article>
            ))}
          </div>
        )}
      </RevealOnScroll>
    </main>
  );
}

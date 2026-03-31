import {
  Activity,
  Boxes,
  FolderKanban,
  GitBranch,
  Network,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { externalLinks, partnerTeamLinks } from "../config/links";
import { siteMode } from "../config/siteMode";
import { getLatestUpdates, getResolvedEntries } from "../content/queries";
import {
  interfaces,
  layerSummaries,
  m2Contribution,
  positioningSummaryCards,
  projectMeta,
  projectPositioning,
  repositories,
  teams,
} from "../data/portalData";
import { progressOverview, riskRegister } from "../data/progressData";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { resolveLocalizedText } from "../utils/content";
import { AttentionTag } from "../components/AttentionTag";
import { DocListItem } from "../components/DocListItem";
import { ExternalLinkPill } from "../components/ExternalLinkPill";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { LogListItem } from "../components/LogListItem";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { StaticTag } from "../components/StaticTag";
import { StatusBadge } from "../components/StatusBadge";

type SystemDetailItem = {
  id: string;
  label: string;
  summary: string;
  supporting: string[];
  status: string;
  link: string;
};

const iconMap = {
  system: Network,
  progress: Activity,
  docs: FolderKanban,
  teams: Boxes,
} as const;

export function HomePage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const [selectedSystemNode, setSelectedSystemNode] = useState("M2");

  useDocumentTitle("meta.pages.home.title", { descriptionKey: "meta.pages.home.description" });

  const latestUpdates = getLatestUpdates(language, 5);
  const docs = getResolvedEntries("docs", language).slice(0, 4);
  const highlightedRisk = siteMode.hideSimulatedData ? null : riskRegister[0];

  const systemDetailItems = useMemo<SystemDetailItem[]>(
    () => [
      ...teams.map((team) => ({
        id: team.id,
        label: team.id,
        summary: resolveLocalizedText(team.responsibility, language),
        supporting: [team.layer, ...team.dependsOn, ...team.dependedBy].slice(0, 4),
        status: team.status,
        link: `/architecture#team-${team.id.toLowerCase()}`,
      })),
      ...interfaces.map((item) => ({
        id: item.id,
        label: item.id,
        summary: resolveLocalizedText(item.m2Usage, language),
        supporting: item.relatedTeams,
        status: "active",
        link: `/architecture#${item.id.toLowerCase()}-dependencies`,
      })),
      ...repositories.map((repo) => ({
        id: repo.id,
        label: repo.id,
        summary: resolveLocalizedText(repo.summary, language),
        supporting: [repo.maintainedBy, ...repo.dependencies].slice(0, 4),
        status: repo.status,
        link: `/architecture#repo-${repo.id}`,
      })),
    ],
    [language],
  );

  const selectedNode = systemDetailItems.find((item) => item.id === selectedSystemNode) ?? systemDetailItems[0];

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" id="top-status" className="section-shell anchor-target p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_20rem]">
          <div>
            <div className="flex flex-wrap gap-2">
              <StaticTag label={resolveLocalizedText(projectMeta.courseName, language)} tone="blue" />
              <StaticTag label={resolveLocalizedText(projectMeta.term, language)} />
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {projectMeta.projectName}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">{t("home.topStatusLead")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ExternalLinkPill href={externalLinks.mainWebRepo.href}>{t("quickLinks.main-web")}</ExternalLinkPill>
              <ExternalLinkPill href={externalLinks.portalRepo.href}>{t("quickLinks.portal-repo")}</ExternalLinkPill>
              <ExternalLinkPill href={externalLinks.recruitmentSite.href}>{t("quickLinks.recruitment-site")}</ExternalLinkPill>
              <InternalLinkPill to="/docs">{t("quickLinks.docs")}</InternalLinkPill>
              <InternalLinkPill to="/calendar">{t("quickLinks.demo")}</InternalLinkPill>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.statusBar.title")}</p>
            <div className="mt-5 grid gap-4">
              <div>
                <p className="text-sm text-slate-500">{t("common.currentIteration")}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  {siteMode.hideSimulatedData ? t("home.statusBar.iterationPending") : resolveLocalizedText(progressOverview.currentStage, language)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t("common.lastUpdated")}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{projectMeta.lastUpdated}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">{t("common.maintainedBy")}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">M2</p>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="project-positioning" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("home.positioning.title")}
          action={<InternalLinkPill to="/architecture">{t("common.openArchitecture")}</InternalLinkPill>}
        />
        <SectionLead>{t("home.positioning.lead")}</SectionLead>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_22rem]">
          <div className="space-y-4">
            <div className="surface-card p-5">
              <p className="text-sm leading-7 text-slate-700">{resolveLocalizedText(projectPositioning.project, language)}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm leading-7 text-slate-700">{resolveLocalizedText(projectPositioning.portal, language)}</p>
            </div>
            <div className="callout-box">
              <p className="text-sm leading-7 text-slate-700">{resolveLocalizedText(projectPositioning.boundary, language)}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {positioningSummaryCards.map((card) => {
              const Icon = iconMap[card.id as keyof typeof iconMap];

              return (
                <div key={card.id} className="surface-card p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {t(`home.summaryCards.${card.id}.title`)}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">{resolveLocalizedText(card.stat, language)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{resolveLocalizedText(card.detail, language)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="system-map" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("home.systemMap.title")}
          action={<InternalLinkPill to="/architecture">{t("common.openArchitecture")}</InternalLinkPill>}
        />
        <SectionLead>{t("home.systemMap.lead")}</SectionLead>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {layerSummaries.map((layer) => (
                <div key={layer.id} className="surface-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {resolveLocalizedText(layer.title, language)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{resolveLocalizedText(layer.summary, language)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {teams
                      .filter((team) => team.layer === layer.id)
                      .map((team) => (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => setSelectedSystemNode(team.id)}
                          className={`filter-chip ${selectedSystemNode === team.id ? "filter-chip-active" : ""}`}
                        >
                          {team.id}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {interfaces.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSystemNode(item.id)}
                  className={`surface-card p-5 text-left ${selectedSystemNode === item.id ? "ring-1 ring-sky-200" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{item.id}</p>
                    <StatusBadge value="active" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{resolveLocalizedText(item.summary, language)}</p>
                </button>
              ))}
            </div>

            <div className="surface-card p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <GitBranch className="h-4 w-4" />
                <span>{t("home.systemMap.relatedRepos")}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {repositories.map((repo) => (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => setSelectedSystemNode(repo.id)}
                    className={`filter-chip ${selectedSystemNode === repo.id ? "filter-chip-active" : ""}`}
                  >
                    {repo.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.systemMap.nodeDetail")}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{selectedNode.label}</h3>
              <StatusBadge value={selectedNode.status} />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{selectedNode.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedNode.supporting.map((item) => (
                <StaticTag key={item} label={item} />
              ))}
            </div>
            <div className="mt-6">
              <InternalLinkPill to={selectedNode.link}>{t("common.viewDetails")}</InternalLinkPill>
            </div>
          </aside>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="progress-snapshot" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("home.progress.title")}
          action={<InternalLinkPill to="/progress">{t("common.openFullProgress")}</InternalLinkPill>}
        />
        <SectionLead>{t("home.progress.lead")}</SectionLead>
        {siteMode.hideSimulatedData ? (
          <div className="callout-box mt-6">
            <p className="text-sm leading-7 text-slate-700">{t("home.progress.pendingNote")}</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("progress.overview.risk")}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(progressOverview.currentRisk, language)}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("common.completed")}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(m2Contribution.completed[0], language)}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("common.inProgress")}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(m2Contribution.dependencies[0], language)}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("common.risksBlockers")}</p>
              <div className="mt-3 flex items-start gap-3">
                <ShieldAlert className="mt-1 h-5 w-5 text-amber-600" />
                <p className="text-sm leading-7 text-slate-700">{resolveLocalizedText(highlightedRisk!.title, language)}</p>
              </div>
            </div>
          </div>
        )}
      </RevealOnScroll>

      <RevealOnScroll as="section" id="latest-updates" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("home.latestUpdates.title")}
          action={<InternalLinkPill to="/logs">{t("common.viewAllLogs")}</InternalLinkPill>}
        />
        <SectionLead>{t("home.latestUpdates.lead")}</SectionLead>
        <div className="mt-6 divide-y divide-slate-200/80">
          {latestUpdates.map((entry) => (
            <LogListItem
              key={entry.slug}
              entry={entry}
              language={language}
              showFallback={entry.locale !== language && language !== "en"}
            />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="deliverables-hub" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("home.deliverables.title")}
          action={<InternalLinkPill to="/docs">{t("common.browseDocuments")}</InternalLinkPill>}
        />
        <SectionLead>{t("home.deliverables.lead")}</SectionLead>
        <div className="mt-6 space-y-4">
          {docs.map((entry) => (
            <DocListItem
              key={entry.slug}
              entry={entry}
              language={language}
              showFallback={entry.locale !== language && language !== "en"}
            />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="team-links" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("home.teams.title")}
          action={<InternalLinkPill to="/team">{t("common.meetTheTeam")}</InternalLinkPill>}
        />
        <SectionLead>{t("home.teams.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.teams.teamLinks")}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {teams.map((team) => (
                <div key={team.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-slate-950">{team.id}</p>
                    {team.directInterfaceWithM2 ? <AttentionTag label={t("architecture.directM2Link")} /> : null}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{resolveLocalizedText(team.responsibility, language)}</p>
                  <div className="mt-4">
                    <InternalLinkPill to={partnerTeamLinks[team.id as keyof typeof partnerTeamLinks].href}>
                      {t("common.viewDetails")}
                    </InternalLinkPill>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.teams.repositoryLinks")}</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">project-main-web</p>
                  <StatusBadge value="active" />
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">{resolveLocalizedText(repositories[0].summary, language)}</p>
                <div className="mt-4">
                  <ExternalLinkPill href={externalLinks.mainWebRepo.href}>project-main-web</ExternalLinkPill>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">project-portal</p>
                  <StatusBadge value="active" />
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">{resolveLocalizedText(repositories[1].summary, language)}</p>
                <div className="mt-4">
                  <ExternalLinkPill href={externalLinks.portalRepo.href}>project-portal</ExternalLinkPill>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">m2-recruitment</p>
                  <StatusBadge value="archived" />
                </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{resolveLocalizedText(repositories[2].summary, language)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ExternalLinkPill href={externalLinks.recruitmentRepo.href}>
                      {externalLinks.recruitmentRepo.label}
                    </ExternalLinkPill>
                    <ExternalLinkPill href={externalLinks.recruitmentSite.href}>
                      {externalLinks.recruitmentSite.label}
                    </ExternalLinkPill>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="m2-contribution" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("home.m2.title")}
          action={<InternalLinkPill to="/architecture#team-m2">{t("common.openArchitecture")}</InternalLinkPill>}
        />
        <SectionLead>{t("home.m2.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_22rem]">
          <div className="space-y-4">
            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.m2.responsibilities")}</p>
              <div className="mt-4 space-y-3">
                {m2Contribution.responsibilities.map((item) => (
                  <p key={item.en} className="text-sm leading-7 text-slate-700">
                    {resolveLocalizedText(item, language)}
                  </p>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.m2.dependencies")}</p>
              <div className="mt-4 space-y-3">
                {m2Contribution.dependencies.map((item) => (
                  <p key={item.en} className="text-sm leading-7 text-slate-700">
                    {resolveLocalizedText(item, language)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="callout-box">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.m2.completed")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {m2Contribution.completed.map((item) => (
                  <StaticTag key={item.en} label={resolveLocalizedText(item, language)} tone="blue" />
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("home.m2.uncovered")}</p>
              <div className="mt-4 space-y-3">
                {m2Contribution.uncovered.map((item) => (
                  <AttentionTag key={item.en} label={resolveLocalizedText(item, language)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </main>
  );
}

import { ArrowRightLeft, Database, MonitorSmartphone, RadioTower, Waypoints } from "lucide-react";
import { useTranslation } from "react-i18next";

import { externalLinks } from "../config/links";
import {
  interfaces,
  layerSummaries,
  repositories,
  roleMatrix,
  teams,
} from "../data/portalData";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { resolveLocalizedText } from "../utils/content";
import { AttentionTag } from "../components/AttentionTag";
import { ExternalLinkPill } from "../components/ExternalLinkPill";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { StaticTag } from "../components/StaticTag";
import { StatusBadge } from "../components/StatusBadge";

const layerIconMap = {
  sensor: RadioTower,
  server: Database,
  monitor: MonitorSmartphone,
} as const;

export function ArchitecturePage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  useDocumentTitle("meta.pages.architecture.title", { descriptionKey: "meta.pages.architecture.description" });

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" id="overall-system-overview" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle
          title={t("architecture.overview.title")}
          action={<InternalLinkPill to="/team">{t("common.meetTheTeam")}</InternalLinkPill>}
        />
        <SectionLead>{t("architecture.overview.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)_3.5rem_minmax(0,1fr)]">
          {layerSummaries.map((layer, index) => {
            const Icon = layerIconMap[layer.id as keyof typeof layerIconMap];

            return (
              <div key={layer.id} className="contents">
                <div className="surface-card p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {resolveLocalizedText(layer.title, language)}
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-950">{layer.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">{resolveLocalizedText(layer.summary, language)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {teams
                      .filter((team) => team.layer === layer.id)
                      .map((team) => (
                        <StaticTag key={team.id} label={team.id} tone={team.id === "M2" ? "blue" : "default"} />
                      ))}
                  </div>
                </div>

                {index < layerSummaries.length - 1 ? (
                  <div className="hidden items-center justify-center lg:flex">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500">
                      <Waypoints className="h-4 w-4" />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="team-responsibility-matrix" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle title={t("architecture.teamMatrix.title")} />
        <SectionLead>{t("architecture.teamMatrix.lead")}</SectionLead>

        <div className="mt-6 grid gap-4">
          {teams.map((team) => (
            <article key={team.id} id={`team-${team.id.toLowerCase()}`} className="surface-card anchor-target p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[8rem_minmax(0,1fr)_14rem]">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-slate-950">{team.id}</p>
                  <p className="mt-1 text-sm text-slate-500">{team.layer}</p>
                  <div className="mt-3">
                    <StatusBadge value={team.status} />
                  </div>
                </div>

                <div>
                  <p className="text-sm leading-7 text-slate-700">{resolveLocalizedText(team.responsibility, language)}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("common.primaryInputs")}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{resolveLocalizedText(team.primaryInputs, language)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("common.primaryOutputs")}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{resolveLocalizedText(team.primaryOutputs, language)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("common.dependsOnShort")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {team.dependsOn.length === 0 ? <StaticTag label="-" /> : team.dependsOn.map((item) => <StaticTag key={item} label={item} />)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("common.dependedBy")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {team.dependedBy.length === 0 ? <StaticTag label="-" /> : team.dependedBy.map((item) => <StaticTag key={item} label={item} />)}
                    </div>
                  </div>
                  {team.directInterfaceWithM2 ? <AttentionTag label={t("architecture.directM2Link")} /> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="repository-map" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle title={t("architecture.repositories.title")} />
        <SectionLead>{t("architecture.repositories.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {repositories.map((repo) => {
            const externalHref =
              repo.id === "project-main-web"
                ? externalLinks.mainWebRepo.href
                : repo.id === "project-portal"
                  ? externalLinks.portalRepo.href
                  : externalLinks.recruitmentRepo.href;

            return (
              <article key={repo.id} id={`repo-${repo.id}`} className="surface-card anchor-target p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-950">{repo.id}</p>
                  <StatusBadge value={repo.status} />
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{resolveLocalizedText(repo.role, language)}</p>
                <p className="mt-3 text-sm leading-7 text-slate-500">{resolveLocalizedText(repo.summary, language)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StaticTag label={repo.maintainedBy} />
                  {repo.dependencies.map((dependency) => (
                    <StaticTag key={dependency} label={dependency} />
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ExternalLinkPill href={externalHref}>{repo.id}</ExternalLinkPill>
                  <InternalLinkPill to={`/architecture#repo-${repo.id}`}>{t("common.viewDetails")}</InternalLinkPill>
                </div>
              </article>
            );
          })}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="interface-dependencies" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle title={t("architecture.interfaces.title")} />
        <SectionLead>{t("architecture.interfaces.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {interfaces.map((item) => (
            <article key={item.id} id={`${item.id.toLowerCase()}-dependencies`} className="surface-card anchor-target p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.id}</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{t(`architecture.interfaces.labels.${item.id}`)}</h3>
                  </div>
                </div>
                <StatusBadge value="active" />
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-700">{resolveLocalizedText(item.summary, language)}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("architecture.interfaces.source")}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.from}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("architecture.interfaces.destination")}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.to}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("architecture.interfaces.m2Usage")}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{resolveLocalizedText(item.m2Usage, language)}</p>
              </div>
            </article>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" id="role-matrix" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle title={t("architecture.roles.title")} />
        <SectionLead>{t("architecture.roles.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleMatrix.map((role) => (
            <article key={role.id} className="surface-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{role.id}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(role.description, language)}</p>
            </article>
          ))}
        </div>
      </RevealOnScroll>
    </main>
  );
}

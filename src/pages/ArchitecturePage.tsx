import { ArrowRightLeft, Database, MonitorSmartphone, RadioTower, Waypoints } from "lucide-react";
import { useTranslation } from "react-i18next";

import { externalLinks, historicalReferenceLinks, projectResourceLinks, teamResourceLinks } from "../config/links";
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

type ResourceSlot = {
  label: string;
  href?: string;
};

type ResourcePlaceholderPillProps = {
  slot: ResourceSlot;
  pendingLabel: string;
};

function ResourcePlaceholderPill({ slot, pendingLabel }: ResourcePlaceholderPillProps) {
  if (slot.href) {
    return <ExternalLinkPill href={slot.href}>{slot.label}</ExternalLinkPill>;
  }

  return (
    <span className="placeholder-link-pill" aria-disabled="true">
      <span className="min-w-0 truncate">{slot.label}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{pendingLabel}</span>
    </span>
  );
}

export function ArchitecturePage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  const teamResourceSlots: Record<string, { repo: ResourceSlot; overview: ResourceSlot }> = {
    S1: {
      repo: teamResourceLinks.S1.repo ?? { label: t("architecture.linkSlots.buttons.teamRepo") },
      overview: teamResourceLinks.S1.overview ?? { label: t("architecture.linkSlots.buttons.teamOverview") },
    },
    S2: {
      repo: teamResourceLinks.S2.repo ?? { label: t("architecture.linkSlots.buttons.teamRepo") },
      overview: teamResourceLinks.S2.overview ?? { label: t("architecture.linkSlots.buttons.teamOverview") },
    },
    V1: {
      repo: teamResourceLinks.V1.repo ?? { label: t("architecture.linkSlots.buttons.teamRepo") },
      overview: teamResourceLinks.V1.overview ?? { label: t("architecture.linkSlots.buttons.teamOverview") },
    },
    V2: {
      repo: teamResourceLinks.V2.repo ?? { label: t("architecture.linkSlots.buttons.teamRepo") },
      overview: teamResourceLinks.V2.overview ?? { label: t("architecture.linkSlots.buttons.teamOverview") },
    },
    M1: {
      repo: teamResourceLinks.M1.repo ?? { label: t("architecture.linkSlots.buttons.teamRepo") },
      overview: teamResourceLinks.M1.overview ?? { label: t("architecture.linkSlots.buttons.teamOverview") },
    },
    M2: {
      repo: teamResourceLinks.M2.repo ?? { label: "project-portal", href: externalLinks.portalRepo.href },
      overview: teamResourceLinks.M2.overview ?? { label: t("architecture.linkSlots.buttons.portalOverview"), href: "/" },
    },
  };

  const projectResourceSlots = [
    {
      id: "project-main",
      title: t("architecture.linkSlots.projectCards.main.title"),
      summary: t("architecture.linkSlots.projectCards.main.summary"),
      slots: [
        projectResourceLinks.main.repo ?? { label: t("architecture.linkSlots.buttons.projectRepo") },
        projectResourceLinks.main.overview ?? { label: t("architecture.linkSlots.buttons.projectOverview") },
      ],
    },
    {
      id: "portal",
      title: "project-portal",
      summary: t("architecture.linkSlots.projectCards.portal.summary"),
      slots: [
        projectResourceLinks.portal.repo ?? { label: "project-portal", href: externalLinks.portalRepo.href },
        projectResourceLinks.portal.overview ?? { label: t("architecture.linkSlots.buttons.portalOverview"), href: "/" },
      ],
    },
  ];
  const [mainProjectResourceCard, portalProjectResourceCard] = projectResourceSlots;

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
                      <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">
                        {resolveLocalizedText(layer.title, language)}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-950">{layer.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-[1rem] leading-8 text-slate-700">{resolveLocalizedText(layer.summary, language)}</p>
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
                  <p className="text-3xl font-bold tracking-tight text-slate-950">{team.id}</p>
                  <p className="mt-1 text-base text-slate-500">{team.layer}</p>
                  <div className="mt-3">
                    <StatusBadge value={team.status} />
                  </div>
                </div>

                <div>
                  <p className="text-[1.05rem] leading-8 text-slate-800">{resolveLocalizedText(team.responsibility, language)}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{t("common.primaryInputs")}</p>
                      <p className="mt-2 text-[1rem] leading-8 text-slate-700">{resolveLocalizedText(team.primaryInputs, language)}</p>
                    </div>
                    <div>
                      <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{t("common.primaryOutputs")}</p>
                      <p className="mt-2 text-[1rem] leading-8 text-slate-700">{resolveLocalizedText(team.primaryOutputs, language)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{t("common.dependsOnShort")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {team.dependsOn.length === 0 ? <StaticTag label="-" /> : team.dependsOn.map((item) => <StaticTag key={item} label={item} />)}
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{t("common.dependedBy")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {team.dependedBy.length === 0 ? <StaticTag label="-" /> : team.dependedBy.map((item) => <StaticTag key={item} label={item} />)}
                    </div>
                  </div>
                  {team.directInterfaceWithM2 ? <AttentionTag label={t("architecture.directM2Link")} /> : null}
                  <div>
                    <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">
                      {t("architecture.linkSlots.teamLinks")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ResourcePlaceholderPill
                        slot={teamResourceSlots[team.id].repo}
                        pendingLabel={t("architecture.linkSlots.pending")}
                      />
                      <ResourcePlaceholderPill
                        slot={teamResourceSlots[team.id].overview}
                        pendingLabel={t("architecture.linkSlots.pending")}
                      />
                    </div>
                  </div>
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
                  <p className="text-xl font-bold text-slate-950">{repo.id}</p>
                  <StatusBadge value={repo.status} />
                </div>
                <p className="mt-3 text-[1rem] leading-8 font-medium text-slate-700">{resolveLocalizedText(repo.role, language)}</p>
                <p className="mt-3 text-[0.98rem] leading-8 text-slate-600">{resolveLocalizedText(repo.summary, language)}</p>
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

      <RevealOnScroll as="section" id="reference-links" className="section-shell anchor-target p-6 sm:p-8">
        <SectionTitle title={t("architecture.linkSlots.title")} />
        <SectionLead>{t("architecture.linkSlots.lead")}</SectionLead>

        <div className="mt-6 space-y-6">
          <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">
              {t("architecture.linkSlots.projectLinks")}
            </p>
            <div className="mt-3 max-w-4xl space-y-3">
              {[mainProjectResourceCard, portalProjectResourceCard].map((card) => (
                <article key={card.id} className="surface-card p-5">
                  <p className="text-xl font-bold text-slate-950">{card.title}</p>
                  <p className="mt-2 text-[0.98rem] leading-8 text-slate-600">{card.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.slots.map((slot) => (
                      <ResourcePlaceholderPill
                        key={`${card.id}-${slot.label}`}
                        slot={slot}
                        pendingLabel={t("architecture.linkSlots.pending")}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">
              {t("architecture.linkSlots.historicalLinks")}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {historicalReferenceLinks.map((card) => (
                <article key={card.id} className="surface-card p-4 sm:p-5">
                  <p className="text-[1.35rem] font-bold tracking-tight text-slate-950">{card.label}</p>
                  <p className="mt-2 text-[0.94rem] leading-7 text-slate-600">
                    {t("architecture.linkSlots.historicalCardSummary")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ResourcePlaceholderPill
                      slot={card.repo ?? { label: t("architecture.linkSlots.buttons.teamRepo") }}
                      pendingLabel={t("architecture.linkSlots.pending")}
                    />
                    <ResourcePlaceholderPill
                      slot={card.overview ?? { label: t("architecture.linkSlots.buttons.teamOverview") }}
                      pendingLabel={t("architecture.linkSlots.pending")}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
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
                    <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{item.id}</p>
                    <h3 className="mt-1 text-[1.45rem] font-bold tracking-tight text-slate-950">{t(`architecture.interfaces.labels.${item.id}`)}</h3>
                  </div>
                </div>
                <StatusBadge value="active" />
              </div>

              <p className="mt-4 text-[1rem] leading-8 text-slate-700">{resolveLocalizedText(item.summary, language)}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{t("architecture.interfaces.source")}</p>
                  <p className="mt-2 text-[0.98rem] leading-8 text-slate-700">{item.from}</p>
                </div>
                <div>
                  <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{t("architecture.interfaces.destination")}</p>
                  <p className="mt-2 text-[0.98rem] leading-8 text-slate-700">{item.to}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{t("architecture.interfaces.m2Usage")}</p>
                <p className="mt-2 text-[1rem] leading-8 text-slate-700">{resolveLocalizedText(item.m2Usage, language)}</p>
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
              <p className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-slate-600">{role.id}</p>
              <p className="mt-3 text-[1rem] leading-8 text-slate-700">{resolveLocalizedText(role.description, language)}</p>
            </article>
          ))}
        </div>
      </RevealOnScroll>
    </main>
  );
}

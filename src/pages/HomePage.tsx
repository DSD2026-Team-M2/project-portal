import {
  ArrowRight,
  CalendarClock,
  FileText,
  FolderKanban,
  Github,
  Layers3,
  Logs,
  Network,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { InternalLinkPill } from "../components/InternalLinkPill";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { StaticTag } from "../components/StaticTag";
import { externalLinks } from "../config/links";
import { siteMode } from "../config/siteMode";
import { getLatestUpdates, getResolvedEntries } from "../content/queries";
import { calendarEvents, interfaces, layerSummaries, projectMeta } from "../data/portalData";
import { milestones, progressOverview, riskRegister } from "../data/progressData";
import { teamMembers } from "../data/teamMembers";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { SupportedLanguage } from "../i18n/language";
import { formatDate } from "../utils/date";
import { resolveLocalizedText } from "../utils/content";

type HubEntryCardProps = {
  description: string;
  icon: LucideIcon;
  label: string;
  stat: string;
  to: string;
};

function HubEntryCard({ description, icon: Icon, label, stat, to }: HubEntryCardProps) {
  return (
    <Link to={to} className="home-hub-card group">
      <div className="flex items-start justify-between gap-4">
        <div className="home-hub-card-icon">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
      </div>

      <div className="mt-5 min-w-0">
        <p className="text-lg font-semibold tracking-tight text-slate-950">{label}</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      </div>

      <div className="mt-5">
        <span className="home-hub-card-stat">{stat}</span>
      </div>
    </Link>
  );
}

function toLocalDate(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00`);
}

function formatLocalDate(value: string, language: SupportedLanguage, options?: Intl.DateTimeFormatOptions) {
  const normalized = value.includes("T") ? value : `${value}T00:00:00`;
  return formatDate(normalized, language, options);
}

export function HomePage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  useDocumentTitle("meta.pages.home.title", { descriptionKey: "meta.pages.home.description" });

  const allLogs = useMemo(() => getResolvedEntries("logs", language), [language]);
  const allDocs = useMemo(() => getResolvedEntries("docs", language), [language]);
  const latestUpdates = useMemo(() => getLatestUpdates(language, 3), [language]);
  const docs = useMemo(() => allDocs.slice(0, 4), [allDocs]);

  const latestTouchedDate = [projectMeta.lastUpdated, docs[0]?.lastUpdated, latestUpdates[0]?.lastUpdated]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
  const nextMilestone = milestones.find((item) => item.status !== "completed") ?? milestones[0];
  const activeRiskCount = riskRegister.length;
  const coreMembers = teamMembers.filter((member) => member.group === "core");
  const aiMembers = teamMembers.filter((member) => member.group === "ai");
  const facultyMembers = teamMembers.filter((member) => member.group === "faculty");
  const roleCoverageCount = new Set(coreMembers.map((member) => member.role)).size;

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const visibleCalendarEvents = useMemo(
    () =>
      calendarEvents
        .filter((event) => !(siteMode.hideSimulatedData && event.sample))
        .sort((left, right) => left.start.localeCompare(right.start)),
    [],
  );

  const calendarPreviewEvents = useMemo(() => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentMonthEvents = visibleCalendarEvents.filter((event) => event.start.slice(0, 7) === currentMonthKey);
    const currentMonthUpcoming = currentMonthEvents.filter((event) => toLocalDate(event.start) >= today);
    const sourceEvents =
      currentMonthUpcoming.length > 0
        ? currentMonthUpcoming
        : currentMonthEvents.length > 0
          ? currentMonthEvents
          : visibleCalendarEvents.filter((event) => toLocalDate(event.start) >= today);

    return sourceEvents.slice(0, 4);
  }, [currentMonthKey, visibleCalendarEvents, now]);

  const upcomingEvent = calendarPreviewEvents[0] ?? null;
  const latestLogEntry = latestUpdates[0] ?? null;

  const overviewMetrics = [
    {
      label: t("home.hero.status.phase"),
      value: resolveLocalizedText(progressOverview.currentStage, language),
    },
    {
      label: t("home.hero.status.focus"),
      value: t("home.hero.focusValue"),
    },
    {
      label: t("home.hero.status.updated"),
      value: latestTouchedDate ? formatLocalDate(latestTouchedDate, language) : projectMeta.lastUpdated,
    },
  ];

  const positioningRows = [
    {
      id: "project",
      icon: Layers3,
      title: t("home.positioning.rows.project.title"),
      text: t("home.positioning.rows.project.text"),
      stat: t("home.positioning.rows.project.stat"),
    },
    {
      id: "portal",
      icon: FileText,
      title: t("home.positioning.rows.portal.title"),
      text: t("home.positioning.rows.portal.text"),
      stat: t("home.positioning.rows.portal.stat"),
    },
    {
      id: "m2",
      icon: Users,
      title: t("home.positioning.rows.m2.title"),
      text: t("home.positioning.rows.m2.text"),
      stat: t("home.positioning.rows.m2.stat"),
    },
  ];

  const snapshotCards = [
    {
      id: "milestone",
      label: t("progress.overview.nextMilestone"),
      value: resolveLocalizedText(nextMilestone.title, language),
      detail: formatLocalDate(nextMilestone.dateLabel, language),
    },
    {
      id: "calendar",
      label: t("home.calendar.title"),
      value: upcomingEvent ? resolveLocalizedText(upcomingEvent.title, language) : t("home.calendar.empty"),
      detail: upcomingEvent
        ? formatLocalDate(upcomingEvent.start, language, { month: "short", day: "numeric" })
        : t("home.hub.emptyDetail"),
    },
    {
      id: "logs",
      label: t("home.logs.title"),
      value: latestLogEntry?.title ?? t("home.logs.empty"),
      detail: latestLogEntry ? formatLocalDate(latestLogEntry.date, language) : t("home.hub.emptyDetail"),
    },
    {
      id: "team",
      label: t("home.team.membersLabel"),
      value: t("home.team.membersValue", { count: coreMembers.length }),
      detail: t("home.team.rolesValue", { count: roleCoverageCount }),
    },
  ];

  const portalEntryCards = [
    {
      label: t("nav.progress"),
      to: "/progress",
      icon: FolderKanban,
      description: t("meta.pages.progress.description"),
      stat: resolveLocalizedText(progressOverview.currentStage, language),
    },
    {
      label: t("nav.logs"),
      to: "/logs",
      icon: Logs,
      description: t("meta.pages.logs.description"),
      stat: t("home.hub.stats.logs", { count: allLogs.length }),
    },
    {
      label: t("nav.docs"),
      to: "/docs",
      icon: FileText,
      description: t("meta.pages.docs.description"),
      stat: t("home.hub.stats.docs", { count: allDocs.length }),
    },
    {
      label: t("nav.architecture"),
      to: "/architecture",
      icon: Network,
      description: t("meta.pages.architecture.description"),
      stat: t("home.positioning.rows.project.stat"),
    },
    {
      label: t("nav.calendar"),
      to: "/calendar",
      icon: CalendarClock,
      description: t("meta.pages.calendar.description"),
      stat: t("home.hub.stats.calendar", { count: calendarPreviewEvents.length }),
    },
    {
      label: t("nav.team"),
      to: "/team",
      icon: Users,
      description: t("meta.pages.team.description"),
      stat: t("home.team.membersValue", { count: coreMembers.length }),
    },
  ];

  const architecturePoints = [
    {
      id: "if1",
      title: t("home.architecture.points.if1.title"),
      stat: "IF1",
      summary: t("home.architecture.points.if1.summary"),
    },
    {
      id: "if2",
      title: t("home.architecture.points.if2.title"),
      stat: "IF2",
      summary: t("home.architecture.points.if2.summary"),
    },
    {
      id: "m2",
      title: t("home.architecture.points.m2.title"),
      stat: "M2",
      summary: t("home.architecture.points.m2.summary"),
    },
  ];

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" immediate id="home-overview" className="section-shell anchor-target home-topboard">
        <div className="home-topboard-grid">
          <div className="home-topboard-main">
            <div className="flex flex-wrap gap-2">
              <StaticTag label={resolveLocalizedText(projectMeta.courseName, language)} tone="blue" />
              <StaticTag label={resolveLocalizedText(projectMeta.term, language)} />
              <StaticTag label={t("home.hero.riskChip", { count: activeRiskCount })} />
            </div>

            <p className="home-kicker">{t("home.hero.eyebrow")}</p>
            <h1 className="home-main-title">{projectMeta.projectName}</h1>
            <p className="home-main-subtitle">{t("home.hero.subtitle")}</p>
            <p className="home-main-boundary">{t("home.hero.boundary")}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              <InternalLinkPill to="/progress">{t("common.openFullProgress")}</InternalLinkPill>
              <InternalLinkPill to="/docs">{t("common.browseDocuments")}</InternalLinkPill>
              <InternalLinkPill to="/calendar">{t("common.viewCalendar")}</InternalLinkPill>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <InternalLinkPill to="/team">{t("common.meetTheTeam")}</InternalLinkPill>
              <a href={externalLinks.mainWebRepo.href} target="_blank" rel="noreferrer" className="external-link-pill">
                <span className="min-w-0 truncate">{t("home.hero.quickLinks.mainWeb")}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </a>
              <a href={externalLinks.portalRepo.href} target="_blank" rel="noreferrer" className="external-link-pill">
                <span className="min-w-0 truncate">{t("home.hero.quickLinks.portalRepo")}</span>
                <Github className="h-4 w-4 shrink-0" />
              </a>
            </div>

            <div className="home-metric-grid">
              {overviewMetrics.map((item) => (
                <div key={item.label} className="home-metric-card">
                  <p className="home-metric-label">{item.label}</p>
                  <p className="home-metric-value">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="home-snapshot-panel">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("home.snapshot.title")}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("home.snapshot.subtitle")}</h2>
            </div>

            <div className="mt-6 grid gap-3">
              {positioningRows.map((row) => {
                const Icon = row.icon;

                return (
                  <div key={row.id} className="home-snapshot-row">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="home-snapshot-row-icon">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{row.title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700">{row.text}</p>
                      </div>
                    </div>
                    <div className="home-snapshot-row-stat">{row.stat}</div>
                  </div>
                );
              })}
            </div>

            <div className="home-snapshot-grid">
              {snapshotCards.map((item) => (
                <div key={item.id} className="home-snapshot-card">
                  <p className="home-preview-label">{item.label}</p>
                  <p className="mt-2 text-base font-semibold leading-7 text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("home.hub.title")} />
        <SectionLead>{t("home.hub.subtitle")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {portalEntryCards.map((item) => (
            <HubEntryCard
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              description={item.description}
              stat={item.stat}
            />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="section-shell p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("home.progress.title")}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {resolveLocalizedText(progressOverview.currentStage, language)}
              </h2>
            </div>
            <InternalLinkPill to="/progress">{t("common.openFullProgress")}</InternalLinkPill>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="home-preview-metric">
              <p className="home-preview-label">{t("progress.overview.phase")}</p>
              <p className="home-preview-value">{resolveLocalizedText(progressOverview.currentStage, language)}</p>
            </div>
            <div className="home-preview-metric">
              <p className="home-preview-label">{t("progress.overview.nextMilestone")}</p>
              <p className="home-preview-value">{resolveLocalizedText(nextMilestone.title, language)}</p>
              <p className="mt-1 text-sm text-slate-500">{formatLocalDate(nextMilestone.dateLabel, language)}</p>
            </div>
            <div className="home-preview-metric">
              <p className="home-preview-label">{t("common.risksBlockers")}</p>
              <p className="home-preview-value">{t("home.progress.blockersValue", { count: activeRiskCount })}</p>
            </div>
            <div className="home-preview-metric">
              <p className="home-preview-label">{t("home.progress.summaryLabel")}</p>
              <p className="home-preview-value">{t("home.progress.summaryLine")}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {calendarPreviewEvents.length === 0 ? (
              <div className="home-empty-state">{t("home.calendar.empty")}</div>
            ) : (
              calendarPreviewEvents.slice(0, 3).map((event) => (
                <Link key={event.id} to={event.link} className="home-list-row">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{formatLocalDate(event.start, language)}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{t(`eventTypes.${event.type}`)}</span>
                    </div>
                    <p className="mt-2 truncate text-base font-semibold text-slate-950">
                      {resolveLocalizedText(event.title, language)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="section-shell p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("home.architecture.title")}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("home.architecture.summary")}</h2>
            </div>
            <InternalLinkPill to="/architecture">{t("common.openArchitecture")}</InternalLinkPill>
          </div>

          <div className="mt-6 space-y-3">
            {architecturePoints.map((point) => (
              <div key={point.id} className="home-architecture-point">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold text-slate-950">{point.title}</p>
                  <span className="home-architecture-stat">{point.stat}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{point.summary}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {interfaces.map((item) => (
              <div key={item.id} className="home-interface-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">{item.id}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {item.from} → {item.to}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{resolveLocalizedText(item.summary, language)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {layerSummaries.map((layer) => (
              <span key={layer.id} className="home-system-team">
                {resolveLocalizedText(layer.title, language)}
              </span>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_20rem]">
        <div className="section-shell p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("home.logs.title")}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("home.logs.subtitle")}</h2>
            </div>
            <InternalLinkPill to="/logs">{t("common.viewAllLogs")}</InternalLinkPill>
          </div>

          <div className="mt-6 space-y-3">
            {latestUpdates.length === 0 ? (
              <div className="home-empty-state">{t("home.logs.empty")}</div>
            ) : (
              latestUpdates.map((entry) => (
                <Link key={entry.slug} to={`/logs/${entry.slug}`} className="home-list-row">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{formatLocalDate(entry.date, language)}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{t(`types.${entry.type}`)}</span>
                    </div>
                    <p className="mt-2 truncate text-base font-semibold text-slate-950">{entry.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="section-shell p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("home.docs.title")}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("home.docs.subtitle")}</h2>
            </div>
            <InternalLinkPill to="/docs">{t("common.browseDocuments")}</InternalLinkPill>
          </div>

          <div className="mt-6 space-y-3">
            {docs.length === 0 ? (
              <div className="home-empty-state">{t("home.docs.empty")}</div>
            ) : (
              docs.map((entry) => (
                <Link key={entry.slug} to={`/docs/${entry.slug}`} className="home-list-row">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-950">{entry.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{entry.version ?? "v0.1"}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{entry.reviewStatus ?? entry.status}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="home-stack-column">
          <div className="section-shell p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("home.calendar.title")}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("home.calendar.subtitle")}</h2>
              </div>
              <InternalLinkPill to="/calendar">{t("common.viewCalendar")}</InternalLinkPill>
            </div>

            <div className="mt-6 grid gap-3">
              {calendarPreviewEvents.length === 0 ? (
                <div className="home-empty-state">{t("home.calendar.empty")}</div>
              ) : (
                calendarPreviewEvents.slice(0, 2).map((event) => (
                  <Link key={event.id} to={event.link} className="home-calendar-card">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {formatLocalDate(event.start, language, { month: "short", day: "numeric" })}
                      </p>
                      <span className="home-calendar-type">{t(`eventTypes.${event.type}`)}</span>
                    </div>
                    <p className="home-clamped-title mt-3 text-base font-semibold text-slate-950">
                      {resolveLocalizedText(event.title, language)}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p>{t("home.calendar.holidayHint")}</p>
            </div>
          </div>

          <div className="section-shell p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("home.team.title")}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("home.team.subtitle")}</h2>
              </div>
              <InternalLinkPill to="/team">{t("common.meetTheTeam")}</InternalLinkPill>
            </div>

            <div className="mt-6 space-y-3">
              <div className="home-preview-metric">
                <p className="home-preview-label">{t("home.team.membersLabel")}</p>
                <p className="home-preview-value">{t("home.team.membersValue", { count: coreMembers.length })}</p>
              </div>
              <div className="home-preview-metric">
                <p className="home-preview-label">{t("home.team.rolesLabel")}</p>
                <p className="home-preview-value">{t("home.team.rolesValue", { count: roleCoverageCount })}</p>
              </div>
              <div className="home-preview-metric">
                <p className="home-preview-label">{t("home.team.timezonesLabel")}</p>
                <p className="home-preview-value">{t("home.team.timezonesValue")}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {t("home.team.summary", { faculty: facultyMembers.length, ai: aiMembers.length })}
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </main>
  );
}

import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  ChevronDown,
  FileText,
  FolderKanban,
  Github,
  Logs,
  Network,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { RevealOnScroll } from "../components/RevealOnScroll";
import { externalLinks } from "../config/links";
import { siteMode } from "../config/siteMode";
import { getLatestUpdates, getResolvedEntries } from "../content/queries";
import { calendarEvents, interfaces, layerSummaries, projectMeta, projectPositioning, teams } from "../data/portalData";
import { milestones, progressDatasetMeta, progressOverview, riskRegister } from "../data/progressData";
import { teamMembers } from "../data/teamMembers";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { SupportedLanguage } from "../i18n/language";
import { formatDate } from "../utils/date";
import { resolveLocalizedText } from "../utils/content";

type ActionLinkProps = {
  children: ReactNode;
  href?: string;
  icon: LucideIcon;
  primary?: boolean;
  to?: string;
};

type PreviewCardProps = {
  actionLabel: string;
  actionTo: string;
  children: ReactNode;
  className?: string;
  title: string;
};

function ActionLink({ children, href, icon: Icon, primary = false, to }: ActionLinkProps) {
  const className = primary ? "home-primary-action" : "home-secondary-action";

  if (to) {
    return (
      <Link to={to} className={className}>
        <Icon className="h-4 w-4 shrink-0" />
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </a>
  );
}

function PreviewCard({ actionLabel, actionTo, children, className, title }: PreviewCardProps) {
  return (
    <section className={`section-shell home-preview-card ${className ?? ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="home-preview-card-title">{title}</h2>
        <Link to={actionTo} className="home-preview-card-link">
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>

      <div className="mt-5">{children}</div>
    </section>
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

  const allDocs = useMemo(() => getResolvedEntries("docs", language), [language]);
  const latestUpdates = useMemo(() => getLatestUpdates(language, 3), [language]);
  const docs = useMemo(() => allDocs.slice(0, 4), [allDocs]);

  const latestTouchedDate = [projectMeta.lastUpdated, docs[0]?.lastUpdated, latestUpdates[0]?.lastUpdated]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  const nextMilestone = milestones.find((item) => item.status !== "completed") ?? milestones[0];
  const hideSimulatedProgress = siteMode.hideSimulatedData && progressDatasetMeta.sample;
  const activeRiskCount = hideSimulatedProgress ? 0 : riskRegister.length;

  const coreMembers = teamMembers.filter((member) => member.group === "core");
  const roleCoverageCount = new Set(coreMembers.map((member) => member.role)).size;
  const timezoneCoverage = Array.from(new Set(coreMembers.map((member) => member.timezone))).join(" · ");

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

  const foldSummaryItems = [
    {
      id: "phase",
      label: t("progress.overview.phase"),
      value: resolveLocalizedText(progressOverview.currentStage, language),
      detail: t("home.hero.focusValue"),
    },
    {
      id: "updated",
      label: t("common.lastUpdated"),
      value: latestTouchedDate
        ? formatLocalDate(latestTouchedDate, language, { year: "numeric", month: "short", day: "numeric" })
        : projectMeta.lastUpdated,
    },
    {
      id: "maintained",
      label: t("common.maintainedBy"),
      value: t("home.hero.maintainerValue"),
    },
    {
      id: "risks",
      label: t("common.risksBlockers"),
      value: t("home.progress.blockersValue", { count: activeRiskCount }),
    },
    {
      id: "milestone",
      label: t("progress.overview.nextMilestone"),
      value: resolveLocalizedText(nextMilestone.title, language),
      detail: formatLocalDate(nextMilestone.dateLabel, language, { month: "short", day: "numeric" }),
    },
  ];

  const foldStatements = [
    {
      id: "project",
      label: t("home.positioning.rows.project.title"),
      text: resolveLocalizedText(projectPositioning.project, language),
    },
    {
      id: "portal",
      label: t("home.positioning.rows.portal.title"),
      text: resolveLocalizedText(projectPositioning.portal, language),
    },
    {
      id: "m2",
      label: t("home.positioning.rows.m2.title"),
      text: resolveLocalizedText(projectPositioning.boundary, language),
    },
  ];

  const systemLanes = layerSummaries.map((layer) => ({
    id: layer.id,
    title: resolveLocalizedText(layer.title, language),
    members: teams.filter((team) => team.layer === layer.id),
  }));

  const architecturePreviewItems = [
    { id: "if1", label: "IF1", title: t("home.architecture.points.if1.title") },
    { id: "if2", label: "IF2", title: t("home.architecture.points.if2.title") },
    { id: "m2", label: "M2", title: t("home.architecture.points.m2.title") },
  ];

  const scrollToPreviews = () => {
    document.getElementById("home-previews")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="page-shell home-page-shell">
      <RevealOnScroll as="section" immediate id="home-overview" className="section-shell anchor-target home-overview-board">
        {/* Slot B: Ambient Background Layer reserved for future subtle motion, signal lines, or low-contrast glow imagery. */}
        <div className="home-ambient-layer" aria-hidden="true">
          <span className="home-ambient-orb home-ambient-orb-left" />
          <span className="home-ambient-orb home-ambient-orb-right" />
          <span className="home-ambient-grid" />
        </div>

        <div className="home-board-grid">
          <div className="home-board-main">
            <p className="home-board-eyebrow">{resolveLocalizedText(projectMeta.overline, language)}</p>
            <h1 className="home-board-title">{projectMeta.projectName}</h1>

            <div className="home-board-statements">
              {foldStatements.map((item) => (
                <div key={item.id} className="home-board-statement">
                  <p className="home-board-statement-label">{item.label}</p>
                  <p className="home-board-statement-text">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="home-board-actions">
              <div className="home-primary-actions">
                <ActionLink to="/progress" icon={FolderKanban} primary>
                  {t("nav.progress")}
                </ActionLink>
                <ActionLink to="/logs" icon={Logs} primary>
                  {t("nav.logs")}
                </ActionLink>
                <ActionLink to="/docs" icon={FileText} primary>
                  {t("nav.docs")}
                </ActionLink>
              </div>

              <div className="home-secondary-actions">
                <ActionLink to="/architecture" icon={Network}>
                  {t("nav.architecture")}
                </ActionLink>
                <ActionLink to="/calendar" icon={CalendarClock}>
                  {t("nav.calendar")}
                </ActionLink>
                <ActionLink to="/team" icon={Users}>
                  {t("nav.team")}
                </ActionLink>
                <ActionLink href={externalLinks.mainWebRepo.href} icon={ArrowUpRight}>
                  {t("home.hero.quickLinks.mainWeb")}
                </ActionLink>
                <ActionLink href={externalLinks.portalRepo.href} icon={Github}>
                  {t("home.hero.quickLinks.portalRepo")}
                </ActionLink>
              </div>
            </div>
          </div>

          <aside className="home-board-side">
            <div className="home-summary-grid">
              {foldSummaryItems.map((item) => (
                <div key={item.id} className="home-summary-item">
                  <p className="home-summary-label">{item.label}</p>
                  <p className="home-summary-value">{item.value}</p>
                  {item.detail ? <p className="home-summary-detail">{item.detail}</p> : null}
                </div>
              ))}
            </div>

            {/* Slot A: Hero System Visual reserved for a future SVG system overview, structure illustration, or short looping video. */}
            <div className="home-system-panel">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="home-system-kicker">{t("home.hero.systemLabel")}</p>
                  <p className="home-system-heading">{t("home.hero.systemSummary")}</p>
                </div>

                <div className="home-system-meta">
                  <span className="home-system-chip">{t("home.positioning.rows.project.stat")}</span>
                  <span className="home-system-chip">{t("home.positioning.rows.m2.stat")}</span>
                </div>
              </div>

              <div className="home-system-flow">
                {systemLanes.map((lane, index) => (
                  <div key={lane.id} className="contents">
                    <div className="home-system-lane">
                      <p className="home-system-lane-title">{lane.title}</p>
                      <div className="home-system-node-list">
                        {lane.members.map((member) => (
                          <span
                            key={member.id}
                            className={`home-system-node ${member.id === "M2" ? "home-system-node-active" : ""}`}
                          >
                            {member.id}
                          </span>
                        ))}
                      </div>
                    </div>

                    {index < systemLanes.length - 1 ? (
                      <div className="home-system-connector" aria-hidden="true">
                        <span>{interfaces[index]?.id}</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="home-system-repos">
                <span className="home-system-repo">{t("home.hero.quickLinks.portalRepo")}</span>
                <span className="home-system-repo">{t("home.hero.quickLinks.mainWeb")}</span>
              </div>
            </div>
          </aside>
        </div>

        <button type="button" className="home-scroll-cue" onClick={scrollToPreviews}>
          <span>{t("home.hero.scroll")}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>
      </RevealOnScroll>

      {/* Slot C: Optional Fold Divider Banner reserved for a narrow visual bridge between the overview fold and preview sections. */}
      <div className="home-fold-divider-slot" aria-hidden="true" />

      <RevealOnScroll as="section" id="home-previews" className="anchor-target home-preview-grid">
        <PreviewCard
          title={t("home.positioning.title")}
          actionLabel={t("common.openArchitecture")}
          actionTo="/architecture"
          className="home-preview-card-span-2"
        >
          <div className="home-scope-list">
            {foldStatements.map((item) => (
              <div key={item.id} className="home-scope-row">
                <p className="home-scope-row-label">{item.label}</p>
                <p className="home-scope-row-text">{item.text}</p>
              </div>
            ))}
          </div>
        </PreviewCard>

        <PreviewCard title={t("home.progress.title")} actionLabel={t("common.openFullProgress")} actionTo="/progress">
          <div className="home-preview-metrics">
            <div className="home-preview-metric-card">
              <p className="home-preview-label">{t("progress.overview.phase")}</p>
              <p className="home-preview-metric-value">{resolveLocalizedText(progressOverview.currentStage, language)}</p>
            </div>
            <div className="home-preview-metric-card">
              <p className="home-preview-label">{t("progress.overview.nextMilestone")}</p>
              <p className="home-preview-metric-value">{resolveLocalizedText(nextMilestone.title, language)}</p>
              <p className="home-preview-metric-detail">
                {formatLocalDate(nextMilestone.dateLabel, language, { month: "short", day: "numeric" })}
              </p>
            </div>
            <div className="home-preview-metric-card">
              <p className="home-preview-label">{t("common.risksBlockers")}</p>
              <p className="home-preview-metric-value">{t("home.progress.blockersValue", { count: activeRiskCount })}</p>
            </div>
          </div>
        </PreviewCard>

        <PreviewCard title={t("home.architecture.title")} actionLabel={t("common.openArchitecture")} actionTo="/architecture">
          <div className="home-architecture-mini-list">
            {architecturePreviewItems.map((item) => (
              <div key={item.id} className="home-architecture-mini-row">
                <span className="home-architecture-mini-chip">{item.label}</span>
                <span className="home-architecture-mini-title">{item.title}</span>
              </div>
            ))}
          </div>
        </PreviewCard>

        <PreviewCard
          title={t("home.logs.title")}
          actionLabel={t("common.viewAllLogs")}
          actionTo="/logs"
          className="home-preview-card-span-2"
        >
          <div className="home-preview-list">
            {latestUpdates.length === 0 ? (
              <div className="home-empty-state">{t("home.logs.empty")}</div>
            ) : (
              latestUpdates.map((entry) => (
                <Link key={entry.slug} to={`/logs/${entry.slug}`} className="home-preview-list-row">
                  <div className="home-preview-list-meta">
                    <span>{formatLocalDate(entry.date, language)}</span>
                    <span className="home-preview-list-dot" />
                    <span>{t(`types.${entry.type}`)}</span>
                  </div>
                  <p className="home-preview-list-title">{entry.title}</p>
                </Link>
              ))
            )}
          </div>
        </PreviewCard>

        <PreviewCard
          title={t("home.docs.title")}
          actionLabel={t("common.browseDocuments")}
          actionTo="/docs"
          className="home-preview-card-span-2"
        >
          <div className="home-preview-list">
            {docs.length === 0 ? (
              <div className="home-empty-state">{t("home.docs.empty")}</div>
            ) : (
              docs.map((entry) => (
                <Link key={entry.slug} to={`/docs/${entry.slug}`} className="home-preview-list-row">
                  <div className="home-preview-list-meta">
                    <span>{entry.version ?? "v0.1"}</span>
                    <span className="home-preview-list-dot" />
                    <span>{entry.reviewStatus ?? entry.status}</span>
                  </div>
                  <p className="home-preview-list-title">{entry.title}</p>
                </Link>
              ))
            )}
          </div>
        </PreviewCard>

        <PreviewCard title={t("home.calendar.title")} actionLabel={t("common.viewCalendar")} actionTo="/calendar">
          <div className="home-preview-list">
            {calendarPreviewEvents.length === 0 ? (
              <div className="home-empty-state">{t("home.calendar.empty")}</div>
            ) : (
              calendarPreviewEvents.map((event) => (
                <Link key={event.id} to={event.link} className="home-preview-list-row">
                  <div className="home-preview-list-meta">
                    <span>
                      {formatLocalDate(event.start, language, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="home-preview-list-dot" />
                    <span>{t(`eventTypes.${event.type}`)}</span>
                  </div>
                  <p className="home-preview-list-title">{resolveLocalizedText(event.title, language)}</p>
                </Link>
              ))
            )}
          </div>
        </PreviewCard>

        <PreviewCard title={t("home.team.title")} actionLabel={t("common.meetTheTeam")} actionTo="/team">
          <div className="home-preview-metrics">
            <div className="home-preview-metric-card">
              <p className="home-preview-label">{t("home.team.membersLabel")}</p>
              <p className="home-preview-metric-value">{t("home.team.membersValue", { count: coreMembers.length })}</p>
            </div>
            <div className="home-preview-metric-card">
              <p className="home-preview-label">{t("home.team.rolesLabel")}</p>
              <p className="home-preview-metric-value">{t("home.team.rolesValue", { count: roleCoverageCount })}</p>
            </div>
            <div className="home-preview-metric-card">
              <p className="home-preview-label">{t("home.team.timezonesLabel")}</p>
              <p className="home-preview-metric-value">{timezoneCoverage}</p>
            </div>
          </div>
        </PreviewCard>
      </RevealOnScroll>
    </main>
  );
}

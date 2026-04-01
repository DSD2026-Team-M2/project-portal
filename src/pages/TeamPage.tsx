import { BookOpenText, Github, Globe2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { externalLinks } from "../config/links";
import { roleMatrix } from "../data/portalData";
import { teamMembers, teamOverview } from "../data/teamMembers";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTimezoneClock } from "../hooks/useTimezoneClock";
import { resolveLocalizedText } from "../utils/content";
import { ExternalLinkPill } from "../components/ExternalLinkPill";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { TeamMemberCard } from "../components/TeamMemberCard";
import { TimezoneClockCard } from "../components/TimezoneClockCard";

export function TeamPage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const coreMembers = teamMembers.filter((member) => member.group === "core");
  const facultyMembers = teamMembers.filter((member) => member.group === "faculty");
  const aiMembers = teamMembers.filter((member) => member.group === "ai");

  useDocumentTitle("meta.pages.team.title", { descriptionKey: "meta.pages.team.description" });

  const chinaClock = useTimezoneClock("Asia/Shanghai", language);
  const portugalClock = useTimezoneClock("Europe/Lisbon", language);

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[7rem_minmax(0,1fr)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/80 bg-white/90 shadow-sm">
            <img src={teamOverview.logo} alt={t("nav.logoAlt")} className="h-14 w-14 object-contain" />
          </div>
          <div>
            <SectionTitle
              title={t("team.title")}
              action={<ExternalLinkPill href={teamOverview.orgLink}>{externalLinks.m2Org.label}</ExternalLinkPill>}
            />
            <SectionLead>{t("team.lead")}</SectionLead>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="surface-card p-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <Users className="h-4 w-4" />
                  <span>{t("team.overview")}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(teamOverview.scopeSummary, language)}</p>
              </div>
              <div className="surface-card p-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <Globe2 className="h-4 w-4" />
                  <span>{t("team.crossTimezone")}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(teamOverview.collaborationNote, language)}</p>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("team.membersTitle")} />
        <SectionLead>{t("team.membersLead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {coreMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} language={language} />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("team.facultyTitle")} />
        <SectionLead>{t("team.facultyLead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {facultyMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} language={language} />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("team.aiTitle")} />
        <SectionLead>{t("team.aiLead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {aiMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} language={language} />
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle
          title={t("team.rolesTitle")}
          action={<InternalLinkPill to="/architecture#role-matrix">{t("common.openArchitecture")}</InternalLinkPill>}
        />
        <SectionLead>{t("team.rolesLead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleMatrix.map((role) => (
            <article key={role.id} className="surface-card p-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <BookOpenText className="h-4 w-4" />
                <span>{role.id}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{resolveLocalizedText(role.description, language)}</p>
            </article>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("team.timezonesTitle")} />
        <SectionLead>{t("team.timezonesLead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TimezoneClockCard label={t("calendar.timezones.china")} time={chinaClock.time} date={chinaClock.date} zone={chinaClock.zone} />
          <TimezoneClockCard label={t("calendar.timezones.portugal")} time={portugalClock.time} date={portugalClock.date} zone={portugalClock.zone} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <ExternalLinkPill href={externalLinks.m2Org.href}>
            <span className="inline-flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>{externalLinks.m2Org.label}</span>
            </span>
          </ExternalLinkPill>
          <ExternalLinkPill href={externalLinks.portalRepo.href}>{externalLinks.portalRepo.label}</ExternalLinkPill>
        </div>
      </RevealOnScroll>
    </main>
  );
}

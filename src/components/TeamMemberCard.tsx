import { Clock3, Github, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import type { SupportedLanguage } from "../i18n/language";
import { resolveLocalizedText } from "../utils/content";
import { ExternalLinkPill } from "./ExternalLinkPill";
import { InternalLinkPill } from "./InternalLinkPill";
import { StaticTag } from "./StaticTag";
import type { TeamMemberRecord } from "../data/teamMembers";

type TeamMemberCardProps = {
  member: TeamMemberRecord;
  language: SupportedLanguage;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamMemberCard({ member, language }: TeamMemberCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const photoSrc = member.photoPath ? `${import.meta.env.BASE_URL}${member.photoPath}` : null;
  const showPhoto = Boolean(photoSrc) && !imageError;
  const hasRole = member.role.trim().length > 0;
  const responsibilityFocus = resolveLocalizedText(member.responsibilityFocus, language).trim();
  const shortNote = resolveLocalizedText(member.shortNote, language).trim();
  const hasRelatedPages = member.relatedPages.length > 0;
  const hasRelatedRepos = member.relatedRepos.length > 0;

  return (
    <article className="surface-card h-full min-w-0 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/80 bg-[linear-gradient(135deg,#dbeafe,#f8fafc_52%,#e2e8f0)] shadow-sm">
            {showPhoto ? (
              <img
                src={photoSrc ?? undefined}
                alt={member.name}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-xl font-semibold tracking-[0.14em] text-slate-600">{getInitials(member.name)}</span>
            )}
          </div>
          <div className="min-w-0">
            {hasRole ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{member.role}</p> : null}
            <h3 className={`${hasRole ? "mt-2" : "mt-0.5"} text-2xl font-semibold tracking-tight text-slate-950`}>{member.name}</h3>
            {member.displayCode ? (
              <p className="mt-1 text-sm text-slate-400">{member.displayCode}</p>
            ) : null}
          </div>
        </div>
        <StaticTag label={resolveLocalizedText(member.locationLabel, language)} tone="blue" />
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <p className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-400" />
          <span>{member.timezone}</span>
        </p>
        <p className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span>{resolveLocalizedText(member.locationLabel, language)}</span>
        </p>
      </div>

      {responsibilityFocus ? <p className="mt-5 text-sm leading-7 text-slate-700">{responsibilityFocus}</p> : null}
      {shortNote ? (
        <p className="mt-4 border-l-2 border-slate-200 pl-4 text-sm leading-7 text-slate-500">
          {shortNote}
        </p>
      ) : null}

      {hasRelatedPages ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {member.relatedPages.map((page) => (
            <InternalLinkPill key={page.href} to={page.href}>
              {page.labelKey ? t(page.labelKey) : page.label}
            </InternalLinkPill>
          ))}
        </div>
      ) : null}

      {hasRelatedRepos ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {member.relatedRepos.map((repo) =>
            repo.external ? (
              <ExternalLinkPill key={repo.href} href={repo.href}>
                {repo.label}
              </ExternalLinkPill>
            ) : (
              <InternalLinkPill key={repo.href} to={repo.href}>
                {repo.label}
              </InternalLinkPill>
            ),
          )}
        </div>
      ) : null}

      {member.github ? (
        <div className="mt-4">
          <ExternalLinkPill href={member.github}>
            <span className="inline-flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </span>
          </ExternalLinkPill>
        </div>
      ) : null}
    </article>
  );
}

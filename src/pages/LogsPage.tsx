import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getResolvedEntries } from "../content/queries";
import { siteMode } from "../config/siteMode";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { FilterChip } from "../components/FilterChip";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { LogListItem } from "../components/LogListItem";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { getAttentionTagLabel } from "../utils/tags";

export function LogsPage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const entries = getResolvedEntries("logs", language);

  useDocumentTitle("meta.pages.logs.title", { descriptionKey: "meta.pages.logs.description" });

  const [typeFilter, setTypeFilter] = useState("all");
  const [ownerRoleFilter, setOwnerRoleFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [attentionFilter, setAttentionFilter] = useState("all");
  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const unique = (values: string[]) => ["all", ...new Set(values)];
    return {
      types: unique(entries.map((entry) => entry.type)),
      ownerRoles: unique(entries.map((entry) => entry.ownerRole)),
      teams: unique(entries.flatMap((entry) => entry.relatedTeams)),
      tags: unique(entries.flatMap((entry) => entry.tags)),
      attention: unique(entries.flatMap((entry) => entry.attentionTags)),
    };
  }, [entries]);

  const filteredEntries = entries.filter((entry) => {
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    const matchesRole = ownerRoleFilter === "all" || entry.ownerRole === ownerRoleFilter;
    const matchesTeam = teamFilter === "all" || entry.relatedTeams.includes(teamFilter);
    const matchesTag = tagFilter === "all" || entry.tags.includes(tagFilter);
    const matchesAttention = attentionFilter === "all" || entry.attentionTags.includes(attentionFilter);
    const haystack = `${entry.title} ${entry.summary}`.toLowerCase();
    const matchesQuery = query.trim().length === 0 || haystack.includes(query.trim().toLowerCase());

    return matchesType && matchesRole && matchesTeam && matchesTag && matchesAttention && matchesQuery;
  });

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle
          title={t("logs.title")}
          action={siteMode.showTemplateExamples ? <InternalLinkPill to="/examples">{t("common.openExamples")}</InternalLinkPill> : undefined}
        />
        <SectionLead>{t("logs.lead")}</SectionLead>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("logs.filters.type")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.types.map((value) => (
                <FilterChip
                  key={value}
                  label={value === "all" ? t("common.all") : t(`types.${value}`)}
                  selected={typeFilter === value}
                  onClick={() => setTypeFilter(value)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("logs.filters.attention")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.attention.map((value) => (
                <FilterChip
                  key={value}
                  label={value === "all" ? t("common.all") : getAttentionTagLabel(value)}
                  selected={attentionFilter === value}
                  onClick={() => setAttentionFilter(value)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("logs.filters.ownerRole")}
              </span>
              <select
                value={ownerRoleFilter}
                onChange={(event) => setOwnerRoleFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
              >
                {options.ownerRoles.map((value) => (
                  <option key={value} value={value}>
                    {value === "all" ? t("common.all") : value}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("logs.filters.team")}
              </span>
              <select
                value={teamFilter}
                onChange={(event) => setTeamFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
              >
                {options.teams.map((value) => (
                  <option key={value} value={value}>
                    {value === "all" ? t("common.all") : value}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t("logs.filters.tag")}
              </span>
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700"
              >
                {options.tags.map((value) => (
                  <option key={value} value={value}>
                    {value === "all" ? t("common.all") : value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {t("logs.filters.search")}
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("logs.filters.searchPlaceholder")}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-300"
              />
            </div>
          </label>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle
          title={t("logs.feedTitle")}
          action={siteMode.showTemplateExamples ? <InternalLinkPill to="/examples">{t("common.viewTemplates")}</InternalLinkPill> : undefined}
        />
        <SectionLead>{t("logs.feedLead", { count: filteredEntries.length })}</SectionLead>

        {filteredEntries.length > 0 ? (
          <div className="mt-6 divide-y divide-slate-200/80">
            {filteredEntries.map((entry) => (
              <LogListItem
                key={entry.slug}
                entry={entry}
                language={language}
                showFallback={entry.locale !== language && language !== "en"}
              />
            ))}
          </div>
        ) : (
          <div className="home-empty-state mt-6" data-empty-state>
            {t("logs.emptyFiltered")}
          </div>
        )}
      </RevealOnScroll>
    </main>
  );
}

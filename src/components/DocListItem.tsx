import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { SupportedLanguage } from "../i18n/language";
import type { GeneratedContentEntry } from "../utils/content";
import { formatDate } from "../utils/date";
import { StaticTag } from "./StaticTag";
import { StatusBadge } from "./StatusBadge";

type DocListItemProps = {
  entry: GeneratedContentEntry;
  language: SupportedLanguage;
  showFallback?: boolean;
};

export function DocListItem({ entry, language, showFallback = false }: DocListItemProps) {
  const { t } = useTranslation();

  return (
    <Link to={`/docs/${entry.slug}`} className="doc-list-card surface-card p-5 sm:p-6">
      <div className="grid gap-4 xl:grid-cols-[11rem_minmax(0,1fr)_10.5rem] xl:items-start">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {t(`docs.categories.${entry.type}`)}
          </p>
          <StatusBadge value={entry.reviewStatus ?? entry.status} />
          {entry.markers.map((marker) => (
            <StaticTag key={marker} label={marker.toUpperCase()} tone="violet" />
          ))}
        </div>

        <div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{entry.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{entry.summary}</p>
              {showFallback ? <p className="mt-3 text-sm text-amber-700">{t("common.showingEnglishFallback")}</p> : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {entry.version ? <StaticTag label={entry.version} tone="blue" /> : null}
            {entry.tags.map((tag) => (
              <StaticTag key={tag} label={tag} />
            ))}
          </div>
        </div>

        <div className="space-y-3 xl:text-right">
          <div className="text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">{t("common.owner")}:</span> {entry.owner}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-slate-900">{t("common.lastUpdated")}:</span>{" "}
              {formatDate(entry.lastUpdated ?? entry.date, language)}
            </p>
          </div>
          <div className="xl:flex xl:justify-end">
            <span className="internal-link-pill">{t("common.openDocument")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

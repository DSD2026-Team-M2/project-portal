import { Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { SupportedLanguage } from "../i18n/language";
import type { GeneratedContentEntry } from "../utils/content";
import { formatDate } from "../utils/date";
import { AttentionTag } from "./AttentionTag";
import { StaticTag } from "./StaticTag";

type LogListItemProps = {
  entry: GeneratedContentEntry;
  language: SupportedLanguage;
  showFallback?: boolean;
};

export function LogListItem({ entry, language, showFallback = false }: LogListItemProps) {
  const { t } = useTranslation();

  return (
    <Link to={`/logs/${entry.slug}`} className="log-list-row border-b border-slate-200/80 py-5 last:border-b-0">
      <div className="grid gap-4 lg:grid-cols-[11rem_minmax(0,1fr)_10rem] lg:items-start">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4" />
            <span>{formatDate(entry.date, language)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StaticTag label={t(`types.${entry.type}`)} tone="blue" />
            <StaticTag label={entry.ownerRole} />
            {entry.markers.map((marker) => (
              <StaticTag key={marker} label={marker.toUpperCase()} tone="violet" />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{entry.title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{entry.summary}</p>
          {showFallback ? <p className="mt-3 text-sm text-amber-700">{t("common.showingEnglishFallback")}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <StaticTag key={tag} label={tag} />
            ))}
            {entry.attentionTags.map((tag) => (
              <AttentionTag key={tag} label={tag} />
            ))}
          </div>
        </div>

        <div className="lg:flex lg:justify-end">
          <span className="internal-link-pill">{t("common.openArticle")}</span>
        </div>
      </div>
    </Link>
  );
}

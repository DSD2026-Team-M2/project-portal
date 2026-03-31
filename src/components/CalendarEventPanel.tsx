import { CalendarClock, Link2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SupportedLanguage } from "../i18n/language";
import { formatDateTime } from "../utils/date";
import { isExternalHref } from "../utils/links";
import { AttentionTag } from "./AttentionTag";
import { ExternalLinkPill } from "./ExternalLinkPill";
import { InternalLinkPill } from "./InternalLinkPill";
import { StaticTag } from "./StaticTag";

type CalendarEventPanelProps = {
  event: {
    id: string;
    title: string;
    type: string;
    start: string;
    end?: string;
    summary: string;
    relatedTeams: string[];
    link: string;
    tags: string[];
    sample?: boolean;
  } | null;
  language: SupportedLanguage;
};

export function CalendarEventPanel({ event, language }: CalendarEventPanelProps) {
  const { t } = useTranslation();

  if (!event) {
    return (
      <section className="meta-panel">
        <p className="meta-panel-title">{t("calendar.selectedEvent")}</p>
        <p className="mt-4 text-sm leading-7 text-slate-500">{t("calendar.emptySelection")}</p>
      </section>
    );
  }

  return (
    <section className="meta-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="meta-panel-title">{t("calendar.selectedEvent")}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{event.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <StaticTag label={t(`eventTypes.${event.type}`)} tone="blue" />
          {event.sample ? <StaticTag label={t("common.sample")} tone="violet" /> : null}
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-slate-400" />
          <span>{formatDateTime(event.start, language)}</span>
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span>{event.relatedTeams.join(", ")}</span>
        </p>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{event.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {event.tags.map((tag) =>
          tag.startsWith("attention:") ? (
            <AttentionTag key={tag} label={tag} />
          ) : (
            <StaticTag key={tag} label={tag} />
          ),
        )}
      </div>

      <div className="mt-4">
        {isExternalHref(event.link) ? (
          <ExternalLinkPill href={event.link}>
            <span className="inline-flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span>{t("common.openLinkedRecord")}</span>
            </span>
          </ExternalLinkPill>
        ) : (
          <InternalLinkPill to={event.link}>
            <span className="inline-flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span>{t("common.openLinkedRecord")}</span>
            </span>
          </InternalLinkPill>
        )}
      </div>
    </section>
  );
}

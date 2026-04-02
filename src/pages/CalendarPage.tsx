import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DayCellContentArg } from "@fullcalendar/core";
import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import { ChevronLeft, ChevronRight, Link2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { calendarEvents } from "../data/portalData";
import cnHolidays from "../generated/holidays/cn.generated.json";
import ptHolidays from "../generated/holidays/pt.generated.json";
import { siteMode } from "../config/siteMode";
import { externalLinks } from "../config/links";
import type { SupportedLanguage } from "../i18n/language";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTimezoneClock } from "../hooks/useTimezoneClock";
import { localizeHolidayCopy } from "../utils/holidays";
import { resolveLocalizedText } from "../utils/content";
import { formatDate } from "../utils/date";
import { CalendarEventPanel } from "../components/CalendarEventPanel";
import { FilterChip } from "../components/FilterChip";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";
import { TimezoneClockCard } from "../components/TimezoneClockCard";

type CalendarDisplayEvent = {
  id: string;
  title: string;
  type: string;
  start: string;
  end?: string;
  allDay?: boolean;
  summary: string;
  relatedTeams: string[];
  link: string;
  tags: string[];
  countryCode?: "CN" | "PT";
  sample?: boolean;
};

const typeOrder = [
  "milestone",
  "meeting",
  "course",
  "deadline",
  "holiday-cn",
  "holiday-pt",
  "demo",
] as const;

const eventToneMap = {
  milestone: "calendar-event-milestone",
  meeting: "calendar-event-meeting",
  course: "calendar-event-course",
  deadline: "calendar-event-deadline",
  "holiday-cn": "calendar-event-holiday-cn",
  "holiday-pt": "calendar-event-holiday-pt",
  demo: "calendar-event-demo",
} as const;

function CalendarEventLabel({ text }: { text: string }) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!shellRef.current || !trackRef.current) return;
      const overflow = Math.max(0, trackRef.current.scrollWidth - shellRef.current.clientWidth);
      setDistance(overflow);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  return (
    <div
      ref={shellRef}
      className={`calendar-event-label ${distance > 0 ? "calendar-event-label-overflow" : ""}`}
      style={{ "--marquee-distance": `${distance}px` } as CSSProperties}
      title={text}
    >
      <span ref={trackRef} className="calendar-event-label-track">
        {text}
      </span>
    </div>
  );
}

function toLocalIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthShortLabel(date: Date, language: SupportedLanguage) {
  return new Intl.DateTimeFormat(language === "zh-CN" ? "zh-CN" : language === "pt" ? "pt-PT" : "en-US", {
    month: "short",
  }).format(date);
}

function CalendarDayNumber({ arg, language }: { arg: DayCellContentArg; language: SupportedLanguage }) {
  const isMonthStart = arg.date.getDate() === 1;

  return (
    <div className="calendar-day-number-shell">
      <span className="calendar-day-number-value">{arg.dayNumberText.replace(/\D/g, "") || arg.date.getDate()}</span>
      {isMonthStart ? <span className="calendar-day-month-chip">{getMonthShortLabel(arg.date, language)}</span> : null}
    </div>
  );
}

export function CalendarPage() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const location = useLocation();
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>([...typeOrder]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useDocumentTitle("meta.pages.calendar.title", { descriptionKey: "meta.pages.calendar.description" });

  const chinaClock = useTimezoneClock("Asia/Shanghai", language);
  const portugalClock = useTimezoneClock("Europe/Lisbon", language);
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localClock = useTimezoneClock(localZone, language);

  const allEvents = useMemo<CalendarDisplayEvent[]>(() => {
    const manualEvents = calendarEvents
      .filter((event) => !(siteMode.hideSimulatedData && event.sample))
      .map((event) => ({
        id: event.id,
        title: resolveLocalizedText(event.title, language),
        type: event.type,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        summary: resolveLocalizedText(event.summary, language),
        relatedTeams: event.relatedTeams,
        link: event.link,
        tags: event.tags,
        sample: event.sample,
      }));

    const holidayEvents = [...cnHolidays.events, ...ptHolidays.events].map((event) => {
      const localized = localizeHolidayCopy(event.title, event.summary, language);
      const countryCode: "CN" | "PT" = event.type === "holiday-cn" ? "CN" : "PT";

      return {
        id: event.id,
        title: localized.title,
        type: event.type,
        start: event.date,
        allDay: true,
        summary: localized.summary,
        relatedTeams: [countryCode],
        link: "/calendar",
        tags: [event.type],
        countryCode,
      };
    });

    return [...manualEvents, ...holidayEvents].sort((left, right) => left.start.localeCompare(right.start));
  }, [language]);

  const filteredEvents = useMemo(
    () =>
      allEvents
        .filter((event) => activeTypes.includes(event.type))
        .sort((left, right) => typeOrder.indexOf(left.type as (typeof typeOrder)[number]) - typeOrder.indexOf(right.type as (typeof typeOrder)[number])),
    [activeTypes, allEvents],
  );
  const hasSampleProjectEvents = !siteMode.hideSimulatedData && allEvents.some((event) => event.sample);

  const eventsForSelectedDate = useMemo(
    () => filteredEvents.filter((event) => event.start.slice(0, 10) === selectedDate),
    [filteredEvents, selectedDate],
  );

  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedEventId) ?? eventsForSelectedDate[0] ?? null;

  useEffect(() => {
    const eventId = location.hash.replace(/^#/, "");
    if (!eventId) return;

    const matchedEvent = allEvents.find((event) => event.id === eventId);
    if (matchedEvent) {
      setSelectedEventId(matchedEvent.id);
      setSelectedDate(matchedEvent.start.slice(0, 10));
    }
  }, [allEvents, location.hash]);

  useEffect(() => {
    if (!selectedEvent && eventsForSelectedDate[0]) {
      setSelectedEventId(eventsForSelectedDate[0].id);
    }
  }, [eventsForSelectedDate, selectedEvent]);

  const toggleType = (type: string) => {
    setActiveTypes((current) => (current.includes(type) ? current.filter((item) => item !== type) : [...current, type]));
  };

  const handleEventClick = (info: EventClickArg) => {
    const id = info.event.id;
    setSelectedEventId(id);
    setSelectedDate(info.event.startStr.slice(0, 10));
    navigate({ hash: id }, { replace: true });
  };

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
    const firstEvent = filteredEvents.find((event) => event.start.slice(0, 10) === info.dateStr);
    setSelectedEventId(firstEvent?.id ?? null);
  };

  const handleDatesSet = (info: DatesSetArg) => {
    setCurrentTitle(
      new Intl.DateTimeFormat(language === "zh-CN" ? "zh-CN" : language === "pt" ? "pt-PT" : "en-US", {
        year: "numeric",
        month: "long",
      }).format(info.view.currentStart),
    );
  };

  return (
    <main className="page-shell">
      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("calendar.title")} />
        <SectionLead>{t("calendar.lead")}</SectionLead>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TimezoneClockCard label={t("calendar.timezones.china")} time={chinaClock.time} date={chinaClock.date} zone={chinaClock.zone} />
          <TimezoneClockCard label={t("calendar.timezones.portugal")} time={portugalClock.time} date={portugalClock.date} zone={portugalClock.zone} />
          <TimezoneClockCard label={t("calendar.timezones.local")} time={localClock.time} date={localClock.date} zone={localClock.zone} />
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="section-shell p-6 sm:p-8">
        <SectionTitle title={t("calendar.monthView.title")} />
        <SectionLead>{t("calendar.monthView.lead")}</SectionLead>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            <div className="surface-card p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => calendarRef.current?.getApi().prev()}
                    className="filter-chip"
                    aria-label={t("calendar.prevMonth")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => calendarRef.current?.getApi().next()}
                    className="filter-chip"
                    aria-label={t("calendar.nextMonth")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => calendarRef.current?.getApi().today()}
                    className="filter-chip"
                  >
                    {t("calendar.today")}
                  </button>
                </div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">{currentTitle}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {typeOrder.map((type) => (
                  <FilterChip
                    key={type}
                    label={t(`eventTypes.${type}`)}
                    selected={activeTypes.includes(type)}
                    accentClassName={eventToneMap[type]}
                    onClick={() => toggleType(type)}
                  />
                ))}
              </div>

              {hasSampleProjectEvents ? (
                <div className="callout-box mt-4">
                  <p className="text-sm leading-7 text-amber-800">{t("calendar.sampleEventNote")}</p>
                </div>
              ) : null}
            </div>

            <div className="surface-card calendar-board p-3 sm:p-4">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false}
                editable={false}
                selectable={false}
                fixedWeekCount={false}
                dayMaxEventRows={3}
                height="auto"
                events={filteredEvents.map((event) => ({
                  id: event.id,
                  title: event.title,
                  start: event.start,
                  end: event.end,
                  allDay: event.allDay,
                  extendedProps: {
                    type: event.type,
                    sample: event.sample,
                  },
                  classNames: ["calendar-event-bar", eventToneMap[event.type as keyof typeof eventToneMap]],
                }))}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                datesSet={handleDatesSet}
                dayCellClassNames={(arg) => (toLocalIsoDate(arg.date) === selectedDate ? ["calendar-day-selected"] : [])}
                dayCellContent={(arg) => <CalendarDayNumber arg={arg} language={language} />}
                eventContent={(arg) => (
                  <CalendarEventLabel
                    text={arg.event.extendedProps.sample ? `${t("common.sample")} · ${arg.event.title}` : arg.event.title}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <section className="meta-panel">
              <p className="meta-panel-title">{t("calendar.selectedDate")}</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{formatDate(selectedDate, language)}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {eventsForSelectedDate.length === 0
                  ? t("calendar.noEvents")
                  : t("calendar.dayEventsCount", { count: eventsForSelectedDate.length })}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {eventsForSelectedDate.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => {
                      setSelectedEventId(event.id);
                      navigate({ hash: event.id }, { replace: true });
                    }}
                    className={`calendar-day-item ${selectedEvent?.id === event.id ? "calendar-day-item-active" : ""}`}
                    title={event.title}
                  >
                    <span className={`calendar-day-dot ${eventToneMap[event.type as keyof typeof eventToneMap]}`} />
                    <span className="min-w-0 truncate">{event.title}</span>
                  </button>
                ))}
              </div>
            </section>

            <CalendarEventPanel event={selectedEvent} language={language} />

            <section className="meta-panel">
              <p className="meta-panel-title">{t("calendar.subscriptionTitle")}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{t("calendar.subscriptionBody")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={externalLinks.portalCalendarFeedCnTeam.href}
                  target="_blank"
                  rel="noreferrer"
                  className="filter-chip inline-flex"
                >
                  <Link2 className="h-4 w-4" />
                  <span>{t("calendar.subscriptionActionCnTeam")}</span>
                </a>
                <a
                  href={externalLinks.portalCalendarFeedPtTeam.href}
                  target="_blank"
                  rel="noreferrer"
                  className="filter-chip inline-flex"
                >
                  <Link2 className="h-4 w-4" />
                  <span>{t("calendar.subscriptionActionPtTeam")}</span>
                </a>
                <a
                  href={externalLinks.portalCalendarFeed.href}
                  target="_blank"
                  rel="noreferrer"
                  className="filter-chip inline-flex"
                >
                  <Link2 className="h-4 w-4" />
                  <span>{t("calendar.subscriptionActionComplete")}</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </RevealOnScroll>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";

import type { SupportedLanguage } from "../i18n/language";
import { getIntlLocale } from "../utils/date";

export function useTimezoneClock(timeZone: string, language: SupportedLanguage) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const locale = getIntlLocale(language);
    const time = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    }).format(now);

    const date = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone,
    }).format(now);

    const zone = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: "short",
    })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value;

    return {
      date,
      time,
      zone: zone ?? timeZone,
    };
  }, [language, now, timeZone]);
}

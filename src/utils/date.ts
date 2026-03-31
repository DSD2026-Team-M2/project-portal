import type { SupportedLanguage } from "../i18n/language";

const INTL_LOCALE_MAP: Record<SupportedLanguage, string> = {
  "zh-CN": "zh-CN",
  en: "en-US",
  pt: "pt-PT",
};

export function getIntlLocale(language: SupportedLanguage): string {
  return INTL_LOCALE_MAP[language];
}

export function formatDate(value: string, language: SupportedLanguage, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(getIntlLocale(language), {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(new Date(value));
}

export function formatDateTime(
  value: string,
  language: SupportedLanguage,
  timeZone?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(getIntlLocale(language), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
    ...options,
  }).format(new Date(value));
}

export function formatDateRange(
  start: string,
  end: string,
  language: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions,
): string {
  const formatter = new Intl.DateTimeFormat(getIntlLocale(language), {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });

  return formatter.formatRange(new Date(start), new Date(end));
}

export function getDaysUntil(date: string): number {
  const target = new Date(date);
  const current = new Date();

  target.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
}

export function toMonthKey(value: string): string {
  return value.slice(0, 7);
}

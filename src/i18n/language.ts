export const SUPPORTED_LANGUAGES = ["zh-CN", "en", "pt"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = "project-portal-language";
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export function normalizeLanguage(input?: string | null): SupportedLanguage | null {
  if (!input) return null;

  const value = input.toLowerCase();

  if (value.startsWith("zh")) return "zh-CN";
  if (value.startsWith("en")) return "en";
  if (value.startsWith("pt")) return "pt";

  return null;
}

export function getStoredLanguage(): SupportedLanguage | null {
  if (typeof window === "undefined") return null;

  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getBrowserPreferredLanguage(): SupportedLanguage | null {
  if (typeof navigator === "undefined") return null;

  const candidates =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const candidate of candidates) {
    const normalized = normalizeLanguage(candidate);
    if (normalized) return normalized;
  }

  return null;
}

export function detectInitialLanguage(): SupportedLanguage {
  return getStoredLanguage() ?? getBrowserPreferredLanguage() ?? DEFAULT_LANGUAGE;
}

export function persistLanguage(language: SupportedLanguage): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage failures so the site remains usable in restricted browsers.
  }
}

export function applyDocumentLanguage(language: SupportedLanguage): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = language;
}

export function getLanguageLabel(language: SupportedLanguage): string {
  if (language === "zh-CN") return "CN";
  if (language === "pt") return "PT";
  return "EN";
}

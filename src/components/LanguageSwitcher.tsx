import { useTranslation } from "react-i18next";

import { changeAppLanguage } from "../i18n";
import { SUPPORTED_LANGUAGES, getLanguageLabel, type SupportedLanguage } from "../i18n/language";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleChange = (language: SupportedLanguage): void => {
    void changeAppLanguage(language);
  };

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
      {SUPPORTED_LANGUAGES.map((language) => {
        const isActive = (i18n.resolvedLanguage ?? i18n.language) === language;

        return (
          <button
            key={language}
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            aria-label={t("language.switchTo", { language: getLanguageLabel(language) })}
            aria-pressed={isActive}
            onClick={() => handleChange(language)}
          >
            {getLanguageLabel(language)}
          </button>
        );
      })}
    </div>
  );
}

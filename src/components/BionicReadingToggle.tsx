import { useTranslation } from "react-i18next";

import { useReadingPreferences } from "../contexts/ReadingPreferencesContext";

type BionicReadingToggleProps = {
  visible?: boolean;
};

export function BionicReadingToggle({ visible = true }: BionicReadingToggleProps) {
  const { t } = useTranslation();
  const { isBionicEnabled, toggleBionic } = useReadingPreferences();

  if (!visible) return null;

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm transition ${
        isBionicEnabled
          ? "border-amber-300 bg-amber-50 text-amber-950 shadow-sm"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900"
      }`}
      aria-label={t("common.bionicAria")}
      aria-pressed={isBionicEnabled}
      title={t("common.bionicHint")}
      onClick={toggleBionic}
    >
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em]">{t("common.bionic")}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          isBionicEnabled ? "bg-amber-400" : "bg-slate-200"
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            isBionicEnabled ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}

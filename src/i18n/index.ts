import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import pt from "./locales/pt.json";
import zhCN from "./locales/zh-CN.json";
import {
  SUPPORTED_LANGUAGES,
  applyDocumentLanguage,
  detectInitialLanguage,
  persistLanguage,
  type SupportedLanguage,
} from "./language";

const initialLanguage = detectInitialLanguage();

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    "zh-CN": { translation: zhCN },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: {
    escapeValue: false,
  },
});

applyDocumentLanguage(initialLanguage);

i18n.on("languageChanged", (language) => {
  applyDocumentLanguage(language as SupportedLanguage);
});

export async function changeAppLanguage(language: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  persistLanguage(language);
  applyDocumentLanguage(language);
}

export default i18n;

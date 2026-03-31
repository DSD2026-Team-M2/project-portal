import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type UseDocumentTitleOptions = {
  descriptionKey?: string;
};

export function useDocumentTitle(titleKey: string, options?: UseDocumentTitleOptions) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const title = `${t(titleKey)} · ${t("meta.titleSuffix")}`;
    document.title = title;

    const description = options?.descriptionKey ? t(options.descriptionKey) : t("meta.description");
    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  }, [i18n.language, options?.descriptionKey, t, titleKey]);
}

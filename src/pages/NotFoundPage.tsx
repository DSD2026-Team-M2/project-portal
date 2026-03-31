import { useTranslation } from "react-i18next";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { InternalLinkPill } from "../components/InternalLinkPill";
import { SectionLead } from "../components/SectionLead";
import { SectionTitle } from "../components/SectionTitle";

export function NotFoundPage() {
  const { t } = useTranslation();

  useDocumentTitle("meta.pages.notFound.title", { descriptionKey: "meta.pages.notFound.description" });

  return (
    <main className="page-shell">
      <section className="section-shell p-8">
        <SectionTitle title={t("notFound.title")} />
        <SectionLead>{t("notFound.lead")}</SectionLead>
        <div className="mt-6">
          <InternalLinkPill to="/">{t("notFound.backHome")}</InternalLinkPill>
        </div>
      </section>
    </main>
  );
}

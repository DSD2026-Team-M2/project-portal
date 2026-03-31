import { useTranslation } from "react-i18next";

import { externalLinks, footerExternalLinks } from "../config/links";
import { projectMeta } from "../data/portalData";
import type { SupportedLanguage } from "../i18n/language";
import { resolveLocalizedText } from "../utils/content";
import { ExternalLinkPill } from "./ExternalLinkPill";
import { InternalLinkPill } from "./InternalLinkPill";

export function Footer() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  return (
    <footer className="mt-12 border-t border-white/60 bg-white/40 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-950">{projectMeta.projectName}</p>
          <p className="mt-1 text-sm text-slate-500">{resolveLocalizedText(projectMeta.term, language)}</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t("footer.description")}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <InternalLinkPill to="/docs">{t("common.browseDocuments")}</InternalLinkPill>
            <InternalLinkPill to="/calendar">{t("common.viewCalendar")}</InternalLinkPill>
            <InternalLinkPill to="/team">{t("common.meetTheTeam")}</InternalLinkPill>
            {footerExternalLinks.map((link) => (
              <ExternalLinkPill key={link.href} href={link.href}>
                {link.label}
              </ExternalLinkPill>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-500">
          <p>
            <span className="font-semibold text-slate-900">{t("footer.maintainedBy")}:</span> M2
          </p>
          <p>
            <span className="font-semibold text-slate-900">{t("footer.lastUpdated")}:</span> {projectMeta.lastUpdated}
          </p>
          <p>
            <span className="font-semibold text-slate-900">{t("footer.license")}:</span> {projectMeta.license}
          </p>
          <p>
            <span className="font-semibold text-slate-900">{t("footer.relatedOrg")}:</span>{" "}
            <a href={externalLinks.m2Org.href} target="_blank" rel="noreferrer" className="text-sky-700 hover:text-sky-900">
              {externalLinks.m2Org.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

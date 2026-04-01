import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { externalLinks, footerExternalLinks } from "../config/links";
import { siteMode } from "../config/siteMode";
import { projectMeta } from "../data/portalData";
import type { SupportedLanguage } from "../i18n/language";
import { resolveLocalizedText } from "../utils/content";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const footerStats = [
    { label: t("footer.maintainedBy"), value: "M2" },
    { label: t("footer.lastUpdated"), value: projectMeta.lastUpdated },
    { label: t("footer.license"), value: projectMeta.license },
  ];
  const sitemapGroups = [
    {
      title: t("footer.groups.overview"),
      links: [
        { to: "/", label: t("nav.overview") },
        { to: "/progress", label: t("nav.progress") },
        { to: "/architecture", label: t("nav.architecture") },
      ],
    },
    {
      title: t("footer.groups.records"),
      links: [
        { to: "/logs", label: t("nav.logs") },
        { to: "/docs", label: t("nav.docs") },
        { to: "/calendar", label: t("nav.calendar") },
      ],
    },
    {
      title: t("footer.groups.collaboration"),
      links: [
        { to: "/team", label: t("nav.team") },
        ...(siteMode.showTemplateExamples ? [{ to: "/examples", label: t("nav.examples") }] : []),
      ],
    },
  ];

  return (
    <footer className="mt-14 border-t border-white/60 bg-white/45 backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">{t("footer.title")}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{projectMeta.projectName}</p>
              <p className="mt-1 text-sm text-slate-500">{resolveLocalizedText(projectMeta.term, language)}</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{t("footer.description")}</p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              {footerStats.map((item) => (
                <p key={item.label}>
                  <span className="font-semibold text-slate-900">{item.label}:</span> {item.value}
                </p>
              ))}
              <p>
                <span className="font-semibold text-slate-900">{t("footer.relatedOrg")}:</span>{" "}
                <a href={externalLinks.m2Org.href} target="_blank" rel="noreferrer" className="text-sky-700 hover:text-sky-900">
                  {externalLinks.m2Org.label}
                </a>
              </p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {footerExternalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 transition hover:text-sky-800"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/70 bg-white/55 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{t("footer.sitemapTitle")}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t("footer.sitemapDescription")}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {sitemapGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-sm font-semibold text-slate-900">{group.title}</p>
                  <div className="mt-2 flex flex-col gap-2">
                    {group.links.map((link) => (
                      <Link key={link.to} to={link.to} className="text-sm text-slate-600 transition hover:text-sky-800">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-white/70 pt-4 text-sm text-slate-500">
              <span>{t("footer.language")}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/70 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <span>{t("footer.maintained")}</span>
            <span>{t("footer.copyright")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

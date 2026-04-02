import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { brandAssets, externalLinks } from "../config/links";
import { siteMode } from "../config/siteMode";
import { projectMeta } from "../data/portalData";
import type { SupportedLanguage } from "../i18n/language";
import { resolveLocalizedText } from "../utils/content";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t, i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;
  const currentYear = new Date().getFullYear();
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
  const externalNavLinks = [
    { label: "Portal", href: externalLinks.portalRepo.href },
    { label: "Main Page", href: externalLinks.mainWebRepo.href },
    { label: "Recruitment", href: externalLinks.recruitmentSite.href },
  ];
  const logoLinks = [
    { href: externalLinks.jlu.href, src: brandAssets.jluLogo, alt: "Jilin University logo", label: "JLU" },
    { href: externalLinks.utad.href, src: brandAssets.utadLogo, alt: "UTAD logo", label: "UTAD" },
  ];

  return (
    <footer className="mt-14 border-t border-white/60 bg-white/45 backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div>
              <p className="mt-2 text-lg font-semibold text-slate-950">{projectMeta.projectName}</p>
              <p className="mt-1 text-sm text-slate-500">{resolveLocalizedText(projectMeta.term, language)}</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t("footer.description")}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{t("footer.subtitle")}</p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
              {sitemapGroups.flatMap((group) => group.links).map((link) => (
                <Link key={link.to} to={link.to} className="font-medium transition hover:text-sky-800">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-base text-slate-700">
              {externalNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold transition hover:text-sky-800"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={externalLinks.portalRepo.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-4 py-2 text-[0.95rem] font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-white"
                aria-label="GitHub repository"
              >
                <span>repo</span>
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <div className="flex items-center gap-3">
              {logoLinks.map((logo) => (
                <a
                  key={logo.label}
                  href={logo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 px-3 shadow-sm transition hover:-translate-y-0.5"
                  aria-label={logo.label}
                >
                  <img src={logo.src} alt={logo.alt} className="h-7 w-auto object-contain" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{t("footer.language")}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/70 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <a href={externalLinks.portalRepo.href} target="_blank" rel="noreferrer" className="transition hover:text-sky-800">
            {t("footer.maintained")}
          </a>
          <span>{`© ${currentYear} DSD2026-Team-M2 · Licensed under the MIT License`}</span>
        </div>
      </div>
    </footer>
  );
}

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";

import { brandAssets } from "../config/links";
import { siteMode } from "../config/siteMode";
import { projectMeta } from "../data/portalData";
import type { SupportedLanguage } from "../i18n/language";
import { resolveLocalizedText } from "../utils/content";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navItems = [
  { to: "/", key: "nav.overview", end: true },
  { to: "/progress", key: "nav.progress" },
  { to: "/logs", key: "nav.logs" },
  { to: "/docs", key: "nav.docs" },
  { to: "/architecture", key: "nav.architecture" },
  { to: "/calendar", key: "nav.calendar" },
  { to: "/team", key: "nav.team" },
  ...(siteMode.showTemplateExamples ? [{ to: "/examples", key: "nav.examples" }] : []),
];

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  useEffect(() => {
    const onScroll = (): void => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        isScrolled
          ? "border-white/70 bg-white/70 shadow-[0_16px_36px_rgba(148,163,184,0.15)] backdrop-blur-xl"
          : "border-transparent bg-white/40 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
              <img src={brandAssets.m2Logo} alt={t("nav.logoAlt")} className="h-7 w-7 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                {resolveLocalizedText(projectMeta.subtitle, language)}
              </p>
              <p className="truncate text-base font-semibold text-slate-950">{projectMeta.projectName}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label={t("nav.primaryAria")}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `section-link ${isActive ? "section-link-active" : ""}`}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <span className="text-sm text-slate-500">{t("nav.language")}</span>
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className="inline-flex rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700 xl:hidden"
            aria-label={t("nav.toggleMenu")}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-slate-200/80 py-4 xl:hidden">
            <nav className="grid gap-2" aria-label={t("nav.mobileAria")}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `section-link ${isActive ? "section-link-active" : ""}`}
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">{t("nav.language")}</span>
              <LanguageSwitcher />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

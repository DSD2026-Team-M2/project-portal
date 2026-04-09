import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { brandAssets } from "../config/links";
import { siteMode } from "../config/siteMode";
import { projectMeta } from "../data/portalData";
import type { SupportedLanguage } from "../i18n/language";
import { resolveLocalizedText } from "../utils/content";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavItem = {
  to: string;
  key: string;
  end?: boolean;
  priority: "core" | "secondary";
};

const navItems: NavItem[] = [
  { to: "/", key: "nav.overview", end: true, priority: "core" },
  { to: "/progress", key: "nav.progress", priority: "core" },
  { to: "/logs", key: "nav.logs", priority: "core" },
  { to: "/docs", key: "nav.docs", priority: "core" },
  { to: "/architecture", key: "nav.architecture", priority: "secondary" },
  { to: "/calendar", key: "nav.calendar", priority: "secondary" },
  { to: "/team", key: "nav.team", priority: "secondary" },
  ...(siteMode.showTemplateExamples ? [{ to: "/examples", key: "nav.examples", priority: "secondary" as const }] : []),
];

const coreNavItems = navItems.filter((item) => item.priority === "core");
const secondaryNavItems = navItems.filter((item) => item.priority === "secondary");

function matchesNavPath(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);
  const language = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  const moreLabel = useMemo(
    () =>
      ({
        en: "More",
        "zh-CN": "更多",
        pt: "Mais",
      })[language] ?? "More",
    [language],
  );

  const overflowActive = secondaryNavItems.some((item) => matchesNavPath(location.pathname, item.to));

  useEffect(() => {
    const onScroll = (): void => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsTabletMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = (): void => {
      if (window.innerWidth >= 1280) {
        setIsTabletMenuOpen(false);
      }

      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        isScrolled
          ? "border-white/70 bg-white/72 shadow-[0_16px_36px_rgba(148,163,184,0.15)] backdrop-blur-xl"
          : "border-transparent bg-white/44 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center gap-3 md:gap-4">
          <Link to="/" className="flex min-w-0 flex-1 items-center gap-3 xl:flex-none">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
              <img src={brandAssets.m2Logo} alt={t("nav.logoAlt")} className="h-7 w-7 object-contain" />
            </div>

            <div className="min-w-0">
              <p className="hidden text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500 xl:block">
                {resolveLocalizedText(projectMeta.subtitle, language)}
              </p>
              <p className="header-brand-title hidden xl:block">{projectMeta.projectName}</p>
              <p className="header-brand-title xl:hidden">{resolveLocalizedText(projectMeta.shortTitle, language)}</p>
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

          <div className="relative hidden items-center gap-2 md:flex xl:hidden">
            <nav className="flex items-center gap-1" aria-label={t("nav.primaryAria")}>
              {coreNavItems.map((item) => (
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

            <button
              type="button"
              className={`section-link inline-flex items-center gap-1.5 ${isTabletMenuOpen || overflowActive ? "section-link-active" : ""}`}
              aria-expanded={isTabletMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsTabletMenuOpen((value) => !value)}
            >
              <span>{moreLabel}</span>
              <ChevronDown className={`h-4 w-4 transition ${isTabletMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isTabletMenuOpen ? (
              <div className="header-tablet-panel" role="menu" aria-label={moreLabel}>
                <nav className="grid gap-2" aria-label={t("nav.mobileAria")}>
                  {secondaryNavItems.map((item) => (
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

                <div className="mt-4 border-t border-slate-200/80 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {t("nav.language")}
                  </p>
                  <LanguageSwitcher />
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 rounded-xl border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-700 md:hidden"
            aria-label={t("nav.toggleMenu")}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="md:hidden">
          <button
            type="button"
            className="fixed inset-0 top-[73px] z-40 bg-slate-950/12 backdrop-blur-[2px]"
            aria-label={t("nav.toggleMenu")}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="header-mobile-panel">
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

            <div className="mt-5 border-t border-slate-200/80 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {t("nav.language")}
              </p>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

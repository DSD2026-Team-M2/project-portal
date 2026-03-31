export type ExternalLinkDefinition = {
  label: string;
  href: string;
  archived?: boolean;
};

export type TeamLinkDefinition = {
  label: string;
  href: string;
  directWithM2?: boolean;
};

export const brandAssets = {
  m2Logo: "https://dsd2026-team-m2.github.io/m2-recruitment/images/logos/team-logo.png",
} as const;

export const externalLinks = {
  m2Org: {
    label: "M2 GitHub Org",
    href: "https://github.com/DSD2026-Team-M2",
  },
  portalRepo: {
    label: "project-portal",
    href: "https://github.com/DSD2026-Team-M2/project-portal",
  },
  mainWebRepo: {
    label: "project-main-web",
    href: "https://github.com/DSD2026-Team-M2/project-main-web",
  },
  recruitmentRepo: {
    label: "m2-recruitment",
    href: "https://github.com/DSD2026-Team-M2/m2-recruitment",
    archived: true,
  },
  recruitmentSite: {
    label: "Recruitment Site",
    href: "https://dsd2026-team-m2.github.io/m2-recruitment/",
    archived: true,
  },
} satisfies Record<string, ExternalLinkDefinition>;

export const footerExternalLinks = [
  externalLinks.portalRepo,
  externalLinks.mainWebRepo,
  externalLinks.recruitmentSite,
  externalLinks.m2Org,
];

export const partnerTeamLinks = {
  S1: { label: "S1", href: "/architecture#team-s1" },
  S2: { label: "S2", href: "/architecture#team-s2" },
  V1: { label: "V1", href: "/architecture#team-v1" },
  V2: { label: "V2", href: "/architecture#team-v2", directWithM2: true },
  M1: { label: "M1", href: "/architecture#team-m1", directWithM2: true },
  M2: { label: "M2", href: "/architecture#team-m2", directWithM2: true },
} satisfies Record<string, TeamLinkDefinition>;

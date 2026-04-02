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

export type TeamResourceLinks = {
  repo?: ExternalLinkDefinition;
  overview?: ExternalLinkDefinition;
};

export type HistoricalReferenceDefinition = {
  id: string;
  label: string;
  repo?: ExternalLinkDefinition;
  overview?: ExternalLinkDefinition;
};

export const brandAssets = {
  m2Logo: "https://dsd2026-team-m2.github.io/m2-recruitment/images/logos/team-logo.png",
  jluLogo: "/images/logos/jlu-logo.webp",
  utadLogo: "/images/logos/utad-logo.jpg",
} as const;

export const externalLinks = {
  m2Org: {
    label: "M2 GitHub Org",
    href: "https://github.com/DSD2026-Team-M2",
  },
  jlu: {
    label: "Jilin University",
    href: "https://en.jlu.edu.cn/",
  },
  utad: {
    label: "UTAD",
    href: "https://www.utad.pt/",
  },
  portalRepo: {
    label: "project-portal",
    href: "https://github.com/DSD2026-Team-M2/project-portal",
  },
  portalSite: {
    label: "project-portal site",
    href: "https://dsd2026-team-m2.github.io/project-portal/",
  },
  portalCalendarFeed: {
    label: "M2 project calendar feed (complete)",
    href: "https://dsd2026-team-m2.github.io/project-portal/calendar/m2-project-complete.ics",
  },
  portalCalendarFeedCnTeam: {
    label: "M2 project calendar feed (CN team)",
    href: "https://dsd2026-team-m2.github.io/project-portal/calendar/m2-project-cn-team.ics",
  },
  portalCalendarFeedPtTeam: {
    label: "M2 project calendar feed (PT team)",
    href: "https://dsd2026-team-m2.github.io/project-portal/calendar/m2-project-pt-team.ics",
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

export const projectResourceLinks = {
  main: {
    repo: {
      label: "DSD Wiki",
      href: "https://github.com/michro/DSD/wiki",
    },
    overview: {
      label: "DSD Wiki Home",
      href: "https://github.com/michro/DSD/wiki",
    },
  },
  portal: {
    repo: externalLinks.portalRepo,
    overview: {
      label: "Portal overview",
      href: "/",
    },
  },
} as const;

export const teamResourceLinks: Record<string, TeamResourceLinks> = {
  S1: {
    repo: {
      label: "S1 GitHub",
      href: "https://github.com/DSD-S1-TEST/DSD-S1.github.io",
    },
    overview: {
      label: "S1 Overview",
      href: "https://dsd-s1-test.github.io/DSD-S1.github.io/#/",
    },
  },
  S2: {
    repo: {
      label: "S2 GitHub",
      href: "https://github.com/rsdbkhusky/DSD2026_TeamS2",
    },
    overview: {
      label: "S2 Overview",
      href: "https://rsdbkhusky.github.io/DSD2026_TeamS2/",
    },
  },
  V1: {
    repo: {
      label: "V1 GitHub",
      href: "https://github.com/abenjas69/DSD2026_TeamV1",
    },
    overview: {
      label: "V1 Overview",
      href: "https://abenjas69.github.io/DSD2026_TeamV1/",
    },
  },
  V2: {
    overview: {
      label: "V2 Overview",
      href: "https://smonizzzz.github.io/dsd2026-teamv2/",
    },
  },
  M1: {
    repo: {
      label: "M1 GitHub",
      href: "https://github.com/diogopinhel/DSD2026_TeamM1",
    },
    overview: {
      label: "M1 Overview",
      href: "https://diogopinhel.github.io/DSD2026_TeamM1/",
    },
  },
  M2: {
    repo: externalLinks.portalRepo,
    overview: {
      label: "Portal overview",
      href: "/",
    },
  },
};

export const historicalReferenceLinks: HistoricalReferenceDefinition[] = [
  {
    id: "wiki-2025",
    label: "DSD 2025",
    overview: {
      label: "DSD 2025",
      href: "https://github.com/michro/DSD/wiki/DSD2025",
    },
  },
  {
    id: "wiki-2023",
    label: "DSD 2023",
    overview: {
      label: "DSD 2023",
      href: "https://github.com/michro/DSD/wiki/DSD2023",
    },
  },
  {
    id: "wiki-2020-spring",
    label: "DSD 2020 Spring",
    overview: {
      label: "DSD 2020 Spring",
      href: "https://github.com/michro/DSD/wiki/DSD2020SPRING",
    },
  },
  {
    id: "wiki-2019",
    label: "DSD 2019",
    overview: {
      label: "DSD 2019",
      href: "https://github.com/michro/DSD/wiki/DSD2019",
    },
  },
  {
    id: "dsd-db-main",
    label: "DSD DB",
    repo: {
      label: "GitHub repo",
      href: "https://github.com/dsd-db/main",
    },
  },
  {
    id: "pigeonhole",
    label: "Pigeonhole",
    repo: {
      label: "GitHub repo",
      href: "https://github.com/PigeonholeDSD/homepage",
    },
    overview: {
      label: "Project overview",
      href: "https://pigeonhole.fun/",
    },
  },
  {
    id: "jlu-dsd",
    label: "JLU DSD",
    repo: {
      label: "GitHub repo",
      href: "https://github.com/WNJXYK/JLU_DSD",
    },
    overview: {
      label: "Project overview",
      href: "https://zhouz.dev/JLU_DSD/",
    },
  },
  {
    id: "rock-house",
    label: "Rock House",
    repo: {
      label: "GitHub repo",
      href: "https://github.com/zhouyuheng2003/DSD2024-rock-house",
    },
  },
  {
    id: "dsd2024-github-io",
    label: "DSD2024",
    repo: {
      label: "GitHub repo",
      href: "https://github.com/Divpeter/DSD2024.github.io",
    },
  },
  {
    id: "dream-share-discover",
    label: "Dream Share Discover",
    repo: {
      label: "GitHub repo",
      href: "https://github.com/zkc3783/dream-share-discover",
    },
  },
  {
    id: "backrooms",
    label: "Backrooms DSD2024",
    repo: {
      label: "GitHub repo",
      href: "https://github.com/Irodixy/Backrooms_dsd2024",
    },
  },
  {
    id: "articuchic",
    label: "ArticuChic",
    overview: {
      label: "Project overview",
      href: "https://caixu.me/ArticuChic_Page/",
    },
  },
  {
    id: "distributed-system-development",
    label: "Distributed System Development",
    overview: {
      label: "Project overview",
      href: "https://cantilenattt.github.io/Distributed_system_development/",
    },
  },
  {
    id: "group-website",
    label: "Group Website",
    overview: {
      label: "Project overview",
      href: "https://dollybogen.github.io/Group_website/",
    },
  },
  {
    id: "smartstride",
    label: "SmartStride",
    overview: {
      label: "Project overview",
      href: "https://joki-sr.github.io/SmartStride/",
    },
  },
] as const;

export const partnerTeamLinks = {
  S1: { label: "S1", href: "/architecture#team-s1" },
  S2: { label: "S2", href: "/architecture#team-s2" },
  V1: { label: "V1", href: "/architecture#team-v1" },
  V2: { label: "V2", href: "/architecture#team-v2", directWithM2: true },
  M1: { label: "M1", href: "/architecture#team-m1", directWithM2: true },
  M2: { label: "M2", href: "/architecture#team-m2", directWithM2: true },
} satisfies Record<string, TeamLinkDefinition>;

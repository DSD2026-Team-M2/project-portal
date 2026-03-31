import { brandAssets, externalLinks } from "../config/links";
import { siteMode } from "../config/siteMode";
import type { LocalizedText } from "../utils/content";

const text = (en: string, zhCN: string, pt: string): LocalizedText => ({
  en,
  "zh-CN": zhCN,
  pt,
});

export type TeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  timezone: string;
  locationLabel: LocalizedText;
  responsibilityFocus: LocalizedText;
  shortNote: LocalizedText;
  relatedPages: Array<{ labelKey?: string; label?: string; href: string }>;
  relatedRepos: Array<{ label: string; href: string; external?: boolean }>;
  github?: string;
};

export const teamOverview = {
  logo: brandAssets.m2Logo,
  orgLink: externalLinks.m2Org.href,
  collaborationNote: text(
    "M2 works across China and Portugal timezones, so the portal emphasizes time clarity, traceable updates and explicit ownership boundaries.",
    "M2 跨中国与葡萄牙时区协作，因此 portal 特别强调时间清晰度、过程留痕与职责边界。",
    "A M2 trabalha entre os fusos da China e de Portugal, por isso o portal enfatiza clareza temporal, rastreabilidade e fronteiras explícitas de responsabilidade.",
  ),
  scopeSummary: text(
    "This page introduces the people maintaining the portal, not a social-style member wall. It complements the role matrix in architecture with individual working focus.",
    "本页展示维护 portal 的成员与分工，不是社交化成员墙；它补充架构页中的角色矩阵，强调个人当前工作重点。",
    "Esta página apresenta as pessoas que mantêm o portal, e não um mural social. Ela complementa a matriz de papéis da arquitetura com o foco de trabalho individual.",
  ),
};

export const teamMembers: TeamMemberRecord[] = [
  {
    id: "yihang-li",
    name: "Yihang LI",
    role: "PM",
    timezone: "Asia/Shanghai",
    locationLabel: text("China Time", "中国时区", "Hora da China"),
    responsibilityFocus: text(
      "Scope alignment, reporting storyline, review priorities and milestone framing for the portal.",
      "负责范围对齐、汇报叙事、评审优先级与 portal 里程碑框架。",
      "Responsável pelo alinhamento de âmbito, narrativa de apresentação, prioridades de revisão e enquadramento de marcos do portal.",
    ),
    shortNote: text(
      "Keeps the portal aligned with course reporting needs instead of drifting into a product landing page.",
      "确保 portal 始终服务于课程汇报，而不是滑向产品营销页。",
      "Mantém o portal alinhado com a apresentação da disciplina, evitando que ele derive para uma landing page de produto.",
    ),
    relatedPages: [
      { labelKey: "nav.progress", href: "/progress" },
      { labelKey: "nav.docs", href: "/docs" },
    ],
    relatedRepos: [{ label: "project-portal", href: externalLinks.portalRepo.href, external: true }],
  },
  {
    id: "kika-vasconcelos-francisca",
    name: "Kika Vasconcelos Francisca",
    role: "Vice PM / Programmer",
    timezone: "Europe/Lisbon",
    locationLabel: text("Portugal Time", "葡萄牙时区", "Hora de Portugal"),
    responsibilityFocus: text(
      "Cross-timezone coordination, frontend implementation support and review follow-up between architecture and page delivery.",
      "负责跨时区协调、前端实现支持，以及架构与页面交付之间的跟进。",
      "Responsável pela coordenação entre fusos, apoio à implementação frontend e seguimento entre arquitetura e entrega de páginas.",
    ),
    shortNote: text(
      "Bridges CN-PT collaboration constraints into concrete page structure and delivery sequencing.",
      "把中葡协作约束转化为具体页面结构与交付节奏。",
      "Converte as restrições de colaboração China-Portugal em estrutura concreta de páginas e sequência de entrega.",
    ),
    relatedPages: [
      { labelKey: "nav.calendar", href: "/calendar" },
      { labelKey: "nav.architecture", href: "/architecture" },
    ],
    relatedRepos: [
      { label: "project-portal", href: externalLinks.portalRepo.href, external: true },
      { label: "M2 GitHub Org", href: externalLinks.m2Org.href, external: true },
    ],
  },
  {
    id: "duhai-xu",
    name: "Duhai XU",
    role: "Programmer",
    timezone: "Asia/Shanghai",
    locationLabel: text("China Time", "中国时区", "Hora da China"),
    responsibilityFocus: text(
      "Progress views, gantt integration, route implementation and maintainable TypeScript page logic.",
      "负责进度视图、甘特图接入、多页面路由与可维护的 TypeScript 页面逻辑。",
      "Responsável pelas vistas de progresso, integração do gantt, implementação de rotas e lógica de páginas TypeScript fácil de manter.",
    ),
    shortNote: text(
      "Focuses on keeping the portal simple enough for future contributors to extend without rewriting its structure.",
      "重点保证 portal 足够简单，便于后续同学继续维护而无需重写结构。",
      "Foca-se em manter o portal simples o suficiente para futuros contribuidores o estenderem sem reescrever a estrutura.",
    ),
    relatedPages: [
      { labelKey: "nav.progress", href: "/progress" },
      ...(siteMode.showTemplateExamples ? [{ labelKey: "nav.examples", href: "/examples" }] : []),
    ],
    relatedRepos: [{ label: "project-portal", href: externalLinks.portalRepo.href, external: true }],
  },
  {
    id: "congming-li",
    name: "Congming LI",
    role: "Webmaster",
    timezone: "Asia/Shanghai",
    locationLabel: text("China Time", "中国时区", "Hora da China"),
    responsibilityFocus: text(
      "Portal maintenance, content pipeline reliability, deployment-readiness and stable navigation structure.",
      "负责 portal 维护、内容流水线稳定性、部署准备与导航结构稳定。",
      "Responsável pela manutenção do portal, fiabilidade do pipeline de conteúdo, prontidão de deploy e estrutura de navegação estável.",
    ),
    shortNote: text(
      "Keeps the hub coherent when content grows and pages need to remain traceable over time.",
      "在内容持续增长时，负责保持整站结构一致且可追踪。",
      "Mantém o hub coerente à medida que o conteúdo cresce e as páginas precisam permanecer rastreáveis ao longo do tempo.",
    ),
    relatedPages: [
      { labelKey: "nav.overview", href: "/" },
      { labelKey: "nav.logs", href: "/logs" },
    ],
    relatedRepos: [
      { label: "project-portal", href: externalLinks.portalRepo.href, external: true },
      { label: "Recruitment Site", href: externalLinks.recruitmentSite.href, external: true },
    ],
  },
  {
    id: "shu-wang",
    name: "Shu WANG",
    role: "S.A.",
    timezone: "Asia/Shanghai",
    locationLabel: text("China Time", "中国时区", "Hora da China"),
    responsibilityFocus: text(
      "Information architecture revision, content semantics and the boundary between portal summary and detail pages.",
      "负责信息架构修订、内容语义以及首页摘要与详情页之间的边界。",
      "Responsável pela revisão da arquitetura de informação, semântica do conteúdo e fronteira entre resumo e páginas de detalhe.",
    ),
    shortNote: text(
      "Keeps the portal document-first and collaboration-oriented instead of letting it become a generic frontend showcase.",
      "保证 portal 以文档和协作为中心，而不是变成泛化前端展示站。",
      "Mantém o portal orientado a documentos e colaboração, evitando que ele se torne uma montra frontend genérica.",
    ),
    relatedPages: [
      { labelKey: "nav.architecture", href: "/architecture" },
      { labelKey: "nav.docs", href: "/docs" },
    ],
    relatedRepos: [
      { label: "project-portal", href: externalLinks.portalRepo.href, external: true },
      { label: "project-main-web", href: externalLinks.mainWebRepo.href, external: true },
    ],
  },
];

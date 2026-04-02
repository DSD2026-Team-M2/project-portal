import { brandAssets, externalLinks } from "../config/links";
import type { LocalizedText } from "../utils/content";

const text = (en: string, zhCN: string, pt: string): LocalizedText => ({
  en,
  "zh-CN": zhCN,
  pt,
});

export type TeamMemberRecord = {
  id: string;
  name: string;
  displayCode?: string;
  role: string;
  timezone: string;
  group: "core" | "faculty" | "ai";
  photoPath?: string;
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
    "M2 works across China and Portugal timezones, so the portal keeps time, updates and ownership clearly visible.",
    "M2 在中国与葡萄牙时区之间协作，因此 portal 会持续保持时间、进展更新与职责归属的清晰可见。",
    "A M2 trabalha entre os fusos da China e de Portugal, por isso o portal mantém tempo, atualizações e responsabilidades sempre visíveis.",
  ),
  scopeSummary: text(
    "This page introduces the M2 team, faculty guidance and AI support involved in the portal.",
    "本页展示参与 portal 的 M2 团队、教师指导角色和 AI 协作支持。",
    "Esta página apresenta a equipa M2, a orientação docente e o apoio de IA envolvidos no portal.",
  ),
};

export const teamMembers: TeamMemberRecord[] = [
  {
    id: "yihang-li",
    name: "Lee",
    displayCode: "Lee-YihangLI-55230714",
    role: "Project Manager",
    timezone: "Asia/Shanghai",
    group: "core",
    photoPath: "images/members/yihang-li.jpg",
    locationLabel: text("🇨🇳 China Time", "🇨🇳 中国时区", "🇨🇳 Hora da China"),
    responsibilityFocus: text(
      "Owns task assignment, overall delivery push, cadence control, requirement alignment and external communication across the project.",
      "负责任务分配、整体推进、节奏控制、需求对齐和项目对外沟通。",
      "Responsável pela atribuição de tarefas, avanço global do trabalho, controlo do ritmo, alinhamento de requisitos e comunicação externa do projeto.",
    ),
    shortNote: text(
      "Keeps the team moving with clear priorities and makes sure cross-group coordination stays actionable instead of vague.",
      "让团队在清晰优先级下推进，并确保跨组沟通保持具体、可执行。",
      "Mantém a equipa a avançar com prioridades claras e garante que a coordenação entre grupos permaneça concreta e acionável.",
    ),
    relatedPages: [
      { labelKey: "nav.progress", href: "/progress" },
      { labelKey: "nav.docs", href: "/docs" },
    ],
    relatedRepos: [{ label: "project-portal", href: externalLinks.portalRepo.href, external: true }],
  },
  {
    id: "kika-vasconcelos-francisca",
    name: "Kika",
    displayCode: "Vasconcelos Francisca",
    role: "Vice PM / Programmer",
    timezone: "Europe/Lisbon",
    group: "core",
    photoPath: "images/members/vasconcelos-francisca.jpg",
    locationLabel: text("🇵🇹 Portugal Time", "🇵🇹 葡萄牙时区", "🇵🇹 Hora de Portugal"),
    responsibilityFocus: text(
      "Works remotely in Portugal through asynchronous collaboration, coordinates handoff with the PM, and implements interface logic for static rehabilitation data and rehabilitation history views.",
      "在葡萄牙远程异步协作，负责与 PM 对接，并实现用户界面逻辑功能，展示静态康复数据和历史康复记录。",
      "Trabalha remotamente em Portugal com colaboração assíncrona, faz o handoff com o PM e implementa a lógica da interface para dados estáticos de reabilitação e registos históricos de reabilitação.",
    ),
    shortNote: text(
      "Acts as the cross-timezone bridge for M2 so remote implementation work still lands in step with the team's main rhythm.",
      "作为 M2 的跨时区桥梁，保证远程实现工作仍能和团队主节奏对齐。",
      "Funciona como ponte entre fusos na M2 para que o trabalho remoto de implementação continue alinhado com o ritmo principal da equipa.",
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
    name: "Shu",
    displayCode: "Hai-DuhaiXU-21230517",
    role: "Programmer",
    timezone: "Asia/Shanghai",
    group: "core",
    photoPath: "images/members/duhai-xu.jpg",
    locationLabel: text("🇨🇳 China Time", "🇨🇳 中国时区", "🇨🇳 Hora da China"),
    responsibilityFocus: text(
      "Implements 3D reconstruction from sensor acquisition data and builds the related visualization workflow for the web presentation.",
      "负责实现传感器采集数据的三维重建，并完成相关展示流程。",
      "Implementa a reconstrução 3D a partir de dados recolhidos pelos sensores e constrói o fluxo de visualização correspondente para a apresentação web.",
    ),
    shortNote: text(
      "Keeps the data-to-visual pipeline concrete so sensor outputs can become something the team can actually present and inspect.",
      "把数据到展示的链路做实，让传感器输出真正变成可展示、可检查的结果。",
      "Mantém o pipeline de dados para visualização concreto, para que as saídas dos sensores se tornem algo que a equipa possa realmente apresentar e inspecionar.",
    ),
    relatedPages: [
      { labelKey: "nav.architecture", href: "/architecture" },
      { labelKey: "nav.progress", href: "/progress" },
    ],
    relatedRepos: [{ label: "project-portal", href: externalLinks.portalRepo.href, external: true }],
  },
  {
    id: "congming-li",
    name: "BFD_qt",
    displayCode: "Congming-CongmingLI-38230227",
    role: "Web Maintainer",
    timezone: "Asia/Shanghai",
    group: "core",
    photoPath: "images/members/congming-li.jpg",
    locationLabel: text("🇨🇳 China Time", "🇨🇳 中国时区", "🇨🇳 Hora da China"),
    responsibilityFocus: text(
      "Owns team homepage development and maintenance, and keeps the project process and progress records visible on the site.",
      "负责队伍主页开发与维护，并记录项目开发过程与进展。",
      "Responsável pelo desenvolvimento e manutenção da página da equipa, além de manter visíveis no site os registos do processo e do progresso do projeto.",
    ),
    shortNote: text(
      "Acts as the continuity layer of the portal so the homepage remains current while the project itself keeps changing.",
      "作为 portal 的连续性维护层，让主页在项目持续变化时仍能同步更新。",
      "Funciona como camada de continuidade do portal, mantendo a homepage atualizada mesmo enquanto o projeto continua a mudar.",
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
    name: "Hai",
    displayCode: "Shu-ShuWANG-35232116",
    role: "System Architect and Designer",
    timezone: "Asia/Shanghai",
    group: "core",
    photoPath: "images/members/shu-wang.jpg",
    locationLabel: text("🇨🇳 China Time", "🇨🇳 中国时区", "🇨🇳 Hora da China"),
    responsibilityFocus: text(
      "Leads page design, project requirement analysis and user research to keep the portal grounded in actual usage and review needs.",
      "负责网页页面设计、项目需求分析与用户调研，让 portal 设计始终贴合真实使用与评审需求。",
      "Responsável pelo desenho das páginas web, análise de requisitos do projeto e investigação com utilizadores, mantendo o portal alinhado com necessidades reais de uso e revisão.",
    ),
    shortNote: text(
      "Connects interface decisions back to requirements and user understanding, not just visual preference.",
      "把界面决策持续拉回需求和用户理解，而不是只停留在视觉偏好层面。",
      "Liga continuamente as decisões de interface aos requisitos e à compreensão do utilizador, e não apenas à preferência visual.",
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
  {
    id: "prof-rui-zhang",
    name: "Prof. Rui ZHANG",
    role: "Course Instructor",
    timezone: "Europe/Lisbon",
    group: "faculty",
    locationLabel: text("🇵🇹 Faculty", "🇵🇹 教师", "🇵🇹 Revisão Docente"),
    responsibilityFocus: text(
      "Provides teaching-side review, guidance and milestone feedback related to the project portal and course deliverables.",
      "负责项目 portal 与课程交付物相关的评审、指导和里程碑反馈。",
      "Responsável pela revisão docente, orientação e feedback de marcos relacionados com o portal do projeto e os entregáveis da disciplina.",
    ),
    shortNote: text(
      "Supports the team through review comments, direction setting and academic feedback during the project.",
      "通过评审意见、方向把控与课程反馈为团队提供支持。",
      "Apoia a equipa com comentários de revisão, definição de direção e feedback académico ao longo do projeto.",
    ),
    relatedPages: [
      // { labelKey: "nav.docs", href: "/docs" },
      // { labelKey: "nav.progress", href: "/progress" },
    ],
    relatedRepos: [],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    role: "AI Pair Programmer",
    timezone: "Async / IDE",
    group: "ai",
    photoPath: "images/members/copilot.jpg",
    locationLabel: text("☁️ AI Assist", "☁️ AI 协作", "☁️ Assistência IA"),
    responsibilityFocus: text(
      "Supports autocomplete, inline coding assistance and fast iteration while implementing portal UI and content-adjacent frontend logic.",
      "用于代码补全、行内实现辅助和快速迭代，主要服务于 portal UI 与内容相关前端逻辑的实现。",
      "Apoia autocomplete, assistência inline de código e iteração rápida durante a implementação da UI do portal e da lógica frontend adjacente ao conteúdo.",
    ),
    shortNote: text(
      "Best used for local code acceleration and short implementation loops, not for making final scope decisions.",
      "更适合本地代码加速和短实现循环，不用于替代最终范围判断。",
      "É mais útil para acelerar código local e ciclos curtos de implementação, não para substituir decisões finais de âmbito.",
    ),
    relatedPages: [
      // { labelKey: "nav.progress", href: "/progress" },
      // { labelKey: "nav.docs", href: "/docs" },
    ],
    relatedRepos: [
      { label: "GitHub Copilot", href: "https://github.com/features/copilot", external: true },
    ],
  },
  {
    id: "codex",
    name: "Codex",
    role: "AI Coding Agent",
    timezone: "Async / Workspace",
    group: "ai",
    photoPath: "images/members/codex.jpg",
    locationLabel: text("☁️ AI Assist", "☁️ AI 协作", "☁️ Assistência IA"),
    responsibilityFocus: text(
      "Helps inspect the repository, implement page fixes, scaffold document structures and carry portal tasks through build verification.",
      "用于仓库检查、页面修复、文档骨架搭建，以及把 portal 任务推进到构建验证完成。",
      "Ajuda a inspecionar o repositório, implementar correções de páginas, criar estruturas documentais e levar tarefas do portal até à verificação de build.",
    ),
    shortNote: text(
      "Useful for end-to-end coding tasks and repetitive maintenance work that still needs human direction and review.",
      "适合端到端编码任务和重复性维护工作，但仍需要人工方向与复核。",
      "É útil para tarefas de código end-to-end e manutenção repetitiva, mas continua a exigir direção e revisão humanas.",
    ),
    relatedPages: [
      // { labelKey: "nav.calendar", href: "/calendar" },
      // { labelKey: "nav.team", href: "/team" },
    ],
    relatedRepos: [
      { label: "OpenAI Codex", href: "https://openai.com", external: true },
    ],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    role: "AI Repo Assistant",
    timezone: "Async / Terminal",
    group: "ai",
    photoPath: "images/members/claude.jpg",
    locationLabel: text("☁️ AI Assist", "☁️ AI 协作", "☁️ Assistência IA"),
    responsibilityFocus: text(
      "Supports repo-aware editing, wording refinement, workflow guidance and implementation discussion around portal structure and delivery prep.",
      "用于基于仓库上下文的编辑支持、措辞优化、工作流建议，以及围绕 portal 结构和交付准备的实现讨论。",
      "Apoia edição com contexto do repositório, refinamento de redação, orientação de workflow e discussão de implementação em torno da estrutura do portal e da preparação de entrega.",
    ),
    shortNote: text(
      "Useful when the team wants stronger code-and-writing collaboration in the same workspace, especially during review crunch.",
      "适合在同一工作区里进行代码与写作混合协作，尤其适合评审冲刺阶段。",
      "É útil quando a equipa quer colaboração combinada de código e escrita no mesmo workspace, especialmente em momentos de revisão intensa.",
    ),
    relatedPages: [
      // { labelKey: "nav.logs", href: "/logs" },
      // { labelKey: "nav.docs", href: "/docs" },
    ],
    relatedRepos: [
      { label: "Claude Code", href: "https://www.anthropic.com", external: true },
    ],
  },
  
];

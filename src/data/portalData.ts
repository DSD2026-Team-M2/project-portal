import type { LocalizedText } from "../utils/content";

const text = (en: string, zhCN: string, pt: string): LocalizedText => ({
  en,
  "zh-CN": zhCN,
  pt,
});

export type SummaryCard = {
  id: string;
  stat: LocalizedText;
  detail: LocalizedText;
};

export type TeamRecord = {
  id: string;
  layer: "sensor" | "server" | "monitor";
  responsibility: LocalizedText;
  primaryInputs: LocalizedText;
  primaryOutputs: LocalizedText;
  dependsOn: string[];
  dependedBy: string[];
  repoLinks: Array<{ label: string; href: string }>;
  status: string;
  directInterfaceWithM2: boolean;
};

export type RepositoryRecord = {
  id: string;
  maintainedBy: string;
  role: LocalizedText;
  status: string;
  summary: LocalizedText;
  dependencies: string[];
  href: string;
  archived?: boolean;
};

export type InterfaceRecord = {
  id: string;
  from: string;
  to: string;
  summary: LocalizedText;
  m2Usage: LocalizedText;
  relatedTeams: string[];
};

export type RoleRecord = {
  id: string;
  description: LocalizedText;
};

export type CalendarEventRecord = {
  id: string;
  title: LocalizedText;
  type: "milestone" | "meeting" | "course" | "deadline" | "demo";
  start: string;
  end?: string;
  allDay?: boolean;
  relatedTeams: string[];
  summary: LocalizedText;
  link: string;
  tags: string[];
  sample?: boolean;
};

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createWeeklyCalendarEvents(
  startDate: string,
  endDate: string,
  dayOfWeek: number,
  buildEvent: (isoDate: string) => CalendarEventRecord,
) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const cursor = new Date(start);

  while (cursor.getDay() !== dayOfWeek) {
    cursor.setDate(cursor.getDate() + 1);
  }

  const events: CalendarEventRecord[] = [];

  while (cursor <= end) {
    events.push(buildEvent(toIsoDate(cursor)));
    cursor.setDate(cursor.getDate() + 7);
  }

  return events;
}

export const projectMeta = {
  projectName: "Limb Motion Recognition and Assistant",
  courseName: text(
    "Distributed Software Development",
    "分布式软件开发",
    "Desenvolvimento Distribuido de Software",
  ),
  term: text("2025-2026 · Semester 2", "2025-2026 · 第二学期", "2025-2026 · Semestre 2"),
  subtitle: text("DSD 2025-2026 · Project Portal", "DSD 2025-2026 · 项目中枢", "DSD 2025-2026 · Portal do Projeto"),
  lastUpdated: "2026-04-02",
  license: "MIT",
};

export const projectPositioning = {
  project: text(
    "This project builds a limb motion recognition and assistance system through coordinated work across sensing, backend processing, AI support and monitor-side web teams.",
    "该项目通过传感、后端处理、AI 支持与监测端网页团队协作，构建一个肢体运动识别与辅助系统。",
    "Este projeto constrói um sistema de reconhecimento e assistência ao movimento dos membros através do trabalho coordenado entre equipas de sensores, backend, apoio por IA e web de monitorização.",
  ),
  portal: text(
    "The portal is the hub for progress tracking, documentation indexing, meeting records, deliverable access and cross-team visibility.",
    "该 portal 是项目进度跟踪、文档索引、会议记录、交付物入口与跨组可见性的中枢站。",
    "O portal funciona como centro de acompanhamento de progresso, indexação de documentos, registos de reuniões, acesso a entregáveis e visibilidade entre equipas.",
  ),
  boundary: text(
    "M2 maintains this portal and the clinical dashboard facing narrative, while the main product web frontend remains in a separate repository maintained by another responsible group.",
    "M2 负责维护本 portal 以及与临床 dashboard 相关的可见网页叙事；主产品网页前端仍由其他负责小组在独立仓库维护。",
    "A M2 mantém este portal e a narrativa web visível relacionada com o dashboard clínico, enquanto o frontend principal do produto permanece num repositório separado mantido por outra equipa responsável.",
  ),
};

export const positioningSummaryCards: SummaryCard[] = [
  {
    id: "system",
    stat: text("3 layers / 6 teams", "3 层 / 6 组", "3 camadas / 6 equipas"),
    detail: text(
      "Sensor, server and monitor layers are shown together with IF1 and IF2 dependencies.",
      "以 Sensor、Server、Monitor 三层以及 IF1、IF2 依赖统一展示整体结构。",
      "As camadas de sensores, servidor e monitorização são apresentadas com as dependências IF1 e IF2.",
    ),
  },
  {
    id: "progress",
    stat: text("Portal revision cycle", "Portal 重构周期", "Ciclo de revisao do portal"),
    detail: text(
      "The current iteration focuses on portal shell completion, IF2 coordination and demo preparation.",
      "当前迭代聚焦 portal 外壳完成、IF2 对接协调与 demo 准备。",
      "A iteração atual foca-se na conclusão da estrutura do portal, coordenação do IF2 e preparação da demonstração.",
    ),
  },
  {
    id: "docs",
    stat: text("9 indexed categories", "9 个索引分类", "9 categorias indexadas"),
    detail: text(
      "Formal deliverables, weekly records, meetings and research notes are indexed in one place.",
      "正式交付物、周报、会议与研究记录被集中索引在同一入口中。",
      "Entregáveis formais, relatórios semanais, reuniões e notas de investigação ficam indexados num único local.",
    ),
  },
  {
    id: "teams",
    stat: text("M2 boundary clarified", "M2 边界清晰", "Fronteira da M2 clarificada"),
    detail: text(
      "The portal distinguishes M2 ownership from related repositories and upstream dependencies.",
      "portal 明确区分 M2 自身职责、相关仓库以及上游依赖边界。",
      "O portal distingue claramente a responsabilidade da M2 dos repositórios relacionados e das dependências a montante.",
    ),
  },
];

export const teams: TeamRecord[] = [
  {
    id: "S1",
    layer: "sensor",
    responsibility: text(
      "Design and maintain the limb-side sensing workflow, including acquisition reliability and device-side capture constraints.",
      "负责肢体侧传感流程设计与维护，包括采集可靠性和设备端采样约束。",
      "Responsável pelo desenho e manutenção do fluxo de sensores do lado do membro, incluindo fiabilidade de aquisição e restrições de captura no dispositivo.",
    ),
    primaryInputs: text(
      "Hardware constraints, sampling configuration and field calibration decisions.",
      "硬件约束、采样配置与现场校准决策。",
      "Restrições de hardware, configuração de amostragem e decisões de calibração em campo.",
    ),
    primaryOutputs: text(
      "Structured sensor streams and acquisition status notes for upstream processing teams.",
      "面向上游处理团队的结构化传感数据流与采集状态说明。",
      "Fluxos de sensores estruturados e notas sobre o estado de aquisição para as equipas de processamento a montante.",
    ),
    dependsOn: [],
    dependedBy: ["V1", "V2"],
    repoLinks: [{ label: "Architecture", href: "/architecture#team-s1" }],
    status: "active",
    directInterfaceWithM2: false,
  },
  {
    id: "S2",
    layer: "sensor",
    responsibility: text(
      "Support data capture validation, hardware iteration feedback and sensing-side reliability checks.",
      "负责数据采集验证、硬件迭代反馈与传感侧可靠性检查。",
      "Apoia a validação da captura de dados, feedback de iterações de hardware e verificações de fiabilidade do lado dos sensores.",
    ),
    primaryInputs: text(
      "Capture plans, field tests and issue reports from sensing sessions.",
      "采集计划、现场测试以及传感会话中的问题记录。",
      "Planos de captura, testes em campo e registos de problemas das sessões de sensores.",
    ),
    primaryOutputs: text(
      "Validated sensing batches, troubleshooting notes and coordination feedback to server teams.",
      "校验后的采集批次、排障记录以及反馈给 server 团队的协作说明。",
      "Lotes de sensores validados, notas de troubleshooting e feedback de coordenação para as equipas de servidor.",
    ),
    dependsOn: [],
    dependedBy: ["V1", "V2"],
    repoLinks: [{ label: "Architecture", href: "/architecture#team-s2" }],
    status: "active",
    directInterfaceWithM2: false,
  },
  {
    id: "V1",
    layer: "server",
    responsibility: text(
      "Handle backend-side data processing support, dataset preparation and server-side pipeline continuity.",
      "负责后端侧数据处理支持、数据集准备与服务端流水线连续性。",
      "Trata do suporte ao processamento backend, preparação de datasets e continuidade do pipeline do lado do servidor.",
    ),
    primaryInputs: text(
      "Sensor batches, capture quality notes and processing constraints from PM and architecture decisions.",
      "传感数据批次、采集质量说明以及 PM/架构决策下发的处理约束。",
      "Lotes de sensores, notas de qualidade de captura e restrições de processamento vindas do PM e da arquitetura.",
    ),
    primaryOutputs: text(
      "Normalized data packages and backend notes for downstream service or model consumers.",
      "供下游服务或模型使用的标准化数据包与后端说明。",
      "Pacotes de dados normalizados e notas backend para consumidores de serviços ou modelos a jusante.",
    ),
    dependsOn: ["S1", "S2"],
    dependedBy: ["V2"],
    repoLinks: [{ label: "Architecture", href: "/architecture#team-v1" }],
    status: "active",
    directInterfaceWithM2: false,
  },
  {
    id: "V2",
    layer: "server",
    responsibility: text(
      "Own the data interface outputs exposed to monitor-side consumers, including IF2 payload alignment and service availability.",
      "负责面向 monitor 侧消费者的数据接口输出，包括 IF2 字段对齐与服务可用性。",
      "Detém as saídas de interface de dados expostas aos consumidores de monitorização, incluindo alinhamento do payload IF2 e disponibilidade do serviço.",
    ),
    primaryInputs: text(
      "Processed data packages, model results and interface decisions from server-side coordination.",
      "处理后的数据包、模型结果以及服务端协作中的接口决策。",
      "Pacotes de dados processados, resultados de modelo e decisões de interface da coordenação do lado do servidor.",
    ),
    primaryOutputs: text(
      "IF2-compatible results and service responses consumed by M1 and M2 views.",
      "被 M1 与 M2 页面消费的 IF2 兼容结果和服务响应。",
      "Resultados compatíveis com IF2 e respostas de serviço consumidas pelas vistas da M1 e M2.",
    ),
    dependsOn: ["S1", "S2", "V1"],
    dependedBy: ["M1", "M2"],
    repoLinks: [{ label: "Architecture", href: "/architecture#team-v2" }],
    status: "active",
    directInterfaceWithM2: true,
  },
  {
    id: "M1",
    layer: "monitor",
    responsibility: text(
      "Support monitor-side presentation and user-facing views that depend on processed server outputs.",
      "负责依赖服务端处理结果的监测端呈现与用户侧视图支持。",
      "Apoia a apresentação do lado de monitorização e as vistas voltadas ao utilizador que dependem das saídas processadas do servidor.",
    ),
    primaryInputs: text(
      "IF2 responses, review goals and collaboration requirements for monitor-side presentation.",
      "IF2 响应、评审目标以及面向监测端呈现的协作需求。",
      "Respostas IF2, objetivos de revisão e requisitos de colaboração para a apresentação do lado de monitorização.",
    ),
    primaryOutputs: text(
      "Monitor-side views, coordinated display requirements and feedback on frontend integration readiness.",
      "监测端视图、协同展示需求以及对前端集成就绪度的反馈。",
      "Vistas de monitorização, requisitos de apresentação coordenada e feedback sobre a prontidão de integração frontend.",
    ),
    dependsOn: ["V2"],
    dependedBy: ["M2"],
    repoLinks: [{ label: "Architecture", href: "/architecture#team-m1" }],
    status: "active",
    directInterfaceWithM2: true,
  },
  {
    id: "M2",
    layer: "monitor",
    responsibility: text(
      "Maintain the portal, present M2-visible dashboard narratives and translate upstream outputs into traceable web views for reporting and collaboration.",
      "负责维护 portal，呈现 M2 可见的 dashboard 叙事，并把上游输出转化为可追踪、可汇报、可协作的网页视图。",
      "Mantém o portal, apresenta narrativas visíveis do dashboard da M2 e transforma resultados a montante em vistas web rastreáveis para relatório e colaboração.",
    ),
    primaryInputs: text(
      "IF2 results, meeting decisions, milestone plans and documentation updates from PM and related teams.",
      "来自 PM 与相关小组的 IF2 结果、会议决策、里程碑计划与文档更新。",
      "Resultados IF2, decisões de reuniões, planos de marcos e atualizações documentais vindas do PM e das equipas relacionadas.",
    ),
    primaryOutputs: text(
      "Project portal pages, dashboard-facing narrative shells, indexed records and report-ready snapshots.",
      "项目 portal 页面、面向 dashboard 的叙事外壳、索引化记录以及可直接汇报的快照。",
      "Páginas do portal do projeto, estruturas narrativas voltadas ao dashboard, registos indexados e snapshots prontos para apresentação.",
    ),
    dependsOn: ["V2", "M1"],
    dependedBy: [],
    repoLinks: [
      { label: "Portal repo", href: "/architecture#repo-project-portal" },
      { label: "Architecture", href: "/architecture#team-m2" }
    ],
    status: "active",
    directInterfaceWithM2: true,
  }
];

export const repositories: RepositoryRecord[] = [
  {
    id: "project-main-web",
    maintainedBy: "Related frontend team",
    role: text(
      "Main frontend repository for the project's core data visualisation and product-facing monitor workflow.",
      "项目核心数据可视化与产品向监测流程的主前端仓库。",
      "Repositório frontend principal para a visualização de dados central do projeto e fluxo de monitorização orientado ao produto.",
    ),
    status: "active",
    summary: text(
      "Indexed here as a related repository only. The portal does not replace this product-facing web application.",
      "这里只作为相关仓库索引展示，portal 不替代这个面向产品的网页应用。",
      "É indexado aqui apenas como repositório relacionado. O portal não substitui esta aplicação web voltada ao produto.",
    ),
    dependencies: ["V2", "M1"],
    href: "/architecture#repo-project-main-web",
  },
  {
    id: "project-portal",
    maintainedBy: "M2",
    role: text(
      "Hub repository for progress tracking, document indexing, logs, architecture visibility and calendar coordination.",
      "用于进度跟踪、文档索引、日志留痕、架构可见性与日历协调的中枢仓库。",
      "Repositório central para acompanhamento de progresso, indexação documental, registos, visibilidade de arquitetura e coordenação de calendário.",
    ),
    status: "active",
    summary: text(
      "This repository is the current deliverable for portal maintenance and collaboration visibility owned by M2.",
      "这个仓库是 M2 当前负责的 portal 维护与协作可见性交付物。",
      "Este repositório é o entregável atual da M2 para manutenção do portal e visibilidade de colaboração.",
    ),
    dependencies: ["V2", "M1"],
    href: "/architecture#repo-project-portal",
  },
  {
    id: "m2-recruitment-site",
    maintainedBy: "M2",
    role: text(
      "Archived recruitment site created earlier for M2 team formation and onboarding.",
      "此前为 M2 招募与组队阶段建立的历史招募站。",
      "Site de recrutamento arquivado criado anteriormente para formação e integração da equipa M2.",
    ),
    status: "archived",
    summary: text(
      "Kept as a historical outcome and linked as an archive, but not used as the main narrative for this portal.",
      "作为历史成果存档保留，并作为关联项目展示，但不承担本 portal 的主叙事。",
      "Mantido como resultado histórico e ligado como arquivo, mas não assume a narrativa principal deste portal.",
    ),
    dependencies: [],
    href: "/architecture#repo-m2-recruitment-site",
    archived: true,
  },
];

export const layerSummaries = [
  {
    id: "sensor",
    title: text("Sensor", "Sensor", "Sensor"),
    summary: text(
      "Sensor teams collect and validate limb-side signals before structured delivery to the server layer.",
      "Sensor 层负责采集并校验肢体侧信号，再把结构化结果交给 server 层。",
      "As equipas de sensores recolhem e validam sinais do lado do membro antes da entrega estruturada à camada de servidor.",
    ),
  },
  {
    id: "server",
    title: text("Server", "Server", "Servidor"),
    summary: text(
      "Server teams normalize data, process results and expose outputs through agreed interfaces.",
      "Server 层负责数据标准化、结果处理，并通过约定接口对外提供输出。",
      "As equipas de servidor normalizam dados, processam resultados e expõem saídas através de interfaces acordadas.",
    ),
  },
  {
    id: "monitor",
    title: text("Monitor", "Monitor", "Monitorização"),
    summary: text(
      "Monitor teams translate outputs into readable web views, dashboard narratives and reporting surfaces.",
      "Monitor 层把上游输出转化为可读网页视图、dashboard 叙事与汇报界面。",
      "As equipas de monitorização transformam resultados em vistas web legíveis, narrativas de dashboard e superfícies de relatório.",
    ),
  },
];

export const interfaces: InterfaceRecord[] = [
  {
    id: "IF1",
    from: "sensor",
    to: "server",
    summary: text(
      "IF1 carries validated sensing outputs from sensor teams into the processing and service layer.",
      "IF1 负责把校验后的传感输出从 sensor 层传递到处理与服务层。",
      "A IF1 transporta saídas validadas dos sensores para a camada de processamento e serviços.",
    ),
    m2Usage: text(
      "M2 does not consume IF1 directly, but depends on its stability because IF1 quality affects downstream server outputs.",
      "M2 不直接消费 IF1，但依赖其稳定性，因为 IF1 质量会影响下游服务端输出。",
      "A M2 não consome a IF1 diretamente, mas depende da sua estabilidade, porque a qualidade da IF1 afeta as saídas do servidor a jusante.",
    ),
    relatedTeams: ["S1", "S2", "V1", "V2"],
  },
  {
    id: "IF2",
    from: "server",
    to: "monitor",
    summary: text(
      "IF2 exposes processed motion results and service payloads from server teams to monitor-side consumers.",
      "IF2 将服务端处理后的动作结果与接口 payload 暴露给 monitor 侧消费者。",
      "A IF2 expõe resultados processados de movimento e payloads de serviço das equipas de servidor para consumidores de monitorização.",
    ),
    m2Usage: text(
      "M2 consumes IF2 outputs to present dashboard summaries, progress evidence and portal-visible coordination notes.",
      "M2 通过消费 IF2 输出，展示 dashboard 摘要、进度证据以及 portal 可见的协作说明。",
      "A M2 consome saídas da IF2 para apresentar resumos de dashboard, evidências de progresso e notas de coordenação visíveis no portal.",
    ),
    relatedTeams: ["V2", "M1", "M2"],
  },
];

export const roleMatrix: RoleRecord[] = [
  {
    id: "PM",
    description: text(
      "Owns scope alignment, delivery priorities and report-facing storyline across teams.",
      "负责跨组范围对齐、交付优先级与面向汇报的整体叙事。",
      "Responsável pelo alinhamento de âmbito, prioridades de entrega e narrativa global orientada à apresentação.",
    ),
  },
  {
    id: "Vice PM",
    description: text(
      "Tracks coordination details, schedules, follow-ups and risk visibility between meetings.",
      "负责协调细节、排期、跟进动作以及会议之间的风险可见性。",
      "Acompanha detalhes de coordenação, agendas, ações de seguimento e visibilidade de risco entre reuniões.",
    ),
  },
  {
    id: "Architect",
    description: text(
      "Clarifies interfaces, dependencies, information structure and handoff constraints for implementation.",
      "负责澄清接口、依赖、信息结构以及实现交接约束。",
      "Clarifica interfaces, dependências, estrutura de informação e restrições de handoff para implementação.",
    ),
  },
  {
    id: "Programmer",
    description: text(
      "Implements portal pages, content tooling and web presentation shells with maintainable frontend code.",
      "负责实现 portal 页面、内容工具链与可维护的网页展示外壳。",
      "Implementa páginas do portal, tooling de conteúdo e estruturas web com código frontend fácil de manter.",
    ),
  },
  {
    id: "Tester",
    description: text(
      "Checks routing, content rendering, evidence links, calendar data and cross-device readability.",
      "负责检查路由、内容渲染、证据链接、日历数据与跨设备可读性。",
      "Verifica rotas, renderização de conteúdo, links de evidência, dados de calendário e legibilidade em vários dispositivos.",
    ),
  },
  {
    id: "Liaison",
    description: text(
      "Keeps external communication with related teams actionable and routes unresolved dependencies back into logs and milestones.",
      "负责对外协作沟通，并把未解决依赖回流到日志与里程碑中。",
      "Mantém a comunicação externa com equipas relacionadas de forma acionável e devolve dependências pendentes para logs e marcos.",
    ),
  },
];

export const calendarEvents: CalendarEventRecord[] = [
  {
    id: "2026-03-29-m2-members-meeting-cn",
    title: text("M2 members meeting (CN)", "M2 成员会议（中国）", "Reunião de membros da M2 (China)"),
    type: "meeting",
    start: "2026-03-29",
    allDay: true,
    relatedTeams: ["M2", "CN"],
    summary: text(
      "China-side internal M2 member meeting.",
      "M2 中方成员内部会议。",
      "Reunião interna da M2 com os membros na China.",
    ),
    link: "/team",
    tags: ["meeting", "m2", "cn"],
  },
  {
    id: "2026-03-31-m2-members-meeting-cross-country",
    title: text("M2 members meeting (CN-PT)", "M2 成员会议（跨国）", "Reunião de membros da M2 (CN-PT)"),
    type: "meeting",
    start: "2026-03-31",
    allDay: true,
    relatedTeams: ["M2", "CN", "PT"],
    summary: text(
      "Cross-country M2 member meeting across China and Portugal.",
      "中葡两地共同参加的 M2 成员会议。",
      "Reunião transnacional da M2 entre China e Portugal.",
    ),
    link: "/team",
    tags: ["meeting", "m2", "cn", "pt"],
  },
  ...createWeeklyCalendarEvents("2026-03-25", "2026-05-20", 3, (isoDate) => ({
    id: `${isoDate}-assessment-ddl`,
    title: text("Assessment DDL", "Assessment 截止", "Prazo de Assessment"),
    type: "deadline",
    start: isoDate,
    allDay: true,
    relatedTeams: ["All"],
    summary: text(
      "Weekly Assessment deadline.",
      "每周一次的 Assessment 截止时间。",
      "Prazo semanal de Assessment.",
    ),
    link: "/calendar",
    tags: ["deadline", "assessment"],
  })),
  ...createWeeklyCalendarEvents("2026-03-19", "2026-05-21", 4, (isoDate) => ({
    id: `${isoDate}-cn-course-meeting`,
    title: text("CN project course", "中方项目课", "Aula CN do projeto"),
    type: "course",
    start: isoDate,
    allDay: true,
    relatedTeams: ["CN"],
    summary: text(
      "Weekly in-person course session for all China-side members in the wider project.",
      "整个大项目所有中方成员每周四的碰面课程。",
      "Sessão semanal presencial com todos os membros do lado chinês do projeto.",
    ),
    link: "/calendar",
    tags: ["meeting", "course", "cn"],
  })),
  {
    id: "2026-04-03-if2-payload-sync",
    title: text("IF2 payload sync meeting", "IF2 payload 同步会", "Reunião de sincronização do payload IF2"),
    type: "meeting",
    start: "2026-04-03T18:00:00+08:00",
    end: "2026-04-03T19:00:00+08:00",
    relatedTeams: ["V2", "M1", "M2"],
    summary: text(
      "Cross-team review of field names, data availability and display assumptions before the next milestone.",
      "跨组确认字段命名、数据可用性与下一里程碑前的展示假设。",
      "Revisão entre equipas dos nomes de campos, disponibilidade de dados e pressupostos de apresentação antes do próximo marco.",
    ),
    link: "/logs",
    tags: ["interface", "attention:V2", "attention:M1", "attention:M2"],
    sample: true,
  },
  {
    id: "2026-04-07-portal-overview-release",
    title: text("Portal overview release", "Portal 总览发布", "Lançamento da visão geral do portal"),
    type: "milestone",
    start: "2026-04-07",
    allDay: true,
    relatedTeams: ["M2"],
    summary: text(
      "Planned internal release of the routed portal shell with home, progress, logs, docs, architecture and calendar pages.",
      "计划内部发布包含首页、进度、日志、文档、架构和日历页的 portal 路由外壳。",
      "Lançamento interno planeado da estrutura roteada do portal com páginas de visão geral, progresso, logs, docs, arquitetura e calendário.",
    ),
    link: "/logs/2026-03-31-first-portal-online",
    tags: ["deliverable", "milestone", "attention:M2"],
    sample: true,
  },
  {
    id: "2026-04-10-cross-group-sync",
    title: text("Cross-group coordination sync", "跨组协调同步会", "Reunião de coordenação entre grupos"),
    type: "meeting",
    start: "2026-04-10T16:00:00+08:00",
    end: "2026-04-10T17:00:00+08:00",
    relatedTeams: ["PM", "V2", "M1", "M2"],
    summary: text(
      "Review current blockers, demo path ownership and document status before the joint review.",
      "在联合评审前复核当前 blocker、demo 路径归属与文档状态。",
      "Rever bloqueios atuais, responsabilidades do percurso da demonstração e estado documental antes da revisão conjunta.",
    ),
    link: "/progress#risk-register",
    tags: ["meeting", "attention:V2", "attention:M1", "attention:M2"],
    sample: true,
  },
  {
    id: "2026-04-15-demo-review",
    title: text("Cross-team demo review", "跨组 Demo 评审", "Revisão de demonstração entre equipas"),
    type: "demo",
    start: "2026-04-15T19:00:00+08:00",
    end: "2026-04-15T20:00:00+08:00",
    relatedTeams: ["PM", "V2", "M1", "M2"],
    summary: text(
      "Teacher-facing rehearsal for current milestone status, portal visibility and dashboard narrative flow.",
      "面向老师的阶段性演练，覆盖当前里程碑状态、portal 可见性与 dashboard 叙事流程。",
      "Ensaio orientado ao professor para o estado do marco atual, visibilidade do portal e fluxo narrativo do dashboard.",
    ),
    link: "/progress#milestones",
    tags: ["demo", "milestone", "attention:M2"],
    sample: true,
  },
  {
    id: "2026-04-18-iteration-closeout",
    title: text("Iteration closeout deadline", "阶段收尾截止", "Prazo de fecho da iteracao"),
    type: "deadline",
    start: "2026-04-18",
    allDay: true,
    relatedTeams: ["All"],
    summary: text(
      "Deadline for updating logs, evidence links and progress notes before the next planning review.",
      "在下一次计划评审前，完成日志、证据链接和进度说明的更新。",
      "Prazo para atualizar logs, links de evidência e notas de progresso antes da próxima revisão de planeamento.",
    ),
    link: "/logs",
    tags: ["deadline", "deliverable"],
    sample: true,
  },
  {
    id: "2026-05-05-presentation-rehearsal",
    title: text("Presentation rehearsal", "展示彩排", "Ensaio de apresentação"),
    type: "milestone",
    start: "2026-05-05T18:30:00+08:00",
    end: "2026-05-05T19:30:00+08:00",
    relatedTeams: ["All"],
    summary: text(
      "Full walkthrough of system explanation, team boundaries, latest progress and deliverable access paths.",
      "完整演练系统说明、团队边界、最新进度与交付入口路径。",
      "Percurso completo da explicação do sistema, fronteiras das equipas, progresso mais recente e caminhos de acesso aos entregáveis.",
    ),
    link: "/architecture",
    tags: ["milestone", "demo"],
    sample: true,
  },
];

export const m2Contribution = {
  responsibilities: [
    text("Maintain the portal routes, content pipeline and collaboration-facing information architecture.", "维护 portal 路由、内容流水线与面向协作的信息架构。", "Manter as rotas do portal, pipeline de conteúdo e arquitetura de informação voltada à colaboração."),
    text("Present M2-visible clinical dashboard and portal-facing frontend narrative without claiming ownership of the whole product web.", "负责与 M2 相关的临床 dashboard / portal 前端叙事展示，但不宣称负责整个产品网页。", "Apresentar a narrativa frontend visível do dashboard clínico e do portal relacionada com a M2 sem reivindicar o produto web completo."),
    text("Keep logs, deliverables and milestone evidence accessible for teachers and collaborators.", "让日志、交付物和里程碑证据对老师与协作者保持可访问。", "Manter logs, entregáveis e evidências de marcos acessíveis para professores e colaboradores."),
  ],
  dependencies: [
    text("Depends on V2 for IF2 payload stability and service-facing result fields.", "依赖 V2 提供稳定的 IF2 payload 与结果字段。", "Depende da V2 para estabilidade do payload IF2 e campos de resultado do serviço."),
    text("Depends on M1 for monitor-side presentation alignment and review feedback.", "依赖 M1 提供监测端展示对齐和评审反馈。", "Depende da M1 para alinhamento de apresentação do lado de monitorização e feedback de revisão."),
    text("Depends on PM / Vice PM for milestone priorities, meeting cadence and reporting focus.", "依赖 PM / Vice PM 提供里程碑优先级、会议节奏与汇报重点。", "Depende do PM / Vice PM para prioridades de marcos, cadência de reuniões e foco de apresentação."),
  ],
  completed: [
    text("Portal IA, field templates and series-style direction were consolidated.", "已完成 portal IA、字段模板与系列化风格方向的整合。", "A IA do portal, modelos de campos e direção de estilo da série foram consolidados."),
    text("Portal page structure now separates progress, logs, docs, architecture and calendar views.", "已将 portal 页面结构拆分为进度、日志、文档、架构与日历视图。", "A estrutura de páginas do portal separa agora progresso, logs, docs, arquitetura e calendário."),
  ],
  uncovered: [
    text("Portal does not replace the full product frontend maintained in project-main-web.", "portal 不替代由 `project-main-web` 维护的完整产品前端。", "O portal não substitui o frontend completo do produto mantido em `project-main-web`."),
    text("Demo assets and production-facing screenshots still depend on upstream teams and later delivery stages.", "demo 资产与面向产品的截图仍依赖上游小组和后续交付阶段。", "Ativos da demonstração e capturas voltadas ao produto ainda dependem de equipas a montante e de fases posteriores de entrega."),
  ],
};

export const docCategoryOrder = [
  "requirement-analysis",
  "system-design",
  "interface",
  "testing",
  "presentation",
  "demo-assets",
  "meeting-minutes",
  "weekly-report",
  "research",
] as const;

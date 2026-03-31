import ganttDataset from "../../content/en/gantt/tasks.json";
import type { LocalizedText } from "../utils/content";

const text = (en: string, zhCN: string, pt: string): LocalizedText => ({
  en,
  "zh-CN": zhCN,
  pt,
});

export type ProgressMilestone = {
  id: string;
  title: LocalizedText;
  dateLabel: string;
  owner: string;
  status: string;
  evidenceLink: string;
};

export type SprintDigest = {
  id: string;
  goal: LocalizedText;
  completed: LocalizedText[];
  incomplete: LocalizedText[];
  blockers: LocalizedText[];
  nextStep: LocalizedText[];
};

export type RiskItem = {
  riskId: string;
  title: LocalizedText;
  severity: "high" | "medium" | "low";
  owner: string;
  status: string;
  mitigation: LocalizedText;
  lastUpdated: string;
};

export type GanttTask = {
  id: string;
  name: string;
  role: string;
  owner: string;
  start: string;
  end: string;
  progress: number;
  status: string;
  dependencies: string[];
  category: string;
};

export const progressDatasetMeta = {
  sample: ganttDataset.sample,
  label: ganttDataset.label,
  note: text(
    ganttDataset.note,
    "当前甘特数据为示例结构，用于替代旧的假 sprint 卡片；待 PM 侧确认后应替换为正式排期。",
    "O dataset de gantt atual e um exemplo estrutural para substituir os antigos cards de sprint ficticios; deve ser trocado pelo planeamento formal quando o PM o confirmar.",
  ),
};

export const ganttTasks = ganttDataset.tasks as GanttTask[];

export const progressOverview = {
  currentStage: text(
    "Portal second-round refactor and documentation hardening",
    "Portal 二轮重构与文档化加固",
    "Segunda ronda de refatoracao do portal e reforco documental",
  ),
  stageGoal: text(
    "Rebuild the portal into a clearer reporting and collaboration hub with a stronger document-first hierarchy.",
    "把 portal 重构成层级更清楚、以文档和协作为中心的项目中枢站。",
    "Reconstruir o portal como um hub de relatorio e colaboracao mais claro, com hierarquia centrada em documentos.",
  ),
  currentRisk: text(
    "Upstream deliverable timing and evidence completeness may still lag behind the UI revision.",
    "上游交付节奏和证据完整度仍可能落后于本轮前端重构。",
    "O ritmo dos entregaveis a montante e a completude das evidencias ainda podem ficar atras do redesenho frontend.",
  ),
};

export const milestones: ProgressMilestone[] = [
  {
    id: "portal-revision-kickoff",
    title: text(
      "Portal revision brief consolidated",
      "Portal 重构需求整合完成",
      "Brief de revisao do portal consolidado",
    ),
    dateLabel: "2026-03-31",
    owner: "M2",
    status: "completed",
    evidenceLink: "/logs/demo-path-checklist",
  },
  {
    id: "semantic-foundation",
    title: text(
      "Semantic UI foundation replaced",
      "语义化 UI 基础层完成替换",
      "Fundacao semantica de UI substituida",
    ),
    dateLabel: "2026-04-04",
    owner: "M2",
    status: "in-progress",
    evidenceLink: "/logs/portal-shell-and-routing",
  },
  {
    id: "gantt-and-calendar-review",
    title: text(
      "Gantt and calendar review ready",
      "甘特与月历评审准备完成",
      "Revisao do gantt e calendario pronta",
    ),
    dateLabel: "2026-04-11",
    owner: "M2 + PM",
    status: "planned",
    evidenceLink: "/calendar",
  },
  {
    id: "demo-bundle-check",
    title: text(
      "Demo bundle and docs check",
      "Demo 材料与文档核对",
      "Verificacao do pacote demo e dos documentos",
    ),
    dateLabel: "2026-04-15",
    owner: "PM + M2",
    status: "at-risk",
    evidenceLink: "/docs/presentation-outline-v1",
  },
];

export const sprintDigests: SprintDigest[] = [
  {
    id: "Iteration A",
    goal: text(
      "Remove bubble-heavy patterns, clarify portal boundaries and rebuild the shared surface system.",
      "清理 bubble 化模式，明确 portal 边界，并重建共享表面层级。",
      "Remover padroes excessivamente bubble, clarificar fronteiras do portal e reconstruir o sistema de superficies partilhadas.",
    ),
    completed: [
      text("Boundary rules were written into AGENT and docs guidance.", "已把边界规则写入 AGENT 与 docs。", "As regras de fronteira foram escritas no AGENT e na documentacao."),
      text("Semantic controls are being separated into badges, tags, chips and link pills.", "标签、状态、筛选和链接语义正在拆分。", "Os controlos semanticos estao a ser separados em badges, tags, chips e links."),
    ],
    incomplete: [
      text("Team member records still need final confirmation from the group.", "团队成员记录仍待组内最终确认。", "Os registos de membros ainda precisam de confirmacao final da equipa."),
    ],
    blockers: [
      text("Some linked deliverables still point to placeholder evidence.", "部分交付物仍然依赖占位证据链接。", "Alguns entregaveis ligados ainda apontam para evidencias placeholder."),
    ],
    nextStep: [
      text("Finish page rebuild and replace old card soup patterns route by route.", "逐页完成重构并替换旧的卡片拼贴模式。", "Concluir a reconstrucao das paginas e substituir os antigos padroes de card soup rota a rota."),
    ],
  },
  {
    id: "Iteration B",
    goal: text(
      "Connect refined pages back to generated content, examples, architecture traces and schedule views.",
      "把重构后的页面重新接回生成内容、示例入口、架构留痕和时间视图。",
      "Ligar novamente as paginas refinadas ao conteudo gerado, exemplos, rastos de arquitetura e vistas de calendario.",
    ),
    completed: [],
    incomplete: [
      text("Formal gantt data import is still sample-labeled until PM provides the confirmed schedule.", "正式甘特数据仍为示例标记，待 PM 确认后替换。", "A importacao formal do gantt continua marcada como exemplo ate o PM fornecer o calendario confirmado."),
    ],
    blockers: [
      text("Cross-team deliverable statuses may change after the next review meeting.", "跨组交付状态可能在下次评审会后变化。", "Os estados dos entregaveis entre equipas podem mudar apos a proxima reuniao de revisao."),
    ],
    nextStep: [
      text("Replace sample schedule blocks with PM-maintained data and update evidence links.", "用 PM 维护的数据替换示例排期，并更新证据链接。", "Substituir os blocos de agenda de exemplo por dados mantidos pelo PM e atualizar os links de evidencia."),
    ],
  },
];

export const riskRegister: RiskItem[] = [
  {
    riskId: "R-01",
    title: text(
      "Schedule views may be mistaken for official history if sample data is not visibly marked.",
      "如果示例数据标识不清，进度视图可能被误解为正式项目历史。",
      "As vistas de agenda podem ser confundidas com historico oficial se os dados de exemplo nao estiverem claramente marcados.",
    ),
    severity: "high",
    owner: "M2",
    status: "watch",
    mitigation: text(
      "Keep SAMPLE labeling visible in the gantt panel and document the replacement rule in docs/mock-data-policy.md.",
      "在甘特区域保留 SAMPLE 标识，并在 docs/mock-data-policy.md 中写明替换规则。",
      "Manter a marcacao SAMPLE visivel no painel de gantt e documentar a regra de substituicao em docs/mock-data-policy.md.",
    ),
    lastUpdated: "2026-03-31",
  },
  {
    riskId: "R-02",
    title: text(
      "English-only article fallbacks may feel abrupt if the notice is missing or too weak.",
      "若 fallback 提示过弱，英文单源内容在中文/葡文界面下会显得突兀。",
      "Os fallbacks para artigos apenas em ingles podem parecer bruscos se o aviso estiver ausente ou fraco.",
    ),
    severity: "medium",
    owner: "M2",
    status: "in-progress",
    mitigation: text(
      "Show a short, explicit fallback note directly in article headers and docs rows when needed.",
      "在文章头部和文档列表中提供简短明确的英文回退提示。",
      "Mostrar um aviso curto e explicito de fallback diretamente nos headers dos artigos e nas linhas dos documentos, quando necessario.",
    ),
    lastUpdated: "2026-03-31",
  },
  {
    riskId: "R-03",
    title: text(
      "Calendar clarity may degrade if too many event types compete inside small cells.",
      "如果事件类型过多且同屏竞争，月历单元格可读性会下降。",
      "A clareza do calendario pode degradar-se se demasiados tipos de evento competirem em celulas pequenas.",
    ),
    severity: "medium",
    owner: "Vice PM / Programmer",
    status: "active",
    mitigation: text(
      "Keep fixed type colors, limit in-cell density and route overflow into the selected-day detail panel.",
      "固定类型颜色、限制单元格密度，并把溢出信息交给右侧当日详情面板。",
      "Manter cores fixas por tipo, limitar a densidade nas celulas e encaminhar o excesso para o painel de detalhe do dia selecionado.",
    ),
    lastUpdated: "2026-03-31",
  },
];

import "../../node_modules/frappe-gantt/dist/frappe-gantt.css";

import Gantt from "frappe-gantt";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { StaticTag } from "./StaticTag";

type GanttPanelProps = {
  tasks?: GanttSourceTask[];
  isSample?: boolean;
  sampleLabel?: string;
  sampleNote?: string;
};

type DatasetTask = {
  id: string;
  name: string;
  role: string;
  owner: string;
  start: string;
  end: string;
  progress: number;
  status: string;
  dependencies?: string[];
  category?: string;
};

type GanttRow = {
  role: string;
  name: string;
  task: string;
  status: "Completed" | "In Progress" | "At Risk";
  weekStart: number;
  weekEnd: number;
  progress: number;
  customClass: "task-completed" | "task-progress" | "task-risk";
};

type GanttSourceTask = GanttRow | DatasetTask;

type BuiltTask = {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  custom_class: string;
  color: string;
  color_progress: string;
  dependencies?: string[];
  _meta: GanttRow & {
    id: string;
    startDate: Date;
    endDate: Date;
    category?: string;
  };
};

type GanttPopupContext = {
  task?: BuiltTask;
};

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function formatRange(start: Date, end: Date) {
  const formatter = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return `${formatter(start)} – ${formatter(end)}`;
}

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validateRows(rows: GanttRow[]) {
  const issues: string[] = [];

  rows.forEach((row, index) => {
    if (row.weekStart > row.weekEnd) issues.push(`Row ${index + 1}: weekStart > weekEnd.`);
    if (row.weekStart < 1) issues.push(`Row ${index + 1}: weekStart must be >= 1.`);
    if (row.weekEnd < 1) issues.push(`Row ${index + 1}: weekEnd must be >= 1.`);
    if (row.progress < 0 || row.progress > 100) issues.push(`Row ${index + 1}: progress must be 0–100.`);
  });

  return issues;
}

function validateBuiltTasks(tasks: BuiltTask[]) {
  const issues: string[] = [];

  tasks.forEach((task, index) => {
    if (!task.id) issues.push(`Task ${index + 1}: missing id.`);
    if (!task.name) issues.push(`Task ${index + 1}: missing name.`);
    if (Number.isNaN(task._meta.startDate.getTime())) issues.push(`Task ${index + 1}: invalid start date.`);
    if (Number.isNaN(task._meta.endDate.getTime())) issues.push(`Task ${index + 1}: invalid end date.`);
    if (task._meta.startDate > task._meta.endDate) issues.push(`Task ${index + 1}: start date is after end date.`);
    if (task.progress < 0 || task.progress > 100) issues.push(`Task ${index + 1}: progress must be 0–100.`);
  });

  return issues;
}

const weekOneStart = new Date("2026-03-19T00:00:00");

const rawRows: GanttRow[] = [
  {
    role: "P.M.",
    name: "Yihang LI",
    task: "Requirement Analysis",
    status: "Completed",
    weekStart: 1,
    weekEnd: 2,
    progress: 100,
    customClass: "task-completed",
  },
  {
    role: "P.M.",
    name: "Yihang LI",
    task: "Prototype Development",
    status: "Completed",
    weekStart: 2,
    weekEnd: 2,
    progress: 100,
    customClass: "task-completed",
  },
  {
    role: "V.P.M./Programmer1",
    name: "Kika Vasconcelos Francisca",
    task: "Testing & QA",
    status: "In Progress",
    weekStart: 1,
    weekEnd: 10,
    progress: 36,
    customClass: "task-progress",
  },
  {
    role: "Programmer2",
    name: "Duhai XU",
    task: "Gantt Diagram",
    status: "Completed",
    weekStart: 2,
    weekEnd: 2,
    progress: 100,
    customClass: "task-completed",
  },
  {
    role: "Programmer2",
    name: "Duhai XU",
    task: "3D Reconstruction",
    status: "In Progress",
    weekStart: 3,
    weekEnd: 5,
    progress: 55,
    customClass: "task-progress",
  },
  {
    role: "Webmaster",
    name: "Congming LI",
    task: "Team Website Development",
    status: "Completed",
    weekStart: 1,
    weekEnd: 1,
    progress: 100,
    customClass: "task-completed",
  },
  {
    role: "Webmaster",
    name: "Congming LI",
    task: "Team Website Maintenance",
    status: "In Progress",
    weekStart: 1,
    weekEnd: 10,
    progress: 42,
    customClass: "task-progress",
  },
  {
    role: "S.A.",
    name: "Shu WANG",
    task: "UI Design",
    status: "In Progress",
    weekStart: 2,
    weekEnd: 4,
    progress: 50,
    customClass: "task-progress",
  },
  {
    role: "S.A.",
    name: "Shu WANG",
    task: "Use Case Diagram",
    status: "In Progress",
    weekStart: 2,
    weekEnd: 3,
    progress: 46,
    customClass: "task-progress",
  },
];

function getTaskColors(status: GanttRow["status"]) {
  if (status === "Completed") {
    return {
      color: "#22c55e",
      color_progress: "#16a34a",
    };
  }

  if (status === "At Risk") {
    return {
      color: "#fdba74",
      color_progress: "#ea580c",
    };
  }

  return {
    color: "#fde68a",
    color_progress: "#eab308",
  };
}

function normalizeStatus(status: string): GanttRow["status"] {
  const value = status.trim().toLowerCase();

  if (value === "completed" || value === "done") return "Completed";
  if (value === "at-risk" || value === "at risk" || value === "blocked") return "At Risk";
  return "In Progress";
}

function getCustomClass(status: GanttRow["status"]): GanttRow["customClass"] {
  if (status === "Completed") return "task-completed";
  if (status === "At Risk") return "task-risk";
  return "task-progress";
}

function buildLegacyTask(row: GanttRow, index: number): BuiltTask {
  const id = `legacy-task-${index + 1}`;
  const startDate = addDays(weekOneStart, (row.weekStart - 1) * 7);
  const endDate = addDays(weekOneStart, row.weekEnd * 7 - 1);
  const colors = getTaskColors(row.status);

  return {
    id,
    name: `${row.name} · ${row.task}`,
    start: toDateString(startDate),
    end: toDateString(endDate),
    progress: row.progress,
    custom_class: row.customClass,
    color: colors.color,
    color_progress: colors.color_progress,
    _meta: {
      ...row,
      id,
      startDate,
      endDate,
    },
  };
}

function buildDatasetTask(task: DatasetTask): BuiltTask {
  const status = normalizeStatus(task.status);
  const customClass = getCustomClass(status);
  const colors = getTaskColors(status);
  const startDate = new Date(`${task.start}T00:00:00`);
  const endDate = new Date(`${task.end}T00:00:00`);

  return {
    id: task.id,
    name: `${task.owner} · ${task.name}`,
    start: task.start,
    end: task.end,
    progress: task.progress,
    custom_class: customClass,
    color: colors.color,
    color_progress: colors.color_progress,
    dependencies: task.dependencies,
    _meta: {
      id: task.id,
      role: task.role,
      name: task.owner,
      task: task.name,
      status,
      weekStart: 1,
      weekEnd: 1,
      progress: task.progress,
      customClass,
      startDate,
      endDate,
      category: task.category,
    },
  };
}

function isLegacyTask(task: GanttSourceTask): task is GanttRow {
  return "weekStart" in task && "weekEnd" in task;
}

function formatScheduleStart(tasks: BuiltTask[]) {
  if (!tasks.length) return "";

  const earliest = tasks.reduce(
    (current, task) => (task._meta.startDate < current ? task._meta.startDate : current),
    tasks[0]._meta.startDate,
  );

  return earliest.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLegendDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GanttPanel({ tasks, isSample = false, sampleLabel, sampleNote }: GanttPanelProps) {
  const { t } = useTranslation();
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState("Day");
  const [error, setError] = useState("");

  const sourceTasks = useMemo(() => (tasks && tasks.length ? tasks : rawRows), [tasks]);
  const builtTasks = useMemo(
    () =>
      sourceTasks.map((task, index) => (isLegacyTask(task) ? buildLegacyTask(task, index) : buildDatasetTask(task))),
    [sourceTasks],
  );
  const validationIssues = useMemo(
    () => (sourceTasks.every(isLegacyTask) ? validateRows(sourceTasks) : validateBuiltTasks(builtTasks)),
    [builtTasks, sourceTasks],
  );
  const scheduleStartLabel = useMemo(() => formatScheduleStart(builtTasks), [builtTasks]);
  const hasRiskTasks = useMemo(() => builtTasks.some((task) => task._meta.status === "At Risk"), [builtTasks]);
  const weekOneLabel = useMemo(() => formatLegendDate(weekOneStart), []);

  useEffect(() => {
    if (!ganttRef.current) return;

    if (validationIssues.length) {
      setError(validationIssues.join(" "));
      return;
    }

    setError("");
    ganttRef.current.innerHTML = "";

    const render = () => {
      if (!ganttRef.current) return;

      try {
        ganttRef.current.innerHTML = "";

        new Gantt(ganttRef.current, builtTasks, {
          view_mode: viewMode,
          column_width: viewMode === "Day" ? 40 : viewMode === "Week" ? 72 : 120,
          bar_height: 28,
          bar_corner_radius: 6,
          container_height: builtTasks.length * 48 + 72,
          padding: 18,
          auto_move_label: true,
          lines: "both",
          readonly: true,
          readonly_dates: true,
          readonly_progress: true,
          infinite_padding: false,
          scroll_to: builtTasks[0]?.start ?? toDateString(weekOneStart),
          today_button: false,
          popup_on: "click",
          popup: (context: unknown) => {
            const task = (context as GanttPopupContext)?.task;
            const meta = task?._meta;
            if (!meta) return false;
            return `
              <div style="padding:12px 14px; min-width:280px; font-family:Aptos, Segoe UI, sans-serif;">
                <div style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:4px;">${meta.task}</div>
                <div style="font-size:12px; color:#475569; margin-bottom:8px;">${meta.role} · ${meta.name}</div>
                <div style="font-size:12px; color:#0f172a; margin-bottom:4px;">Status: ${meta.status}</div>
                <div style="font-size:12px; color:#0f172a;">${formatRange(meta.startDate, meta.endDate)}</div>
              </div>
            `;
          },
        });
      } catch (renderError) {
        setError(renderError instanceof Error ? renderError.message : "Failed to render gantt chart.");
      }
    };

    const timer = window.setTimeout(render, 80);

    return () => {
      window.clearTimeout(timer);
      if (ganttRef.current) ganttRef.current.innerHTML = "";
    };
  }, [builtTasks, validationIssues, viewMode]);

  return (
    <div className="overflow-hidden">
      <style>{`
        .gantt-shell .gantt-container {
          border-radius: 24px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          overflow: hidden;
          background: #ffffff;
        }

        .gantt-shell .grid-background {
          fill: transparent;
        }

        .gantt-shell .grid-row:nth-child(even) {
          fill: #fbfcfe;
        }

        .gantt-shell .row-line,
        .gantt-shell .tick,
        .gantt-shell .grid-header {
          stroke: rgba(148, 163, 184, 0.24);
        }

        .gantt-shell .upper-text,
        .gantt-shell .lower-text,
        .gantt-shell .bar-label {
          font-family: Aptos, Segoe UI, sans-serif;
        }

        .gantt-shell .upper-text {
          fill: #1e293b;
          font-size: 16px;
          font-weight: 700;
        }

        .gantt-shell .lower-text {
          fill: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .gantt-shell .bar-label {
          fill: #0f172a;
          font-size: 12px;
          font-weight: 600;
        }

        .gantt-shell .bar-wrapper .bar {
          stroke: rgba(148, 163, 184, 0.24);
          stroke-width: 1;
        }

        .gantt-shell .task-completed .bar,
        .gantt-shell .task-completed .bar-progress {
          fill: #09b24d;
        }

        .gantt-shell .task-progress .bar,
        .gantt-shell .task-progress .bar-progress {
          fill: #f0e400;
        }

        .gantt-shell .task-risk .bar,
        .gantt-shell .task-risk .bar-progress {
          fill: #f59e0b;
        }

        .legend-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #334155;
          font-size: 13px;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          flex: 0 0 12px;
        }

      `}</style>

      <div className="surface-card rounded-[28px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              DSD 2026 · Team M2
            </div>
            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">{t("progress.gantt.title")}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              This gantt view uses exact daily dates internally and can switch between day, week, and month scales
              without losing the task schedule.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSample && sampleLabel ? <StaticTag label={sampleLabel} tone="violet" /> : null}
            <button
              type="button"
              onClick={() => setViewMode("Day")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                viewMode === "Day" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Day View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("Week")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                viewMode === "Week" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Week View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("Month")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                viewMode === "Month" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Month View
            </button>
          </div>
        </div>

        {sampleNote ? <p className="mt-3 text-sm leading-7 text-amber-800">{sampleNote}</p> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="legend-chip">
            <span className="legend-dot" style={{ background: "#09b24d" }} />
            Completed
          </span>
          <span className="legend-chip">
            <span className="legend-dot" style={{ background: "#f0e400" }} />
            In Progress
          </span>
          {hasRiskTasks ? (
            <span className="legend-chip">
              <span className="legend-dot" style={{ background: "#f59e0b" }} />
              At Risk
            </span>
          ) : null}
          <span className="legend-chip">W1 = {weekOneLabel}</span>
          <span className="legend-chip">Thursday → Wednesday</span>
          {scheduleStartLabel ? <span className="legend-chip">Start = {scheduleStartLabel}</span> : null}
          <span className="legend-chip">Default = Day View</span>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-white/90 p-4">
          <div className="mb-3 flex items-center justify-between px-2">
            <div className="text-sm font-semibold text-slate-700">Frappe Gantt timeline</div>
            <div className="text-xs text-slate-500">{error ? "error" : "ready"}</div>
          </div>

          {error ? (
            <div className="mx-2 mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Click a task bar to inspect details. The chart is read-only in this portal view.
          </div>

          <div className="gantt-shell overflow-x-auto">
            <div ref={ganttRef} className="min-w-[1180px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

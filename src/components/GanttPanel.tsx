import "../../node_modules/frappe-gantt/dist/frappe-gantt.css";

import Gantt from "frappe-gantt";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type GanttPanelProps = {
  tasks?: GanttSourceTask[];
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
  status: "Completed" | "In Progress";
  weekStart: number;
  weekEnd: number;
  progress: number;
  customClass: "task-completed" | "task-progress";
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

const GANTT_BAR_HEIGHT = 28;
const GANTT_PADDING = 18;
const GANTT_ROW_HEIGHT = GANTT_BAR_HEIGHT + GANTT_PADDING;
const GANTT_UPPER_HEADER_HEIGHT = 45;
const GANTT_LOWER_HEADER_HEIGHT = 30;
const GANTT_HEADER_HEIGHT = GANTT_UPPER_HEADER_HEIGHT + GANTT_LOWER_HEADER_HEIGHT + 10;
const GANTT_LANE_WIDTH = 290;
const GANTT_LANE_WIDTH_COMPACT = 236;
const COMPLETED_COLOR = "#09b24d";
const IN_PROGRESS_COLOR = "#f0e400";

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

function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
      color: COMPLETED_COLOR,
      color_progress: COMPLETED_COLOR,
    };
  }

  return {
    color: IN_PROGRESS_COLOR,
    color_progress: IN_PROGRESS_COLOR,
  };
}

function normalizeStatus(status: string): GanttRow["status"] {
  const value = status.trim().toLowerCase();

  if (value === "completed" || value === "done") return "Completed";
  return "In Progress";
}

function getCustomClass(status: GanttRow["status"]): GanttRow["customClass"] {
  if (status === "Completed") return "task-completed";
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

function getSidebarTone(status: GanttRow["status"]) {
  if (status === "Completed") return "gantt-sidebar-completed";
  return "gantt-sidebar-progress";
}

export function GanttPanel({ tasks }: GanttPanelProps) {
  const { t } = useTranslation();
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const sidebarRowsRef = useRef<HTMLDivElement | null>(null);
  const selectedTaskIdRef = useRef("");
  const [viewMode, setViewMode] = useState("Day");
  const [error, setError] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

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
  const selectedTask = useMemo(
    () => builtTasks.find((task) => task.id === selectedTaskId) ?? null,
    [builtTasks, selectedTaskId],
  );

  const applySelectedBarState = (taskId: string) => {
    const host = ganttRef.current;
    if (!host) return;

    host.querySelectorAll<SVGGElement>(".bar-wrapper").forEach((wrapper) => {
      wrapper.classList.toggle("is-selected", wrapper.getAttribute("data-id") === taskId);
    });
  };

  useEffect(() => {
    if (!builtTasks.length) {
      setSelectedTaskId("");
      return;
    }

    setSelectedTaskId((current) => (current && builtTasks.some((task) => task.id === current) ? current : builtTasks[0].id));
  }, [builtTasks]);

  useEffect(() => {
    selectedTaskIdRef.current = selectedTaskId;
    applySelectedBarState(selectedTaskId);
  }, [selectedTaskId]);

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
          bar_height: GANTT_BAR_HEIGHT,
          bar_corner_radius: 6,
          container_height: builtTasks.length * GANTT_ROW_HEIGHT + 90,
          padding: GANTT_PADDING,
          upper_header_height: GANTT_UPPER_HEADER_HEIGHT,
          lower_header_height: GANTT_LOWER_HEADER_HEIGHT,
          auto_move_label: true,
          lines: "both",
          readonly: true,
          readonly_dates: true,
          readonly_progress: true,
          infinite_padding: false,
          scroll_to: builtTasks[0]?.start ?? toDateString(weekOneStart),
          today_button: false,
          popup: false,
          on_click: (task: unknown) => {
            const clickedTask = task as BuiltTask | undefined;
            if (clickedTask?.id) setSelectedTaskId(clickedTask.id);
          },
        });

        const chartContainer = ganttRef.current.querySelector<HTMLElement>(".gantt-container");
        if (!chartContainer) return () => {};

        const syncSidebarOffset = () => {
          if (!sidebarRowsRef.current) return;
          const offset = chartContainer.scrollTop;
          sidebarRowsRef.current.style.transform = offset ? `translateY(-${offset}px)` : "translateY(0)";
        };

        const handleWheel = (event: WheelEvent) => {
          if (!event.deltaY || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
          event.preventDefault();
          window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
        };

        const handleBarClick = (event: Event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;

          const barWrapper = target.closest(".bar-wrapper");
          const nextTaskId = barWrapper?.getAttribute("data-id");
          if (nextTaskId) setSelectedTaskId(nextTaskId);
        };

        chartContainer.addEventListener("scroll", syncSidebarOffset, { passive: true });
        chartContainer.addEventListener("wheel", handleWheel, { passive: false });
        chartContainer.addEventListener("click", handleBarClick);

        syncSidebarOffset();
        applySelectedBarState(selectedTaskIdRef.current);

        return () => {
          chartContainer.removeEventListener("scroll", syncSidebarOffset);
          chartContainer.removeEventListener("wheel", handleWheel);
          chartContainer.removeEventListener("click", handleBarClick);
          if (sidebarRowsRef.current) sidebarRowsRef.current.style.transform = "translateY(0)";
        };
      } catch (renderError) {
        setError(renderError instanceof Error ? renderError.message : "Failed to render gantt chart.");
        return () => {};
      }
    };

    let cleanupInteractions: () => void = () => {};
    const timer = window.setTimeout(() => {
      cleanupInteractions = render() ?? (() => {});
    }, 80);

    return () => {
      window.clearTimeout(timer);
      cleanupInteractions();
      if (ganttRef.current) ganttRef.current.innerHTML = "";
      if (sidebarRowsRef.current) sidebarRowsRef.current.style.transform = "translateY(0)";
    };
  }, [builtTasks, validationIssues, viewMode]);

  return (
    <div className="overflow-hidden">
      <style>{`
        .gantt-shell {
          overflow: hidden;
        }

        .gantt-board {
          display: grid;
          grid-template-columns: ${GANTT_LANE_WIDTH}px minmax(0, 1fr);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
        }

        .gantt-sidebar {
          overflow: hidden;
          border-right: 1px solid rgba(148, 163, 184, 0.16);
          background:
            linear-gradient(180deg, rgba(248, 250, 252, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
        }

        .gantt-sidebar-header {
          display: flex;
          align-items: center;
          height: ${GANTT_HEADER_HEIGHT}px;
          box-sizing: border-box;
          padding: 18px 16px 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        }

        .gantt-sidebar-header-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #64748b;
        }

        .gantt-sidebar-header-title {
          margin-top: 4px;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .gantt-sidebar-rows {
          padding-bottom: 0;
          will-change: transform;
        }

        .gantt-sidebar-row {
          display: flex;
          align-items: center;
          gap: 10px;
          height: ${GANTT_ROW_HEIGHT}px;
          box-sizing: border-box;
          padding: 0 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.72);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .gantt-sidebar-row:hover {
          background: rgba(241, 245, 249, 0.8);
        }

        .gantt-sidebar-row.is-selected {
          background: rgba(226, 232, 240, 0.76);
        }

        .gantt-sidebar-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          flex: 0 0 10px;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9);
        }

        .gantt-sidebar-copy {
          min-width: 0;
        }

        .gantt-sidebar-owner {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }

        .gantt-sidebar-task {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: #475569;
        }

        .gantt-sidebar-completed .gantt-sidebar-dot {
          background: ${COMPLETED_COLOR};
        }

        .gantt-sidebar-progress .gantt-sidebar-dot {
          background: ${IN_PROGRESS_COLOR};
        }

        .gantt-chart {
          min-width: 0;
          background: #ffffff;
        }

        .gantt-chart .gantt-container {
          border: 0;
          border-radius: 0;
          overflow-x: auto;
          overflow-y: hidden;
          background: #ffffff;
        }

        .gantt-chart .grid-background {
          fill: transparent;
        }

        .gantt-chart .grid-row:nth-child(even) {
          fill: #fbfcfe;
        }

        .gantt-chart .row-line,
        .gantt-chart .tick,
        .gantt-chart .grid-header {
          stroke: rgba(148, 163, 184, 0.24);
        }

        .gantt-chart .upper-text,
        .gantt-chart .lower-text,
        .gantt-chart .bar-label {
          font-family: Aptos, Segoe UI, sans-serif;
        }

        .gantt-chart .upper-text {
          fill: #1e293b;
          font-size: 16px;
          font-weight: 700;
        }

        .gantt-chart .lower-text {
          fill: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        .gantt-chart .bar-label {
          display: none;
        }

        .gantt-chart .bar-progress {
          display: none;
        }

        .gantt-chart .bar-wrapper .bar {
          stroke: rgba(148, 163, 184, 0.24);
          stroke-width: 1;
        }

        .gantt-chart .bar-wrapper.is-selected .bar {
          stroke: #0f172a;
          stroke-width: 2;
        }

        .gantt-chart .task-completed .bar,
        .gantt-chart .task-completed .bar-progress {
          fill: ${COMPLETED_COLOR};
        }

        .gantt-chart .task-progress .bar,
        .gantt-chart .task-progress .bar-progress {
          fill: ${IN_PROGRESS_COLOR};
        }

        @media (max-width: 900px) {
          .gantt-board {
            grid-template-columns: ${GANTT_LANE_WIDTH_COMPACT}px minmax(0, 1fr);
          }
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

        .gantt-detail-card {
          display: grid;
          gap: 12px;
          margin-bottom: 16px;
          padding: 14px 16px;
          border: 1px solid rgba(203, 213, 225, 0.82);
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
        }

        .gantt-detail-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .gantt-detail-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .gantt-detail-subtitle {
          margin-top: 4px;
          font-size: 12px;
          color: #475569;
        }

        .gantt-detail-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(203, 213, 225, 0.82);
          background: #ffffff;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          white-space: nowrap;
        }

        .gantt-detail-status-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          flex: 0 0 10px;
        }

        .gantt-detail-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .gantt-detail-item {
          min-width: 0;
          padding: 10px 12px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.88);
        }

        .gantt-detail-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
        }

        .gantt-detail-value {
          margin-top: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          overflow-wrap: anywhere;
        }

        @media (max-width: 760px) {
          .gantt-detail-grid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>

      <div className="surface-card rounded-[28px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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

          <div className="max-w-full overflow-x-auto lg:shrink-0">
            <div className="inline-flex min-w-max items-center rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode("Day")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  viewMode === "Day" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setViewMode("Week")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  viewMode === "Week" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setViewMode("Month")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  viewMode === "Month" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="legend-chip">
            <span className="legend-dot" style={{ background: COMPLETED_COLOR }} />
            Completed
          </span>
          <span className="legend-chip">
            <span className="legend-dot" style={{ background: IN_PROGRESS_COLOR }} />
            In Progress
          </span>
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

          {selectedTask ? (
            <div className="gantt-detail-card">
              <div className="gantt-detail-top">
                <div>
                  <div className="gantt-detail-title">{selectedTask._meta.task}</div>
                  <div className="gantt-detail-subtitle">
                    {selectedTask._meta.role} · {selectedTask._meta.name}
                  </div>
                </div>

                <div className="gantt-detail-status">
                  <span
                    className="gantt-detail-status-dot"
                    style={{
                      background: selectedTask._meta.status === "Completed" ? COMPLETED_COLOR : IN_PROGRESS_COLOR,
                    }}
                  />
                  {selectedTask._meta.status}
                </div>
              </div>

              <div className="gantt-detail-grid">
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">Progress</div>
                  <div className="gantt-detail-value">{selectedTask.progress}%</div>
                </div>
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">Start</div>
                  <div className="gantt-detail-value">{formatFullDate(selectedTask._meta.startDate)}</div>
                </div>
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">End</div>
                  <div className="gantt-detail-value">{formatFullDate(selectedTask._meta.endDate)}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="gantt-shell">
            <div className="gantt-board">
              <div className="gantt-sidebar">
                <div className="gantt-sidebar-header">
                  <div>
                    <div className="gantt-sidebar-header-label">Fixed Lane</div>
                    <div className="gantt-sidebar-header-title">Owner · Task</div>
                  </div>
                </div>

                <div ref={sidebarRowsRef} className="gantt-sidebar-rows">
                  {builtTasks.map((task) => (
                    <div
                      key={`sidebar-${task.id}`}
                      className={`gantt-sidebar-row ${getSidebarTone(task._meta.status)} ${
                        selectedTaskId === task.id ? "is-selected" : ""
                      }`}
                      title={`${task._meta.role} · ${task._meta.name} · ${task._meta.task}`}
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <span className="gantt-sidebar-dot" />
                      <div className="gantt-sidebar-copy">
                        <div className="gantt-sidebar-owner">{task._meta.name}</div>
                        <div className="gantt-sidebar-task">{task._meta.task}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gantt-chart">
                <div ref={ganttRef} className="w-full min-w-[980px] lg:min-w-[1180px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

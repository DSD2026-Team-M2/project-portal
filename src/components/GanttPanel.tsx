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
  plannedStart?: string;
  plannedEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  progress: number;
  status: string;
  dependencies?: string[];
  category?: string;
};

type TaskStatus = "Completed" | "In Progress";
type TaskBarKind = "planned" | "actual";

type GanttRow = {
  role: string;
  name: string;
  task: string;
  status: TaskStatus;
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
    groupId: string;
    barKind: TaskBarKind;
    rowIndex: number;
    startDate: Date;
    endDate: Date;
    plannedStartDate: Date;
    plannedEndDate: Date;
    actualStartDate: Date;
    actualEndDate: Date;
    actualProgress: number;
    category?: string;
  };
};

type TaskGroup = {
  id: string;
  rowIndex: number;
  role: string;
  name: string;
  task: string;
  status: TaskStatus;
  progress: number;
  category?: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
};

type TaskEntry = {
  group: TaskGroup;
  bars: BuiltTask[];
};

type OwnerGroup = {
  owner: string;
  role: string;
  tasks: TaskGroup[];
};

type GanttPopupContext = {
  task?: BuiltTask;
};

const GANTT_BAR_HEIGHT = 8;
const GANTT_PADDING = 28;
const GANTT_ROW_HEIGHT = GANTT_BAR_HEIGHT + GANTT_PADDING;
const GANTT_UPPER_HEADER_HEIGHT = 45;
const GANTT_LOWER_HEADER_HEIGHT = 30;
const GANTT_HEADER_HEIGHT = GANTT_UPPER_HEADER_HEIGHT + GANTT_LOWER_HEADER_HEIGHT + 10;
const GANTT_LANE_WIDTH = 360;
const GANTT_LANE_WIDTH_COMPACT = 260;
const GANTT_OWNER_WIDTH = 124;
const GANTT_OWNER_WIDTH_COMPACT = 88;
const GANTT_BAR_RADIUS = 4;
const GANTT_PLANNED_OFFSET = 8;
const GANTT_ACTUAL_OFFSET = 21;
const COMPLETED_COLOR = "#09b24d";
const IN_PROGRESS_COLOR = "#f0e400";
const PLANNED_BAR_FILL = "rgba(148, 163, 184, 0.24)";
const PLANNED_BAR_STROKE = "#94a3b8";
const SHOW_DEPENDENCY_ARROWS = false;

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

function getTaskColors(status: TaskStatus) {
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

function normalizeStatus(status: string): TaskStatus {
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
      groupId: id,
      barKind: "actual",
      rowIndex: 0,
      startDate,
      endDate,
      plannedStartDate: startDate,
      plannedEndDate: endDate,
      actualStartDate: startDate,
      actualEndDate: endDate,
      actualProgress: row.progress,
    },
  };
}

function buildDatasetTaskGroup(task: DatasetTask): TaskGroup {
  const status = normalizeStatus(task.status);
  const plannedStart = task.plannedStart ?? task.start;
  const plannedEnd = task.plannedEnd ?? task.end;
  const actualStart = task.actualStart ?? task.start;
  const actualEnd = task.actualEnd ?? task.end;

  return {
    id: task.id,
    rowIndex: 0,
    role: task.role,
    name: task.owner,
    task: task.name,
    status,
    progress: task.progress,
    category: task.category,
    plannedStartDate: new Date(`${plannedStart}T00:00:00`),
    plannedEndDate: new Date(`${plannedEnd}T00:00:00`),
    actualStartDate: new Date(`${actualStart}T00:00:00`),
    actualEndDate: new Date(`${actualEnd}T00:00:00`),
  };
}

function buildDatasetTaskBars(task: DatasetTask): BuiltTask[] {
  const group = buildDatasetTaskGroup(task);
  const actualClass = getCustomClass(group.status);
  const actualColors = getTaskColors(group.status);

  const makeMeta = (
    id: string,
    barKind: TaskBarKind,
    startDate: Date,
    endDate: Date,
    progress: number,
    customClass: GanttRow["customClass"],
  ): BuiltTask["_meta"] => ({
    id,
    groupId: group.id,
    barKind,
    rowIndex: group.rowIndex,
    role: group.role,
    name: group.name,
    task: group.task,
    status: group.status,
    weekStart: 1,
    weekEnd: 1,
    progress,
    customClass,
    startDate,
    endDate,
    plannedStartDate: group.plannedStartDate,
    plannedEndDate: group.plannedEndDate,
    actualStartDate: group.actualStartDate,
    actualEndDate: group.actualEndDate,
    actualProgress: group.progress,
    category: group.category,
  });

  return [
    {
      id: `${task.id}__planned`,
      name: `${task.owner} · ${task.name} · Planned`,
      start: toDateString(group.plannedStartDate),
      end: toDateString(group.plannedEndDate),
      progress: 100,
      custom_class: "task-planned",
      color: PLANNED_BAR_FILL,
      color_progress: PLANNED_BAR_FILL,
      _meta: makeMeta(
        `${task.id}__planned`,
        "planned",
        group.plannedStartDate,
        group.plannedEndDate,
        100,
        "task-progress",
      ),
    },
    {
      id: `${task.id}__actual`,
      name: `${task.owner} · ${task.name} · Actual`,
      start: toDateString(group.actualStartDate),
      end: toDateString(group.actualEndDate),
      progress: group.progress,
      custom_class: actualClass,
      color: actualColors.color,
      color_progress: actualColors.color_progress,
      dependencies: SHOW_DEPENDENCY_ARROWS ? task.dependencies : undefined,
      _meta: makeMeta(
        `${task.id}__actual`,
        "actual",
        group.actualStartDate,
        group.actualEndDate,
        group.progress,
        actualClass,
      ),
    },
  ];
}

function isLegacyTask(task: GanttSourceTask): task is GanttRow {
  return "weekStart" in task && "weekEnd" in task;
}

function assignRowIndex(entry: TaskEntry, rowIndex: number): TaskEntry {
  return {
    group: {
      ...entry.group,
      rowIndex,
    },
    bars: entry.bars.map((bar) => ({
      ...bar,
      _meta: {
        ...bar._meta,
        rowIndex,
      },
    })),
  };
}

function groupTaskEntriesByOwner(entries: TaskEntry[]) {
  const ownerOrder: string[] = [];
  const entriesByOwner = new Map<string, TaskEntry[]>();

  entries.forEach((entry) => {
    const owner = entry.group.name;
    if (!entriesByOwner.has(owner)) {
      ownerOrder.push(owner);
      entriesByOwner.set(owner, []);
    }

    entriesByOwner.get(owner)?.push(entry);
  });

  return ownerOrder.flatMap((owner) => entriesByOwner.get(owner) ?? []);
}

function getTaskRowTone(task: TaskGroup) {
  if (task.status === "Completed") return "gantt-task-completed";
  return "gantt-task-progress";
}

function formatTaskProgress(task: TaskGroup) {
  if (task.status === "Completed") return `${task.progress}%`;
  return "In progress";
}

function getCompactChartHeight(rowCount: number) {
  return GANTT_HEADER_HEIGHT + rowCount * GANTT_ROW_HEIGHT + 8;
}

function getCompactBarY(rowIndex: number, barKind: TaskBarKind) {
  const rowTop = GANTT_HEADER_HEIGHT + rowIndex * GANTT_ROW_HEIGHT;
  return rowTop + (barKind === "planned" ? GANTT_PLANNED_OFFSET : GANTT_ACTUAL_OFFSET);
}

function setSvgRectBarShape(rect: SVGRectElement, y: number) {
  rect.setAttribute("y", String(y));
  rect.setAttribute("height", String(GANTT_BAR_HEIGHT));
  rect.setAttribute("rx", String(GANTT_BAR_RADIUS));
  rect.setAttribute("ry", String(GANTT_BAR_RADIUS));
}

// Frappe Gantt renders one SVG row per bar. The portal keeps planned and actual as separate bars,
// then compacts each pair into one task row so both timings remain selectable.
function compactRenderedGanttRows(
  host: HTMLElement,
  chartContainer: HTMLElement,
  builtTaskMap: Map<string, BuiltTask>,
  rowCount: number,
) {
  const chartHeight = getCompactChartHeight(rowCount);
  const bodyHeight = Math.max(0, chartHeight - GANTT_HEADER_HEIGHT);

  chartContainer.style.setProperty("--gv-grid-height", `${chartHeight}px`);
  chartContainer.style.height = `${chartHeight}px`;

  const svg = host.querySelector<SVGSVGElement>("svg.gantt");
  svg?.setAttribute("height", String(chartHeight));

  const background = host.querySelector<SVGRectElement>(".grid-background");
  background?.setAttribute("height", String(chartHeight));

  host.querySelectorAll<SVGRectElement>(".grid-row").forEach((row, index) => {
    if (index >= rowCount) {
      row.style.display = "none";
      return;
    }

    row.style.display = "";
    row.setAttribute("y", String(GANTT_HEADER_HEIGHT + index * GANTT_ROW_HEIGHT));
    row.setAttribute("height", String(GANTT_ROW_HEIGHT));
  });

  host.querySelectorAll<SVGLineElement>(".row-line").forEach((line, index) => {
    if (index >= rowCount) {
      line.style.display = "none";
      return;
    }

    const y = GANTT_HEADER_HEIGHT + (index + 1) * GANTT_ROW_HEIGHT;
    line.style.display = "";
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
  });

  host.querySelectorAll<SVGPathElement>(".tick").forEach((tick) => {
    const path = tick.getAttribute("d") ?? "";
    const match = /^M\s+([^\s]+)\s+([^\s]+)\s+v\s+([^\s]+)$/i.exec(path);
    if (!match) return;

    tick.setAttribute("d", `M ${match[1]} ${GANTT_HEADER_HEIGHT} v ${bodyHeight}`);
  });

  host.querySelectorAll<SVGRectElement>(".holiday-highlight, .grid-column, .ignored-bar").forEach((rect) => {
    rect.setAttribute("y", String(GANTT_HEADER_HEIGHT));
    rect.setAttribute("height", String(bodyHeight));
  });

  chartContainer.querySelectorAll<HTMLElement>(".current-highlight").forEach((highlight) => {
    highlight.style.top = `${GANTT_HEADER_HEIGHT}px`;
    highlight.style.height = `${bodyHeight}px`;
  });

  host.querySelectorAll<SVGGElement>(".bar-wrapper").forEach((wrapper) => {
    const taskId = wrapper.getAttribute("data-id") ?? "";
    const task = builtTaskMap.get(taskId);
    if (!task) return;

    const y = getCompactBarY(task._meta.rowIndex, task._meta.barKind);
    wrapper.setAttribute("data-row-index", String(task._meta.rowIndex));
    wrapper.setAttribute("data-bar-kind", task._meta.barKind);

    wrapper.querySelectorAll<SVGRectElement>(".bar, .bar-progress, .bar-expected-progress").forEach((rect) => {
      setSvgRectBarShape(rect, y);
    });

    wrapper.querySelectorAll<SVGTextElement>(".bar-label").forEach((label) => {
      label.setAttribute("y", String(y + GANTT_BAR_HEIGHT / 2));
    });
  });
}

export function GanttPanel({ tasks }: GanttPanelProps) {
  const { t } = useTranslation();
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const sidebarRowsRef = useRef<HTMLDivElement | null>(null);
  const selectedGroupIdRef = useRef("");
  const [viewMode, setViewMode] = useState("Day");
  const [error, setError] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const sourceTasks = useMemo(() => (tasks && tasks.length ? tasks : rawRows), [tasks]);
  const { builtTasks, taskGroups } = useMemo(() => {
    const entries: TaskEntry[] = [];

    sourceTasks.forEach((task, index) => {
      if (isLegacyTask(task)) {
        const builtTask = buildLegacyTask(task, index);
        entries.push({
          group: {
            id: builtTask.id,
            rowIndex: 0,
            role: builtTask._meta.role,
            name: builtTask._meta.name,
            task: builtTask._meta.task,
            status: builtTask._meta.status,
            progress: builtTask._meta.actualProgress,
            category: builtTask._meta.category,
            plannedStartDate: builtTask._meta.plannedStartDate,
            plannedEndDate: builtTask._meta.plannedEndDate,
            actualStartDate: builtTask._meta.actualStartDate,
            actualEndDate: builtTask._meta.actualEndDate,
          },
          bars: [builtTask],
        });
        return;
      }

      entries.push({
        group: buildDatasetTaskGroup(task),
        bars: buildDatasetTaskBars(task),
      });
    });

    const orderedEntries = groupTaskEntriesByOwner(entries).map(assignRowIndex);

    return {
      builtTasks: orderedEntries.flatMap((entry) => entry.bars),
      taskGroups: orderedEntries.map((entry) => entry.group),
    };
  }, [sourceTasks]);
  const builtTaskMap = useMemo(() => new Map(builtTasks.map((task) => [task.id, task])), [builtTasks]);
  const ownerGroups = useMemo<OwnerGroup[]>(() => {
    const groups: OwnerGroup[] = [];
    const groupByOwner = new Map<string, OwnerGroup>();

    taskGroups.forEach((task) => {
      let ownerGroup = groupByOwner.get(task.name);
      if (!ownerGroup) {
        ownerGroup = {
          owner: task.name,
          role: task.role,
          tasks: [],
        };
        groupByOwner.set(task.name, ownerGroup);
        groups.push(ownerGroup);
      }

      ownerGroup.tasks.push(task);
    });

    return groups;
  }, [taskGroups]);
  const validationIssues = useMemo(
    () => (sourceTasks.every(isLegacyTask) ? validateRows(sourceTasks) : validateBuiltTasks(builtTasks)),
    [builtTasks, sourceTasks],
  );
  const selectedTaskGroup = useMemo(
    () => taskGroups.find((task) => task.id === selectedGroupId) ?? null,
    [selectedGroupId, taskGroups],
  );

  const applySelectedBarState = (groupId: string) => {
    const host = ganttRef.current;
    if (!host) return;

    host.querySelectorAll<SVGGElement>(".bar-wrapper").forEach((wrapper) => {
      const taskId = wrapper.getAttribute("data-id") ?? "";
      const builtTask = builtTaskMap.get(taskId);
      wrapper.classList.toggle("is-selected", builtTask?._meta.groupId === groupId);
    });
  };

  useEffect(() => {
    if (!taskGroups.length) {
      setSelectedGroupId("");
      return;
    }

    setSelectedGroupId((current) => (current && taskGroups.some((task) => task.id === current) ? current : taskGroups[0].id));
  }, [taskGroups]);

  useEffect(() => {
    selectedGroupIdRef.current = selectedGroupId;
    applySelectedBarState(selectedGroupId);
  }, [selectedGroupId, builtTaskMap]);

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
          bar_corner_radius: GANTT_BAR_RADIUS,
          container_height: getCompactChartHeight(taskGroups.length),
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
            if (clickedTask?._meta.groupId) setSelectedGroupId(clickedTask._meta.groupId);
          },
        });

        const chartContainer = ganttRef.current.querySelector<HTMLElement>(".gantt-container");
        if (!chartContainer) return () => {};
        compactRenderedGanttRows(ganttRef.current, chartContainer, builtTaskMap, taskGroups.length);

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
          const nextTaskId = barWrapper?.getAttribute("data-id") ?? "";
          const nextTask = builtTaskMap.get(nextTaskId);
          if (nextTask?._meta.groupId) setSelectedGroupId(nextTask._meta.groupId);
        };

        chartContainer.addEventListener("scroll", syncSidebarOffset, { passive: true });
        chartContainer.addEventListener("wheel", handleWheel, { passive: false });
        chartContainer.addEventListener("click", handleBarClick);

        syncSidebarOffset();
        applySelectedBarState(selectedGroupIdRef.current);

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
  }, [builtTaskMap, builtTasks, taskGroups.length, validationIssues, viewMode]);

  return (
    <div className="overflow-hidden">
      <style>{`
        .gantt-shell {
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 2px;
        }

        .gantt-board {
          display: grid;
          grid-template-columns: ${GANTT_LANE_WIDTH}px minmax(0, 1fr);
          min-width: 860px;
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
          display: grid;
          grid-template-columns: ${GANTT_OWNER_WIDTH}px minmax(0, 1fr);
          height: ${GANTT_HEADER_HEIGHT}px;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        }

        .gantt-sidebar-header-cell {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          padding: 14px 14px 12px;
        }

        .gantt-sidebar-header-cell + .gantt-sidebar-header-cell {
          border-left: 1px solid rgba(148, 163, 184, 0.14);
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

        .gantt-owner-group {
          display: grid;
          grid-template-columns: ${GANTT_OWNER_WIDTH}px minmax(0, 1fr);
          border-bottom: 1px solid rgba(203, 213, 225, 0.78);
        }

        .gantt-owner-cell {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          box-sizing: border-box;
          padding: 10px 12px;
          border-right: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(248, 250, 252, 0.78);
        }

        .gantt-owner-name {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.25;
          color: #0f172a;
        }

        .gantt-owner-role {
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.2;
          text-transform: uppercase;
          color: #64748b;
        }

        .gantt-task-list {
          min-width: 0;
        }

        .gantt-task-row {
          display: grid;
          grid-template-columns: 14px minmax(0, 1fr);
          align-items: center;
          column-gap: 8px;
          height: ${GANTT_ROW_HEIGHT}px;
          box-sizing: border-box;
          padding: 0 12px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.72);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .gantt-task-row:last-child {
          border-bottom: 0;
        }

        .gantt-task-row:hover {
          background: rgba(241, 245, 249, 0.8);
        }

        .gantt-task-row.is-selected {
          background: rgba(226, 232, 240, 0.76);
        }

        .gantt-task-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9);
        }

        .gantt-task-copy {
          min-width: 0;
        }

        .gantt-task-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.25;
          color: #0f172a;
        }

        .gantt-task-meta {
          margin-top: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          line-height: 1.25;
          text-transform: uppercase;
          color: #475569;
        }

        .gantt-task-completed .gantt-task-dot {
          background: ${COMPLETED_COLOR};
        }

        .gantt-task-progress .gantt-task-dot {
          background: ${IN_PROGRESS_COLOR};
        }

        .gantt-chart {
          min-width: 0;
          overflow: hidden;
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
          display: block;
        }

        .gantt-chart .bar-wrapper .bar {
          stroke: rgba(148, 163, 184, 0.24);
          stroke-width: 1;
        }

        .gantt-chart .bar-wrapper.is-selected .bar {
          stroke-width: 1.5;
        }

        .gantt-chart .bar-wrapper.is-selected .bar-progress {
          stroke-width: 0;
        }

        .gantt-chart .task-completed.is-selected .bar {
          stroke: #059669;
        }

        .gantt-chart .task-progress.is-selected .bar {
          stroke: #ca8a04;
        }

        .gantt-chart .task-planned.is-selected .bar {
          stroke: ${PLANNED_BAR_STROKE};
        }

        .gantt-chart .task-completed .bar,
        .gantt-chart .task-completed .bar-progress {
          fill: ${COMPLETED_COLOR};
        }

        .gantt-chart .task-planned .bar,
        .gantt-chart .task-planned .bar-progress {
          fill: ${PLANNED_BAR_FILL};
          stroke: ${PLANNED_BAR_STROKE};
          stroke-dasharray: 5 3;
        }

        .gantt-chart .task-progress .bar,
        .gantt-chart .task-progress .bar-progress {
          fill: ${IN_PROGRESS_COLOR};
        }

        @media (max-width: 900px) {
          .gantt-board {
            grid-template-columns: ${GANTT_LANE_WIDTH_COMPACT}px minmax(520px, 1fr);
            min-width: 780px;
          }

          .gantt-sidebar-header,
          .gantt-owner-group {
            grid-template-columns: ${GANTT_OWNER_WIDTH_COMPACT}px minmax(0, 1fr);
          }
        }

        @media (max-width: 520px) {
          .gantt-board {
            grid-template-columns: 220px minmax(500px, 1fr);
            min-width: 720px;
          }

          .gantt-sidebar-header,
          .gantt-owner-group {
            grid-template-columns: 76px minmax(0, 1fr);
          }

          .gantt-sidebar-header-cell,
          .gantt-owner-cell,
          .gantt-task-row {
            padding-left: 10px;
            padding-right: 10px;
          }
        }

        .legend-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 132px;
          padding: 7px 16px;
          border-radius: 10px;
          border: 1px solid rgba(148, 163, 184, 0.24);
          box-shadow:
            0 6px 14px rgba(148, 163, 184, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.34);
          font-size: 13px;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
        }

        .legend-chip-completed {
          background: ${COMPLETED_COLOR};
          color: #ffffff;
        }

        .legend-chip-planned {
          background: #ffffff;
          color: #475569;
          border-style: dashed;
          border-color: ${PLANNED_BAR_STROKE};
        }

        .legend-chip-progress {
          background: ${IN_PROGRESS_COLOR};
          color: #0f172a;
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
          grid-template-columns: repeat(5, minmax(0, 1fr));
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
              This gantt view compares planned and actual timing for each task and can switch between day, week, and
              month scales without losing the schedule.
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
          <span className="legend-chip legend-chip-planned">
            Planned
          </span>
          <span className="legend-chip legend-chip-completed">
            Actual Completed
          </span>
          <span className="legend-chip legend-chip-progress">
            Actual In Progress
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

          {selectedTaskGroup ? (
            <div className="gantt-detail-card">
              <div className="gantt-detail-top">
                <div>
                  <div className="gantt-detail-title">{selectedTaskGroup.task}</div>
                  <div className="gantt-detail-subtitle">
                    {selectedTaskGroup.role} · {selectedTaskGroup.name}
                  </div>
                </div>

                <div className="gantt-detail-status">
                  <span
                    className="gantt-detail-status-dot"
                    style={{
                      background: selectedTaskGroup.status === "Completed" ? COMPLETED_COLOR : IN_PROGRESS_COLOR,
                    }}
                  />
                  {selectedTaskGroup.status}
                </div>
              </div>

              <div className="gantt-detail-grid">
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">Progress</div>
                  <div className="gantt-detail-value">{formatTaskProgress(selectedTaskGroup)}</div>
                </div>
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">Planned Start</div>
                  <div className="gantt-detail-value">{formatFullDate(selectedTaskGroup.plannedStartDate)}</div>
                </div>
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">Planned End</div>
                  <div className="gantt-detail-value">{formatFullDate(selectedTaskGroup.plannedEndDate)}</div>
                </div>
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">Actual Start</div>
                  <div className="gantt-detail-value">{formatFullDate(selectedTaskGroup.actualStartDate)}</div>
                </div>
                <div className="gantt-detail-item">
                  <div className="gantt-detail-label">Actual End</div>
                  <div className="gantt-detail-value">{formatFullDate(selectedTaskGroup.actualEndDate)}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="gantt-shell">
            <div className="gantt-board">
              <div className="gantt-sidebar">
                <div className="gantt-sidebar-header">
                  <div className="gantt-sidebar-header-cell">
                    <div className="gantt-sidebar-header-label">Fixed Lane</div>
                    <div className="gantt-sidebar-header-title">Owner</div>
                  </div>
                  <div className="gantt-sidebar-header-cell">
                    <div className="gantt-sidebar-header-label">Grouped Tasks</div>
                    <div className="gantt-sidebar-header-title">Task</div>
                  </div>
                </div>

                <div ref={sidebarRowsRef} className="gantt-sidebar-rows">
                  {ownerGroups.map((ownerGroup) => (
                    <div
                      key={`owner-${ownerGroup.owner}`}
                      className="gantt-owner-group"
                      style={{ height: ownerGroup.tasks.length * GANTT_ROW_HEIGHT }}
                    >
                      <div className="gantt-owner-cell" title={`${ownerGroup.role} · ${ownerGroup.owner}`}>
                        <div className="gantt-owner-name">{ownerGroup.owner}</div>
                        <div className="gantt-owner-role">{ownerGroup.role}</div>
                      </div>
                      <div className="gantt-task-list">
                        {ownerGroup.tasks.map((task) => (
                          <div
                            key={`task-${task.id}`}
                            className={`gantt-task-row ${getTaskRowTone(task)} ${
                              selectedGroupId === task.id ? "is-selected" : ""
                            }`}
                            title={`${task.role} · ${task.name} · ${task.task}`}
                            onClick={() => setSelectedGroupId(task.id)}
                          >
                            <span className="gantt-task-dot" />
                            <div className="gantt-task-copy">
                              <div className="gantt-task-title">{task.task}</div>
                              <div className="gantt-task-meta">{task.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gantt-chart">
                <div ref={ganttRef} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

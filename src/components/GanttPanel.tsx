import "../../node_modules/frappe-gantt/dist/frappe-gantt.css";

import Gantt from "frappe-gantt";
import { CalendarRange, Filter, LayoutList } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { GanttTask } from "../data/progressData";
import { StaticTag } from "./StaticTag";
import { StatusBadge } from "./StatusBadge";

type GanttPanelProps = {
  tasks: GanttTask[];
  isSample?: boolean;
  sampleLabel?: string;
  sampleNote?: string;
};

export function GanttPanel({ tasks, isSample = false, sampleLabel, sampleNote }: GanttPanelProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id ?? "");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const roles = useMemo(() => ["all", ...new Set(tasks.map((task) => task.role))], [tasks]);
  const statuses = useMemo(() => ["all", ...new Set(tasks.map((task) => task.status))], [tasks]);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesRole = roleFilter === "all" || task.role === roleFilter;
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        return matchesRole && matchesStatus;
      }),
    [roleFilter, statusFilter, tasks],
  );

  useEffect(() => {
    if (!filteredTasks.find((task) => task.id === selectedTaskId)) {
      setSelectedTaskId(filteredTasks[0]?.id ?? "");
    }
  }, [filteredTasks, selectedTaskId]);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    if (filteredTasks.length === 0) return;

    const gantt = new Gantt(
      containerRef.current,
      filteredTasks.map((task) => ({
        ...task,
        custom_class: `gantt-status-${task.status}`,
      })),
      {
        view_mode: "Week",
        readonly: true,
        readonly_progress: true,
        readonly_dates: true,
        move_dependencies: false,
        popup: () => false,
        today_button: false,
        scroll_to: "start",
        language: "en",
        container_height: "auto",
        bar_height: 22,
        padding: 18,
        column_width: 96,
        upper_header_height: 38,
        lower_header_height: 28,
        on_click: (task) => {
          setSelectedTaskId(task.id);
        },
      },
    );

    return () => {
      containerRef.current?.replaceChildren();
      void gantt;
    };
  }, [filteredTasks]);

  return (
    <div className="surface-card overflow-hidden p-0">
      <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <CalendarRange className="h-4 w-4" />
              <span>{t("progress.gantt.kicker")}</span>
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{t("progress.gantt.title")}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{t("progress.gantt.lead")}</p>
          </div>
          {isSample && sampleLabel ? <StaticTag label={sampleLabel} tone="violet" /> : null}
        </div>

        {sampleNote ? <p className="mt-3 text-sm leading-7 text-amber-800">{sampleNote}</p> : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
            <Filter className="h-4 w-4" />
            <span>{t("progress.gantt.filters")}</span>
          </div>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "all" ? t("common.all") : role}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? t("common.all") : t(`status.${status}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[26rem_minmax(0,1fr)]">
        <div className="border-b border-slate-200/80 xl:border-b-0 xl:border-r">
          <div className="grid grid-cols-[8rem_minmax(0,1fr)_7rem] gap-3 border-b border-slate-200/80 bg-slate-50/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:px-6">
            <span>{t("progress.gantt.columns.role")}</span>
            <span>{t("progress.gantt.columns.task")}</span>
            <span>{t("progress.gantt.columns.status")}</span>
          </div>
          <div className="divide-y divide-slate-200/80">
            {filteredTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskId(task.id)}
                className={`grid w-full grid-cols-[8rem_minmax(0,1fr)_7rem] gap-3 px-5 py-4 text-left transition sm:px-6 ${
                  selectedTaskId === task.id ? "bg-sky-50/80" : "bg-white hover:bg-slate-50/70"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{task.role}</p>
                  <p className="mt-1 text-xs text-slate-500">{task.owner}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{task.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{task.start} → {task.end}</p>
                </div>
                <div className="flex items-start justify-end">
                  <StatusBadge value={task.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <LayoutList className="h-4 w-4" />
            <span>{t("progress.gantt.legend")}</span>
            <span className="gantt-legend gantt-legend-completed">{t("status.completed")}</span>
            <span className="gantt-legend gantt-legend-progress">{t("status.in-progress")}</span>
            <span className="gantt-legend gantt-legend-risk">{t("status.at-risk")}</span>
          </div>
          <div ref={containerRef} className="gantt-host min-w-[760px]" />
        </div>
      </div>
    </div>
  );
}

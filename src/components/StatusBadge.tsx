import { useTranslation } from "react-i18next";

type StatusBadgeProps = {
  value: string;
};

const statusToneMap: Record<string, string> = {
  planned: "status-badge status-badge-blue",
  active: "status-badge status-badge-blue",
  ready: "status-badge status-badge-blue",
  "in-progress": "status-badge status-badge-teal",
  completed: "status-badge status-badge-green",
  final: "status-badge status-badge-green",
  draft: "status-badge status-badge-slate",
  "in-review": "status-badge status-badge-violet",
  archived: "status-badge status-badge-violet",
  "at-risk": "status-badge status-badge-amber",
  blocked: "status-badge status-badge-red",
  watch: "status-badge status-badge-amber",
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const { t } = useTranslation();

  return <span className={statusToneMap[value] ?? "status-badge status-badge-slate"}>{t(`status.${value}`)}</span>;
}

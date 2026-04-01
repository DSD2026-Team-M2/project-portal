import { AlertTriangle } from "lucide-react";

type AttentionTagProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function AttentionTag({ label, active = false, onClick }: AttentionTagProps) {
  const className = `attention-tag ${active ? "attention-tag-active" : ""}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} aria-pressed={active} title={label}>
        <AlertTriangle className="h-3.5 w-3.5" />
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <span className={className} title={label}>
      <AlertTriangle className="h-3.5 w-3.5" />
      <span className="truncate">{label}</span>
    </span>
  );
}

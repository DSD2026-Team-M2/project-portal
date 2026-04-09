import { AlertTriangle } from "lucide-react";

import { getAttentionTagLabel } from "../utils/tags";

type AttentionTagProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function AttentionTag({ label, active = false, onClick }: AttentionTagProps) {
  const className = `attention-tag ${active ? "attention-tag-active" : ""}`;
  const displayLabel = getAttentionTagLabel(label);

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} aria-pressed={active} title={displayLabel}>
        <AlertTriangle className="h-3.5 w-3.5" />
        <span className="truncate">{displayLabel}</span>
      </button>
    );
  }

  return (
    <span className={className} title={displayLabel}>
      <AlertTriangle className="h-3.5 w-3.5" />
      <span className="truncate">{displayLabel}</span>
    </span>
  );
}

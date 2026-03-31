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
      <button type="button" onClick={onClick} className={className} aria-pressed={active}>
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <span className={className}>
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>{label}</span>
    </span>
  );
}

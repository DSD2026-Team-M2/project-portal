import type { ReactNode } from "react";

type FilterChipProps = {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  accentClassName?: string;
  onClick: () => void;
};

export function FilterChip({ label, selected = false, icon, accentClassName, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-chip ${selected ? "filter-chip-active" : ""}`}
      aria-pressed={selected}
      title={label}
    >
      {accentClassName ? <span className={`filter-chip-swatch ${accentClassName}`} aria-hidden="true" /> : null}
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

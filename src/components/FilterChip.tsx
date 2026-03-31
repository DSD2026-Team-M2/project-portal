import type { ReactNode } from "react";

type FilterChipProps = {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onClick: () => void;
};

export function FilterChip({ label, selected = false, icon, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-chip ${selected ? "filter-chip-active" : ""}`}
      aria-pressed={selected}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

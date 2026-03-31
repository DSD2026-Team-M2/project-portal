type StaticTagProps = {
  label: string;
  tone?: "default" | "blue" | "violet";
};

const toneClassMap = {
  default: "static-tag",
  blue: "static-tag static-tag-blue",
  violet: "static-tag static-tag-violet",
} as const;

export function StaticTag({ label, tone = "default" }: StaticTagProps) {
  return <span className={toneClassMap[tone]}>{label}</span>;
}

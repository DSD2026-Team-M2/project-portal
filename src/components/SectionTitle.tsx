import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
};

export function SectionTitle({ eyebrow, title, action }: SectionTitleProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-4xl">
        <div className="section-title-bar" />
        {eyebrow ? (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
        ) : null}
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.15rem]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
